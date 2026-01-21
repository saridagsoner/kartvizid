
import React, { useState, useRef, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';
import { useAuth } from '../context/AuthContext';
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
}

const Navbar: React.FC<NavbarProps & {
  onOpenAuth: (mode: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => void;
  isAuthModalOpen: boolean;
  onCloseAuth: () => void;
  authMode: 'signin' | 'signup';
  authRole?: 'job_seeker' | 'employer';
}> = ({
  onSearch, onCreateCV, onOpenCompanyProfile, onOpenSettings, hasCV, userPhotoUrl, notificationCount = 0, notifications = [], onNotificationAction, onMarkNotificationRead,
  onOpenAuth, isAuthModalOpen, onCloseAuth, authMode, authRole
}) => {
    const { user, signOut } = useAuth();
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
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 flex items-center justify-center">
          <div className="max-w-[1440px] w-full px-4 md:px-6 flex items-center h-full">

            {/* Left Section: Logo */}
            <div className="lg:w-[304px] shrink-0 flex items-center">
              <div className="flex flex-col shrink-0 w-fit cursor-pointer hover:opacity-80 transition-opacity group">
                <div className="flex items-center text-[#2b2b2b] text-[32px] font-bold tracking-tight rounded-font leading-none">
                  <span>Kartvizi</span>
                  <span className="inline-block ml-1 transform rotate-[12deg] origin-center translate-y-[-1px] text-[#1f6d78] font-black">d</span>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 tracking-[-0.01em] mt-0.5 leading-none whitespace-nowrap">
                  dijital cv & doğru eşleşme
                </span>
              </div>
            </div>

            {/* Center Section: Search Bar */}
            <div className="flex-1 relative group px-0 lg:px-0">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-100 transition-opacity"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Meslek, isim veya şehir ara..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="w-full bg-[#F0F2F5] hover:bg-[#E8EAED] focus:bg-white focus:ring-1 focus:ring-black transition-all outline-none rounded-full px-12 py-2.5 text-sm text-gray-800 border border-transparent focus:border-black/10 shadow-sm"
              />
            </div>

            {/* Right Section: Actions */}
            <div className="md:w-[304px] shrink-0 flex items-center justify-end gap-2 md:gap-4 ml-0 md:ml-0">
              {user ? (
                <>
                  <button
                    onClick={isEmployer && onOpenCompanyProfile ? onOpenCompanyProfile : onCreateCV}
                    className="hidden sm:block bg-white border border-gray-200 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap shadow-sm"
                  >
                    {isEmployer
                      ? "İş Veren Profili"
                      : (hasCV ? "CV'yi Düzelt" : "CV Oluştur")
                    }
                  </button>

                  <div className="h-6 w-px bg-gray-100 hidden sm:block"></div>

                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsNotifOpen(!isNotifOpen);
                        setIsProfileOpen(false);
                      }}
                      className="w-10 h-10 text-gray-600 rounded-full flex items-center justify-center text-lg hover:bg-gray-100 transition-colors relative group"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
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
                      />
                    )}
                  </div>
                  {/* Profile Dropdown ... */}

                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => {
                        setIsProfileOpen(!isProfileOpen);
                        setIsNotifOpen(false);
                      }}
                      className={`w-9 h-9 rounded-full overflow-hidden border transition-all ${isProfileOpen ? 'ring-2 ring-black border-black' : 'border-gray-200 hover:ring-2 hover:ring-gray-100'}`}
                    >

                      {userPhotoUrl ? (
                        <img src={userPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                      )}
                    </button>
                    {isProfileOpen && <UserMenuDropdown onClose={() => setIsProfileOpen(false)} onLogout={signOut} onOpenSettings={onOpenSettings} />}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenAuth('signup', 'employer')}
                    className="text-gray-600 font-bold text-sm px-4 py-2 hover:bg-gray-100 rounded-full transition-colors whitespace-nowrap"
                  >
                    İş Veren
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup', 'job_seeker')}
                    className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                  >
                    İş Arayan
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
