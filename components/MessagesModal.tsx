import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Conversation, Message } from '../types';
import { useToast } from '../context/ToastContext';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onRefreshConversations: () => void;
}

const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onRefreshConversations
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (activeConversationId && isOpen) {
      fetchMessages(activeConversationId);
      markMessagesAsRead(activeConversationId);
      
      // Subscribe to new messages
      const channel = supabase
        .channel(`chat:${activeConversationId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversationId}` },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages(prev => {
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            if (newMsg.sender_id !== user?.id) {
               markMessagesAsRead(activeConversationId);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeConversationId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (convId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (convId: string) => {
    if (!user) return;
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', convId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
      
      onRefreshConversations();
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversationId || !user) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: activeConversationId,
            sender_id: user.id,
            content: content
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Optimistically append the new message to local state immediately
      // This ensures the sender sees it instantly even if Realtime is disabled or delayed
      if (data) {
        setMessages(prev => {
          if (!prev.find(m => m.id === data.id)) {
            return [...prev, data as Message];
          }
          return prev;
        });
      }

      // Update conversation's last message
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_at: new Date().toISOString()
        })
        .eq('id', activeConversationId);

      onRefreshConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      showToast('Mesaj gönderilemedi.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex sm:items-center sm:justify-center bg-white sm:bg-black/40 sm:backdrop-blur-sm">
      <div className="w-full h-full sm:max-w-5xl sm:h-[85vh] sm:rounded-[2.5rem] bg-white shadow-2xl overflow-hidden flex flex-col sm:flex-row relative">
        
        {/* Sidebar - Conversation List */}
        <div className={`w-full sm:w-[350px] flex-col border-r border-gray-100 bg-gray-50/30 ${activeConversationId && 'hidden sm:flex'} flex`}>
          <div className="p-6 sm:p-7 sm:pb-4 border-b border-gray-100 flex items-start justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
            <div>
              <h2 className="text-2xl font-bold text-black tracking-tight mb-0.5">{t('messages.title')}</h2>
              <p className="text-xs font-medium text-gray-500 max-w-[280px] leading-relaxed">
                {t('messages.subtitle')}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full text-black flex items-center justify-center transition-all active:scale-95 hover:bg-gray-50"
              title={t('profile.close') || 'Kapat'}
            >
              <i className="fi fi-rr-cross text-xs font-bold"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-10 py-16">
                 <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                   <i className="fi fi-rr-comment-dots text-3xl text-gray-300"></i>
                 </div>
                 <h3 className="text-lg font-bold text-black mb-2">
                   {t('messages.empty_title') || 'Henüz Bir Görüşme Başlamadı'}
                 </h3>
                 <p className="text-sm text-gray-400 leading-relaxed max-w-[240px]">
                   {t('messages.empty_desc') || 'İşverenler size mesaj gönderdiğinde burada görünecektir.'}
                 </p>
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-white hover:shadow-md group ${activeConversationId === conv.id ? 'bg-white shadow-md ring-1 ring-gray-100' : ''}`}
                >
                  <div className="relative shrink-0">
                    {conv.other_participant?.avatar_url ? (
                      <img src={conv.other_participant.avatar_url} className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1f6d78]/10 text-[#1f6d78] flex items-center justify-center font-black text-lg shadow-sm">
                        {conv.other_participant?.full_name?.charAt(0) || '?'}
                      </div>
                    )}
                    {conv.unread_count && conv.unread_count > 0 ? (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        {conv.unread_count}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-black text-black text-sm truncate">{conv.other_participant?.full_name || 'Kullanıcı'}</h4>
                    <p className="text-gray-400 text-xs font-bold truncate mt-0.5">
                      {conv.last_message || (t('messages.click_to_start') || 'Sohbeti başlatın...')}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col bg-white ${!activeConversationId && 'hidden sm:flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:p-6 border-b border-gray-50 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <button onClick={() => onSelectConversation('')} className="sm:hidden w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <i className="fi fi-rr-arrow-left text-sm"></i>
                </button>
                <div className="flex items-center gap-3">
                  {activeConversation.other_participant?.avatar_url ? (
                    <img src={activeConversation.other_participant.avatar_url} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm bg-gray-100" />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1f6d78]/10 text-[#1f6d78] flex items-center justify-center font-black text-base shadow-sm">
                      {activeConversation.other_participant?.full_name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-black text-sm sm:text-lg tracking-tight">{activeConversation.other_participant?.full_name}</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-[#1f6d78] uppercase tracking-wider">
                      {activeConversation.other_participant?.role === 'employer' ? t('common.employer') : t('common.job_seeker')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="hidden sm:flex ml-auto w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-black transition-all items-center justify-center active:scale-95"
                  title={t('profile.close') || 'Kapat'}
                >
                   <i className="fi fi-rr-cross text-xs"></i>
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 custom-scrollbar bg-gray-50/10">
                {messages.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1f6d78]">
                      İSE ALIM SÜRECİ VE KARİYER GÖRÜŞMESİ
                    </p>
                    <div className="w-24 h-0.5 bg-gray-100 my-4" />
                    <p className="text-sm font-bold text-gray-400">
                      Sohbeti başlatan ilk mesajı siz gönderin.
                    </p>
                  </div>
                )}
                
                {messages.map((msg, idx) => {
                  const isOwn = msg.sender_id === user?.id;
                  const showTime = idx === 0 || 
                    new Date(msg.created_at).getTime() - new Date(messages[idx-1].created_at).getTime() > 1800000;

                  return (
                    <div key={msg.id} className="flex flex-col">
                      {showTime && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] sm:max-w-[70%] px-5 py-3.5 sm:px-6 sm:py-4 rounded-3xl font-medium text-sm sm:text-[15px] shadow-sm leading-relaxed ${
                          isOwn 
                          ? 'bg-[#1f6d78] text-white rounded-br-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-8 bg-white border-t border-gray-50 sticky bottom-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('messages.type_placeholder') || "Mesajınızı buraya yazın..."}
                    className="flex-1 bg-gray-50 border-none rounded-2xl sm:rounded-3xl py-3.5 sm:py-5 px-5 sm:px-8 text-sm sm:text-base font-bold text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#1f6d78] transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[#1f6d78] text-white flex items-center justify-center hover:bg-[#155e68] transition-all active: disabled:opacity-50 disabled:grayscale shadow-lg shadow-[#1f6d78]/20"
                  >
                    <i className="fi fi-sr-paper-plane text-base sm:text-xl"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/10">
              <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center mb-6">
                 <i className="fi fi-rr-comment-quote text-4xl text-gray-200"></i>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">Kariyer Sohbetleri</h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                İş arayanlar ve iş verenlerin profesyonel bir ortamda buluştuğu güvenli mesajlaşma merkezi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
