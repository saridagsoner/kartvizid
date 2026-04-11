import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CV, FilterState } from '../types';
import BusinessCard from './BusinessCard';
import SelectionModal from './SelectionModal';
import { EXPERIENCE_LEVELS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const AdvancedFilterModal = React.lazy(() => import('./AdvancedFilterModal'));

interface SearchOverlayProps {
    onClose: () => void;
    cvList: CV[];
    onOpenProfile: (userId: string, role?: string) => void;
    onOpenFilter?: () => void;
    availableProfessions: any[];
    availableCities: any[];
    currentFilters: FilterState;
    onFilterChange?: (key: string, value: any) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
    onClose,
    cvList,
    onOpenProfile,
    onOpenFilter,
    availableProfessions,
    availableCities,
    currentFilters,
    onFilterChange
}) => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [activeModal, setActiveModal] = useState<'professions' | 'cities' | 'experience' | 'advanced' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Defensive check for currentFilters
    const filters = currentFilters || {
        profession: '',
        city: '',
        experience: '',
        workType: '',
        employmentType: '',
        educationLevel: '',
        skills: []
    };

    const results = useMemo(() => {
        if (!cvList) return [];
        let filtered = cvList.filter(cv => !!cv); // Remove any nulls/undefineds

        // Apply filters
        if (filters.profession) {
            filtered = filtered.filter(cv => cv.profession === filters.profession);
        }
        if (filters.city) {
            filtered = filtered.filter(cv => cv.city === filters.city);
        }
        if (filters.experience) {
            // Mapping label to experience description or logical match if needed
            // Currently CV has experienceYears (number), so we might need a more complex match
            // For now, let's keep it partial string match if we had a string field, or hide this logic until perfected
            // filtered = filtered.filter(cv => cv.experienceLevel === filters.experience);
        }
        if (filters.workType) {
            filtered = filtered.filter(cv => cv.workType === filters.workType);
        }
        if (filters.employmentType) {
            filtered = filtered.filter(cv => cv.employmentType === filters.employmentType);
        }
        if (filters.educationLevel) {
            filtered = filtered.filter(cv => cv.educationLevel === filters.educationLevel);
        }
        if (filters.skills && Array.isArray(filters.skills) && filters.skills.length > 0) {
            filtered = filtered.filter(cv => 
                filters.skills?.every(s => cv.skills?.includes(s))
            );
        }

        // Apply Search Query
        if (query.trim()) {
            const lowQuery = query.toLowerCase();
            filtered = filtered.filter(cv =>
                cv.name?.toLowerCase().includes(lowQuery) ||
                cv.profession?.toLowerCase().includes(lowQuery) ||
                cv.city?.toLowerCase().includes(lowQuery) ||
                cv.skills?.some(s => s.toLowerCase().includes(lowQuery))
            );
        }

        return filtered.slice(0, 30); // Limit results for performance
    }, [query, cvList, filters]);

    const handleResultClick = (cv: CV) => {
        onOpenProfile(cv.userId, 'job_seeker');
    };

    const handleFilterSelect = (key: string, val: string) => {
        if (onFilterChange) {
            const currentVal = filters[key as keyof FilterState];
            const newVal = currentVal === val ? '' : val;
            onFilterChange(key, newVal);
        }
        setActiveModal(null);
    };

    const handleAdvancedApply = (newFilters: FilterState) => {
        if (onFilterChange) {
            Object.entries(newFilters).forEach(([key, val]) => {
                onFilterChange(key, val);
            });
        }
        setActiveModal(null);
    };

    const activeFiltersCount = useMemo(() => {
        if (!filters) return 0;
        return Object.entries(filters).filter(([k, v]) => {
            if (Array.isArray(v)) return v.length > 0;
            return v !== '' && v !== null && v !== undefined;
        }).length;
    }, [filters]);

    return (
        <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 flex flex-col sm:hidden overflow-hidden">
            {/* Search Header */}
            <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20">
                <div className="flex items-center gap-3 p-4 pb-2">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-black dark:text-white hover:opacity-70 transition-colors -ml-1.5 translate-y-[2px]"
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
                        onClick={() => setActiveModal('advanced')}
                        className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all active:scale-90 shrink-0 shadow-sm ${
                            activeFiltersCount > 0 
                            ? 'bg-[#1f6d78] border-[#1f6d78] text-white' 
                            : 'border-black dark:border-white text-black dark:text-white'
                        }`}
                    >
                        <i className="fi fi-rr-settings-sliders text-[15px]"></i>
                    </button>
                </div>

                {/* Horizontal Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3 pb-4">
                    <button
                        onClick={() => setActiveModal('professions')}
                        className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                            filters.profession 
                            ? 'bg-[#1f6d78]/10 text-[#1f6d78] border-[#1f6d78]' 
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-white/5'
                        }`}
                    >
                        <span>{filters.profession || t('filters.categories')}</span>
                        <i className="fi fi-rr-angle-small-down text-[10px]"></i>
                    </button>

                    <button
                        onClick={() => setActiveModal('cities')}
                        className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                            filters.city 
                            ? 'bg-[#1f6d78]/10 text-[#1f6d78] border-[#1f6d78]' 
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-white/5'
                        }`}
                    >
                        <span>{filters.city || t('filters.city')}</span>
                        <i className="fi fi-rr-angle-small-down text-[10px]"></i>
                    </button>

                    <button
                        onClick={() => setActiveModal('experience')}
                        className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                            filters.experience 
                            ? 'bg-[#1f6d78]/10 text-[#1f6d78] border-[#1f6d78]' 
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-white/5'
                        }`}
                    >
                        <span>{filters.experience || t('filters.experience')}</span>
                        <i className="fi fi-rr-angle-small-down text-[10px]"></i>
                    </button>

                    <button
                        onClick={() => setActiveModal('advanced')}
                        className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all active:scale-95 flex items-center gap-1.5`}
                    >
                         <span>{t('filters.advanced')}</span>
                         <i className="fi fi-rr-caret-right text-[10px] opacity-40"></i>
                    </button>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 px-4 py-4 pb-24">
                {results.length > 0 ? (
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
                ) : !query.trim() && activeFiltersCount === 0 ? (
                    <div className="flex flex-col items-center pt-[15vh] pb-12 px-8 text-center animate-in fade-in duration-700">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl flex items-center justify-center mb-8">
                             <i className="fi fi-rr-search text-3xl text-[#1f6d78] dark:text-[#2dd4bf]"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Yetenek veya Hizmet Keşfet</h3>
                        <p className="text-[16px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-[320px]">
                            Kriterlerinize en uygun adaylara anında ulaşın ya da aradığınız profesyonel hizmeti hemen bulmaya başlayın.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                            <i className="fi fi-rr-search-help text-2xl text-red-400"></i>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-bold mb-1">Eşleşme Bulunamadı</p>
                        <p className="text-gray-500 text-sm">Farklı bir anahtar kelime veya<br />şehir denemeyi unutma.</p>
                    </div>
                )}
            </div>

            {/* Selection Modals */}
            {activeModal === 'professions' && (
                <SelectionModal
                    title="Tüm Meslekler"
                    items={availableProfessions}
                    onSelect={(val) => handleFilterSelect('profession', val)}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'cities' && (
                <SelectionModal
                    title="Tüm Şehirler"
                    items={availableCities}
                    onSelect={(val) => handleFilterSelect('city', val)}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'experience' && (
                <SelectionModal
                    title="Tüm Deneyim Seviyeleri"
                    items={EXPERIENCE_LEVELS}
                    onSelect={(val) => handleFilterSelect('experience', val)}
                    onClose={() => setActiveModal(null)}
                />
            )}
            {activeModal === 'advanced' && (
                <React.Suspense fallback={null}>
                    <AdvancedFilterModal
                        initialFilters={filters}
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

export default SearchOverlay;
