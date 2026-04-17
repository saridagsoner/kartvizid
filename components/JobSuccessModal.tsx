import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface JobSuccessModalProps {
    onClose: () => void;
}

const JobSuccessModal: React.FC<JobSuccessModalProps> = ({ onClose }) => {
    const { t } = useLanguage();

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[6px] transition-all duration-500 animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl relative shadow-[0_32px_120px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 overflow-hidden border border-white/20">

                {/* Inner Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f6d78]/5 via-transparent to-[#1f6d78]/5 pointer-events-none"></div>

                {/* Inner Dashed Border - Brand Color */}
                <div className="absolute inset-4 border-2 border-dashed border-[#1f6d78]/20 rounded-[2rem] pointer-events-none"></div>

                <div className="p-10 sm:p-16 flex flex-col items-center relative z-10 text-center">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        <i className="fi fi-rr-cross text-sm"></i>
                    </button>

                    {/* Success Icon/Badge */}
                    <div className="w-24 h-24 bg-gradient-to-tr from-[#1f6d78] to-[#2dd4bf] rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-[#1f6d78]/20 animate-bounce">
                        <i className="fi fi-ss-check text-4xl text-white"></i>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <div className="flex items-center justify-center text-black dark:text-white text-[32px] sm:text-[40px] font-black tracking-tighter leading-none logo-font mb-2">
                            <span>Kartvizi</span>
                            <span className="inline-block ml-0.5 transform rotate-[12deg] origin-center text-[#1f6d78] dark:text-[#2dd4bf]">d</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-widest mb-1">TEBRİKLER!</h2>
                    </div>

                    <div className="text-gray-600 dark:text-gray-300 font-bold text-lg leading-relaxed max-w-[420px] space-y-4">
                        <p className="italic">"{t('job_success.msg1')}"</p>
                        <p className="text-sm opacity-80 font-medium">{t('job_success.msg2')}</p>
                    </div>

                    <div className="mt-12 w-full">
                        <button 
                            onClick={onClose}
                            className="w-full bg-[#1f6d78] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-[#1f6d78]/20 hover:bg-[#155e68] transform hover:-translate-y-1 transition-all active:translate-y-0"
                        >
                            Teşekkürler
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobSuccessModal;
