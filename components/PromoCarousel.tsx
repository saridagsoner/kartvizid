import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PromoCarouselProps {
    onOpenTips: () => void;
    onOpenInfo: () => void;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({ onOpenTips, onOpenInfo }) => {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Common background style for all slides
    // Common background style for all slides - REMOVED border/bg as it's now on parent
    const commonBg = "";

    const slides = [
        {
            id: 'premium',
            content: (
                <div className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden ${commonBg}`}>
                    {/* Icon - Standalone, large and clean */}
                    <div className="mb-6 text-[#1f6d78] transform hover:scale-110 transition-transform duration-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3h12l4 6-10 13L2 9Z"></path>
                            <path d="M11 3 8 9l4 13 4-13-3-6"></path>
                            <path d="M2 9h20"></path>
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-[240px]">
                        <h3 className="font-extrabold text-xl mb-3 tracking-tight text-gray-900 dark:text-white">
                            {t('promo.premium_title')}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            {t('promo.premium_desc')}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'employer',
            content: (
                <div className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden ${commonBg}`}>
                    {/* Icon */}
                    <div className="mb-6 text-[#1f6d78] transform hover:scale-110 transition-transform duration-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-[240px]">
                        <h3 className="font-extrabold text-xl mb-3 tracking-tight text-gray-900 dark:text-white">
                            {t('promo.employer_title')}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            {t('promo.employer_desc')}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'seeker',
            content: (
                <div className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden ${commonBg}`}>
                    {/* Icon */}
                    <div className="mb-6 text-[#1f6d78] transform hover:scale-110 transition-transform duration-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-[240px]">
                        <h3 className="font-extrabold text-xl mb-3 tracking-tight text-gray-900 dark:text-white">
                            {t('promo.seeker_title')}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            {t('promo.seeker_desc')}
                        </p>
                    </div>
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
                    {/* Icon - Orange Accent for Tips */}
                    <div className="mb-6 text-orange-500 transform group-hover:scale-110 transition-transform duration-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M3.343 19.657l.707-.707m15.556 0l-.707-.707M6 12a6 6 0 0012 0v4a10 10 0 001.794 6.784c.163.2.046.506-.207.545H4.413c-.253-.04-.37-.344-.207-.545A10 10 0 006 16v-4z"></path>
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-[240px]">
                        <h3 className="font-extrabold text-xl mb-3 tracking-tight flex items-center justify-center gap-2 text-gray-900 dark:text-white">
                            {t('promo.tips_title')}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-orange-600 transition-colors">
                            {t('promo.tips_desc')}
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'info',
            content: (
                <div
                    className={`h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200 p-6 relative overflow-hidden cursor-pointer group ${commonBg}`}
                    onClick={onOpenInfo}
                >
                    {/* Icon - Info */}
                    <div className="mb-6 text-[#1f6d78] transform group-hover:scale-110 transition-transform duration-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-[240px]">
                        <h3 className="font-extrabold text-xl mb-3 tracking-tight flex items-center justify-center gap-2 text-gray-900 dark:text-white">
                            Kartvizid Nedir?
                        </h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-[#1f6d78] transition-colors">
                            Platformu nasıl kullanacağınızı ve avantajlarını keşfedin.
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
            className="w-full h-[260px] rounded-2xl overflow-hidden relative shadow-sm group select-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
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
