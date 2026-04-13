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
    const [activeTab, setActiveTab] = useState<'general' | 'account' | 'security' | 'notifications'>(user ? 'account' : 'general');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [showWarning, setShowWarning] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

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
            setShowWarning({ show: true, message: t('settings.pass_mismatch') });
            return;
        }
        if (newPassword.length < 6) {
            setShowWarning({ show: true, message: t('settings.pass_min_length') });
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setShowWarning({ show: true, message: t('settings.pass_success') });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setShowWarning({ show: true, message: t('settings.error') + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail.includes('@')) {
            setShowWarning({ show: true, message: t('settings.email_invalid') });
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ email: newEmail });
            if (error) throw error;
            setShowWarning({ show: true, message: t('settings.email_pending_msg') });
            setNewEmail('');
        } catch (error: any) {
            setShowWarning({ show: true, message: t('settings.error') + error.message });
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
            setShowWarning({ show: true, message: t('settings.delete_error') + ': ' + error.message });
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
        <div className="fixed inset-0 z-[250] flex items-center justify-center sm:p-4 bg-white sm:bg-black/60 sm:backdrop-blur-sm">
            {/* Fixed Height Layout */}
            <div className="bg-white w-full h-full sm:h-[600px] sm:max-h-[90vh] sm:max-w-2xl sm:rounded-[2rem] shadow-none sm:shadow-2xl relative flex flex-col overflow-hidden text-black dark:text-white dark:bg-gray-900 transition-colors duration-300">

                {/* Warning / Error Overlay */}
                {showWarning.show && (
                    <div className="absolute inset-0 z-[300] flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-sm p-6">
                        <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 dark:bg-gray-700 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                            <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl shadow-xl relative z-10">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-black dark:text-white mb-2 leading-tight tracking-tight relative z-10">
                                {t('settings.info_msg')}
                            </h3>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-8 leading-relaxed relative z-10">
                                {showWarning.message}
                            </p>
                            <button
                                onClick={() => setShowWarning({ show: false, message: '' })}
                                className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg active: relative z-10"
                            >
                                {t('settings.ok')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Custom Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6">
                        <div className="bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                                ⚠️
                            </div>
                            <h3 className="text-xl font-black text-black dark:text-white mb-3 leading-tight">
                                {t('settings.delete_confirm_title')}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                {isEmployer
                                    ? t('settings.delete_confirm_desc_emp')
                                    : t('settings.delete_confirm_desc_seek')
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 active: disabled:opacity-70"
                                >
                                    {loading ? '...' : t('settings.delete_confirm_yes')}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="w-full bg-gray-50 dark:bg-gray-700 text-black dark:text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-all active:"
                                >
                                    {t('settings.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Deletion Success Overlay */}
                {showDeleteSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-md p-6">
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
                            <div className="w-20 h-20 bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                👋
                            </div>
                            <h3 className="text-2xl font-black text-[#1f6d78] dark:text-[#2dd4bf] mb-4 leading-tight tracking-tight">
                                {t('settings.delete_success_title')}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                {t('settings.delete_success_desc')}
                            </p>
                            <button
                                onClick={handleFinalExit}
                                className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:"
                            >
                                {t('common.done')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tighter">{t('settings.header_title')}</h2>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">
                            {user ? t('settings.header_subtitle') : t('settings.theme_and_language')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xl text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-90"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-full sm:w-48 bg-gray-50 dark:bg-black p-4 sm:p-6 flex flex-row sm:flex-col gap-2 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-white/10 shrink-0 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                        {user && (
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'account' ? 'bg-[#1f6d78] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
                                    }`}
                            >
                                {t('settings.account')}
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'general' ? 'bg-[#1f6d78] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
                                }`}
                        >
                            {t('settings.general')}
                        </button>
                        {user && (
                            <>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'security' ? 'bg-[#1f6d78]' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {t('settings.security')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className={`whitespace-nowrap px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all snap-start ${activeTab === 'notifications' ? 'bg-[#1f6d78]' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {t('settings.notifications')}
                                </button>
                            </>
                        )}
                        
                        {!user && (
                            <div className="mt-auto pt-6 px-2 opacity-50 hidden sm:block">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                                    {t('settings.login_for_more')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar dark:bg-black">

                        {activeTab === 'general' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2 mb-4">
                                        {t('account.appearance')}
                                    </h3>
                                    <button
                                        onClick={toggleTheme}
                                        className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between transition-colors shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white flex items-center justify-center text-sm">
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
                                                <p className="font-bold text-black dark:text-white text-sm">{theme === 'dark' ? t('account.dark') : t('account.light')}</p>
                                                <p className="text-xs text-gray-400 font-medium mt-0.5">
                                                    {theme === 'dark' ? t('settings.dark_mode_active') : t('settings.light_mode_active')}
                                                </p>
                                            </div>
                                        </div>
 
                                        <div className={`w-12 h-7 rounded-full p-1 transition-all  ${theme === 'dark' ? 'bg-[#1f6d78]' : 'bg-gray-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform  ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                    </button>
                                </div>


                                <div>
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2 mb-4">
                                        {t('settings.language')}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('settings.language_desc')}</p>
                                    <div className="grid grid-cols-1 gap-3 pb-32 sm:pb-0">
                                        {[
                                            { code: 'tr', label: t('lang.turkish'), flag: '🇹🇷' },
                                            { code: 'en', label: t('lang.english'), flag: '🇬🇧' },
                                            { code: 'de', label: t('lang.german'), flag: '🇩🇪' },
                                            { code: 'fr', label: t('lang.french'), flag: '🇫🇷' },
                                            { code: 'es', label: t('lang.spanish'), flag: '🇪🇸' },
                                        ].map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => setLanguage(lang.code as any)}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all active:scale-95 ${language === lang.code
                                                    ? 'bg-[#1f6d78] text-white border-[#1f6d78] shadow-md'
                                                    : 'bg-white dark:bg-black border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/20'
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
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2 mb-4">
                                        {t('settings.account_summary')}
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl space-y-2 border border-transparent dark:border-white/5 shadow-inner">
                                        <p className="text-sm dark:text-gray-300"><strong>{t('settings.email_label')}:</strong> {user?.email}</p>
                                        <p className="text-sm dark:text-gray-300"><strong>{t('settings.member_since')}:</strong> {new Date(user?.created_at || '').toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('settings.user_id')}: {user?.id}</p>
                                    </div>
                                </div>

                                {/* Account Deletion */}
                                <div className="pt-8 border-t border-gray-100 dark:border-white/10">
                                    <div className="bg-red-50 dark:bg-red-950/10 rounded-2xl p-5 border border-red-100 dark:border-red-900/20">
                                        <div className="mb-4">
                                            <p className="text-sm font-bold text-red-900 dark:text-red-400">{t('settings.delete_account')}</p>
                                            <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                                                {isEmployer
                                                    ? t('settings.delete_desc_emp')
                                                    : t('settings.delete_desc_seek')
                                                }
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-red-600/70 dark:text-red-400/50 italic mb-5">
                                            {t('settings.delete_warning')}
                                        </p>
                                        <button
                                            onClick={handleDeleteClick}
                                            disabled={loading}
                                            className="w-full bg-white dark:bg-black border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-500 px-5 py-3 rounded-xl text-sm font-bold hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? t('settings.deleting') : t('settings.delete_btn')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                                        {t('settings.change_email')}
                                    </h3>

                                    {/* Current Email Display */}
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-4 border border-gray-100 dark:border-white/10">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{t('settings.current_email')}</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">{user?.email}</p>


                                        {user?.new_email && (
                                            <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 p-3 rounded-lg flex items-start gap-3">
                                                <div className="text-yellow-600 dark:text-yellow-500 text-lg">⚠️</div>
                                                <div>
                                                    <p className="text-xs font-bold text-yellow-800 dark:text-yellow-200 mb-1">{t('settings.pending_change')}</p>
                                                    <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                                                        {t('settings.new_email_is')} <span className="font-bold">{user.new_email}</span>
                                                        <br />
                                                        {t('settings.email_confirm_hint')}
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
                                                className="flex-1 bg-gray-50 dark:bg-black/5 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent dark:border-white/10 text-black dark:text-white focus:ring-2 focus:ring-[#1f6d78]/20 transition-all"
                                            />
                                            <button
                                                onClick={handleUpdateEmail}
                                                disabled={loading || !newEmail || newEmail === user?.email}
                                                className="bg-[#1f6d78] text-white px-6 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#155e68] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1f6d78]/20"
                                            >
                                                {loading ? '...' : t('settings.update')}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 italic px-1">
                                            {t('settings.security_hint')}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/10 pb-2">
                                        {t('settings.change_password')}
                                    </h3>
                                    <div className="space-y-3">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder={t('settings.new_password')}
                                            className="w-full bg-gray-50 dark:bg-black/5 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent dark:border-white/10 text-black dark:text-white focus:ring-2 focus:ring-[#1f6d78]/20 transition-all"
                                        />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder={t('settings.new_password_confirm')}
                                            className="w-full bg-gray-50 dark:bg-black/5 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent dark:border-white/10 text-black dark:text-white focus:ring-2 focus:ring-[#1f6d78]/20 transition-all"
                                        />
                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={handleUpdatePassword}
                                                disabled={loading || !newPassword || !confirmPassword}
                                                className="bg-[#1f6d78] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#155e68] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                                            >
                                                {loading ? t('settings.updating') : t('settings.update_password')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5 cursor-pointer" onClick={() => toggleNotification('email')}>
                                    <div>
                                        <h4 className="font-bold text-sm text-black dark:text-white">{t('settings.notif_email_title')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.notif_email_desc')}</p>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full p-1 transition-all  ${emailNotif ? 'bg-[#1f6d78]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform  ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-transparent dark:border-white/5 cursor-pointer" onClick={() => toggleNotification('marketing')}>
                                    <div>
                                        <h4 className="font-bold text-sm text-black dark:text-white">{t('settings.notif_marketing_title')}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.notif_marketing_desc')}</p>
                                    </div>
                                    <div className={`w-12 h-7 rounded-full p-1 transition-all  ${marketingNotif ? 'bg-[#1f6d78]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform  ${marketingNotif ? 'translate-x-5' : 'translate-x-0'}`}></div>
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
