import React, { useState, useRef, useEffect } from 'react';

interface MonthYearPickerProps {
    value: string; // Format: "YYYY-MM"
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const MONTHS = [
    { value: '01', label: 'Oca' },
    { value: '02', label: 'Şub' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Nis' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Haz' },
    { value: '07', label: 'Tem' },
    { value: '08', label: 'Ağu' },
    { value: '09', label: 'Eyl' },
    { value: '10', label: 'Eki' },
    { value: '11', label: 'Kas' },
    { value: '12', label: 'Ara' }
];

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ value, onChange, placeholder = 'Tarih Seçiniz', disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse current value
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>('');

    useEffect(() => {
        if (value) {
            const [y, m] = value.split('-');
            if (y) setSelectedYear(parseInt(y));
            if (m) setSelectedMonth(m);
        } else {
            // Default state if empty
            setSelectedYear(new Date().getFullYear());
            setSelectedMonth('');
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= 1970; i--) {
            years.push(i);
        }
        return years;
    };

    const handleSelect = (month: string, year: number) => {
        onChange(`${year}-${month}`);
        setIsOpen(false);
    };

    const getDisplayValue = () => {
        if (!value) return placeholder;
        const [y, m] = value.split('-');
        const monthLabel = MONTHS.find(mo => mo.value === m)?.label;
        return `${monthLabel || m} ${y}`;
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-gray-50 dark:bg-gray-800 border border-transparent rounded-xl px-4 py-3 text-sm font-bold flex items-center justify-between cursor-pointer transition-all outline-none ${isOpen ? 'bg-white dark:bg-gray-700 border-[#1f6d78]/10 ring-2 ring-[#1f6d78]/5' : ''
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-gray-700 hover:border-[#1f6d78]/10'}`}
            >
                <span className={value ? 'text-black dark:text-white' : 'text-gray-400'}>
                    {getDisplayValue()}
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 top-[110%] left-0 w-[280px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header: Year Selector */}
                    <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-1 flex justify-center">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="bg-transparent font-bold text-center outline-none py-1 cursor-pointer w-full dark:text-white"
                        >
                            {generateYears().map(y => (
                                <option key={y} value={y} className="dark:bg-gray-800">{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Months Grid */}
                    <div className="grid grid-cols-4 gap-2">
                        {MONTHS.map(m => (
                            <button
                                key={m.value}
                                onClick={() => handleSelect(m.value, selectedYear)}
                                className={`p-2 rounded-lg text-xs font-bold transition-all ${selectedMonth === m.value && value.startsWith(selectedYear.toString())
                                    ? 'bg-[#1f6d78] text-white shadow-lg shadow-[#1f6d78]/20'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                        <button
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            className="text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded"
                        >
                            Temizle
                        </button>
                        <button
                            onClick={() => {
                                const now = new Date();
                                const m = (now.getMonth() + 1).toString().padStart(2, '0');
                                const y = now.getFullYear();
                                handleSelect(m, y);
                            }}
                            className="text-[10px] font-bold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded"
                        >
                            Bu ay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthYearPicker;
