
import React, { useState, useRef, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';



import { ContactRequest, NotificationItem } from '../types';

interface NavbarProps {
  onSearch: (query: string) => void;
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
  onOpenMenu?: () => void;
  unreadMessageCount?: number;
  onOpenMessages?: () => void;
}

const Navbar: React.FC<NavbarProps & {
  onOpenAuth: (mode: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => void;
  isAuthModalOpen: boolean;
  onCloseAuth: () => void;
  authMode: 'signin' | 'signup';
  authRole?: 'job_seeker' | 'employer';
  onOpenSavedCVs?: () => void;
}> = ({
  onSearch, onCreateCV, onOpenCompanyProfile, onOpenSettings, hasCV, userPhotoUrl, notificationCount = 0, notifications = [], onNotificationAction, onMarkNotificationRead,
  onOpenAuth, isAuthModalOpen, onCloseAuth, authMode, authRole, onMarkAllRead, onOpenProfile, onOpenSavedCVs, onOpenMenu, unreadMessageCount = 0, onOpenMessages
}) => {
    const { user, loading, signOut } = useAuth();
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    // ... existing useState ...
    const isEmployer = user?.user_metadata?.role === 'employer';

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      onSearch(val);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
          setIsProfileOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <>
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-black border-b border-gray-100 dark:border-white/5 z-50 flex items-center justify-center transition-colors duration-300">
          <div className="max-w-[1440px] w-full px-4 md:px-6 flex items-center justify-between h-full gap-2 md:gap-0">

            {/* Left Section: Logo & Mobile Menu */}
            <div className="lg:w-[290px] shrink-0 flex items-center gap-1">
              {/* Mobile Menu Button */}
              <button
                onClick={onOpenMenu}
                className="sm:hidden p-2 -ml-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95 flex items-center justify-center translate-y-[2px]"
                title="Menü"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <Link to="/" onClick={() => {
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }} className="flex flex-col shrink-0 w-fit cursor-pointer hover:opacity-80 transition-opacity group">
                <div className="flex items-center text-[#2b2b2b] dark:text-white text-[27px] md:text-[36px] font-bold tracking-tight rounded-font leading-none">
                  <span>Kartvizi</span>
                  <span className="inline-block ml-1 transform rotate-[12deg] origin-center translate-y-[-1px] text-[#1f6d78] font-black">d</span>
                </div>
                <span className="hidden sm:block text-[12px] font-medium text-gray-400 tracking-[-0.01em] mt-0.5 leading-none whitespace-nowrap">
                  dijital cv & doğru eşleşme
                </span>
              </Link>
            </div>

            {/* Center Section: Search Bar */}
            <div className="flex-1 relative group px-2 lg:px-0 hidden md:block">
              <div className="absolute left-6 lg:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <i className="fi fi-br-search text-gray-500 dark:text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder={t('nav.search_placeholder')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="w-full bg-[#F0F2F5] dark:bg-gray-700 hover:bg-[#E8EAED] dark:hover:bg-gray-600 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-[#1f6d78] dark:focus:ring-[#2dd4bf] transition-all outline-none rounded-lg px-12 py-2.5 text-[16px] lg:text-sm font-light text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:border-[#1f6d78]/20 shadow-sm placeholder-gray-500 dark:placeholder-gray-400 placeholder:font-light"
              />
            </div>

            {/* Right Section: Actions */}
            <div className={`${loading ? 'flex' : 'flex'} md:w-[330px] shrink-0 items-center justify-end gap-2 md:gap-4 ml-auto lg:ml-0`}>
              {loading ? (
                <div className="flex items-center gap-6 opacity-50 pr-4">
                  <div className="w-16 md:w-20 h-5 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-full"></div>
                  <div className="w-16 md:w-20 h-5 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-full"></div>
                </div>
              ) : user ? (
                <>


                  {/* Desktop Button */}
                  <button
                    onClick={isEmployer && onOpenCompanyProfile ? onOpenCompanyProfile : onCreateCV}
                    className="hidden sm:block bg-white dark:bg-gray-800 border border-[#1f6d78] dark:border-gray-600 text-black dark:text-white px-3 md:px-6 py-2 rounded-xl font-bold text-xs md:text-sm hover:bg-[#1f6d78] hover:text-white hover:border-[#1f6d78] dark:hover:bg-[#1f6d78] dark:hover:text-white transition-all active:scale-95 whitespace-nowrap shadow-sm"
                  >
                    {isEmployer
                      ? t('nav.employer_profile')
                      : (hasCV ? t('nav.fix_cv') : t('nav.create_cv'))
                    }
                  </button>

                  {/* Mobile Icon Button - Hidden entirely as per "only messages" request */}
                  <button
                    onClick={isEmployer && onOpenCompanyProfile ? onOpenCompanyProfile : onCreateCV}
                    className="hidden w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 shadow-sm"
                    title={isEmployer ? t('nav.employer_profile') : (hasCV ? t('nav.fix_cv') : t('nav.create_cv'))}
                  >
                    {isEmployer ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    ) : hasCV ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    )}
                  </button>

                  <div className="h-6 w-px bg-gray-100 dark:bg-gray-700 hidden sm:block"></div>

                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => {
                        setIsNotifOpen(!isNotifOpen);
                        setIsProfileOpen(false);
                      }}
                      className="w-10 h-10 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                    >
                      <i className="fi fi-rr-bell text-xl translate-y-[1px]"></i>
                      {notificationCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-sm">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                    {isNotifOpen && (
                      <NotificationDropdown
                        onClose={() => setIsNotifOpen(false)}
                        notifications={notifications}
                        onAction={onNotificationAction || (() => { })}
                        onMarkRead={onMarkNotificationRead}
                        onMarkAllRead={onMarkAllRead}
                        onOpenProfile={onOpenProfile}
                      />
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={onOpenMessages}
                      className="w-10 h-10 text-black dark:text-white rounded-full flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-95 text-[#3a4d59]">
                        <path d="M12 3C7 3 3 7 3 12s4 9 9 9h9V12c0-5-4-9-9-9z"></path>
                        <line x1="8" y1="10" x2="13" y2="10"></line>
                        <line x1="8" y1="14.5" x2="16" y2="14.5"></line>
                      </svg>
                      {unreadMessageCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-sm">
                          {unreadMessageCount}
                        </span>
                      )}
                    </button>
                  </div>
                  {/* Profile Dropdown ... */}

                  <div className="relative hidden sm:block" ref={profileRef}>
                    <button
                      onClick={() => {
                        setIsProfileOpen(!isProfileOpen);
                        setIsNotifOpen(false);
                      }}
                      className={`w-9 h-9 rounded-full overflow-hidden border transition-all ${isProfileOpen ? 'ring-2 ring-[#1f6d78] border-[#1f6d78]' : 'border-gray-200 hover:ring-2 hover:ring-gray-100'}`}
                    >

                      {userPhotoUrl ? (
                        <img src={userPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                      )}
                    </button>
                    {isProfileOpen && <UserMenuDropdown onClose={() => setIsProfileOpen(false)} onLogout={signOut} onOpenSettings={onOpenSettings} onOpenSavedCVs={onOpenSavedCVs} onOpenProfile={onOpenProfile} />}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 md:gap-4 mr-2 md:mr-4">
                  <button
                    onClick={() => onOpenAuth('signin')}
                    className="px-4 md:px-6 py-1.5 md:py-2 text-[#1f6d78] dark:text-[#2dd4bf] border border-[#1f6d78] dark:border-[#2dd4bf]/40 rounded-full font-bold text-[13px] md:text-[15px] transition-all hover:bg-[#1f6d78]/5 dark:hover:bg-[#2dd4bf]/5 active:scale-95 whitespace-nowrap"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-4 md:px-6 py-1.5 md:py-2 text-[#1f6d78] dark:text-[#2dd4bf] border border-[#1f6d78] dark:border-[#2dd4bf]/40 rounded-full font-bold text-[13px] md:text-[15px] transition-all hover:bg-[#1f6d78]/5 dark:hover:bg-[#2dd4bf]/5 active:scale-95 whitespace-nowrap"
                  >
                    Kayıt Ol
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={onCloseAuth}
          initialMode={authMode}
          initialRole={authRole}
        />
      </>
    );
  };

export default Navbar;
