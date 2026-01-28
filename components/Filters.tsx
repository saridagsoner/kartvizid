
import React, { useState, useRef, useEffect } from 'react';
import { EXPERIENCE_LEVELS } from '../constants';
import SelectionModal from './SelectionModal';
import AdvancedFilterModal from './AdvancedFilterModal';
import { FilterState } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FiltersProps {
  currentFilters: FilterState;
  onChange: (key: string, value: any) => void;
  availableProfessions: any[];
  availableCities: any[];
  mobileSort?: React.ReactNode;
}

const CustomDropdown: React.FC<{
  label: string;
  value: string;
  items: any[];
  onSelect: (val: string) => void;
  onMore: () => void;
}> = ({ label, value, items, onSelect, onMore }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 min-w-[130px] relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-gray-800 border ${isOpen || value ? 'border-black dark:border-white shadow-md' : 'border-gray-100 dark:border-gray-700 shadow-sm'} rounded-full px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-bold text-gray-800 dark:text-white outline-none cursor-pointer hover:border-black dark:hover:border-white transition-all flex items-center justify-between group`}
      >
        <span className="truncate pr-2">{value || label}</span>
        <svg
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[100] animate-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
            {/* Add Reset Option if value is selected */}
            {value && (
              <button
                onClick={() => {
                  onSelect('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all border-b border-gray-50 dark:border-gray-700 mb-1"
              >
                × {t('filters.reset')}
              </button>
            )}
            {(items || []).slice(0, 5).map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(item.label);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-all ${value === item.label ? 'text-black dark:text-white bg-gray-50 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              onMore();
            }}
            className="w-full text-center py-2.5 text-[10px] font-black text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-widest border-t border-gray-50 dark:border-gray-700 mt-1 transition-colors"
          >
            {t('filters.show_more')}
          </button>
        </div>
      )}
    </div>
  );
};

const Filters: React.FC<FiltersProps> = ({ currentFilters, onChange, availableProfessions, availableCities, mobileSort }) => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<'professions' | 'cities' | 'experience' | 'advanced' | null>(null);

  const handleSelect = (key: string, val: string) => {
    // If val is empty string (reset), just set it. Toggle logic added for clicks on same item if passed
    const newVal = (val === '' || currentFilters[key as keyof FilterState] === val) ? '' : val;
    onChange(key, newVal);
    setActiveModal(null);
  };

  const handleAdvancedApply = (newFilters: FilterState) => {
    Object.entries(newFilters).forEach(([key, val]) => {
      onChange(key, val);
    });
    setActiveModal(null);
  };

  const activeFiltersCount = Object.entries(currentFilters).filter(([k, v]) => {
    if (Array.isArray(v)) return v.length > 0;
    return v !== '';
  }).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm flex flex-wrap gap-3 items-center transition-all duration-300">
      <div className="hidden sm:block flex-1 min-w-[130px]">
        <CustomDropdown
          label={t('filters.categories')}
          value={currentFilters.profession}
          items={availableProfessions}
          onSelect={(val) => handleSelect('profession', val)}
          onMore={() => setActiveModal('professions')}
        />
      </div>

      <div className="hidden sm:block flex-1 min-w-[130px]">
        <CustomDropdown
          label={t('filters.city')}
          value={currentFilters.city}
          items={availableCities}
          onSelect={(val) => handleSelect('city', val)}
          onMore={() => setActiveModal('cities')}
        />
      </div>

      <div className="hidden sm:block flex-1 min-w-[130px]">
        <CustomDropdown
          label={t('filters.experience')}
          value={currentFilters.experience}
          items={EXPERIENCE_LEVELS}
          onSelect={(val) => handleSelect('experience', val)}
          onMore={() => setActiveModal('experience')}
        />
      </div>

      {/* Desktop Advanced Button */}
      <button
        onClick={() => setActiveModal('advanced')}
        className={`hidden sm:flex bg-white dark:bg-gray-800 border px-5 py-2.5 rounded-full font-bold text-xs transition-all items-center gap-2 shadow-sm shrink-0 hover:border-[#1f6d78] active:scale-95 ${activeFiltersCount > 0 ? 'border-[#1f6d78] bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'border-gray-200 dark:border-gray-700 text-black dark:text-white'
          }`}
      >
        <span>{t('filters.advanced')}</span>
        {activeFiltersCount > 0 && (
          <span className="w-4 h-4 bg-[#1f6d78] text-white text-[9px] rounded-full flex items-center justify-center font-black">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Layout: Advanced Button + Sort (Passed from parent) */}
      <div className="sm:hidden flex items-center justify-between w-full">
        <button
          onClick={() => setActiveModal('advanced')}
          className={`flex-1 bg-white dark:bg-gray-800 border px-4 py-2 rounded-full font-bold text-[10px] transition-all flex items-center justify-center gap-2 shadow-sm hover:border-[#1f6d78] active:scale-95 ${activeFiltersCount > 0 ? 'border-[#1f6d78] bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'border-gray-200 dark:border-gray-700 text-black dark:text-white'
            }`}
        >
          <span>{t('filters.advanced')}</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 bg-[#1f6d78] text-white text-[9px] rounded-full flex items-center justify-center font-black">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Spacer or minimal gap */}
        <div className="w-3"></div>

        {/* Mobile Sort Container */}
        {mobileSort}
      </div>

      {/* Full Selection Modals */}
      {activeModal === 'professions' && (
        <SelectionModal
          title="Tüm Meslekler"
          items={availableProfessions}
          onSelect={(val) => handleSelect('profession', val)}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'cities' && (
        <SelectionModal
          title="Tüm Şehirler"
          items={availableCities}
          onSelect={(val) => handleSelect('city', val)}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'experience' && (
        <SelectionModal
          title="Tüm Deneyim Seviyeleri"
          items={EXPERIENCE_LEVELS}
          onSelect={(val) => handleSelect('experience', val)}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'advanced' && (
        <AdvancedFilterModal
          initialFilters={currentFilters}
          onApply={handleAdvancedApply}
          onClose={() => setActiveModal(null)}
          availableProfessions={availableProfessions}
          availableCities={availableCities}
        />
      )}
    </div>
  );
};

export default Filters;
