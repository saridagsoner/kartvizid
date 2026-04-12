import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface SettingsDetailViewProps {
    activeTab: 'general' | 'account' | 'security' | 'notifications';
}

const SettingsDetailView: React.FC<SettingsDetailViewProps> = ({ activeTab: initialTab }) => {
    const { user, signOut } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    // Guests can only access 'general' settings
    const activeTab = (!user && initialTab !== 'general') ? 'general' : initialTab;
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

    // Security State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');

    // Notification State
    const [emailNotif, setEmailNotif] = useState(true);
    const [marketingNotif, setMarketingNotif] = useState(false);
    const [notifLoading, setNotifLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchSettings = async () => {
                const { data } = await supabase
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
            setShowWarning({ show: true, message: 'Şifreler eşleşmiyor!' });
            return;
        }
        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setShowWarning({ show: true, message: 'Şifreniz başarıyla güncellendi!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setShowWarning({ show: true, message: 'Hata: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ email: newEmail });
            if (error) throw error;
            setShowWarning({ show: true, message: 'E-posta güncelleme onayı için yeni adresinize bir mail gönderdik.' });
            setNewEmail('');
        } catch (error: any) {
            setShowWarning({ show: true, message: 'Hata: ' + error.message });
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
            const { error } = await supabase
                .from('profiles')
                .update(type === 'email' ? { email_notifications: newValue } : { marketing_notifications: newValue })
                .eq('id', user.id);
            if (error) throw error;
        } catch (error) {
            if (type === 'email') setEmailNotif(!newValue);
            else setMarketingNotif(!newValue);
        } finally {
            setNotifLoading(false);
        }
    };

    const isEmployer = user?.user_metadata?.role === 'employer';

    return (
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto custom-scrollbar bg-white dark:bg-black">
            {/* Warning Overlay */}
            {showWarning.show && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/5 backdrop-blur-sm p-6">
                    <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl text-center">
                        <h3 className="text-xl font-black mb-4 tracking-tighter">Mesaj</h3>
                        <p className="text-sm font-medium text-gray-500 mb-8">{showWarning.message}</p>
                        <button onClick={() => setShowWarning({ show: false, message: '' })} className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest">Tamam</button>
                    </div>
                </div>
            )}

            {activeTab === 'general' && (
                <div className="space-y-12">
                    <section>
                        <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                            {t('account.appearance')}
                        </h3>
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                                    <i className={`fi ${theme === 'dark' ? 'fi-rr-moon' : 'fi-rr-sun'} text-xl text-[#1f6d78] dark:text-[#2dd4bf]`}></i>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{theme === 'dark' ? t('account.dark') : t('account.light')}</p>
                                    <p className="text-xs text-gray-500 font-medium">Platform temasını değiştirin</p>
                                </div>
                            </div>
                            <button onClick={toggleTheme} className={`w-14 h-8 rounded-full p-1.5 transition-all ${theme === 'dark' ? 'bg-[#1f6d78]' : 'bg-gray-300'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                            {t('settings.language')}
                        </h3>
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
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${language === lang.code
                                        ? 'bg-[#1f6d78] text-white border-[#1f6d78] shadow-lg shadow-[#1f6d78]/10'
                                        : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-white/5 text-gray-900 dark:text-gray-300 hover:border-[#1f6d78]/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className="font-bold text-sm tracking-tight">{lang.label}</span>
                                    </div>
                                    {language === lang.code && <i className="fi fi-rr-check text-sm"></i>}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'account' && (
                <div className="max-w-xl mx-auto space-y-10">
                    <section>
                        <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                            HESAP ÖZETİ
                        </h3>
                        <div className="p-8 rounded-[2rem] bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-6">
                            <div className="flex flex-col gap-1">
                                <span className="font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">E-POSTA</span>
                                <span className="font-bold text-[15px] text-gray-900 dark:text-gray-100">{user?.email}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">ÜYELİK TARİHİ</span>
                                <span className="font-bold text-[15px] text-gray-900 dark:text-gray-100">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                                </span>
                            </div>
                            <div className="pt-2">
                                <span className="font-medium text-[11px] text-gray-400/70">Kullanıcı ID: {user?.id}</span>
                            </div>
                        </div>
                    </section>

                    <section className="pt-4">
                        <div className="p-8 rounded-[2.5rem] bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 text-center">
                            <h4 className="text-red-900 dark:text-red-400 font-black tracking-tight mb-2">Hesabımı Sil</h4>
                            <p className="text-[13px] font-medium text-red-700/70 dark:text-red-400/60 mb-8 max-w-sm mx-auto leading-relaxed">
                                CV'niz, başvurularınız ve profiliniz kalıcı olarak silinir. Bu işlem geri alınamaz.
                            </p>
                            <button className="w-full max-w-xs py-4 bg-white dark:bg-gray-900 text-red-600 font-extrabold border border-red-200 dark:border-red-900/50 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95">
                                Hesabı Sil
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="space-y-12">
                    <section>
                         <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                            E-posta Değiştir
                        </h3>
                        <div className="flex gap-3">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Yeni e-posta adresi"
                                className="flex-1 bg-gray-50 dark:bg-gray-800/80 rounded-xl px-5 py-3.5 text-sm font-bold border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-[#1f6d78]/20 transition-all"
                            />
                            <button onClick={handleUpdateEmail} className="px-6 bg-[#1f6d78] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20 hover:scale-105 active:scale-95 transition-all">Güncelle</button>
                        </div>
                    </section>

                    <section>
                         <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                            Şifre Değiştir
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Yeni şifre"
                                className="w-full bg-gray-50 dark:bg-gray-800/80 rounded-xl px-5 py-3.5 text-sm font-bold border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-[#1f6d78]/20 transition-all"
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Yeni şifre (Tekrar)"
                                className="w-full bg-gray-50 dark:bg-gray-800/80 rounded-xl px-5 py-3.5 text-sm font-bold border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-[#1f6d78]/20 transition-all"
                            />
                            <div className="flex justify-end pt-2">
                                <button onClick={handleUpdatePassword} className="px-8 py-3.5 bg-[#1f6d78] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20 hover:scale-105 active:scale-95 transition-all">Şifreyi Güncelle</button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'notifications' && (
                <div className="space-y-6">
                    <h3 className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
                        Bildirim Tercihleri
                    </h3>
                    {[
                        { id: 'email', title: t('settings.notif_email_title'), desc: t('settings.notif_email_desc'), active: emailNotif },
                        { id: 'marketing', title: t('settings.notif_marketing_title'), desc: t('settings.notif_marketing_desc'), active: marketingNotif }
                    ].map((n) => (
                        <div key={n.id} onClick={() => toggleNotification(n.id as any)} className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[#1f6d78]/30 transition-all group">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{n.title}</h4>
                                <p className="text-xs text-gray-500 font-medium">{n.desc}</p>
                            </div>
                            <div className={`w-14 h-8 rounded-full p-1.5 transition-all ${n.active ? 'bg-[#1f6d78]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${n.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SettingsDetailView;
