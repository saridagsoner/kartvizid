
import React from 'react';

import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface UserMenuDropdownProps {
  onClose: () => void;
  onLogout: () => void;
  onOpenSettings?: () => void;
  onOpenSavedCVs?: () => void;
  onOpenProfile?: (userId: string) => void;
  mobile?: boolean;
}

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ onClose, onLogout, onOpenSettings, onOpenSavedCVs, onOpenProfile, mobile }) => {

  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className={`${mobile ? 'w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden' : 'absolute right-0 top-12 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[60] py-4 animate-in slide-in-from-top-4 duration-300'}`}>
      <div className="px-6 py-2 mb-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">{t('account.title')}</h3>
      </div>

      <div className="flex flex-col">
        <button
          onClick={() => {
            onClose();
            if (user) onOpenProfile?.(user.id);
          }}
          className="w-full text-left px-6 py-4 text-sm font-black text-black hover:bg-gray-50 flex items-center gap-4 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 text-black flex items-center justify-center text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          Kartvizidim
        </button>

        {user?.user_metadata?.role === 'employer' && (
          <button
            onClick={() => {
              onClose();
              onOpenSavedCVs?.();
            }}
            className="w-full text-left px-6 py-4 text-sm font-black text-black hover:bg-gray-50 flex items-center gap-4 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 text-black flex items-center justify-center text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            Kaydettiklerim
          </button>
        )}

        <button
          onClick={() => {
            onClose();
            onOpenSettings?.();
          }}
          className="w-full text-left px-6 py-4 text-sm font-black text-black hover:bg-gray-50 flex items-center gap-4 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 text-black flex items-center justify-center text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          {t('account.settings')}
        </button>



        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full text-left px-6 py-4 text-sm font-black text-red-500 hover:bg-red-50 flex items-center gap-4 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          {t('account.sign_out')}
        </button>
      </div>

      <div className="mt-4 px-6 pt-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
          {t('account.promo_text')}
        </p>
      </div>
    </div>
  );
};

export default UserMenuDropdown;
