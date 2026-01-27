import React, { useEffect, useState } from 'react';
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
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, notifications, onAction, onMarkRead, onMarkAllRead, mobile }) => {
  const { user } = useAuth();
  const [requestStatuses, setRequestStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const requestIds = notifications
      .filter(item => !(item as ContactRequest).status && (item as NotificationItem).type === 'contact_request' && (item as NotificationItem).related_id)
      .map(item => (item as NotificationItem).related_id as string);

    const uniqueIds = Array.from(new Set(requestIds));
    if (uniqueIds.length === 0) return;

    const fetchStatuses = async () => {
      const { data } = await supabase.from('contact_requests').select('id, status').in('id', uniqueIds);
      if (data) {
        const statuses: Record<string, string> = {};
        data.forEach(req => { statuses[req.id] = req.status; });
        setRequestStatuses(statuses);
      }
    };
    fetchStatuses();
  }, [notifications]);

  const handleProfileClick = (id: string, role?: string) => {
    const event = new CustomEvent('open-profile', { detail: { id, role } });
    window.dispatchEvent(event);
    onClose();
  };

  const isContactRequest = (item: ContactRequest | NotificationItem): item is ContactRequest => {
    return (item as ContactRequest).status !== undefined;
  };

  // Helper to resolve display name and avatar
  const getSenderDetails = (item: NotificationItem | ContactRequest) => {
    // If it's a raw contact request (from pending list)
    // If it's a raw contact request (from pending list)
    if (isContactRequest(item)) {
      const requester = (item as any).requester;

      if (!requester) return { name: 'Bir kullanıcı', avatar: null, role: null };

      // 1. Try Company details (for ContactRequest)
      if (requester.role === 'employer' && requester.companies && requester.companies.length > 0) {
        return {
          name: requester.companies[0].company_name || requester.full_name,
          avatar: requester.companies[0].logo_url || requester.avatar_url,
          role: 'employer'
        };
      }

      // 2. Try CV details (for ContactRequest)
      if (requester.role === 'job_seeker' && requester.cvs && requester.cvs.length > 0) {
        return {
          name: requester.cvs[0].name || requester.full_name,
          avatar: requester.cvs[0].photo_url || requester.avatar_url,
          role: 'job_seeker'
        };
      }

      // Fallback
      return {
        name: requester.full_name || 'İletişim İsteği',
        avatar: requester.avatar_url,
        role: requester.role
      };
    }

    // If it's a notification
    const sender = item.sender as any;
    if (!sender) return { name: 'Bir kullanıcı', avatar: null, role: null };

    // 1. Try Company details
    if (sender.role === 'employer' && sender.companies && sender.companies.length > 0) {
      return {
        name: sender.companies[0].company_name || sender.full_name,
        avatar: sender.companies[0].logo_url || sender.avatar_url,
        role: 'employer'
      };
    }

    // 2. Try CV details
    if (sender.role === 'job_seeker' && sender.cvs && sender.cvs.length > 0) {
      return {
        name: sender.cvs[0].name || sender.full_name,
        avatar: sender.cvs[0].photo_url || sender.avatar_url,
        role: 'job_seeker'
      };
    }

    // 3. Fallback to Profile
    return {
      name: sender.full_name || 'İletişim İsteği',
      avatar: sender.avatar_url,
      role: sender.role
    };
  };

  return (
    <>
      {!mobile && <div className="fixed inset-0 z-[55]" onClick={onClose} />}
      <div className={`${mobile ? 'w-full bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden' : 'absolute -right-4 sm:right-0 top-14 w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-xl border border-gray-100 z-[60] overflow-hidden animate-in slide-in-from-top-2 duration-200'}`}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-white">
          <h3 className="font-bold text-gray-900 text-sm">Bildirimler</h3>
          <button onClick={onMarkAllRead} className="text-gray-500 text-xs font-medium hover:text-black transition-colors">
            Hepsini Oku
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-gray-50/50">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-3xl block mb-2">🔕</span>
              <p className="text-gray-400 text-xs">Henüz bir bildiriminiz yok.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const details = getSenderDetails(item);
              const dateObj = new Date(item.created_at);
              const timeStr = dateObj.getHours() + ':' + dateObj.getMinutes().toString().padStart(2, '0');
              const dateStr = dateObj.toLocaleDateString('tr-TR');

              const isResolved = !isContactRequest(item) && item.related_id && requestStatuses[item.related_id];

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isContactRequest(item)) {
                      if (onMarkRead) onMarkRead(item.id);
                      if (item.sender_id) handleProfileClick(item.sender_id, details.role);
                    }
                  }}
                  className={`px-5 py-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-white
                    ${!isContactRequest(item) && !item.is_read ? 'bg-blue-50/40' : 'bg-transparent'}
                  `}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
                        {details.avatar ? (
                          <img src={details.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-gray-500 text-xs">{details.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {/* Status Icon Badge */}
                      {(!isContactRequest(item) && !item.is_read) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 truncate pr-2">{details.name}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{timeStr}</span>
                      </div>

                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">
                        {isContactRequest(item)
                          ? "İletişim bilgilerinizi görüntülemek istiyor."
                          : (
                            item.title === 'İletişim İsteği Onaylandı' ? 'İletişim isteğinizi onayladı.' :
                              item.title === 'İstek Sonuçlandı' ? 'İletişim isteğinizi reddetti.' :
                                item.message.replace(details.name, '').trim()
                          )
                        }
                      </p>

                      {/* Actions Area */}
                      {(isContactRequest(item) || (item as NotificationItem).type === 'contact_request') && (
                        <div className="mt-3">
                          {isResolved ? (
                            <div className={`text-[10px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 
                                ${requestStatuses[(item as any).related_id] === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {requestStatuses[(item as any).related_id] === 'approved' ? '✓ İstek Onaylandı' : '✕ İstek Reddedildi'}
                            </div>
                          ) : (
                            /* Pending Actions */
                            !isResolved && (
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onAction(isContactRequest(item) ? item.id : (item as any).related_id, 'approved'); }}
                                  className="flex-1 bg-black text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  Onayla
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onAction(isContactRequest(item) ? item.id : (item as any).related_id, 'rejected'); }}
                                  className="flex-1 bg-gray-100 text-black text-[10px] font-bold py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  Reddet
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

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <button onClick={onClose} className="text-black text-[10px] font-black uppercase tracking-widest hover:text-gray-600">
            Kapat
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
