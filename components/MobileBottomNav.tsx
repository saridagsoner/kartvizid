import React, { useState, useEffect } from 'react';
import { ContactRequest, NotificationItem } from '../types';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from './ImageWithFallback';
import SearchOverlay from './SearchOverlay';
import { CV } from '../types';

interface MobileBottomNavProps {
    user?: any; // To match App.tsx usage
    onSearch: (query: string) => void;
    onCreateCV: () => void;
    onOpenCompanyProfile?: () => void;
    userPhotoUrl?: string;
    notificationCount?: number;
    notifications?: (ContactRequest | NotificationItem)[];
    onNotificationAction?: (requestId: string, action: 'approved' | 'rejected') => void;
    onMarkNotificationRead?: (id: string) => void;
    onMarkAllRead?: () => void;
    onOpenProfile?: (userId: string, role?: string) => void;
    onOpenAuth: (mode: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => void;
    signOut: () => void;
    isHomeView?: boolean;
    onGoHome?: () => void;
    isCreateOpen?: boolean;
    isProfileOpen?: boolean;
    cvList?: CV[];
    onOpenFilter?: () => void;
    onOpenMenu?: () => void;
    onOpenNotifications?: () => void;
    onOpenSavedCVs?: () => void;
    hasCV?: boolean;
    onOpenSettings?: () => void;
    currentFilters?: FilterState;
    onFilterApply?: (key: string, value: any) => void;
    availableProfessions?: any[];
    availableCities?: any[];
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    onSearch,
    onCreateCV,
    onOpenCompanyProfile,
    userPhotoUrl,
    notificationCount = 0,
    notifications = [],
    onNotificationAction,
    onMarkNotificationRead,
    onMarkAllRead,
    onOpenProfile,
    onOpenAuth,
    isHomeView = true,
    onGoHome,
    isCreateOpen = false,
    isProfileOpen = false,
    cvList = [],
    availableProfessions = [],
    availableCities = [],
    currentFilters = {
        profession: '',
        city: '',
        experience: '',
        workType: '',
        employmentType: '',
        education: '',
        skills: []
    },
    onOpenSettings,
    onOpenFilter,
    onOpenNotifications,
    onOpenSavedCVs,
    signOut,
    onFilterApply
}) => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'search' | 'create' | null>(null);
    const isEmployer = user?.user_metadata?.role === 'employer';
    const isShop = user?.user_metadata?.role === 'shop';

    // Close sheets when navigating away from home
    useEffect(() => {
        if (!isHomeView && activeTab !== null) {
            setActiveTab(null);
        }
    }, [isHomeView, activeTab]);

    const toggleTab = (tab: 'profile' | 'search' | 'create') => {
        if (activeTab === tab) {
            setActiveTab(null);
        } else {
            setActiveTab(tab);
        }
    };

    const isSearchActive = activeTab === 'search';
    const isCreateActiveTab = isCreateOpen || activeTab === 'create';
    const isProfileActiveTab = isProfileOpen || activeTab === 'profile';
    const hasActiveBottomTab = isSearchActive || isCreateActiveTab || isProfileActiveTab;

    return (
        <>
            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-[250] sm:hidden">
                <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex justify-between px-2 pb-safe h-[60px]">
                    {/* Home Button */}
                    <button
                        onClick={() => {
                            setActiveTab(null);
                            if (onGoHome) onGoHome();
                        }}
                        className={`flex flex-col items-center justify-center relative flex-1 transition-transform duration-200 active:scale-90`}
                    >
                        <div className="flex items-center justify-center text-black dark:text-white translate-y-[2px]">
                            <i className={`fi ${isHomeView && !hasActiveBottomTab ? 'fi-sr-home' : 'fi-rr-home'} text-[22px]`}></i>
                        </div>
                    </button>
                    
                    {/* Search Button */}
                    <button
                        onClick={() => toggleTab('search')}
                        className={`flex flex-col items-center justify-center relative flex-1 transition-transform duration-200 active:scale-90`}
                    >
                        <div className="flex items-center justify-center text-black dark:text-white translate-y-[2px]">
                            <i className={`fi ${isSearchActive ? 'fi-sr-search' : 'fi-rr-search'} text-[22px]`}></i>
                        </div>
                    </button>

                    {/* Main Action Button (Create/Edit) */}
                    <button
                        onClick={() => {
                            setActiveTab(null);
                            if (!user) {
                                onOpenAuth('signup');
                            } else {
                                if (isEmployer && onOpenCompanyProfile) {
                                    onOpenCompanyProfile();
                                } else {
                                    onCreateCV();
                                }
                            }
                        }}
                        className={`flex flex-col items-center justify-center relative flex-1 transition-transform duration-200 active:scale-90`}
                    >
                        <div className={`flex items-center justify-center text-black dark:text-white transition-all ${isCreateActiveTab ? 'scale-110' : ''} translate-y-[2px]`}>
                            <i className={`fi ${isCreateActiveTab ? 'fi-sr-add' : 'fi-rr-add'} text-[22px]`}></i>
                        </div>
                    </button>

                    {/* Profile Button */}
                    <button
                        onClick={() => {
                            setActiveTab(null);
                            if (!user) {
                                onOpenAuth('signup');
                            } else {
                                if (onOpenProfile) onOpenProfile(user.id, user.user_metadata?.role);
                            }
                        }}
                        className={`flex flex-col items-center justify-center relative flex-1 transition-transform duration-200 active:scale-90`}
                    >
                        <div className="flex items-center justify-center text-black dark:text-white translate-y-[2px]">
                            {userPhotoUrl ? (
                                <div className={`w-7 h-7 rounded-full overflow-hidden border-2 flex items-center justify-center ${isProfileActiveTab ? 'border-black dark:border-white' : 'border-transparent'}`}>
                                    <ImageWithFallback 
                                        src={userPhotoUrl} 
                                        alt={user?.user_metadata?.full_name || user?.email || 'User'} 
                                        className="w-full h-full object-cover"
                                        initialsClassName="text-xs font-black"
                                    />
                                </div>
                            ) : (
                                <i className={`fi ${
                                    isEmployer ? (isProfileActiveTab ? 'fi-sr-building' : 'fi-rr-building') :
                                    isShop ? (isProfileActiveTab ? 'fi-sr-shop' : 'fi-rr-shop') :
                                    (isProfileActiveTab ? 'fi-sr-circle-user' : 'fi-rr-circle-user')
                                } text-[22px]`}></i>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Overlays */}
            {activeTab === 'search' && (
                <SearchOverlay 
                    onClose={() => setActiveTab(null)}
                    cvList={cvList || []}
                    onOpenProfile={onOpenProfile || (() => {})}
                    onOpenFilter={onOpenFilter}
                    availableProfessions={availableProfessions}
                    availableCities={availableCities}
                    currentFilters={currentFilters}
                    onFilterChange={onFilterApply}
                />
            )}
        </>
    );
};

export default MobileBottomNav;

