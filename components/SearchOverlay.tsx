import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CV } from '../types';
import BusinessCard from './BusinessCard';

interface SearchOverlayProps {
  onClose: () => void;
  cvList: CV[];
  onOpenProfile: (userId: string, role?: string) => void;
  onOpenFilter?: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, cvList, onOpenProfile, onOpenFilter }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowQuery = query.toLowerCase();
    return cvList.filter(cv => 
      cv.name?.toLowerCase().includes(lowQuery) ||
      cv.profession?.toLowerCase().includes(lowQuery) ||
      cv.city?.toLowerCase().includes(lowQuery) ||
      cv.skills?.some(s => s.toLowerCase().includes(lowQuery))
    ).slice(0, 20); // Limit results for performance
  }, [query, cvList]);

  const handleResultClick = (cv: CV) => {
    onOpenProfile(cv.userId, 'job_seeker');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-16 z-[200] bg-white dark:bg-gray-900 flex flex-col sm:hidden">
      {/* Search Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:opacity-70 transition-colors -ml-1.5 translate-y-[4px]"
        >
          <i className="fi fi-br-angle-left text-[21px]"></i>
        </button>
        
        <div className="relative flex-1">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-[#1f6d78] dark:text-[#2dd4bf]' : 'text-gray-500'} pointer-events-none`}>
            <i className="fi fi-br-search text-sm"></i>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Meslek, Şehir, İsim Ara"
            className="w-full bg-white dark:bg-gray-800 border-[1px] border-black dark:border-white rounded-2xl pl-11 pr-10 h-[46px] font-semibold tracking-tight outline-none appearance-none focus:border-black dark:focus:border-white transition-all placeholder:text-gray-400 text-[14px] text-gray-900 dark:text-white"
          />
          {query ? (
             <button 
             onClick={() => setQuery('')}
             className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-500 text-[8px] active:scale-90 transition-transform"
           >
             <i className="fi fi-br-cross"></i>
           </button>
          ) : null}
        </div>

        <button
          onClick={() => onOpenFilter?.()}
          className="w-11 h-11 rounded-full border border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-90 shrink-0 shadow-sm"
        >
          <i className="fi fi-rr-settings-sliders text-[15px]"></i>
        </button>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 px-4 py-4">
        {!query.trim() ? (
          <div className="flex flex-col items-center pt-[20vh] pb-12 px-8 text-center animate-in fade-in duration-700">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Yetenek veya Hizmet Keşfet</h3>
            <p className="text-[16px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-[320px]">
              Kriterlerinize en uygun adaylara anında ulaşın ya da aradığınız profesyonel hizmeti hemen bulmaya başlayın.
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sonuçlar ({results.length})</h3>
            </div>
            {results.map((cv) => (
              <BusinessCard 
                key={cv.id} 
                cv={cv} 
                onClick={() => handleResultClick(cv)} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
             <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <i className="fi fi-rr-search-help text-2xl text-red-400"></i>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-bold mb-1">Eşleşme Bulunamadı</p>
            <p className="text-gray-500 text-sm">Farklı bir anahtar kelime veya<br/>şehir denemeyi unutma.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
