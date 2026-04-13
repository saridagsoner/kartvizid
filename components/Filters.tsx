
import React, { useState, useRef, useEffect } from 'react';
import { EXPERIENCE_LEVELS } from '../constants';
import SelectionModal from './SelectionModal';
const AdvancedFilterModal = React.lazy(() => import('./AdvancedFilterModal'));
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
  category?: string;
}> = ({ label, value, items, onSelect, onMore, category }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to map values to translated keys (matching AdvancedFilterModal logic)
  const getLocalizedLabel = (cat: string, val: string): string => {
    const maps: Record<string, Record<string, string>> = {
      workType: {
        'Uzaktan': 'work.remote', 'Hibrit': 'work.hybrid', 'İş Yeri': 'work.office',
        'Remote': 'work.remote', 'Hybrid': 'work.hybrid', 'Office': 'work.office'
      },
      experience: {
        'Stajyer / Yeni Mezun': 'exp.intern_new',
        'Junior (1-3 Yıl)': 'exp.junior',
        'Orta Seviye (3-5 Yıl)': 'exp.mid',
        'Kıdemli (5-10 Yıl)': 'exp.senior',
        'Uzman (10+ Yıl)': 'exp.expert',
        'Intern / New Graduate': 'exp.intern_new',
        'Junior (1-3 Years)': 'exp.junior',
        'Mid Level (3-5 Years)': 'exp.mid',
        'Senior (5-10 Years)': 'exp.senior',
        'Expert (10+ Years)': 'exp.expert'
      }
    };

    if (cat && maps[cat] && maps[cat][val]) {
      return t(maps[cat][val]);
    }
    return val;
  };

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-transparent border-none ${isOpen || value ? 'text-[#1f6d78]' : 'text-gray-700 dark:text-gray-300'} rounded-lg px-2 py-2 text-[15px] font-semibold outline-none cursor-pointer hover:text-black dark:hover:text-white transition-all flex items-center justify-start gap-1 group relative`}
      >
        <span className="relative pb-0.5">
          {value ? getLocalizedLabel(category || '', value) : label}
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1f6d78] transition-all duration-300 group-hover:w-full"></span>
        </span>
        <svg
          className={`transition-transform duration-300 opacity-40 ${isOpen ? 'rotate-180' : ''}`}
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-gray-100/50 dark:border-gray-700/50 py-1.5 z-[100] animate-in slide-in-from-top-2 duration-200 overflow-hidden w-[210px]">
          <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
            {value && (
              <button
                onClick={() => {
                  onSelect('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all border-b border-gray-50 dark:border-gray-700 mb-1"
              >
                × {t('filters.reset')}
              </button>
            )}
            {(items || []).slice(0, 10).map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(item.label);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-all ${value === item.label ? 'text-black dark:text-white bg-gray-50 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                  }`}
              >
                {getLocalizedLabel(category || '', item.label)}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              onMore();
            }}
            className="w-full text-center py-3 text-[11px] font-bold text-[#1f6d78] hover:text-black dark:hover:text-white uppercase tracking-wider border-t border-gray-50 dark:border-gray-700/50 mt-1 transition-all bg-gray-50/50 dark:bg-gray-800/50"
          >
            {t('filters.show_more')}...
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
    <div className="flex flex-wrap sm:flex-nowrap justify-start gap-8 items-center transition-all duration-300 py-1 pr-1">
      <div className="hidden sm:block shrink-0">
        <CustomDropdown
          label={t('filters.categories')}
          value={currentFilters.profession}
          items={availableProfessions}
          onSelect={(val) => handleSelect('profession', val)}
          onMore={() => setActiveModal('professions')}
        />
      </div>

      <div className="hidden sm:block shrink-0">
        <CustomDropdown
          label={t('filters.city')}
          value={currentFilters.city}
          items={availableCities}
          onSelect={(val) => handleSelect('city', val)}
          onMore={() => setActiveModal('cities')}
        />
      </div>

      <div className="hidden sm:block shrink-0">
        <CustomDropdown
          label={t('filters.experience')}
          value={currentFilters.experience}
          items={EXPERIENCE_LEVELS}
          onSelect={(val) => handleSelect('experience', val)}
          onMore={() => setActiveModal('experience')}
          category="experience"
        />
      </div>

      {/* Desktop Advanced Button */}
      <button
        onClick={() => setActiveModal('advanced')}
        className={`hidden sm:flex bg-transparent border-none py-2 rounded-lg font-semibold text-[15px] transition-all items-center gap-1.5 shrink-0 hover:text-black dark:hover:text-white active:scale-95 group relative ${activeFiltersCount > 0 ? 'text-[#1f6d78]' : 'text-gray-700 dark:text-gray-300'
          }`}
      >
        <span className="relative pb-0.5">
          {t('filters.advanced')}
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1f6d78] transition-all duration-300 group-hover:w-full"></span>
        </span>
        <i className="fi fi-rr-caret-right text-[10px] opacity-40 mt-0.5"></i>
        {activeFiltersCount > 0 && (
          <span className="w-4 h-4 bg-[#1f6d78] text-white text-[9px] rounded-full flex items-center justify-center font-black ml-1">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Mobile Layout: Advanced Button + Sort (Passed from parent) */}
      <div className="sm:hidden flex items-center justify-between w-full">
        <button
          onClick={() => setActiveModal('advanced')}
          className={`flex-1 bg-white dark:bg-gray-800 border px-4 py-2 rounded-full font-bold text-[10px] transition-all flex items-center justify-center gap-2 shadow-sm hover:border-[#1f6d78] dark:hover:border-[#2dd4bf] active:scale-95 ${activeFiltersCount > 0 ? 'border-[#1f6d78] dark:border-[#2dd4bf] bg-gray-50 dark:bg-gray-800 text-[#1f6d78] dark:text-[#2dd4bf]' : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white'
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
          title={t('filters.all_professions')}
          items={availableProfessions}
          onSelect={(val) => handleSelect('profession', val)}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'cities' && (
        <SelectionModal
          title={t('filters.all_cities')}
          items={availableCities}
          onSelect={(val) => handleSelect('city', val)}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'experience' && (
        <SelectionModal
          title={t('filters.all_experience')}
          items={EXPERIENCE_LEVELS}
          onSelect={(val) => handleSelect('experience', val)}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'advanced' && (
        <React.Suspense fallback={null}>
          <AdvancedFilterModal
            initialFilters={currentFilters}
            onApply={handleAdvancedApply}
            onClose={() => setActiveModal(null)}
            availableProfessions={availableProfessions}
            availableCities={availableCities}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default Filters;
