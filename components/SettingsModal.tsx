import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'security' | 'notifications'>('security');

    // Security State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Notification State
    const [emailNotif, setEmailNotif] = useState(true);
    const [marketingNotif, setMarketingNotif] = useState(false);
    const [notifLoading, setNotifLoading] = useState(false);

    // Fetch initial notification settings
    React.useEffect(() => {
        if (user) {
            const fetchSettings = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('email_notifications, marketing_notifications')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setEmailNotif(data.email_notifications ?? true);
                    setMarketingNotif(data.marketing_notifications ?? false);
                }
            };
            fetchSettings();
        }
    }, [user]);

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Şifreler eşleşmiyor!');
            return;
        }
        if (newPassword.length < 6) {
            alert('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            alert('Şifreniz başarıyla güncellendi!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            alert('Hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail.includes('@')) {
            alert('Geçerli bir e-posta adresi giriniz.');
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ email: newEmail });
            if (error) throw error;
            alert('E-posta güncelleme onayı için yeni adresinize bir mail gönderdik. Lütfen kontrol edin.');
            setNewEmail('');
        } catch (error: any) {
            alert('Hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleNotification = async (type: 'email' | 'marketing') => {
        if (!user) return;

        const newValue = type === 'email' ? !emailNotif : !marketingNotif;
        if (type === 'email') setEmailNotif(newValue);
        else setMarketingNotif(newValue);

        try {
            setNotifLoading(true);
            const updateData = type === 'email'
                ? { email_notifications: newValue }
                : { marketing_notifications: newValue };

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id);

            if (error) throw error;
        } catch (error: any) {
            console.error('Error updating notifications:', error);
            // Revert state on error
            if (type === 'email') setEmailNotif(!newValue);
            else setMarketingNotif(!newValue);
        } finally {
            setNotifLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh]">

                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-black tracking-tighter">Hesap Ayarları</h2>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Profil ve güvenlik tercihlerinizi yönetin
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl text-black hover:bg-black hover:text-white transition-all active:scale-90"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-gray-50 p-6 flex flex-col gap-2 border-r border-gray-100 shrink-0">
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Güvenlik
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Bildirimler
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                                        E-posta Değiştir
                                    </h3>
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500">Mevcut: <span className="font-bold text-black">{user?.email}</span></p>
                                        <div className="flex gap-3">
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                placeholder="Yeni e-posta adresi"
                                                className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transaction-all"
                                            />
                                            <button
                                                onClick={handleUpdateEmail}
                                                disabled={loading || !newEmail}
                                                className="bg-black text-white px-6 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {loading ? '...' : 'Güncelle'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                                        Şifre Değiştir
                                    </h3>
                                    <div className="space-y-3">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Yeni şifre"
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transaction-all"
                                        />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Yeni şifre (tekrar)"
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transaction-all"
                                        />
                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={handleUpdatePassword}
                                                disabled={loading || !newPassword || !confirmPassword}
                                                className="bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                            >
                                                {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                {/*
                                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6">
                                  <p className="text-xs text-yellow-700 font-bold">
                                    Not: Bu ayarlar şu an sadece cihazınızda saklanır.
                                  </p>
                                </div>
                                */}

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => toggleNotification('email')}>
                                    <div>
                                        <h4 className="font-bold text-sm text-black">E-posta Bildirimleri</h4>
                                        <p className="text-xs text-gray-500 mt-1">Önemli güncellemeler ve aktiviteler hakkında e-posta al.</p>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${emailNotif ? 'bg-black' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => toggleNotification('marketing')}>
                                    <div>
                                        <h4 className="font-bold text-sm text-black">Pazarlama İletileri</h4>
                                        <p className="text-xs text-gray-500 mt-1">Yeni özellikler ve kampanyalar hakkında bilgi ver.</p>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${marketingNotif ? 'bg-black' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${marketingNotif ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
