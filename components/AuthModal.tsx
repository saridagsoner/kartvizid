
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';


interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup';
    initialRole?: 'job_seeker' | 'employer';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin', initialRole = 'job_seeker' }) => {
    const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
    const [showSuccess, setShowSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEmployer, setIsEmployer] = useState(initialRole === 'employer');

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

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
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

                // If the trigger doesn't handle it, we might want to manually update.
                // However, doing it here might be racy if the user isn't fully created/confirmed.
                // For now, we rely on metadata. 

                // Show success modal instead of alert
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                        {isEmployer
                            ? (mode === 'signin' ? 'İş Veren Girişi' : 'İş Veren Hesabı Oluştur')
                            : (mode === 'signin' ? 'Aday Girişi' : 'Aday Hesabı Oluştur')
                        }
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {isEmployer
                            ? 'Firma profilinizi yönetmek için giriş yapın.'
                            : 'Kariyerinizde yeni bir sayfa açmak için katılın.'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">E-posta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78]/5 focus:border-[#1f6d78] transition-all placeholder:text-gray-400"
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78]/5 focus:border-[#1f6d78] transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                        />
                    </div>

                    {mode === 'signin' && (
                        <div className="flex items-center gap-2 px-1">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#1f6d78] focus:ring-[#1f6d78] focus:ring-offset-0 cursor-pointer accent-[#1f6d78]"
                            />
                            <label htmlFor="rememberMe" className="text-sm font-bold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                Beni Hatırla
                            </label>
                        </div>
                    )}


                    {/* Show employer checkbox ONLY if no initialRole was passed (generic entry) 
                        OR if we want to allow switching. But user requested 'accordingly'. 
                        So if initialRole is set, we hide the checkbox to avoid confusion, 
                        assuming the button click determines the intent. 
                    */}
                    {!initialRole && mode === 'signup' && (
                        <div className="flex items-center gap-2 px-1">
                            <input
                                type="checkbox"
                                id="isEmployer"
                                checked={isEmployer}
                                onChange={(e) => setIsEmployer(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#1f6d78] focus:ring-[#1f6d78] focus:ring-offset-0 cursor-pointer accent-[#1f6d78]"
                            />
                            <label htmlFor="isEmployer" className="text-sm font-bold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                İşveren Hesabı Oluştur (Firma Profili)
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full bg-[#1f6d78] text-white font-bold py-4 rounded-xl hover:bg-[#155e68] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'İşleniyor...' : (mode === 'signin' ? 'Giriş Yap' : 'Kayıt Ol')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {mode === 'signin' ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
                        <button
                            onClick={() => {
                                setMode(mode === 'signin' ? 'signup' : 'signin');
                                setError(null);
                            }}
                            className="ml-2 text-black dark:text-white font-bold hover:underline"
                        >
                            {mode === 'signin' ? 'Kayıt Ol' : 'Giriş Yap'}
                        </button>
                    </p>
                </div>
                {/* Success Overlay */}
                {showSuccess && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-800 animate-in fade-in duration-300">
                        <div className="text-center p-8 w-full">
                            <div className="w-20 h-20 bg-[#1f6d78]/10 text-[#1f6d78] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl animate-in zoom-in-50 duration-500">
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
                                className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:scale-95"
                            >
                                Tamam
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
