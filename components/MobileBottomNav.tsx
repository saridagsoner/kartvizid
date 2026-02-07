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
    onOpenMenu?: () => void;
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
    signOut,
    onOpenMenu
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
        if (tab === 'notifications' && !user) {
            return;
        }
        if (activeTab === tab) {
            setActiveTab(null);
        } else {
            setActiveTab(tab);
        }
    };



    return (
        <>
            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-[100] sm:hidden pb-safe">
                <div className="flex items-center justify-around h-16 px-2 pt-1">
                    {/* Menu Button (Replaces Home) */}
                    <button
                        onClick={() => {
                            if (onOpenMenu) onOpenMenu();
                        }}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-0.5 group`}
                    >
                        <div className="h-8 group-active:scale-95 transition-transform flex items-center justify-center">
                            <span className="inline-block transform rotate-[12deg] origin-center text-[#1f6d78] font-black text-2xl leading-none rounded-font tracking-tight">d</span>
                        </div>
                        <span className="text-[10px] font-medium text-[#1f6d78] leading-none">
                            {activeTab === null ? 'Kartvizid v2.1' : 'Anasayfa'}
                        </span>
                    </button>

                    {/* Notifications Button */}
                    <button
                        onClick={() => toggleTab('notifications')}
                        className={`relative flex flex-col items-center justify-center w-16 h-full space-y-0.5 ${activeTab === 'notifications' ? 'text-[#1f6d78]' : 'text-gray-400'}`}
                    >
                        <div className="h-8 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'notifications' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" />
                                <path d="M19 16.5C19 14 17 12 17 8a5 5 0 0 0-10 0c0 4-2 6-2 8.5C5 18 6 19 12 19s7-1 7-2.5z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium leading-none">Bildirim</span>
                        {notificationCount > 0 && (
                            <span className="absolute top-2 right-4 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Main Action Button (Create/Edit) - Simplified & Inline */}
                    <button
                        onClick={isEmployer && onOpenCompanyProfile ? onOpenCompanyProfile : onCreateCV}
                        className="flex flex-col items-center justify-center w-16 h-full space-y-0.5 text-gray-400 hover:text-[#1f6d78] transition-colors active:scale-95 active:text-[#1f6d78]"
                    >
                        <div className="h-8 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                                onOpenAuth('signin');
                            } else {
                                toggleTab('profile');
                            }
                        }}
                        className={`flex flex-col items-center justify-center w-16 h-full space-y-0.5 ${activeTab === 'profile' ? 'text-[#1f6d78]' : 'text-gray-400'}`}
                    >
                        <div className="h-8 flex flex-col items-center justify-center">
                            {userPhotoUrl ? (
                                <div className={`w-6 h-6 rounded-full overflow-hidden border ${activeTab === 'profile' ? 'border-[#1f6d78]' : 'border-gray-200'}`}>
                                    <img src={userPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className={`${activeTab === 'profile' ? 'text-[#1f6d78]' : 'text-gray-400'}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'profile' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="15" width="14" height="6" rx="3" ry="3"></rect>
                                        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <span className={`text-[10px] font-medium leading-none ${activeTab === 'profile' ? 'text-[#1f6d78]' : 'text-gray-400'}`}>Profil</span>
                    </button>
                </div>
            </div>

            {/* Search Overlay - Shows at Top (Covering Header) */}


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
