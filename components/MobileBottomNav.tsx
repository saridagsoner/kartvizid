import React, { useState, useEffect } from 'react';
import { ContactRequest, NotificationItem } from '../types';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Rebuild verified

interface MobileBottomNavProps {
    user: any;
    onSearch: (query: string) => void;
    onCreateCV: () => void;
    onOpenCompanyProfile?: () => void;
    hasCV?: boolean;
    userPhotoUrl?: string;
    notificationCount?: number;
    notifications?: (ContactRequest | NotificationItem)[];
    onNotificationAction?: (requestId: string, action: 'approved' | 'rejected') => void;
    onMarkNotificationRead?: (id: string) => void;
    onMarkAllRead?: () => void;
    onOpenProfile?: (userId: string, role?: string) => void;
    onOpenAuth: (mode: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => void;
    signOut: () => void;
    onOpenMenu?: () => void;
    isHomeView?: boolean;
    onGoHome?: () => void;
    isCreateOpen?: boolean;
    isProfileOpen?: boolean;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    user,
    onSearch,
    onCreateCV,
    onOpenCompanyProfile,
    hasCV,
    userPhotoUrl,
    notificationCount = 0,
    notifications = [],
    onNotificationAction,
    onMarkNotificationRead,
    onMarkAllRead,
    onOpenProfile,
    onOpenAuth,
    signOut,
    onOpenMenu,
    isHomeView = true,
    onGoHome,
    isCreateOpen = false,
    isProfileOpen = false
}) => {
    const [activeTab, setActiveTab] = useState<'home' | 'notifications' | 'profile' | 'search' | 'create' | null>(null);
    const isEmployer = user?.user_metadata?.role === 'employer';
    const [query, setQuery] = useState('');
    const { t } = useLanguage();

    // Close sheets when clicking outside or navigating
    useEffect(() => {
        const handleScroll = () => {
            // Optional: Hide/Show logic on scroll could go here
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTab = (tab: 'notifications' | 'profile' | 'search' | 'create') => {
        if (activeTab === tab) {
            setActiveTab(null);
        } else {
            setActiveTab(tab);
        }
    };

    const isNotifActive = activeTab === 'notifications';
    const isCreateActiveTab = isCreateOpen || activeTab === 'create';
    const isProfileActiveTab = isProfileOpen || activeTab === 'profile';
    const hasActiveBottomTab = isNotifActive || isCreateActiveTab || isProfileActiveTab;

    // First button (Menu/Kartvizid) becomes Home if NOT on home OR if ANY bottom tab is active
    const isFirstButtonHome = !isHomeView || hasActiveBottomTab;

    const renderHomeIcon = () => (
        <div className="h-8 group-active:scale-95 transition-transform flex items-center justify-center">
            <span className="inline-block transform rotate-[12deg] origin-center text-[#1f6d78] font-black text-2xl leading-none rounded-font tracking-tight">d</span>
        </div>
    );

    return (
        <>
            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg z-[150] sm:hidden pb-safe">
                <div className="flex items-center justify-around h-16 px-2 pb-2">
                    {/* Menu Button (Replaces Home) */}
                    <button
                        onClick={() => {
                            if (isFirstButtonHome) {
                                setActiveTab(null);
                                if (onGoHome) onGoHome();
                            } else if (onOpenMenu) {
                                onOpenMenu();
                            }
                        }}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-0.5 group`}
                    >
                        {renderHomeIcon()}
                        <span className="text-[10px] font-medium text-[#1f6d78] leading-none">
                            {isFirstButtonHome ? 'Ana Sayfa' : 'Kartvizid'}
                        </span>
                    </button>

                    {/* Notifications Button */}
                    <button
                        onClick={() => toggleTab('notifications')}
                        className={`relative flex flex-col items-center justify-center w-16 h-full space-y-0.5 ${activeTab === 'notifications' ? 'text-[#1f6d78]' : 'text-[#1f6d78]'}`}
                    >
                        <div className="h-8 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium leading-none">Bildirim</span>
                        {notificationCount > 0 && (
                            <span className="absolute top-2 right-4 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Main Action Button (Create/Edit) */}
                    <button
                        onClick={() => {
                            if (!user) {
                                toggleTab('create');
                            } else {
                                if (isEmployer && onOpenCompanyProfile) {
                                    onOpenCompanyProfile();
                                } else {
                                    onCreateCV();
                                }
                            }
                        }}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-0.5 transition-colors active:scale-95 ${activeTab === 'create' ? 'text-[#1f6d78]' : 'text-[#1f6d78] hover:text-[#1f6d78] active:text-[#1f6d78]'}`}
                    >
                        <div className="h-8 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium leading-none text-center">Oluştur</span>
                    </button>

                    {/* Profile Button */}
                    <button
                        onClick={() => {
                            if (!user) {
                                toggleTab('profile');
                            } else {
                                if (onOpenProfile) onOpenProfile(user.id, user.user_metadata?.role);
                            }
                        }}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-0.5 ${activeTab === 'profile' ? 'text-[#1f6d78]' : 'text-[#1f6d78]'}`}
                    >
                        <div className="h-8 flex flex-col items-center justify-center">
                            {userPhotoUrl ? (
                                <div className={`w-6 h-6 rounded-full overflow-hidden border ${activeTab === 'profile' ? 'border-[#1f6d78]' : 'border-gray-200'}`}>
                                    <img src={userPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <span className={`text-[10px] font-medium leading-none ${activeTab === 'profile' ? 'text-[#1f6d78]' : 'text-[#1f6d78]'}`}>Profil</span>
                    </button>
                </div>
            </div>

            {/* Search Overlay - Shows at Top (Covering Header) */}


            {/* Bottom Sheets Overlay Background*/}
            {(activeTab === 'notifications' || activeTab === 'profile' || activeTab === 'search' || activeTab === 'create') && (
                <div
                    className="fixed inset-0 bg-black/20 z-[90] sm:hidden animate-in fade-in duration-200"
                    onClick={() => setActiveTab(null)}
                />
            )}

            {/* Notifications Sheet - Full Screen */}
            {activeTab === 'notifications' && (
                user ? (
                    <NotificationDropdown
                        onClose={() => setActiveTab(null)}
                        notifications={notifications}
                        onAction={onNotificationAction || (() => { })}
                        onMarkRead={onMarkNotificationRead}
                        onMarkAllRead={onMarkAllRead}
                        onOpenProfile={onOpenProfile}
                        mobile={true}
                    />
                ) : (
                    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 animate-in slide-in-from-bottom duration-300 flex flex-col sm:hidden">
                        {/* Close Button Only */}
                        <div className="absolute top-4 right-4 z-10">
                            <button onClick={() => setActiveTab(null)} className="p-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 backdrop-blur-sm transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Marketing Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-center items-center">
                            <h3 className="text-[32px] leading-tight font-black text-gray-900 dark:text-white mb-10 rounded-font tracking-tight text-center">
                                Kariyeriniz İçin Ağ<br />Kurun
                            </h3>

                            <div className="space-y-6 mb-10 w-full text-center">
                                <div className="w-full flex flex-col items-center">
                                    <h4 className="font-bold text-[#1f6d78] dark:text-[#2dd4bf] mb-2 text-xl">
                                        İş Arayanlar İçin
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-[280px]">
                                        Potansiyel iş verenlerin size direkt ulaşmasını ve teklifleriyle kariyerinizi ileri taşımasını sağlayın.
                                    </p>
                                </div>

                                <div className="w-full flex flex-col items-center">
                                    <h4 className="font-bold text-[#1f6d78] dark:text-[#2dd4bf] mb-2 text-xl">
                                        İş Verenler İçin
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-[280px]">
                                        Açık pozisyonlarınız için en uygun adaylarla hemen iletişime geçin ve güvenilir bir iletişim ağı oluşturun.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setActiveTab(null);
                                        onOpenAuth('signup', 'job_seeker');
                                    }}
                                    className="w-full bg-[#1f6d78] text-white font-bold py-3.5 rounded-xl hover:bg-[#155e68] active:scale-[0.98] transition-all shadow-lg shadow-[#1f6d78]/20"
                                >
                                    Hemen CV Oluştur
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab(null);
                                        onOpenAuth('signup', 'employer');
                                    }}
                                    className="w-full bg-white dark:bg-gray-800 text-[#1f6d78] dark:text-[#2dd4bf] border border-[#1f6d78] dark:border-[#2dd4bf] font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all"
                                >
                                    Firma Profili Oluştur
                                </button>
                                <p className="mt-2 text-[13px] text-center text-gray-500 pb-2">
                                    Zaten üye misin? <button onClick={() => { setActiveTab(null); onOpenAuth('signin'); }} className="font-bold text-gray-900 dark:text-white hover:underline underline-offset-2">Giriş Yap</button>
                                </p>
                            </div>
                        </div>
                    </div>
                )
            )}
            {/* Create Sheet - Full Screen (Unauthenticated) */}
            {activeTab === 'create' && !user && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 animate-in slide-in-from-bottom duration-300 flex flex-col sm:hidden pb-[84px]">
                    {/* Close Button Only */}
                    <div className="absolute top-4 right-4 z-10">
                        <button onClick={() => setActiveTab(null)} className="p-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 backdrop-blur-sm transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Marketing Content */}
                    <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col justify-center">
                        <h3 className="text-2xl sm:text-3xl leading-tight font-black text-gray-900 dark:text-white mb-6 rounded-font tracking-tight text-center mt-6">
                            Dijital Kimliğinizi<br />Oluşturun
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="px-2 py-2 rounded-2xl border border-transparent">
                                <h4 className="font-bold text-[#1f6d78] dark:text-[#2dd4bf] mb-1 text-base sm:text-lg">
                                    İş Arayanlar İçin
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    Hemen ücretsiz bir CV oluşturun ve yeteneklerinizi on binlerce iş verene kolayca sergileyin.
                                </p>
                            </div>

                            <div className="px-2 py-2 rounded-2xl border border-transparent">
                                <h4 className="font-bold text-[#1f6d78] dark:text-[#2dd4bf] mb-1 text-base sm:text-lg">
                                    İş Verenler İçin
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    Firma profilinizi saniyeler içinde kurun ve aradığınız o mükemmel yeteneği hemen bulmaya başlayın.
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-2.5">
                            <button
                                onClick={() => {
                                    setActiveTab(null);
                                    onOpenAuth('signup', 'job_seeker');
                                }}
                                className="w-full bg-[#1f6d78] text-white font-bold py-3 sm:py-3.5 rounded-xl hover:bg-[#155e68] active:scale-[0.98] transition-all shadow-lg shadow-[#1f6d78]/20 text-sm sm:text-base"
                            >
                                Hemen CV Oluştur
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab(null);
                                    onOpenAuth('signup', 'employer');
                                }}
                                className="w-full bg-white dark:bg-gray-800 text-[#1f6d78] dark:text-[#2dd4bf] border border-[#1f6d78] dark:border-[#2dd4bf] font-bold py-3 sm:py-3.5 rounded-xl active:scale-[0.98] transition-all text-sm sm:text-base"
                            >
                                Firma Profili Oluştur
                            </button>
                            <p className="mt-4 text-[13px] text-center text-gray-500">
                                Zaten üye misin? <button onClick={() => { setActiveTab(null); onOpenAuth('signin'); }} className="font-bold text-gray-900 dark:text-white hover:underline underline-offset-2 transition-colors">Giriş Yap</button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Sheet - Full Screen (Unauthenticated) */}
            {activeTab === 'profile' && !user && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 animate-in slide-in-from-bottom duration-300 flex flex-col sm:hidden pb-[84px]">
                    {/* Close Button Only (No Header Text) */}
                    <div className="absolute top-4 right-4 z-10">
                        <button onClick={() => setActiveTab(null)} className="p-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 backdrop-blur-sm transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Marketing Content */}
                    <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col justify-center">
                        <h3 className="text-2xl sm:text-3xl leading-tight font-black text-gray-900 dark:text-white mb-6 rounded-font tracking-tight text-center mt-6">
                            Kartvizid.com'a Katıl
                        </h3>

                        <div className="space-y-3 mb-6">
                            <div className="px-2 py-2 rounded-2xl border border-transparent">
                                <h4 className="font-bold text-[#1f6d78] dark:text-[#2dd4bf] mb-1 text-base sm:text-lg">
                                    İş Arayanlar İçin
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    Ücretsiz CV'nizi oluşturun ve Kartvizid sizin yerinize çalışsın. Siz tatildeyken, uyurken veya başka işlerle ilgilenirken bile CV'niz iş verenler tarafından görüntülenebilir ve <strong>sürpriz iş teklifleri</strong> alabilirsiniz. CV'nizi PDF olarak indirin, QR kod ile her yerde paylaşın!
                                </p>
                            </div>

                            <div className="px-2 py-2 rounded-2xl border border-transparent">
                                <h4 className="font-bold text-[#1f6d78] dark:text-[#2dd4bf] mb-1 text-base sm:text-lg">
                                    İş Verenler İçin
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                                    Aradığınız o "kusursuz" yeteneği on binlerce CV arasından saniyeler içinde filtreleyin. <strong>Gelecekteki çalışanlarınızı kaydedin</strong>, CV'lerini tek tıkla cihazınıza indirin ve anında iletişime geçin. Doğru yeteneği bulmak hiç bu kadar kolay olmamıştı!
                                </p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-2.5">
                            <button
                                onClick={() => {
                                    setActiveTab(null);
                                    onOpenAuth('signup', 'job_seeker');
                                }}
                                className="w-full bg-[#1f6d78] text-white font-bold py-3 sm:py-3.5 rounded-xl hover:bg-[#155e68] active:scale-[0.98] transition-all shadow-lg shadow-[#1f6d78]/20 text-sm sm:text-base"
                            >
                                Ücretsiz CV Oluştur, Keşfedil
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab(null);
                                    onOpenAuth('signup', 'employer');
                                }}
                                className="w-full bg-white dark:bg-gray-800 text-[#1f6d78] dark:text-[#2dd4bf] border border-[#1f6d78] dark:border-[#2dd4bf] font-bold py-3 sm:py-3.5 rounded-xl active:scale-[0.98] transition-all text-sm sm:text-base"
                            >
                                İş Veren Profilini Aç
                            </button>
                            <p className="mt-4 text-[13px] text-center text-gray-500">
                                Zaten üye misin? <button onClick={() => { setActiveTab(null); onOpenAuth('signin'); }} className="font-bold text-gray-900 dark:text-white hover:underline underline-offset-2 transition-colors">Giriş Yap</button>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileBottomNav;
