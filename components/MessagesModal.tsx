import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Conversation, Message } from '../types';
import { useToast } from '../context/ToastContext';
import ImageWithFallback from './ImageWithFallback';

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
      // Clear old messages instantly to prevent ghosting previous chat while fetching
      setMessages([]);
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
      showToast(t('messages.send_error'), 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex sm:items-center sm:justify-center bg-white sm:bg-black/40 sm:backdrop-blur-sm">
      <div className="w-full h-full sm:max-w-5xl sm:h-[85vh] sm:rounded-[2.5rem] bg-white shadow-2xl overflow-hidden flex flex-col sm:flex-row relative">
        
        {/* Sidebar - Conversation List */}
        <div className={`w-full sm:w-[350px] flex-col border-r border-gray-100 bg-gray-50/30 ${activeConversationId && 'hidden sm:flex'} flex`}>
          <div className="pl-4 pr-6 sm:pl-5 sm:pr-7 pt-6 pb-2 sm:pb-3 border-b border-gray-100 flex items-start justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-20">
            <div>
              <h2 className="text-[28px] font-black text-black tracking-tighter mb-0.5 leading-tight">{t('messages.title')}</h2>
              <p className="text-xs font-medium text-gray-500 max-w-[280px] leading-relaxed">
                {t('messages.subtitle')}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full text-black flex items-center justify-center transition-all active:scale-95 hover:bg-gray-50"
              title={t('profile.close')}
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
                   {t('messages.empty_title')}
                 </h3>
                 <p className="text-sm text-gray-400 leading-relaxed max-w-[240px]">
                   {t('messages.empty_desc')}
                 </p>
              </div>
            ) : (
              conversations.map((conv, idx) => (
                <div key={conv.id} className="relative">
                  <button
                    onClick={() => onSelectConversation(conv.id)}
                    className={`w-full pl-2 pr-6 py-5 flex items-center gap-4 transition-all duration-200 hover:bg-gray-50/50 group ${activeConversationId === conv.id ? 'bg-gray-50' : 'bg-transparent'}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-50 dark:bg-black border border-gray-100 dark:border-white/20 shadow-sm transition-transform group-hover:scale-[1.02]">
                        <ImageWithFallback 
                          src={conv.other_participant?.avatar_url} 
                          alt={conv.other_participant?.full_name || '?'} 
                          className="w-full h-full object-cover"
                          initialsClassName="text-xl font-black"
                        />
                      </div>
                      {conv.unread_count && conv.unread_count > 0 ? (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg z-10">
                          {conv.unread_count}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-bold text-black text-[15px] sm:text-[16.5px] tracking-tight truncate leading-tight mb-1">{conv.other_participant?.full_name || t('messages.user_fallback')}</h4>
                      <p className="text-gray-400 text-[13px] font-medium truncate opacity-90">
                        {conv.last_message || t('messages.click_to_start')}
                      </p>
                    </div>
                  </button>
                  {idx !== conversations.length - 1 && (
                    <div className="absolute bottom-0 right-0 left-[88px] border-b border-gray-100 dark:border-white/5" />
                  )}
                </div>
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
                  <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden shrink-0 shadow-sm">
                    <ImageWithFallback 
                      src={activeConversation.other_participant?.avatar_url} 
                      alt={activeConversation.other_participant?.full_name || '?'} 
                      className="w-full h-full object-cover"
                      initialsClassName="text-xl font-black"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-black text-sm sm:text-lg tracking-tight">{activeConversation.other_participant?.full_name}</h3>
                    <p className="text-[10px] sm:text-xs font-bold text-[#1f6d78] uppercase tracking-wider">
                      {activeConversation.other_participant?.profession || 
                        (activeConversation.other_participant?.role === 'employer' ? t('nav.employer') : t('nav.job_seeker'))}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="hidden sm:flex ml-auto w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-black transition-all items-center justify-center active:scale-95"
                  title={t('profile.close')}
                >
                   <i className="fi fi-rr-cross text-xs"></i>
                </button>
              </div>

              {/* Messages Body (Anchored to Bottom) */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/10 flex flex-col min-h-0">
                <div className="flex-1" />
                <div className="p-4 sm:p-8 space-y-4">
                  {loading ? (
                    <div className="space-y-6 animate-pulse px-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <div className={`h-12 w-48 sm:w-64 rounded-2xl ${i % 2 === 0 ? 'bg-[#1f6d78]/10' : 'bg-gray-200/50'}`} />
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-8">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-[#1f6d78]/5 border border-[#1f6d78]/10 mb-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1f6d78]/70">
                          {t('messages.secure_chat_tag')}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-400 max-w-[201px] leading-relaxed">
                        {t('messages.start_convo_desc')}
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, idx) => {
                        const isOwn = msg.sender_id === user?.id;
                        const showTime = idx === 0 || 
                          new Date(msg.created_at).getTime() - new Date(messages[idx-1].created_at).getTime() > 1800000;

                        return (
                          <div key={msg.id} className="flex flex-col group/msg">
                            {showTime && (
                              <div className="flex justify-center my-6">
                                <span className="px-4 py-1 rounded-lg bg-gray-100/50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] sm:max-w-[70%] px-5 py-3 sm:px-6 sm:py-3.5 shadow-sm leading-relaxed transition-all ${
                                isOwn 
                                ? 'bg-[#1f6d78] text-white rounded-[1.25rem] rounded-br-[0.2rem]' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-[1.25rem] rounded-bl-[0.2rem]'
                              }`}>
                                <p className="text-sm sm:text-[15px] font-medium leading-relaxed">{msg.content}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </div>

              {/* Input Area (Solid & Clean - Fixed Overlapping) */}
              <div className="p-4 sm:p-6 bg-white border-t border-gray-100 sticky bottom-0 z-30">
                <form 
                  onSubmit={handleSendMessage} 
                  className="w-full max-w-4xl mx-auto flex items-center bg-gray-50/50 border border-gray-200/60 rounded-2xl px-2 py-1.5 focus-within:bg-white focus-within:border-[#1f6d78]/40 transition-all duration-300 shadow-sm"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    placeholder={t('messages.type_placeholder')}
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-gray-800 placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 flex items-center justify-center transition-all duration-300 active:scale-90 disabled:cursor-not-allowed group shrink-0"
                    title={t('messages.send')}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300 ${
                        newMessage.trim() 
                        ? 'text-[#1f6d78] scale-110 group-hover:scale-125' 
                        : 'text-gray-300 opacity-60'
                      }`}
                    >
                      <path 
                        d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" 
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/10">
              <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center mb-6">
                 <i className="fi fi-rr-comment-quote text-4xl text-gray-200"></i>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">{t('messages.center_title')}</h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                {t('messages.center_desc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
