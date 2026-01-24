
import React, { useState, useRef, useEffect } from 'react';
import { FilterState } from '../types';
import {
  EXPERIENCE_LEVELS,
  LANGUAGES,
  LANGUAGE_LEVELS,
  ALL_SKILLS,
  WORK_TYPES,
  EMPLOYMENT_TYPES,
  EDUCATION_LEVELS,
  GRADUATION_STATUSES,
  MILITARY_STATUSES,
  MARITAL_STATUSES,
  DISABILITY_STATUSES,
  NOTICE_PERIODS,
  DRIVER_LICENSES,
  TRAVEL_STATUSES
} from '../constants';

interface AdvancedFilterModalProps {
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
  availableProfessions: { label: string }[];
  availableCities: { label: string }[];
}

// Searchable Dropdown for Modal
const ModalDropdown: React.FC<{
  label: string;
  value: string;
  placeholder: string;
  items: { label: string }[];
  onSelect: (val: string) => void;
}> = ({ label, value, placeholder, items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm(''); // Reset search on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter(item =>
    item.label.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
  );

  return (
    <div className="space-y-4 flex-1 relative" ref={containerRef}>
      <label className="block text-[13px] font-bold text-black dark:text-gray-300 uppercase tracking-tight ml-1">{label}</label>

      <div className="relative group">
        <input
          type="text"
          value={isOpen ? searchTerm : (value || '')}
          placeholder={isOpen ? "Aramaya başlayın..." : placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full px-6 py-3 sm:px-8 sm:py-5 outline-none font-bold text-xs sm:text-sm transition-all border border-gray-200 dark:border-gray-700 focus:border-[#1f6d78] focus:ring-4 focus:ring-[#1f6d78]/5 placeholder:text-gray-400 ${value && !isOpen ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#1f6d78] transition-colors">
          <svg
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 py-3 z-[170] animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
            {!searchTerm && (
              <button
                onClick={() => { onSelect(''); setIsOpen(false); setSearchTerm(''); }}
                className="w-full text-left px-8 py-4 text-sm font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#1f6d78] transition-all"
              >
                Tümü (Sıfırla)
              </button>
            )}

            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(item.label);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-8 py-4 text-sm font-bold transition-all ${value === item.label ? 'bg-[#1f6d78] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#1f6d78] dark:hover:text-[#2dd4bf]'
                    }`}
                >
                  {item.label}
                </button>
              ))
            ) : (
              <div className="px-8 py-4 text-xs font-bold text-gray-400 italic text-center">
                Sonuç bulunamadı...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({ initialFilters, onApply, onClose, availableProfessions, availableCities }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleLicense = (license: string) => {
    setFilters(prev => ({
      ...prev,
      driverLicenses: prev.driverLicenses.includes(license)
        ? prev.driverLicenses.filter(l => l !== license)
        : [...prev.driverLicenses, license]
    }));
  };

  const clearFilters = () => {
    setFilters({
      profession: '',
      city: '',
      experience: '',
      language: '',
      languageLevel: '',
      salaryMin: '',
      salaryMax: '',
      skills: [],
      workType: '',
      employmentType: '',
      educationLevel: '',
      graduationStatus: '',
      militaryStatus: '',
      maritalStatus: '',
      disabilityStatus: '',
      noticePeriod: '',
      travelStatus: '',
      driverLicenses: []
    });
  };

  const handleSalaryChange = (key: 'salaryMin' | 'salaryMax', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFilters(prev => ({
      ...prev,
      [key]: numericValue === '' ? '' : Number(numericValue)
    }));
  };

  const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
      <label className="block text-[11px] sm:text-[13px] font-bold text-black dark:text-gray-300 uppercase tracking-tight ml-1 mb-2 sm:mb-4">{title}</label>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">{children}</div>
    </div>
  );

  const SelectionPill: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-bold border transition-all duration-300 ${active
        ? 'bg-[#1f6d78] border-[#1f6d78] text-white shadow-lg scale-105'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#1f6d78] dark:hover:border-[#1f6d78] hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-[900px] max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-black dark:text-white tracking-tight">Gelişmiş Filtreler</h2>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5 sm:mt-1">Nokta atışı adayları keşfedin ve ekibinize katın</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl sm:text-2xl text-black dark:text-white hover:bg-[#1f6d78] hover:text-white transition-all shadow-sm active:scale-90"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-8 sm:space-y-12 custom-scrollbar bg-white dark:bg-gray-900">

          {/* Section: Main Info with Searchable Dropdowns */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <ModalDropdown
              label="POZİSYON / MESLEK"
              value={filters.profession}
              placeholder="Pozisyon Ara (Örn: Yazılım, Garson...)"
              items={availableProfessions}
              onSelect={(val) => setFilters({ ...filters, profession: val })}
            />
            <ModalDropdown
              label="LOKASYON / ŞEHİR"
              value={filters.city}
              placeholder="Şehir Ara (Örn: İstanbul, Antalya...)"
              items={availableCities}
              onSelect={(val) => setFilters({ ...filters, city: val })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FilterSection title="Çalışma Modeli">
              {WORK_TYPES.map(t => <SelectionPill key={t} label={t} active={filters.workType === t} onClick={() => setFilters({ ...filters, workType: filters.workType === t ? '' : t })} />)}
            </FilterSection>
            <FilterSection title="Çalışma Şekli">
              {EMPLOYMENT_TYPES.map(t => <SelectionPill key={t} label={t} active={filters.employmentType === t} onClick={() => setFilters({ ...filters, employmentType: filters.employmentType === t ? '' : t })} />)}
            </FilterSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FilterSection title="Eğitim Seviyesi">
              {EDUCATION_LEVELS.map(l => <SelectionPill key={l} label={l} active={filters.educationLevel === l} onClick={() => setFilters({ ...filters, educationLevel: filters.educationLevel === l ? '' : l })} />)}
            </FilterSection>
            <FilterSection title="Mezuniyet Durumu">
              {GRADUATION_STATUSES.map(s => <SelectionPill key={s} label={s} active={filters.graduationStatus === s} onClick={() => setFilters({ ...filters, graduationStatus: filters.graduationStatus === s ? '' : s })} />)}
            </FilterSection>
          </div>

          <FilterSection title="Deneyim Seviyesi">
            {EXPERIENCE_LEVELS.map(lvl => (
              <SelectionPill key={lvl.label} label={lvl.label} active={filters.experience === lvl.label} onClick={() => setFilters({ ...filters, experience: filters.experience === lvl.label ? '' : lvl.label })} />
            ))}
          </FilterSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FilterSection title="Yabancı Dil">
              {LANGUAGES.map(l => <SelectionPill key={l} label={l} active={filters.language === l} onClick={() => setFilters({ ...filters, language: filters.language === l ? '' : l })} />)}
            </FilterSection>
            <FilterSection title="Dil Seviyesi">
              {LANGUAGE_LEVELS.map(lvl => <SelectionPill key={lvl} label={lvl} active={filters.languageLevel === lvl} onClick={() => setFilters({ ...filters, languageLevel: filters.languageLevel === lvl ? '' : lvl })} />)}
            </FilterSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FilterSection title="MAAŞ BEKLENTİSİ (₺)">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="En Az"
                    value={filters.salaryMin}
                    onChange={e => handleSalaryChange('salaryMin', e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full px-6 py-3.5 outline-none font-bold text-xs focus:border-[#1f6d78] focus:ring-4 focus:ring-[#1f6d78]/5 transition-all border border-gray-200 dark:border-gray-700 shadow-sm placeholder:text-gray-400 dark:text-white"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[10px]">₺</span>
                </div>
                <div className="w-4 h-0.5 bg-gray-300 rounded-full shrink-0"></div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="En Çok"
                    value={filters.salaryMax}
                    onChange={e => handleSalaryChange('salaryMax', e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full px-6 py-3.5 outline-none font-bold text-xs focus:border-[#1f6d78] focus:ring-4 focus:ring-[#1f6d78]/5 transition-all border border-gray-200 dark:border-gray-700 shadow-sm placeholder:text-gray-400 dark:text-white"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[10px]">₺</span>
                </div>
              </div>
            </FilterSection>
            <FilterSection title="Seyahat Durumu">
              {TRAVEL_STATUSES.map(s => <SelectionPill key={s} label={s} active={filters.travelStatus === s} onClick={() => setFilters({ ...filters, travelStatus: filters.travelStatus === s ? '' : s })} />)}
            </FilterSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FilterSection title="Medeni Durum">
              {MARITAL_STATUSES.map(s => <SelectionPill key={s} label={s} active={filters.maritalStatus === s} onClick={() => setFilters({ ...filters, maritalStatus: filters.maritalStatus === s ? '' : s })} />)}
            </FilterSection>
            <FilterSection title="Engellilik Durumu">
              {DISABILITY_STATUSES.map(s => <SelectionPill key={s} label={s} active={filters.disabilityStatus === s} onClick={() => setFilters({ ...filters, disabilityStatus: filters.disabilityStatus === s ? '' : s })} />)}
            </FilterSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FilterSection title="Sürücü Belgesi">
              {DRIVER_LICENSES.map(l => <SelectionPill key={l} label={l} active={filters.driverLicenses.includes(l)} onClick={() => toggleLicense(l)} />)}
            </FilterSection>
            <FilterSection title="Askerlik Durumu">
              {MILITARY_STATUSES.map(s => <SelectionPill key={s} label={s} active={filters.militaryStatus === s} onClick={() => setFilters({ ...filters, militaryStatus: filters.militaryStatus === s ? '' : s })} />)}
            </FilterSection>
          </div>

          <FilterSection title="Önemli Yetenekler">
            {ALL_SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-bold border transition-all ${filters.skills.includes(skill)
                  ? 'bg-[#1f6d78] border-[#1f6d78] text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                {skill}
              </button>
            ))}
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-4 sm:gap-6">
          <button
            onClick={clearFilters}
            className="flex-1 max-w-[140px] sm:max-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 py-3 sm:py-5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-tight hover:text-[#1f6d78] dark:hover:text-[#2dd4bf] hover:border-[#1f6d78] dark:hover:border-[#2dd4bf] transition-all active:scale-95 shadow-sm"
          >
            Sıfırla
          </button>
          <button
            onClick={() => onApply(filters)}
            className="flex-[2] bg-[#1f6d78] text-white py-3 sm:py-5 rounded-full font-bold text-xs sm:text-base uppercase tracking-tight hover:bg-[#155e68] transition-all shadow-xl active:scale-[0.98]"
          >
            Filtreleri Uygula
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterModal;
