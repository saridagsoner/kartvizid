import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Conversation } from '../types';
import ImageWithFallback from './ImageWithFallback';

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onRefreshConversations: () => void;
  user?: any;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversationId,
  onRefreshConversations,
  user
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      <div className="pl-8 pr-8 pt-8 pb-4 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[28px] font-black text-black dark:text-white tracking-tighter leading-tight">
            İş Görüşmeleri
          </h2>
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Görüşmelerinizi buradan takip edin.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {!user ? (
          <div className="flex flex-col items-center justify-start h-full text-center px-10 pt-20">
            <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] mb-8 shadow-sm">
              <i className="fi fi-rr-comments text-4xl"></i>
            </div>
            <h3 className="text-xl font-black text-black dark:text-white mb-3 uppercase tracking-tight">
              Görüşmelerinizi Takip Edin
            </h3>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[320px]">
              İşverenlerle olan yazışmalarınızı ve mülakat süreçlerinizi yönetmek için giriş yapmalısınız.
            </p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-start h-full text-center px-10 pt-20">
            <h3 className="text-lg font-black text-black dark:text-white mb-2 uppercase tracking-tight">
              Henüz Bir Görüşme Başlamadı
            </h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[240px]">
              İşverenler sizinle iletişime geçtiğinde veya siz bir görüşme başlattığınızda süreci buradan yönetebilirsiniz.
            </p>
          </div>
        ) : (
          conversations.map((conv, idx) => {
            const isActive = activeConversationId === conv.id;
            return (
              <div key={conv.id} className="relative group/item">
                <button
                  onClick={() => navigate(`/mesajlar/${conv.id}`)}
                  className={`w-full px-5 py-6 flex items-center gap-5 transition-all duration-300 rounded-[2rem] ${
                    isActive 
                      ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 text-black dark:text-white translate-x-1.5' 
                      : 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-white/[0.02] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-14 h-18 rounded-2xl overflow-hidden shadow-sm transition-transform duration-500 group-hover/item:scale-[1.05] border-2 ${
                      isActive ? 'border-[#1f6d78] dark:border-[#2dd4bf]' : 'border-gray-100 dark:border-white/5'
                    }`}>
                      <ImageWithFallback 
                        src={conv.other_participant?.avatar_url} 
                        alt={conv.other_participant?.full_name || '?'} 
                        className="w-full h-full object-cover"
                        initialsClassName="text-2xl font-black"
                      />
                    </div>
                    {conv.unread_count && conv.unread_count > 0 ? (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-lg z-10 animate-bounce">
                        {conv.unread_count}
                      </span>
                    ) : null}
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <h4 className={`font-black tracking-tight leading-tight mb-1 truncate ${
                      isActive ? 'text-[17px] text-gray-900 dark:text-white' : 'text-[16px] text-gray-700 dark:text-gray-300'
                    }`}>
                      {conv.other_participant?.full_name || 'Kullanıcı'}
                    </h4>
                    <p className={`text-[13px] font-medium truncate opacity-70 ${
                      isActive ? 'text-[#1f6d78] dark:text-[#2dd4bf]' : 'text-gray-400'
                    }`}>
                      {conv.last_message || 'Sohbeti başlatın...'}
                    </p>
                  </div>

                  <div className={`shrink-0 transition-all duration-300 ${
                    isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0'
                  }`}>
                    <i className="fi fi-rr-angle-small-right text-xl text-[#1f6d78] dark:text-[#2dd4bf]"></i>
                  </div>
                </button>
                
                {!isActive && idx !== conversations.length - 1 && (
                  <div className="absolute bottom-0 right-10 left-[100px] border-b border-gray-100 dark:border-white/5" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
