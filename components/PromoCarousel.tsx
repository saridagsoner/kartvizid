import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PromoCarouselProps {
    onOpenTips: () => void;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ onOpenTips }) => {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Common background style for all slides
    const commonBg = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";

    const slides = [
        {
            id: 'premium',
            content: (
                <div className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden ${commonBg}`}>
                    {/* Background Watermark */}
                    <div className="absolute -right-6 -bottom-6 opacity-[0.04] transform rotate-12 pointer-events-none text-[#1f6d78]">
                        <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-6a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
                        </svg>
                    </div>

                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-[#1f6d78] z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3h12l4 6-10 13L2 9Z"></path>
                            <path d="M11 3 8 9l4 13 4-13-3-6"></path>
                            <path d="M2 9h20"></path>
                        </svg>
                    </div>
                    <h3 className="font-black text-lg mb-2 tracking-tight text-gray-900 dark:text-white">{t('promo.premium_title')}</h3>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[200px]">
                        {t('promo.premium_desc')}
                    </p>
                </div>
            )
        },
        {
            id: 'employer',
            content: (
                <div className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden ${commonBg}`}>
                    {/* Background Watermark */}
                    <div className="absolute -left-4 -bottom-4 opacity-[0.04] transform -rotate-12 pointer-events-none">
                        <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </div>

                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-[#1f6d78] z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h3 className="font-black text-lg mb-2 tracking-tight text-gray-900 dark:text-white">{t('promo.employer_title')}</h3>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[200px]">
                        {t('promo.employer_desc')}
                    </p>
                </div>
            )
        },
        {
            id: 'seeker',
            content: (
                <div className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden ${commonBg}`}>
                    {/* Background Watermark */}
                    <div className="absolute right-0 top-10 opacity-[0.03] pointer-events-none">
                        <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>

                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-[#1f6d78] z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <h3 className="font-black text-lg mb-2 tracking-tight text-gray-900 dark:text-white">{t('promo.seeker_title')}</h3>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[200px]">
                        {t('promo.seeker_desc')}
                    </p>
                </div>
            )
        },
        {
            id: 'tips',
            content: (
                <div
                    className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden cursor-pointer group ${commonBg}`}
                    onClick={onOpenTips}
                >
                    {/* Background Watermark */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] transform scale-150 pointer-events-none group-hover:scale-125 transition-transform duration-700">
                        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-5-6.33-5-6.33S1 10.62 1 12a2.5 2.5 0 002.5 2.5 2.5 2.5 0 002.5-2.5 2.5 2.5 0 002.5 2.5z"></path>
                        </svg>
                    </div>

                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 text-orange-500 shadow-sm group-hover:scale-110 transition-transform z-10 border border-orange-100">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M3.343 19.657l.707-.707m15.556 0l-.707-.707M6 12a6 6 0 0012 0v4a10 10 0 001.794 6.784c.163.2.046.506-.207.545H4.413c-.253-.04-.37-.344-.207-.545A10 10 0 006 16v-4z"></path>
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-black text-lg mb-2 tracking-tight flex items-center justify-center gap-2 text-gray-900 dark:text-white">
                            {t('promo.tips_title')}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[200px]">
                            {t('promo.tips_desc')}
                        </p>
                    </div>
                </div>
            )
        }
    ];

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        if (!isPaused) {
            resetTimeout();
            timeoutRef.current = setTimeout(() => {
                setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }, 8000); // 8 seconds duration
        }

        return () => {
            resetTimeout();
        };
    }, [currentSlide, isPaused, slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <div
            className="w-full h-[260px] rounded-2xl overflow-hidden relative shadow-sm group select-none bg-white dark:bg-gray-800"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                className="w-full h-full whitespace-nowrap transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{ transform: `translate3d(${-currentSlide * 100}%, 0, 0)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="inline-block w-full h-full align-top whitespace-normal"
                    >
                        {slide.content}
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${currentSlide === idx
                            ? 'w-6 h-1.5 bg-[#1f6d78]'
                            : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                            }`}
                    ></div>
                ))}
            </div>

            {/* Arrows (Visible on Hover) */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black shadow-sm"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black shadow-sm"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
        </div>
    );
};

export default PromoCarousel;
