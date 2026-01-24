
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ContactRequest, NotificationItem } from '../types';

interface NotificationDropdownProps {
  onClose: () => void;
  notifications: (ContactRequest | NotificationItem)[];
  onAction: (requestId: string, action: 'approved' | 'rejected') => void;
  onMarkRead?: (notificationId: string) => void;
  mobile?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, notifications, onAction, onMarkRead, mobile }) => {
  const { user } = useAuth();

  // Helper type guard
  const isContactRequest = (item: ContactRequest | NotificationItem): item is ContactRequest => {
    return (item as ContactRequest).status !== undefined;
  };

  return (
    <>
      {!mobile && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={onClose}
        />
      )}
      <div className={`${mobile ? 'w-full bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden' : 'absolute -right-16 sm:right-0 top-14 w-[300px] sm:w-[400px] bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-gray-100 z-[60] overflow-hidden animate-in slide-in-from-top-4 duration-300'}`}>
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
          <h3 className="font-black text-black text-sm sm:text-lg tracking-tight">Bildirimler</h3>
          <button className="text-black text-[10px] sm:text-xs font-bold hover:underline underline-offset-4">Hepsini Oku</button>
        </div>

        <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Bildiriminiz yok.</div>
          ) : (
            notifications.map((item) => {
              if (isContactRequest(item)) {
                // RENDER CONTACT REQUEST
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 border-b border-gray-50 hover:bg-[#F0F2F5] cursor-pointer transition-colors bg-[#F9FAFB]"
                  >
                    <div className="flex gap-3 sm:gap-5">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-xl shrink-0 shadow-sm bg-black text-white">
                        👋
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs sm:text-sm text-black font-black">İletişim İsteği</p>
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"></span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                          {(item as any).requester?.full_name || 'Bir kullanıcı'} iletişim bilgilerinizi görüntülemek istiyor.
                        </p>

                        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                          <button
                            onClick={() => onAction(item.id, 'approved')}
                            className="bg-white border border-gray-200 text-black px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-50 transition-all"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => onAction(item.id, 'rejected')}
                            className="bg-gray-100 text-black px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-200 transition-all"
                          >
                            Reddet
                          </button>
                        </div>

                        <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 sm:mt-3 font-bold uppercase tracking-wider">
                          {new Date(item.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // RENDER GENERAL NOTIFICATION
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 border-b border-gray-50 hover:bg-white cursor-pointer transition-colors bg-white relative"
                  >
                    {!item.is_read && (
                      <span className="absolute top-4 right-4 sm:top-6 sm:right-6 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                    )}
                    <div className="flex gap-3 sm:gap-5">
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-xl shrink-0 shadow-sm ${item.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {item.type === 'success' ? '🎉' : (item.type === 'contact_request' ? '👋' : '📢')}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-black font-black mb-1">{item.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                          {item.message}
                        </p>

                        {/* Actions for Contact Request Notifications */}
                        {item.type === 'contact_request' && item.related_id && (
                          <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction(item.related_id!, 'approved');
                              }}
                              className="bg-white border border-gray-200 text-black px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-50 transition-all"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction(item.related_id!, 'rejected');
                              }}
                              className="bg-gray-100 text-black px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-200 transition-all"
                            >
                              Reddet
                            </button>
                          </div>
                        )}

                        <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                          {new Date(item.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>

        <div className="p-3 sm:p-4 text-center bg-gray-50 border-t border-gray-100">
          <button className="w-full bg-white border border-gray-200 text-black py-2 sm:py-3 rounded-full font-black text-[10px] sm:text-xs hover:bg-gray-50 uppercase tracking-widest transition-all">Tüm Bildirimleri Gör</button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
