import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ContactRequest, NotificationItem } from '../types';
import { supabase } from '../lib/supabase';

interface NotificationDropdownProps {
  onClose: () => void;
  notifications: (ContactRequest | NotificationItem)[];
  onAction: (requestId: string, action: 'approved' | 'rejected') => void;
  onMarkRead?: (notificationId: string) => void;
  onMarkAllRead?: () => void;
  mobile?: boolean;
  onOpenProfile?: (userId: string, role?: string) => void;
  embedded?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, notifications, onAction, onMarkRead, onMarkAllRead, mobile, embedded }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleProfileClick = (id: string, role?: string, requestId?: string) => {
    const event = new CustomEvent('open-profile', { detail: { id, role, requestId } });
    window.dispatchEvent(event);
    if (!embedded) onClose();
  };

  // ... helpers ...
  const isContactRequest = (item: ContactRequest | NotificationItem): item is ContactRequest => {
    return (item as ContactRequest).status !== undefined;
  };

  // Helper to resolve display name and avatar
  const getSenderDetails = (item: NotificationItem | ContactRequest) => {
    const extractProfile = (user: any) => {
      if (!user) return { name: 'Bir kullanıcı', avatar: null, role: null };

      // 1. Check for Company (Priority)
      if (user.companies && user.companies.length > 0) {
        return {
          name: user.companies[0].company_name || user.full_name,
          avatar: user.companies[0].logo_url || user.avatar_url,
          role: 'employer'
        };
      }

      // 2. Check for CV
      if (user.cvs && user.cvs.length > 0) {
        return {
          name: user.cvs[0].name || user.full_name,
          avatar: user.cvs[0].photo_url || user.avatar_url,
          role: 'job_seeker'
        };
      }

      // 3. Fallback
      return {
        name: user.full_name || 'İletişim İsteği',
        avatar: user.avatar_url,
        role: user.role
      };
    };

    if (isContactRequest(item)) {
      return extractProfile((item as any).requester);
    } else {
      return extractProfile((item as any).sender);
    }
  };

  return (
    <>
      {!mobile && !embedded && <div className="fixed inset-0 z-[55]" onClick={onClose} />}
      <div className={`${embedded ? 'w-full h-full bg-transparent' : mobile ? 'fixed inset-0 z-[105] w-full h-full bg-white dark:bg-gray-900 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300' : 'absolute -right-4 sm:right-0 top-14 w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-xl border border-gray-100 z-[60] overflow-hidden animate-in slide-in-from-top-2 duration-200'}`}>

        {/* Header - Hidden if embedded */}
        {!embedded && (
          <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 shrink-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{t('notif.title')}</h3>
            <div className="flex items-center gap-4">
              <button onClick={onMarkAllRead} className="text-gray-500 dark:text-gray-400 text-[10px] font-bold hover:text-red-500 transition-colors uppercase tracking-wider">
                {t('notif.clear_all')}
              </button>
              {mobile && (
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`${embedded ? '' : mobile ? 'flex-1' : 'max-h-[290px]'} overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-800/50`}>
          {notifications.length === 0 ? (
            <div className={`text-center flex flex-col items-center justify-center ${embedded ? 'py-20' : mobile ? 'h-full' : 'py-12'}`}>
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              </div>
              <p className="text-gray-900 dark:text-white font-medium text-sm">{t('notif.empty')}</p>
            </div>
          ) : (
            notifications.map((item) => {
              const details = getSenderDetails(item);
              const dateObj = new Date(item.created_at);
              const timeStr = dateObj.getHours() + ':' + dateObj.getMinutes().toString().padStart(2, '0');

              // Status resolution
              const status = isContactRequest(item) ? item.status : (item as NotificationItem).requestStatus;
              const isResolved = status === 'approved' || status === 'rejected';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    const profileId = isContactRequest(item) ? item.requester_id : item.sender_id;
                    const relatedId = isContactRequest(item) ? item.id : (item as NotificationItem).related_id;

                    if (!isContactRequest(item) && onMarkRead) onMarkRead(item.id);
                    if (profileId) handleProfileClick(profileId, details.role, relatedId);
                  }}
                  className={`px-5 py-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800
                    ${!isContactRequest(item) && !item.is_read ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'bg-transparent'}
                  `}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600 shadow-sm flex items-center justify-center">
                        {details.avatar ? (
                          <img src={details.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-gray-500 dark:text-gray-400 text-xs">{details.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {/* Status Icon Badge */}
                      {(!isContactRequest(item) && !item.is_read) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate pr-2">{details.name}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{timeStr}</span>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed line-clamp-2">
                        {isContactRequest(item)
                          ? t('notif.sent_request')
                          : (
                            item.title === 'İletişim İsteği Onaylandı' ? t('notif.req_approved') :
                              item.title === 'İstek Sonuçlandı' ? t('notif.req_rejected') :
                                item.message.replace(details.name, '').trim()
                          )
                        }
                      </p>

                      {/* Actions Area */}
                      {(isContactRequest(item) || (item as NotificationItem).type === 'contact_request') && (
                        <div className="mt-3">
                          {isResolved ? (
                            <div className={`text-[10px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 
                                ${status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {status === 'approved' ? `✓ ${t('notif.approved')}` : `✕ ${t('notif.rejected')}`}
                            </div>
                          ) : (
                            /* Pending Actions */
                            !isResolved && (
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onAction(isContactRequest(item) ? item.id : (item as any).related_id, 'approved'); }}
                                  className="flex-1 bg-[#1f6d78] text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-[#155e68] transition-colors"
                                >
                                  {t('profile.approve_request')}
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onAction(isContactRequest(item) ? item.id : (item as any).related_id, 'rejected'); }}
                                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  {t('profile.reject_request')}
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer - Hidden if embedded or mobile (mobile has close in header) */}
        {!embedded && !mobile && (
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <button onClick={onClose} className="text-black text-[10px] font-black uppercase tracking-widest hover:text-gray-600">
              {t('profile.close')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
