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

    // Yeni Kayıt alanları (CV İçin)
    const [fullName, setFullName] = useState('');
    const [profession, setProfession] = useState('');
    const [city, setCity] = useState('');
    const [experienceYears, setExperienceYears] = useState<number | ''>('');
    const [experienceMonths, setExperienceMonths] = useState<number | ''>('');

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
                            role: isEmployer ? 'employer' : 'job_seeker',
                            full_name: !isEmployer ? fullName : undefined,
                            profession: (!isEmployer && profession) ? profession : undefined,
                            city: (!isEmployer && city) ? city : undefined,
                            experience_years: (!isEmployer && experienceYears !== '') ? Number(experienceYears) : undefined,
                            experience_months: (!isEmployer && experienceMonths !== '') ? Number(experienceMonths) : undefined,
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
        <div className="fixed inset-0 z-[140] flex flex-col justify-end sm:justify-center items-center sm:p-4 bg-white dark:bg-gray-900 sm:bg-black/50 sm:backdrop-blur-sm animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 w-full h-full max-h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-none sm:shadow-2xl relative flex flex-col rounded-none sm:rounded-3xl overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 z-20 bg-white/50 backdrop-blur-sm"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Scrollable Content Area */}
                <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-5 sm:p-8 pt-10 sm:pt-8 w-full pb-8">
                    <div className="text-center mb-6 px-4">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                            {mode === 'reset'
                                ? 'Şifremi Unuttum'
                                : (isEmployer
                                    ? (mode === 'signin' ? 'İş Veren Girişi' : 'İş Veren Hesabı Oluştur')
                                    : (mode === 'signin' ? 'İş Arayan Girişi' : 'İş Arayan Hesabı Oluştur')
                                )
                            }
                        </h2>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                            {mode === 'reset'
                                ? 'Şifrenizi sıfırlamak için e-posta adresinizi girin.'
                                : (isEmployer
                                    ? 'Firma profilinizi yönetmek için giriş yapın.'
                                    : (mode === 'signin'
                                        ? 'Sizinle hangi işverenlerin ilgilendiğini görmek için giriş yapın.'
                                        : 'Saniyeler içinde hesabınızı oluşturun, ana sayfada kartvizitiniz\nsizin için iş bulmaya başlasın.')
                                )
                            }
                        </p>
                    </div>

                    <form id="auth-form" onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-[11px] sm:text-sm p-3 rounded-xl font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        {mode === 'signup' && !isEmployer && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">İsim Soyisim</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78]/5 focus:border-[#1f6d78] transition-all placeholder:text-gray-400"
                                        placeholder="Adınız Soyadınız"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Meslek</label>
                                    <input
                                        type="text"
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78]/5 focus:border-[#1f6d78] transition-all placeholder:text-gray-400"
                                        placeholder="Örn: Muhasebeci, Bilgisayar Mühendisi"
                                    />
                                    <p className="text-[9px] text-gray-500 ml-1">Yaptığınız meslekleri virgülle ayırarak daha fazla meslek yazabilirsiniz.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Şehir</label>
                                    <SearchableSelect
                                        value={city}
                                        onChange={(val) => setCity(val)}
                                        options={Object.keys(TURKEY_LOCATIONS).sort()}
                                        placeholder="Şehir"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Tecrübe</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={experienceYears}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '') setExperienceYears('');
                                                else if (Number(val) >= 0 && Number(val) <= 100) setExperienceYears(Number(val));
                                            }}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78] transition-all"
                                            placeholder="Yıl (Örn: 5)"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            max="11"
                                            value={experienceMonths}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '') setExperienceMonths('');
                                                else if (Number(val) >= 0 && Number(val) <= 11) setExperienceMonths(Number(val));
                                            }}
                                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78] transition-all"
                                            placeholder="Ay (Örn: 6)"
                                        />
                                    </div>
                                    <p className="text-[9px] text-gray-500 ml-1">En deneyimli olduğunuz meslekteki tecrübenizi girin.</p>
                                </div>
                            </>
                        )}

                        <div className={`flex flex-col gap-4 ${(mode === 'signin' || mode === 'reset') ? 'my-auto' : ''}`}>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">E-posta</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78] transition-all placeholder:text-gray-400"
                                    placeholder="ornek@email.com"
                                />
                            </div>

                            {mode !== 'reset' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Şifre</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#1f6d78]/5 focus:border-[#1f6d78] transition-all placeholder:text-gray-400 pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                                    <line x1="2" y1="2" x2="22" y2="22" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {mode === 'signin' && (
                                        <div className="flex justify-end mt-1">
                                            <button
                                                type="button"
                                                onClick={() => { setMode('reset'); setError(null); }}
                                                className="text-[10px] sm:text-xs font-bold text-[#1f6d78] hover:underline"
                                            >
                                                Şifremi Unuttum?
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {mode === 'signin' && (
                                <div className="flex items-center gap-2 px-1">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#1f6d78] focus:ring-[#1f6d78] focus:ring-offset-0 cursor-pointer accent-[#1f6d78]"
                                    />
                                    <label htmlFor="rememberMe" className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                        Beni Hatırla
                                    </label>
                                </div>
                            )}
                        </div>


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
                                <label htmlFor="isEmployer" className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                    İşveren Hesabı Oluştur (Firma Profili)
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-[90%] sm:w-full mx-auto bg-[#1f6d78] text-white font-bold py-3.5 sm:py-3.5 rounded-full hover:bg-[#155e68] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-[15px] leading-none mt-auto`}
                        >
                            {loading ? 'İşleniyor...' : (mode === 'signin' ? 'Giriş Yap' : (mode === 'reset' ? 'Sıfırlama Linki Gönder' : 'Kayıt Ol'))}
                        </button>
                    </form>

                    <div className={`mt-5 text-center ${mode === 'signup' ? 'pb-24' : 'pb-12'} sm:pb-8`}>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {mode === 'signin'
                                ? 'Hesabın yok mu?'
                                : (mode === 'reset' ? 'Giriş ekranına dön:' : 'Zaten hesabın var mı?')
                            }
                            <button
                                onClick={() => {
                                    if (mode === 'signin') {
                                        setMode('signup');
                                    } else if (mode === 'signup' || mode === 'reset') {
                                        setMode('signin');
                                    }
                                    setError(null);
                                }}
                                className="ml-2 text-xs sm:text-sm font-bold text-[#1f6d78] hover:underline pb-2"
                            >
                                {mode === 'signin' ? 'Kayıt Ol' : 'Giriş Yap'}
                            </button>
                        </p>
                    </div>

                    {/* Success Overlay for SIGNUP */}
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

                    {/* Success Overlay for RESET PASSWORD */}
                    {showResetSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-800 animate-in fade-in duration-300">
                            <div className="text-center p-8 w-full">
                                <div className="w-20 h-20 bg-[#1f6d78]/10 text-[#1f6d78] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl animate-in zoom-in-50 duration-500">
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
                                    className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-xl shadow-[#1f6d78]/20 active:scale-95"
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
