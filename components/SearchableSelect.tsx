import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ value, onChange, options, placeholder = 'Seçiniz', disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
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

    // Filter options
    const filteredOptions = options.filter(opt =>
        opt.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger Button */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-gray-50 dark:bg-gray-800 border border-transparent rounded-full px-6 py-3.5 text-sm font-bold flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'bg-white dark:bg-gray-700 border-[#1f6d78]/10 ring-2 ring-[#1f6d78]/5' : ''
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-gray-700 hover:border-[#1f6d78]/10'}`}
            >
                <span className={value ? 'text-black dark:text-gray-100' : 'text-gray-400'}>
                    {value || placeholder}
                </span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 top-[110%] left-0 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="relative h-[38px] overflow-hidden">
                            <input
                                type="text"
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Ara..."
                                className="w-[111.11%] h-[42.22px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-0 text-[16px] origin-top-left scale-[0.9] font-bold outline-none focus:border-[#1f6d78] transition-colors dark:text-white"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-[240px] overflow-y-auto no-scrollbar p-2">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors ${value === option ? 'bg-[#1f6d78] text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs font-bold text-gray-400">
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
