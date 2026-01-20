
import React, { useState, useRef, useEffect } from 'react';
import { EXPERIENCE_LEVELS } from '../constants';
import SelectionModal from './SelectionModal';
import AdvancedFilterModal from './AdvancedFilterModal';
import { FilterState } from '../types';

interface FiltersProps {
  currentFilters: FilterState;
  onChange: (key: string, value: any) => void;
  availableProfessions: any[];
  availableCities: any[];
}

const CustomDropdown: React.FC<{
  label: string;
  value: string;
  items: any[];
  onSelect: (val: string) => void;
  onMore: () => void;
}> = ({ label, value, items, onSelect, onMore }) => {
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
        className={`w-full bg-white border ${isOpen || value ? 'border-black shadow-md' : 'border-gray-100 shadow-sm'} rounded-full px-5 py-2.5 text-xs font-bold text-gray-800 outline-none cursor-pointer hover:border-black transition-all flex items-center justify-between group`}
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[100] animate-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
            {/* Add Reset Option if value is selected */}
            {value && (
              <button
                onClick={() => {
                  onSelect('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-all border-b border-gray-50 mb-1"
              >
                × Sıfırla
              </button>
            )}
            {(items || []).slice(0, 5).map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(item.label);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-all ${value === item.label ? 'text-black bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
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
            className="w-full text-center py-2.5 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest border-t border-gray-50 mt-1 transition-colors"
          >
            Daha Fazla Göster
          </button>
        </div>
      )}
    </div>
  );
};

const Filters: React.FC<FiltersProps> = ({ currentFilters, onChange, availableProfessions, availableCities }) => {
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
    <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm flex flex-wrap gap-3 items-center">
      <CustomDropdown
        label="Tüm Kategoriler"
        value={currentFilters.profession}
        items={availableProfessions}
        onSelect={(val) => handleSelect('profession', val)}
        onMore={() => setActiveModal('professions')}
      />

      <CustomDropdown
        label="Şehir Seçin"
        value={currentFilters.city}
        items={availableCities}
        onSelect={(val) => handleSelect('city', val)}
        onMore={() => setActiveModal('cities')}
      />

      <CustomDropdown
        label="Deneyim Seviyesi"
        value={currentFilters.experience}
        items={EXPERIENCE_LEVELS}
        onSelect={(val) => handleSelect('experience', val)}
        onMore={() => setActiveModal('experience')}
      />

      <button
        onClick={() => setActiveModal('advanced')}
        className={`bg-white border px-5 py-2.5 rounded-full font-bold text-xs transition-all flex items-center gap-2 shadow-sm shrink-0 hover:border-black active:scale-95 ${activeFiltersCount > 0 ? 'border-black bg-gray-50' : 'border-gray-200 text-black'
          }`}
      >
        <span>Gelişmiş Filtreler</span>
        {activeFiltersCount > 0 && (
          <span className="w-4 h-4 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-black">
            {activeFiltersCount}
          </span>
        )}
      </button>

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
