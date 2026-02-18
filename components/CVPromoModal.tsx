import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CVPromoModalProps {
    onClose: () => void;
    onCreateCV: () => void;
}

const CVPromoModal: React.FC<CVPromoModalProps> = ({ onClose, onCreateCV }) => {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={onClose}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-[#1f6d78] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#1f6d78] rounded-full blur-3xl"></div>
                </div>



                {/* Main Text */}
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                    CV'ni Oluştur,<br />
                    <span className="text-[#1f6d78]">İş Verenler Seni Bulsun!</span>
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed max-w-xs mx-auto">
                    Şu an profilin boş görünüyor. Hemen profesyonel bir CV oluşturarak iş fırsatlarını yakala.
                </p>

                {/* Features List */}
                <div className="flex flex-col gap-3 mb-10 text-left w-full max-w-xs">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="font-medium">Saniyeler içinde oluştur</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="font-medium">Tamamen ücretsiz</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="font-medium">İş verenlere görünür ol</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="font-medium">CV'in sen başka bir şey yapmadan senin yerine iş bulsun</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onCreateCV}
                    className="w-full max-w-xs bg-[#1f6d78] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#1f6d78]/20 hover:bg-[#165a63] transform hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Şimdi CV Oluştur
                </button>


            </div>
        </div>
    );
};

export default CVPromoModal;
