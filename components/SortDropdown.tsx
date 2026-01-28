import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SortDropdownProps {
    value: string;
    onChange: (val: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { t } = useLanguage();

    const options = [
        { id: 'default', label: t('sort.default') },
        { id: 'newest', label: t('sort.newest') },
        { id: 'oldest', label: t('sort.oldest') }
    ];

    const activeLabel = options.find(o => o.id === value)?.label || t('sort.default');

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 bg-white dark:bg-gray-800 border ${isOpen ? 'border-[#1f6d78] shadow-md' : 'border-gray-200 dark:border-gray-700'} rounded-full px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-bold text-gray-800 dark:text-white transition-all hover:border-[#1f6d78] dark:hover:border-[#1f6d78] active:scale-95`}
            >
                <span>{activeLabel}</span>
                <svg
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-[60] animate-in slide-in-from-top-2 duration-200 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => {
                                onChange(opt.id);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3 text-xs font-bold transition-all flex items-center justify-between ${value === opt.id ? 'bg-[#1f6d78]/5 text-[#1f6d78] dark:text-[#2dd4bf]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#1f6d78] dark:hover:text-[#2dd4bf]'
                                }`}
                        >
                            {opt.label}
                            {value === opt.id && <span className="text-[10px] font-black text-black dark:text-white">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SortDropdown;
