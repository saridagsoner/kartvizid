import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[] | { label: string, value: string }[];
    placeholder?: string;
    disabled?: boolean;
    icon?: string;
    searchable?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ value, onChange, options, placeholder = 'common.city', disabled = false, icon, searchable = true }) => {
    const { t } = useLanguage();
    const normalizedOptions = options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt);
    const selectedOption = normalizedOptions.find(opt => opt.value === value);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getPlaceholderText = () => {
        const translated = t(placeholder);
        return translated !== placeholder ? translated : placeholder;
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

    const filteredOptions = normalizedOptions.filter(opt =>
        opt.label.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full h-[38px] sm:h-[48px] bg-white dark:bg-black border border-black/10 dark:border-white/20 rounded-full pl-5 pr-4 sm:pl-6 sm:pr-5 text-[14px] font-semibold flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'ring-2 ring-[#1f6d78]/10 border-[#1f6d78]/20 bg-white dark:bg-black' : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <span className={value ? 'text-black dark:text-white' : 'text-gray-400 font-medium'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center translate-y-[1.5px]">
                    <i className={`fi fi-rr-angle-small-down text-gray-400 text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-[100] top-[115%] left-0 w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[26px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-black/5 dark:border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
                    {searchable && (
                        <div className="p-3 border-b border-black/5 dark:border-white/5">
                            <div className="relative h-11">
                                <input
                                    type="text"
                                    autoFocus
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoComplete="off"
                                    onFocus={(e) => {
                                        setTimeout(() => {
                                            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }, 300);
                                    }}
                                    placeholder={options.length > 50 ? t('common.search_list') : t('common.search_list')}
                                    className="w-full h-full bg-gray-50/50 dark:bg-white/5 border border-black/5 dark:border-white/20 rounded-2xl pl-10 pr-4 text-[15px] font-bold outline-none focus:border-[#1f6d78]/30 transition-all dark:text-white"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <i className="fi fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                            </div>
                        </div>
                    )}

                    <div className="max-h-[240px] overflow-y-auto p-2.5 no-scrollbar flex flex-col gap-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`relative px-5 py-3.5 rounded-[18px] text-[14px] font-bold cursor-pointer transition-all flex items-center justify-between group overflow-hidden ${value === option.value 
                                        ? 'bg-[#1f6d78]/8 text-[#1f6d78]' 
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <span className="relative z-10">{option.label}</span>
                                    {value === option.value && (
                                        <i className="fi fi-rr-check text-[15px] sm:text-[17px] font-black"></i>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-[13px] font-bold text-gray-400 italic">
                                Sonuç bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
