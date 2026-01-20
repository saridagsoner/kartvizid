
import React, { useState, useRef, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  onSearch: (query: string) => void;
  onCreateCV: () => void;
  onOpenSettings?: () => void;
  hasCV?: boolean;
  userPhotoUrl?: string;
  notificationCount?: number;
  notifications?: any[]; // Using any to avoid complex type import issues in immediate fixes, though ContactRequest[] is better
  onNotificationAction?: (requestId: string, action: 'approved' | 'rejected') => void;
}

const Navbar: React.FC<NavbarProps & {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  isAuthModalOpen: boolean;
  onCloseAuth: () => void;
  authMode: 'signin' | 'signup';
}> = ({
  onSearch, onCreateCV, onOpenSettings, hasCV, userPhotoUrl, notificationCount = 0, notifications = [], onNotificationAction,
  onOpenAuth, isAuthModalOpen, onCloseAuth, authMode
}) => {
    const { user, signOut } = useAuth();
    const [query, setQuery] = useState('');
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    // ... existing useState ...

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
                  Dijital Cv & Doğru Eşleşme
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
                    onClick={onCreateCV}
                    className="hidden sm:block bg-white border border-gray-200 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap shadow-sm"
                  >
                    {hasCV ? "CV'yi Düzelt" : "CV Oluştur"}
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
                      <img src={userPhotoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt="Profile" className="w-full h-full object-cover" />
                    </button>
                    {isProfileOpen && <UserMenuDropdown onClose={() => setIsProfileOpen(false)} onLogout={signOut} onOpenSettings={onOpenSettings} />}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuth('signin')}
                    className="text-gray-600 font-bold text-sm px-4 py-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
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
        />
      </>
    );
  };

export default Navbar;
