import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { user, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications'>('account');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            // RPC call to delete_account function
            const { error } = await supabase.rpc('delete_account');

            if (error) throw error;

            alert('Hesabınız başarıyla silindi. Bizi tercih ettiğiniz için teşekkürler.');
            await signOut();
            window.location.reload(); // Force reload to clear any cached states
        } catch (error: any) {
            console.error('Error deleting account:', error);
            alert('Hesap silinirken bir hata oluştu: ' + error.message + '\n\nLütfen "delete_account" SQL fonksiyonunun Supabase üzerinde kurulu olduğundan emin olun.');
            setShowDeleteConfirm(false); // Close modal on error to allow retry
        } finally {
            setLoading(false);
        }
    };


    const isEmployer = user?.user_metadata?.role === 'employer';

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Fixed Height Layout */}
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden h-[600px] max-h-[90vh]">

                {/* Custom Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
                        <div className="bg-white border border-red-100 rounded-3xl p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                                ⚠️
                            </div>
                            <h3 className="text-xl font-black text-black mb-3 leading-tight">
                                Hesabınızı silmek istediğinize emin misiniz?
                            </h3>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                {isEmployer
                                    ? "Bu işlem geri alınamaz. İş veren profiliniz ve tüm verileriniz kalıcı olarak silinecektir."
                                    : "Bu işlem geri alınamaz. CV'niz, profiliniz ve tüm verileriniz kalıcı olarak silinecektir."
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-70"
                                >
                                    {loading ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="w-full bg-gray-50 text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    Vazgeç
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                            onClick={() => setActiveTab('account')}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'account' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Hesap
                        </button>
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

                        {activeTab === 'account' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                                        Hesap Özeti
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                        <p className="text-sm"><strong>E-posta:</strong> {user?.email}</p>
                                        <p className="text-sm"><strong>Üyelik Tarihi:</strong> {new Date(user?.created_at || '').toLocaleDateString('tr-TR')}</p>
                                        <p className="text-xs text-gray-400 mt-2">Kullanıcı ID: {user?.id}</p>
                                    </div>
                                </div>

                                {/* Account Deletion */}
                                <div className="pt-8 border-t border-gray-100">
                                    <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                                        <div className="mb-4">
                                            <p className="text-sm font-bold text-red-900">Hesabımı Sil</p>
                                            <p className="text-xs text-red-700 mt-1">
                                                {isEmployer
                                                    ? "İş veren profiliniz ve tüm verileriniz kalıcı olarak silinir."
                                                    : "CV'niz, başvurularınız ve profiliniz kalıcı olarak silinir."
                                                }
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-red-600/70 italic mb-5">
                                            Dikkat: Bu işlem geri alınamaz. Silme işleminden sonra tüm verilerinize erişimi kaybedeceksiniz.
                                        </p>
                                        <button
                                            onClick={handleDeleteClick}
                                            disabled={loading}
                                            className="w-full bg-white border border-red-200 text-red-600 px-5 py-3 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? 'Siliniyor...' : 'Hesabı Sil'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                                        E-posta Değiştir
                                    </h3>
                                    <div className="space-y-3">
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
