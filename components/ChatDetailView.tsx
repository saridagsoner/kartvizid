import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Conversation, Message } from '../types';
import { useToast } from '../context/ToastContext';
import ImageWithFallback from './ImageWithFallback';

interface ChatDetailViewProps {
  conversations: Conversation[];
  onRefreshConversations: () => void;
}

const ChatDetailView: React.FC<ChatDetailViewProps> = ({
  conversations,
  onRefreshConversations
}) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === id);

  useEffect(() => {
    if (id && user) {
      setMessages([]);
      fetchMessages(id);
      markMessagesAsRead(id);
      
      const channel = supabase
        .channel(`chat:desktop:${id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${id}` },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages(prev => {
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            if (newMsg.sender_id !== user?.id) {
               markMessagesAsRead(id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id, user]);

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
    if (!newMessage.trim() || !id || !user) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: id,
            sender_id: user.id,
            content: content
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages(prev => {
          if (!prev.find(m => m.id === data.id)) {
            return [...prev, data as Message];
          }
          return prev;
        });
      }

      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_at: new Date().toISOString()
        })
        .eq('id', id);

      onRefreshConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      showToast('Mesaj gönderilemedi.', 'error');
    }
  };

  if (!id) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-black">
        <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center mb-10 border border-gray-100 dark:border-white/5 relative group">
           <div className="absolute inset-0 bg-[#1f6d78]/5 dark:bg-[#2dd4bf]/5 rounded-[2rem] scale-0 group-hover:scale-100 transition-transform duration-500"></div>
           <i className="fi fi-rr-comment-info text-4xl text-[#1f6d78] dark:text-[#2dd4bf] relative z-10 transition-transform duration-500 group-hover:rotate-6"></i>
        </div>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase">{t('chat.empty_title')}</h3>
        <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 max-w-[340px] leading-[1.8] uppercase tracking-[0.05em]">
          {t('chat.empty_desc')}
        </p>
      </div>
    );
  }

  if (!activeConversation && !loading) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-18 rounded-2xl overflow-hidden shadow-lg border-2 border-[#1f6d78] dark:border-[#2dd4bf]">
            <ImageWithFallback 
              src={activeConversation?.other_participant?.avatar_url} 
              alt={activeConversation?.other_participant?.full_name || '?'} 
              className="w-full h-full object-cover"
              initialsClassName="text-2xl font-black"
            />
          </div>
          <div>
            <h3 className="font-black text-gray-900 dark:text-white text-xl tracking-tight leading-tight">
              {activeConversation?.other_participant?.full_name || 'Kullanıcı'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[11px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-widest leading-none">
                {activeConversation?.other_participant?.profession || 
                  (activeConversation?.other_participant?.role === 'employer' ? t('chat.employer') : 
                   activeConversation?.other_participant?.role === 'shop' ? 'Hizmet Veren' : t('chat.seeker'))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-black dark:hover:text-white transition-all flex items-center justify-center border border-gray-100 dark:border-white/5">
                <i className="fi fi-rr-menu-dots-vertical"></i>
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll custom-scrollbar bg-gray-50/20 dark:bg-transparent flex flex-col min-h-0 pt-6">
        <div className="flex-1" />
        <div className="p-8 space-y-6">
          {loading ? (
            <div className="space-y-6 animate-pulse px-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`h-16 w-64 md:w-[400px] rounded-[2rem] ${i % 2 === 0 ? 'bg-[#1f6d78]/10' : 'bg-gray-100 dark:bg-gray-800/50'}`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="inline-block px-5 py-2 rounded-full bg-[#1f6d78]/5 border border-[#1f6d78]/10 mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1f6d78]/80">
                  {t('chat.secure_chat_started')}
                </p>
              </div>
              <p className="text-base font-bold text-gray-400 max-w-[280px] leading-relaxed">
                {t('chat.first_message_prompt')}
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
                      <div className="flex justify-center my-8">
                        <span className="px-5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[75%] px-7 py-4 shadow-xl leading-relaxed transition-all duration-300 ${
                        isOwn 
                        ? 'bg-gradient-to-br from-[#1f6d78] to-[#154d55] text-white rounded-[2.5rem] rounded-br-lg' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-white/5 rounded-[2.5rem] rounded-bl-lg hover:shadow-2xl hover:scale-[1.01]'
                      }`}>
                        <p className="text-[16px] font-medium leading-relaxed">{msg.content}</p>
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

      {/* Input Area */}
      <div className="px-8 py-8 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5 sticky bottom-0 z-30">
        <form 
          onSubmit={handleSendMessage} 
          className="w-full max-w-5xl mx-auto flex items-center bg-gray-50/80 dark:bg-gray-900/80 border-2 border-transparent focus-within:border-[#1f6d78]/30 focus-within:bg-white dark:focus-within:bg-gray-800 rounded-[2.5rem] px-3 py-2 transition-all duration-500 shadow-sm"
        >
          <div className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#1f6d78] transition-colors cursor-pointer ml-2">
            <i className="fi fi-rr-smile text-2xl"></i>
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.input_placeholder')}
            className="flex-1 bg-transparent border-none focus:ring-0 outline-none py-4 px-6 text-base font-bold text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
              newMessage.trim() 
              ? 'bg-[#1f6d78] text-white scale-100 hover:scale-105 hover:rotate-3 shadow-[#1f6d78]/30' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
            }`}
          >
            <i className="fi fi-rr-paper-plane text-xl"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDetailView;
