import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SearchableSelect from './SearchableSelect';
import { TURKEY_LOCATIONS } from '../locations';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup' | 'reset';
    initialRole?: 'job_seeker' | 'employer';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin', initialRole }) => {
    const { t } = useLanguage();
    const { signInWithGoogle, signInWithApple } = useAuth();
    const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
    const [selectedRole, setSelectedRole] = useState<'job_seeker' | 'employer' | 'shop' | null>(initialRole || null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showResetSuccess, setShowResetSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setSelectedRole(initialRole || null);
            if (initialMode === 'signin') {
                const savedEmail = localStorage.getItem('rememberedEmail');
                if (savedEmail) {
                    setEmail(savedEmail);
                    setRememberMe(true);
                }
            }
        }
    }, [isOpen, initialMode, initialRole]);

    const handleSocialLogin = async (provider: 'google') => {
        if (mode === 'signup' && !selectedRole) {
            setError(t('auth.error_select_role') || 'Lütfen bir hesap türü seçin.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Store role in localStorage before redirecting for OAuth signup
            if (mode === 'signup' && selectedRole) {
                localStorage.setItem('pendingRole', selectedRole);
            }

            if (provider === 'google') {
                await signInWithGoogle();
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'signup' && !selectedRole) {
            setError(t('auth.error_select_role') || 'Lütfen bir hesap türü seçin.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            if (mode === 'reset') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/#reset-password`,
                });
                if (error) throw error;
                setShowResetSuccess(true);
            } else if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: selectedRole
                        }
                    }
                });
                if (error) throw error;
                setShowSuccess(true);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                onClose();
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[140] flex flex-col justify-end sm:justify-center items-center sm:p-4 bg-white dark:bg-black sm:bg-black/50 sm:backdrop-blur-sm">
            <div className="bg-white dark:bg-black w-full h-full max-h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-none sm:shadow-2xl relative flex flex-col rounded-none sm:rounded-3xl overflow-hidden sm:border sm:border-gray-100 dark:border-white/10">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 z-50 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-6 sm:p-10 pt-28 sm:pt-24 w-full pb-8 relative z-10">
                    <div className="text-center mb-8 px-2">
                        <h2 className="text-[28px] sm:text-[32px] font-black text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">
                            {mode === 'reset' ? t('auth.forgot_password') : (mode === 'signin' ? t('auth.signin_title') : t('auth.signup_title'))}
                        </h2>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] mx-auto max-w-[280px] sm:max-w-sm">
                            {mode === 'signup' ? t('auth.signup_desc') || 'Size uygun olan hesap türünü seçin aramıza katılın.' : t('auth.signin_desc') || 'Sisteme giriş yapmak için bilgilerinizi girin.'}
                        </p>
                    </div>

                    {mode === 'signup' && !selectedRole ? (
                        <div className="space-y-8 max-w-sm mx-auto w-full mt-12">
                            {[
                                { id: 'job_seeker', title: t('auth.job_seeker_title'), desc: t('auth.job_seeker_desc'), icon: 'fi-rr-user' },
                                { id: 'employer', title: t('auth.employer_title'), desc: t('auth.employer_desc'), icon: 'fi-rr-building' }
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id as any)}
                                    className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border-2 border-black dark:border-white rounded-2xl transition-all group text-left shadow-sm active:scale-[0.98]"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center text-2xl text-[#1f6d78] dark:text-[#2dd4bf] group-hover:scale-110 transition-transform">
                                        <i className={`fi ${role.icon}`}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-[#1f6d78] dark:text-[#2dd4bf] text-base leading-tight">{role.title}</h3>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">{role.desc}</p>
                                    </div>
                                </button>
                            ))}
                            
                             <div className="flex flex-row items-center justify-center gap-1.5 pt-6">
                                <p className="text-[13.5px] text-gray-500 dark:text-gray-400 font-bold">{t('auth.have_account')}</p>
                                <button
                                    onClick={() => { setMode('signin'); setSelectedRole(null); }}
                                    className="text-[13.5px] font-black text-[#1f6d78] dark:text-[#2dd4bf] hover:text-[#155e68] dark:hover:text-white transition-colors"
                                >
                                    {t('auth.signin_btn')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form id="auth-form" onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 w-full max-w-sm mx-auto">
                            {selectedRole && mode === 'signup' && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-2 border border-dashed border-gray-200 dark:border-gray-700">
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedRole(null)}
                                        className="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                                    >
                                        <i className="fi fi-rr-arrow-small-left text-xl"></i>
                                    </button>
                                    <div>
                                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('auth.selected_type') || 'Seçilen Tür'}</p>
                                        <h4 className="text-sm font-black text-gray-800 dark:text-white leading-none">
                                            {selectedRole === 'job_seeker' ? t('nav.job_seeker') : selectedRole === 'employer' ? t('nav.employer') : t('nav.service_provider')}
                                        </h4>
                                    </div>
                                </div>
                            )}

                            {mode !== 'reset' && (
                                <>
                                    <div className="flex flex-col gap-3 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSocialLogin('google')}
                                                disabled={loading}
                                                className="w-full flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-white/5 h-[52px] rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-bold text-[14px] text-gray-700 dark:text-gray-200 active:scale-[0.98] shadow-sm"
                                            >
                                                <div className="flex items-center justify-center gap-3 w-full">
                                                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                                        <img 
                                                            src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" 
                                                            alt="Google" 
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="leading-none">{mode === 'signin' ? t('auth.signin_google') || 'Google ile Giriş Yap' : t('auth.signup_google') || 'Google ile Kayıt Ol'}</span>
                                                </div>
                                            </button>
                                    </div>

                                    <div className="relative flex items-center gap-4 my-2 mb-4">
                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/5"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('auth.or') || 'veya e-posta'}</span>
                                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/5"></div>
                                    </div>
                                </>
                            )}

                            {error && (
                                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] sm:text-sm p-3.5 rounded-2xl font-bold border border-red-100 dark:border-red-500/20 text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1 pl-1">{t('auth.email_label')}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-black/50 border-2 border-transparent focus:bg-white dark:focus:bg-black focus:border-[#1f6d78]/30 dark:focus:border-[#2dd4bf]/30 rounded-2xl px-5 py-4 text-[15px] text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-4 focus:ring-[#1f6d78]/10 transition-all placeholder:text-gray-400"
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            {mode !== 'reset' && (
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1 pl-1">{t('auth.password_label')}</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 dark:bg-black/50 border-2 border-transparent focus:bg-white dark:focus:bg-black focus:border-[#1f6d78]/30 dark:focus:border-[#2dd4bf]/30 rounded-2xl px-5 py-4 text-[15px] text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-4 focus:ring-[#1f6d78]/10 transition-all placeholder:text-gray-400 pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1f6d78] transition-colors"
                                        >
                                            <i className={`fi ${showPassword ? 'fi-rr-eye-crossed' : 'fi-rr-eye'} text-lg`}></i>
                                        </button>
                                    </div>
                                     {mode === 'signin' && (
                                        <div className="flex justify-end mt-1">
                                            <button type="button" onClick={() => setMode('reset')} className="text-[10px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-wide">{t('auth.forgot_password')}?</button>
                                        </div>
                                    )}
                                </div>
                            )}

                             <button
                                 type="submit"
                                 disabled={loading}
                                 className="w-full bg-[#1f6d78] dark:bg-[#2dd4bf] text-white dark:text-gray-900 font-black py-4 rounded-2xl hover:bg-[#155e68] shadow-xl shadow-[#1f6d78]/10 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 uppercase tracking-widest text-sm"
                             >
                                 {loading ? t('common.processing') || 'İşleniyor...' : (mode === 'signin' ? t('auth.signin_btn') : (mode === 'signup' ? t('auth.signup_btn') : t('auth.send_reset_link') || 'Sıfırlama Linki Gönder'))}
                             </button>

                             <div className="flex items-center justify-center gap-1.5 pt-4">
                                <p className="text-[13px] text-gray-500 font-bold">{mode === 'signin' ? t('auth.no_account') : t('auth.have_account')}</p>
                                <button
                                    type="button"
                                    onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); if (mode === 'signin') setSelectedRole(null); }}
                                    className="text-[13px] font-black text-[#1f6d78] dark:text-[#2dd4bf]"
                                >
                                    {mode === 'signin' ? t('auth.signup_now') : t('auth.signin_btn')}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Success Overlay for SIGNUP */}
                    {showSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
                            <div className="text-center p-8 w-full">
                                <div className="w-20 h-20 bg-[#1f6d78]/10 text-[#1f6d78] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                    ✉️
                                </div>
                                 <h3 className="text-2xl font-black text-[#1f6d78] dark:text-[#2dd4bf] mb-4 leading-tight tracking-tight">
                                    {t('auth.success_signup')}
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
                                    {t('auth.success_signup_desc')}
                                </p>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:"
                                >
                                    {t('common.done') || 'Tamam'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success Overlay for RESET PASSWORD */}
                    {showResetSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-800">
                            <div className="text-center p-8 w-full">
                                <div className="w-20 h-20 bg-[#1f6d78]/10 text-[#1f6d78] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                    📨
                                </div>
                                 <h3 className="text-2xl font-black text-[#1f6d78] dark:text-[#2dd4bf] mb-4 leading-tight tracking-tight">
                                    {t('auth.reset_sent') || 'E-posta Gönderildi!'}
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
                                    {t('auth.reset_sent_desc') || 'Şifre sıfırlama talimatlarını içeren bir e-posta gönderdik. Lütfen gelen kutunuzu kontrol edin.'}
                                </p>
                                <button
                                    onClick={() => { setShowResetSuccess(false); setMode('signin'); }}
                                    className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:"
                                >
                                    {t('auth.signin_btn')}
                                </button>
                            </div>
                        </div>
                    )}
                </div> {/* End of scrollable area */}
            </div>
        </div>
    );
};

export default AuthModal;
