
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NOTIFICATIONS } from '../constants'; // Keeping mock data for other types if needed, or remove
import { ContactRequest, Notification } from '../types';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // 1. Fetch Contact Requests (Pending)
      const { data: requests, error } = await supabase
        .from('contact_requests')
        .select(`
          id,
          status,
          created_at,
          requester:requester_id (
            full_name,
            avatar_url
          )
        `)
        .eq('target_user_id', user?.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map requests to Notifications
      const requestNotifs: Notification[] = (requests || []).map((req: any) => ({
        id: req.id,
        type: 'CONTACT_REQUEST',
        title: 'İletişim İsteği',
        message: `${req.requester?.full_name || 'Bir kullanıcı'} iletişim bilgilerinizi görüntülemek istiyor.`,
        time: new Date(req.created_at).toLocaleDateString('tr-TR'),
        isRead: false,
        requestId: req.id,
        requesterId: req.requester_id
      }));

      // Merge with static or other notifications (simulated)
      // For now, let's just show requests + static ones that match current layout
      // Filter static ones? Or just append.
      const combined = [...requestNotifs, ...NOTIFICATIONS]; // Static ones might duplicate IDs, be careful in real app

      setNotifications(combined);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;

      // Remove from list or update status
      setNotifications(prev => prev.filter(n => n.requestId !== requestId));
      showToast(action === 'approved' ? 'İstek onaylandı' : 'İstek reddedildi', 'success');
    } catch (error: any) {
      console.error('Error updating request:', error);
      showToast('İşlem başarısız: ' + error.message, 'error');
    }
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
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-6 border-b border-gray-50 hover:bg-[#F0F2F5] cursor-pointer transition-colors ${!notif.isRead ? 'bg-[#F9FAFB]' : 'bg-white'}`}
              >
                <div className="flex gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 shadow-sm ${notif.type === 'CONTACT_REQUEST' ? 'bg-black text-white' :
                    notif.type === 'APPROVED' ? 'bg-gray-100' : 'bg-gray-50'
                    }`}>
                    {notif.type === 'CONTACT_REQUEST' ? '👋' :
                      notif.type === 'APPROVED' ? '✅' : '👀'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm text-black font-black">{notif.title}</p>
                      {!notif.isRead && <span className="w-2 h-2 bg-black rounded-full"></span>}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{notif.message}</p>

                    {notif.type === 'CONTACT_REQUEST' && notif.requestId && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleAction(notif.requestId!, 'approved')}
                          className="bg-white border border-gray-200 text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-50 transition-all"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => handleAction(notif.requestId!, 'rejected')}
                          className="bg-gray-100 text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-all"
                        >
                          Reddet
                        </button>
                      </div>
                    )}

                    <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-wider">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))
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
