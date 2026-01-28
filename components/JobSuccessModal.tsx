import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface JobSuccessModalProps {
    onClose: () => void;
}

const JobSuccessModal: React.FC<JobSuccessModalProps> = ({ onClose }) => {
    const { t } = useLanguage();

    useEffect(() => {
        // Fire confetti indefinitely while mounted
        let animationFrameId: number;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                zIndex: 9999,
                colors: ['#1f6d78', '#ffecd2', '#d4af37']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                zIndex: 9999,
                colors: ['#1f6d78', '#ffecd2', '#d4af37']
            });

            // Keep loop running until unmount
            animationFrameId = requestAnimationFrame(frame);
        };

        frame();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (

        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[6px] animate-in fade-in duration-300">
            {/* Modal Container - Smaller max-w-xl (rectangular card shape) */}
            <div className="bg-white dark:bg-gray-900 rounded-[1.5rem] w-full max-w-xl relative shadow-2xl animate-in zoom-in-95 overflow-hidden">

                {/* Inner Dashed Border - Brand Color */}
                <div className="absolute inset-3 border-2 border-dashed border-[#1f6d78]/30 rounded-2xl pointer-events-none"></div>

                <div className="p-8 sm:p-12 flex flex-col items-center relative z-10 text-center">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    {/* Content - Handwriting/Elegant Font Style */}
                    {/* Logo Replacement */}
                    <div className="mb-6 scale-125">
                        <div className="flex items-center text-[#2b2b2b] dark:text-white text-[32px] sm:text-[40px] font-bold tracking-tight rounded-font leading-none">
                            <span>Kartvizi</span>
                            <span className="inline-block ml-1 transform rotate-[12deg] origin-center translate-y-[-1px] text-[#1f6d78] font-black">d</span>
                        </div>
                    </div>

                    <p className="text-[#1f6d78] dark:text-[#2dd4bf] font-serif italic text-lg sm:text-xl leading-relaxed max-w-[360px] opacity-90">
                        "{t('success.job_found_msg') || 'Yeni işinizde başarılar dileriz!'}"
                    </p>



                </div>
            </div>
        </div>
    );

};

export default JobSuccessModal;
