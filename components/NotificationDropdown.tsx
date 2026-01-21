
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ContactRequest, NotificationItem } from '../types';

interface NotificationDropdownProps {
  onClose: () => void;
  notifications: (ContactRequest | NotificationItem)[];
  onAction: (requestId: string, action: 'approved' | 'rejected') => void;
  onMarkRead?: (notificationId: string) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, notifications, onAction, onMarkRead }) => {
  const { user } = useAuth();

  // Helper type guard
  const isContactRequest = (item: ContactRequest | NotificationItem): item is ContactRequest => {
    return (item as ContactRequest).status !== undefined;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[55]"
        onClick={onClose}
      />
      <div className="absolute right-0 top-14 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[60] overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
          <h3 className="font-black text-black text-lg tracking-tight">Bildirimler</h3>
          <button className="text-black text-xs font-bold hover:underline underline-offset-4">Hepsini Oku</button>
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
                    className="p-6 border-b border-gray-50 hover:bg-[#F0F2F5] cursor-pointer transition-colors bg-[#F9FAFB]"
                  >
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 shadow-sm bg-black text-white">
                        👋
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm text-black font-black">İletişim İsteği</p>
                          <span className="w-2 h-2 bg-black rounded-full"></span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                          {(item as any).requester?.full_name || 'Bir kullanıcı'} iletişim bilgilerinizi görüntülemek istiyor.
                        </p>

                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => onAction(item.id, 'approved')}
                            className="bg-white border border-gray-200 text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-50 transition-all"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => onAction(item.id, 'rejected')}
                            className="bg-gray-100 text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
                          >
                            Reddet
                          </button>
                        </div>

                        <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-wider">
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
                    className="p-6 border-b border-gray-50 hover:bg-white cursor-pointer transition-colors bg-white relative"
                  >
                    {!item.is_read && (
                      <span className="absolute top-6 right-6 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                    <div className="flex gap-5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 shadow-sm ${item.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {item.type === 'success' ? '🎉' : '📢'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black font-black mb-1">{item.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                          {item.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
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

        <div className="p-4 text-center bg-gray-50 border-t border-gray-100">
          <button className="w-full bg-white border border-gray-200 text-black py-3 rounded-full font-black text-xs hover:bg-gray-50 uppercase tracking-widest transition-all">Tüm Bildirimleri Gör</button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
