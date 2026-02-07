import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { user, signOut } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'general' | 'account' | 'security' | 'notifications'>('account');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    // Security State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // ... (notification state code unchanged) ...
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

            // Don't sign out yet, show success UI
            setShowDeleteConfirm(false);
            setShowDeleteSuccess(true);

        } catch (error: any) {
            console.error('Error deleting account:', error);
            alert('Hesap silinirken bir hata oluştu: ' + error.message);
            setShowDeleteConfirm(false); // Close modal on error to allow retry
        } finally {
            setLoading(false);
        }
    };

    const handleFinalExit = async () => {
        await signOut();
        window.location.reload();
    };


    const isEmployer = user?.user_metadata?.role === 'employer';

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center sm:p-4 bg-white sm:bg-black/60 sm:backdrop-blur-sm animate-in fade-in duration-200">
            {/* Fixed Height Layout */}
            <div className="bg-white w-full h-full sm:h-[600px] sm:max-h-[90vh] sm:max-w-2xl sm:rounded-[2rem] shadow-none sm:shadow-2xl relative flex flex-col overflow-hidden">

                {/* Custom Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
                        <div className="bg-white border border-red-100 rounded-3xl p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                                ⚠️
                            </div>
                            <h3 className="text-xl font-black text-black mb-3 leading-tight">
                                {t('settings.delete_confirm_title')}
                            </h3>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                {isEmployer
                                    ? t('settings.delete_confirm_desc_emp')
                                    : t('settings.delete_confirm_desc_seek')
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-70"
                                >
                                    {loading ? '...' : t('settings.delete_confirm_yes')}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="w-full bg-gray-50 text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    {t('settings.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Deletion Success Overlay */}
                {showDeleteSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md p-6 animate-in fade-in duration-300">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-300 text-center">
                            <div className="w-20 h-20 bg-[#1f6d78]/10 text-[#1f6d78] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                👋
                            </div>
                            <h3 className="text-2xl font-black text-[#1f6d78] mb-4 leading-tight tracking-tight">
                                {t('settings.delete_success_title') || 'Hesabınız Silindi'}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
                                {t('settings.delete_success_desc') || 'Kartvizid ailesinin bir parçası olduğunuz için teşekkür ederiz. Sizi tekrar aramızda görmekten mutluluk duyarız.'}
                            </p>
                            <button
                                onClick={handleFinalExit}
                                className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:scale-95"
                            >
                                {t('common.done') || 'Hoşça Kal'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-black tracking-tighter">{t('settings.header_title')}</h2>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {t('settings.header_subtitle')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl text-black hover:bg-black hover:text-white transition-all active:scale-90"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-full sm:w-48 bg-gray-50 p-4 sm:p-6 flex flex-row sm:flex-col gap-2 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'account' ? 'bg-[#1f6d78] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {t('settings.account')}
                        </button>
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'general' ? 'bg-[#1f6d78] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {t('settings.general')}
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'security' ? 'bg-[#1f6d78] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {t('settings.security')}
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'notifications' ? 'bg-[#1f6d78] text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {t('settings.notifications')}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">

                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                                        {t('account.appearance')}
                                    </h3>
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full text-left p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 text-black flex items-center justify-center text-sm">
                                                {theme === 'dark' ? (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="4"></circle>
                                                        <path d="M12 2v2"></path>
                                                        <path d="M12 20v2"></path>
                                                        <path d="m4.93 4.93 1.41 1.41"></path>
                                                        <path d="m17.66 17.66 1.41 1.41"></path>
                                                        <path d="M2 12h2"></path>
                                                        <path d="M20 12h2"></path>
                                                        <path d="m6.34 17.66-1.41 1.41"></path>
                                                        <path d="m19.07 4.93-1.41 1.41"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black text-sm">{theme === 'dark' ? t('account.dark') : t('account.light')}</p>
                                                <p className="text-xs text-gray-400 font-medium mt-0.5">
                                                    {theme === 'dark' ? 'Koyu mod aktif' : 'Aydınlık mod aktif'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-[#1f6d78]' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                                        {t('settings.language')}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-4">{t('settings.language_desc')}</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
                                            { code: 'en', label: 'English', flag: '🇬🇧' },
                                            { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
                                            { code: 'fr', label: 'Français', flag: '🇫🇷' },
                                            { code: 'es', label: 'Español', flag: '🇪🇸' },
                                        ].map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => setLanguage(lang.code as any)}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all active:scale-95 ${language === lang.code
                                                    ? 'bg-[#1f6d78] text-white border-[#1f6d78] shadow-md'
                                                    : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{lang.flag}</span>
                                                    <span className="font-bold text-sm">{lang.label}</span>
                                                </div>
                                                {language === lang.code && (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                                        {t('settings.account_summary')}
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                        <p className="text-sm"><strong>{t('settings.email_label')}:</strong> {user?.email}</p>
                                        <p className="text-sm"><strong>{t('settings.member_since')}:</strong> {new Date(user?.created_at || '').toLocaleDateString('tr-TR')}</p>
                                        <p className="text-xs text-gray-400 mt-2">{t('settings.user_id')}: {user?.id}</p>
                                    </div>
                                </div>

                                {/* Account Deletion */}
                                <div className="pt-8 border-t border-gray-100">
                                    <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                                        <div className="mb-4">
                                            <p className="text-sm font-bold text-red-900">{t('settings.delete_account')}</p>
                                            <p className="text-xs text-red-700 mt-1">
                                                {isEmployer
                                                    ? t('settings.delete_desc_emp')
                                                    : t('settings.delete_desc_seek')
                                                }
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-red-600/70 italic mb-5">
                                            {t('settings.delete_warning')}
                                        </p>
                                        <button
                                            onClick={handleDeleteClick}
                                            disabled={loading}
                                            className="w-full bg-white border border-red-200 text-red-600 px-5 py-3 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? 'Siliniyor...' : t('settings.delete_btn')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                                        {t('settings.change_email')}
                                    </h3>

                                    {/* Current Email Display */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Mevcut E-posta</p>
                                        <p className="text-sm font-bold text-gray-800">{user?.email}</p>

                                        {/* Pending Email Warning */}
                                        {user?.new_email && (
                                            <div className="mt-3 bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex items-start gap-3">
                                                <div className="text-yellow-600 text-lg">⚠️</div>
                                                <div>
                                                    <p className="text-xs font-bold text-yellow-800 mb-1">Onay Bekleyen Değişiklik</p>
                                                    <p className="text-xs text-yellow-700 leading-relaxed">
                                                        Yeni e-posta adresiniz: <span className="font-bold">{user.new_email}</span>
                                                        <br />
                                                        Lütfen hem eski ({user.email}) hem de yeni adresinize gönderilen onay linklerine tıklayın.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                placeholder={t('settings.new_email')}
                                                className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#1f6d78]/20 focus:border-[#1f6d78] border border-transparent transition-all"
                                            />
                                            <button
                                                onClick={handleUpdateEmail}
                                                disabled={loading || !newEmail || newEmail === user?.email}
                                                className="bg-[#1f6d78] text-white px-6 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#155e68] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1f6d78]/20"
                                            >
                                                {loading ? '...' : t('settings.update')}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 italic px-1">
                                            * Güvenliğiniz için değişiklik işlemi her iki e-posta adresine de onay linki gönderir.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                                        {t('settings.change_password')}
                                    </h3>
                                    <div className="space-y-3">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder={t('settings.new_password')}
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transaction-all"
                                        />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder={t('settings.new_password_confirm')}
                                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-black/5 transaction-all"
                                        />
                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={handleUpdatePassword}
                                                disabled={loading || !newPassword || !confirmPassword}
                                                className="bg-[#1f6d78] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#155e68] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                            >
                                                {loading ? 'Güncelleniyor...' : t('settings.update_password')}
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
                                        <h4 className="font-bold text-sm text-black">{t('settings.notif_email_title')}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{t('settings.notif_email_desc')}</p>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${emailNotif ? 'bg-[#1f6d78]' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => toggleNotification('marketing')}>
                                    <div>
                                        <h4 className="font-bold text-sm text-black">{t('settings.notif_marketing_title')}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{t('settings.notif_marketing_desc')}</p>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full p-1 transition-all duration-300 ${marketingNotif ? 'bg-[#1f6d78]' : 'bg-gray-300'}`}>
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
