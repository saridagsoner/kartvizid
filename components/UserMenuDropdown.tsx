
import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface UserMenuDropdownProps {
  onClose: () => void;
  onLogout: () => void;
  onOpenSettings?: () => void;
  mobile?: boolean;
}

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ onClose, onLogout, onOpenSettings, mobile }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`${mobile ? 'w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden' : 'absolute right-0 top-12 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[60] py-4 animate-in slide-in-from-top-4 duration-300'}`}>
      <div className="px-6 py-2 mb-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Hesabım</h3>
      </div>

      <div className="flex flex-col">
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
          Ayarlar
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
          }}
          className="w-full text-left px-6 py-4 text-sm font-black text-black dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between transition-colors bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex items-center justify-center text-xs">
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              )}
            </div>
            Görünüm: {theme === 'dark' ? 'Koyu' : 'Aydınlık'}
          </div>

          <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-[#1f6d78]' : 'bg-gray-300'}`}>
            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
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
          Çıkış Yap
        </button>
      </div>

      <div className="mt-4 px-6 pt-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
          Dijital kartvizid'ini oluşturup işverenler tarafından keşfedilmeye hemen başla!
        </p>
      </div>
    </div>
  );
};

export default UserMenuDropdown;
