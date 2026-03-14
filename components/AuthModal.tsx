import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SearchableSelect from './SearchableSelect';
import { TURKEY_LOCATIONS } from '../locations';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup' | 'reset';
    initialRole?: 'job_seeker' | 'employer';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin', initialRole = 'job_seeker' }) => {
    const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showResetSuccess, setShowResetSuccess] = useState(false); // Success for reset email sent
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isEmployer, setIsEmployer] = useState(initialRole === 'employer');
    const [showPassword, setShowPassword] = useState(false);



    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setIsEmployer(initialRole === 'employer');
            if (mode === 'signin') {
                const savedEmail = localStorage.getItem('rememberedEmail');
                if (savedEmail) {
                    setEmail(savedEmail);
                    setRememberMe(true);
                }
            }
        }
    }, [isOpen, initialMode, initialRole]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'reset') {
                // Password Reset Logic
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/#reset-password`,
                });
                if (error) throw error;
                setShowResetSuccess(true);

            } else if (mode === 'signup') {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: isEmployer ? 'employer' : 'job_seeker'
                        }
                    }
                });
                if (error) throw error;

                // Always show success message for email verification
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
        <div className="fixed inset-0 z-[140] flex flex-col justify-end sm:justify-center items-center sm:p-4 bg-white dark:bg-gray-900 sm:bg-black/50 sm:backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full h-full max-h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-none sm:shadow-2xl relative flex flex-col rounded-none sm:rounded-3xl overflow-hidden sm:border sm:border-gray-100 dark:border-gray-800">

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

                {/* Scrollable Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-6 sm:p-10 pt-12 sm:pt-10 w-full pb-[100px] sm:pb-8 relative z-10">
                    <div className="text-center mb-8 px-2">
                        <h2 className="text-[28px] sm:text-[32px] font-black text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">
                            {mode === 'reset'
                                ? 'Şifremi Unuttum'
                                : (isEmployer
                                    ? (mode === 'signin' ? 'İş Veren Girişi' : 'İş Veren Kaydı')
                                    : (mode === 'signin' ? 'İş Arayan Girişi' : 'Hesap Oluştur')
                                )
                            }
                        </h2>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] mx-auto max-w-[280px] sm:max-w-sm">
                            {mode === 'reset'
                                ? 'Şifrenizi sıfırlamak için e-posta adresinizi girin.'
                                : (isEmployer
                                    ? 'Firma profilinizi yönetmek için giriş yapın.'
                                    : 'Kariyerinizde yeni bir sayfa açmak için hemen giriş yapın.'
                                )
                            }
                        </p>
                    </div>

                    <form id="auth-form" onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 w-full max-w-sm mx-auto">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] sm:text-sm p-3.5 rounded-2xl font-bold border border-red-100 dark:border-red-500/20 text-center">
                                {error}
                            </div>
                        )}

                        <div className={`flex flex-col gap-4 ${(mode === 'signin' || mode === 'reset') ? 'my-auto' : ''}`}>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1 pl-1">E-posta</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-[#1f6d78]/30 dark:focus:border-[#2dd4bf]/30 rounded-2xl px-5 py-4 text-[15px] sm:text-base text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-4 focus:ring-[#1f6d78]/10 transition-all placeholder:text-gray-400 placeholder:font-medium shadow-sm"
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            {mode !== 'reset' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1 pl-1">Şifre</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-[#1f6d78]/30 dark:focus:border-[#2dd4bf]/30 rounded-2xl px-5 py-4 text-[15px] sm:text-base text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-4 focus:ring-[#1f6d78]/10 transition-all placeholder:text-gray-400 placeholder:font-medium shadow-sm pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -/2 text-gray-400 hover:text-[#1f6d78] dark:hover:text-[#2dd4bf] focus:outline-none transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                                    <line x1="2" y1="2" x2="22" y2="22" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {mode === 'signin' && (
                                        <div className="flex justify-end mt-2">
                                            <button
                                                type="button"
                                                onClick={() => { setMode('reset'); setError(null); }}
                                                className="text-[11px] font-black text-[#1f6d78] dark:text-[#2dd4bf] hover:text-[#155e68] dark:hover:text-white transition-colors"
                                            >
                                                Şifremi Unuttum?
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {mode === 'signin' && (
                                <div className="flex items-center gap-3 px-2 mt-1">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded-md border-gray-300 dark:border-gray-600 text-[#1f6d78] focus:ring-[#1f6d78] focus:ring-offset-0 cursor-pointer accent-[#1f6d78] dark:bg-gray-800"
                                    />
                                    <label htmlFor="rememberMe" className="text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                                        Beni Hatırla
                                    </label>
                                </div>
                            )}
                        </div>

                        {!initialRole && mode === 'signup' && (
                            <div className="flex items-center gap-3 px-2 mt-1">
                                <input
                                    type="checkbox"
                                    id="isEmployer"
                                    checked={isEmployer}
                                    onChange={(e) => setIsEmployer(e.target.checked)}
                                    className="w-4 h-4 rounded-md border-gray-300 dark:border-gray-600 text-[#1f6d78] focus:ring-[#1f6d78] focus:ring-offset-0 cursor-pointer accent-[#1f6d78] dark:bg-gray-800"
                                />
                                <label htmlFor="isEmployer" className="text-sm font-bold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                                    İşveren Hesabı Oluştur (Firma Profili)
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#1f6d78] dark:bg-[#2dd4bf] text-white dark:text-gray-900 font-black py-4 rounded-2xl hover:bg-[#155e68] dark:hover:bg-teal-300 shadow-xl shadow-[#1f6d78]/20 dark:shadow-[#2dd4bf]/20 active:[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[15px] uppercase tracking-widest leading-none mt-6 mb-2`}
                        >
                            {loading ? 'İşleniyor...' : (mode === 'signin' ? 'Giriş Yap' : (mode === 'reset' ? 'Sıfırlama Linki Gönder' : 'Kayıt Ol'))}
                        </button>

                        <div className="flex flex-row flex-wrap items-center justify-center gap-1.5 pt-4 pb-6 sm:pb-2">
                            <p className="text-[13.5px] text-gray-500 dark:text-gray-400 font-bold">
                                {mode === 'signin'
                                    ? 'Hesabın yok mu?'
                                    : (mode === 'reset' ? 'Giriş ekranına dön:' : 'Zaten hesabın var mı?')
                                }
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    if (mode === 'signin') {
                                        setMode('signup');
                                    } else if (mode === 'signup' || mode === 'reset') {
                                        setMode('signin');
                                    }
                                    setError(null);
                                }}
                                className="text-[13.5px] font-black text-[#1f6d78] dark:text-[#2dd4bf] hover:text-[#155e68] dark:hover:text-white transition-colors"
                            >
                                {mode === 'signin' ? 'Hemen Kayıt Ol' : 'Giriş Yap'}
                            </button>
                        </div>
                    </form>

                    {/* Success Overlay for SIGNUP */}
                    {showSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-800">
                            <div className="text-center p-8 w-full">
                                <div className="w-20 h-20 bg-[#1f6d78]/10 text-[#1f6d78] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                    ✉️
                                </div>
                                <h3 className="text-2xl font-black text-[#1f6d78] dark:text-[#2dd4bf] mb-4 leading-tight tracking-tight">
                                    Kayıt Başarılı!
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
                                    Lütfen e-posta adresinizi doğrulayın. Hesabınızı aktifleştirmek için mail kutunuzu kontrol edin.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:"
                                >
                                    Tamam
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
                                    E-posta Gönderildi!
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
                                    Şifre sıfırlama talimatlarını içeren bir e-posta gönderdik. Lütfen gelen kutunuzu kontrol edin.
                                </p>
                                <button
                                    onClick={() => { setShowResetSuccess(false); setMode('signin'); }}
                                    className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:"
                                >
                                    Giriş Yap
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
