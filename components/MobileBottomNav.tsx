import React, { useState, useEffect } from 'react';
import { ContactRequest, NotificationItem } from '../types';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
    user: any;
    onSearch: (query: string) => void; // Can scroll top
    onCreateCV: () => void;
    onOpenCompanyProfile?: () => void;
    onOpenSettings?: () => void;
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
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    user,
    onSearch,
    onCreateCV,
    onOpenCompanyProfile,
    onOpenSettings,
    hasCV,
    userPhotoUrl,
    notificationCount = 0,
    notifications = [],
    onNotificationAction,
    onMarkNotificationRead,
    onMarkAllRead,
    onOpenProfile,
    onOpenAuth,
    signOut
}) => {
    const [activeTab, setActiveTab] = useState<'home' | 'notifications' | 'profile' | 'search' | null>(null);
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

    const toggleTab = (tab: 'notifications' | 'profile' | 'search') => {
        if (activeTab === tab) {
            setActiveTab(null);
        } else {
            setActiveTab(tab);
        }
    };

    if (!user) return null; // Only show for logged in users? Or maybe show simplified for guests? 
    // Assuming persistent bottom nav is main UI for logged users. 
    // For non-logged in, maybe just standard buttons?
    // Let's stick to logged in focus for now based on context.

    return (
        <>
            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-[100] sm:hidden pb-safe">
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Home Button */}
                    <button
                        onClick={() => {
                            setActiveTab(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${!activeTab ? 'text-[#1f6d78]' : 'text-gray-400'}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={!activeTab ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </button>

                    {/* Notifications Button */}
                    <div className="relative">
                        <button
                            onClick={() => toggleTab('notifications')}
                            className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${activeTab === 'notifications' ? 'text-[#1f6d78]' : 'text-gray-400'}`}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'notifications' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                        </button>
                        {notificationCount > 0 && (
                            <span className="absolute top-3 right-3 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                                {notificationCount}
                            </span>
                        )}
                    </div>

                    {/* Main Action Button (Create/Edit) */}
                    <div className="relative -top-5">
                        <button
                            onClick={isEmployer && onOpenCompanyProfile ? onOpenCompanyProfile : onCreateCV}
                            className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-900 transition-transform active:scale-95 border-4 border-white dark:border-gray-900"
                        >
                            {isEmployer ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            ) : hasCV ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            )}
                        </button>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={() => toggleTab('search')}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${activeTab === 'search' ? 'text-[#1f6d78]' : 'text-gray-400'}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'search' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>


                    {/* Profile Button */}
                    <button
                        onClick={() => toggleTab('profile')}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${activeTab === 'profile' ? 'ring-2 ring-black rounded-full p-1' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                            {userPhotoUrl ? (
                                <img src={userPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Search Overlay - Shows at Top (Covering Header) */}
            {activeTab === 'search' && (
                <div className="fixed top-0 left-0 right-0 p-4 pt-4 sm:pt-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-[110] sm:hidden animate-in slide-in-from-top-2 duration-200 shadow-xl h-20 flex items-center">
                    <div className="relative w-full flex items-center gap-2">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={query}
                                autoFocus
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (onSearch) onSearch(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.currentTarget.blur();
                                        if (onSearch) onSearch(query);
                                    }
                                }}
                                placeholder={t('nav.search_placeholder')}
                                className="w-full bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 border border-transparent focus:border-[#1f6d78] dark:focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#1f6d78] dark:focus:ring-[#2dd4bf] rounded-full pl-10 pr-4 py-3 text-sm font-medium outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setActiveTab(null);
                                setQuery('');
                                onSearch('');
                            }}
                            className="text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white px-2"
                        >
                            {t('mobile.cancel')}
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Sheets Overlay Background*/}
            {(activeTab === 'notifications' || activeTab === 'profile' || activeTab === 'search') && (
                <div
                    className="fixed inset-0 bg-black/20 z-[90] sm:hidden animate-in fade-in duration-200"
                    onClick={() => setActiveTab(null)}
                />
            )}

            {/* Notifications Sheet */}
            {activeTab === 'notifications' && (
                <div className="fixed bottom-20 left-4 right-4 z-[95] sm:hidden animate-in slide-in-from-bottom-4 duration-300">
                    <NotificationDropdown
                        onClose={() => setActiveTab(null)}
                        notifications={notifications}
                        onAction={onNotificationAction || (() => { })}
                        onMarkRead={onMarkNotificationRead}
                        onMarkAllRead={onMarkAllRead}
                        onOpenProfile={onOpenProfile}
                        // We will need to update NotificationDropdown to accept a 'mobile' prop to style it as a sheet/block
                        // For now, let's wrap it in a container that constraints its width/height
                        mobile={true}
                    />
                </div>
            )}

            {/* Profile Sheet */}
            {activeTab === 'profile' && (
                <div className="fixed bottom-20 right-4 z-[95] sm:hidden animate-in slide-in-from-bottom-4 duration-300">
                    <UserMenuDropdown
                        onClose={() => setActiveTab(null)}
                        onLogout={signOut}
                        onOpenSettings={onOpenSettings}
                        mobile={true}
                    />
                </div>
            )}
        </>
    );
};

export default MobileBottomNav;
