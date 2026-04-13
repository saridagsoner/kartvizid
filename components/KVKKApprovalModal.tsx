import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface KVKKApprovalModalProps {
    onApprove: () => void;
    onCancel: () => void;
}

const KVKKApprovalModal: React.FC<KVKKApprovalModalProps> = ({ onApprove, onCancel }) => {
    const [canApprove, setCanApprove] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                setCanApprove(true);
            }
        }
    };

    useEffect(() => {
        if (contentRef.current) {
            if (contentRef.current.scrollHeight <= contentRef.current.clientHeight) {
                setCanApprove(true);
            }
        }
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white dark:bg-black fade-in">
            <div className="bg-white dark:bg-black w-full h-full flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-black items-center flex justify-between shrink-0 sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('kvkk.title')}</h2>
                        <p className="text-[10px] sm:text-xs text-[#1f6d78] font-bold mt-0.5 sm:mt-1 capitalize">{t('kvkk.subtitle')}</p>
                    </div>
                    <button 
                        onClick={onCancel} 
                        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
                    >
                        <svg width="20" height="20" sm:width="24" sm:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 sm:p-12 sm:px-20 custom-scrollbar bg-white dark:bg-black"
                >
                    <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-4xl mx-auto text-gray-600 dark:text-gray-400">
                        <div className="mb-10 sm:mb-14">
                            <p className="font-black text-gray-800 dark:text-white mb-4 text-center sm:text-left text-base sm:text-lg leading-tight uppercase">
                                {t('kvkk.main_title')}
                            </p>
                            <p className="italic text-sm sm:text-base leading-relaxed text-gray-500">
                                {t('kvkk.intro_text')}
                            </p>
                        </div>

                        <div className="space-y-12 sm:space-y-16">
                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section1_title')}
                                </h4>
                                <p className="leading-relaxed">{t('kvkk.section1_content')}</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section2_title')}
                                </h4>
                                <p className="mb-4 leading-relaxed">{t('kvkk.section2_desc')}</p>
                                <ul className="list-none pl-0 mt-4 space-y-4">
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>{t('kvkk.cat1_title')}</strong> {t('kvkk.cat1_desc')}
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>{t('kvkk.cat2_title')}</strong> {t('kvkk.cat2_desc')}
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>{t('kvkk.cat3_title')}</strong> {t('kvkk.cat3_desc')}
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>{t('kvkk.cat4_title')}</strong> {t('kvkk.cat4_desc')}
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>{t('kvkk.cat5_title')}</strong> {t('kvkk.cat5_desc')}
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section3_title')}
                                </h4>
                                <p className="leading-relaxed text-justify">{t('kvkk.section3_content')}</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section4_title')}
                                </h4>
                                <p className="leading-relaxed text-justify mb-4">{t('kvkk.section4_p1')} <strong>{t('kvkk.section4_highlight')}</strong></p>
                                <p className="leading-relaxed text-justify mb-4">{t('kvkk.section4_p2')}</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section5_title')}
                                </h4>
                                <p className="leading-relaxed">{t('kvkk.section5_content')}</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section6_title')}
                                </h4>
                                <p className="leading-relaxed text-justify">{t('kvkk.section6_content')}</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section7_title')}
                                </h4>
                                <p className="leading-relaxed text-justify">{t('kvkk.section7_content')}</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section8_title')}
                                </h4>
                                <p className="mb-4 leading-relaxed">{t('kvkk.section8_desc')}</p>
                                <ul className="list-disc pl-5 mt-4 space-y-3 leading-relaxed">
                                    <li>{t('kvkk.right1')}</li>
                                    <li>{t('kvkk.right2')}</li>
                                    <li>{t('kvkk.right3')}</li>
                                    <li>{t('kvkk.right4')}</li>
                                    <li>{t('kvkk.right5')}</li>
                                    <li>{t('kvkk.right6')}</li>
                                </ul>
                            </section>

                            <section className="pb-32 sm:pb-40">
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    {t('kvkk.section9_title')}
                                </h4>
                                <p className="leading-relaxed">{t('kvkk.section9_content')}</p>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer UI */}
                <div className="p-6 sm:p-10 border-t border-gray-100 dark:border-white/5 bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center shrink-0 z-20">
                    <button
                        onClick={() => canApprove && onApprove()}
                        className={`w-full max-w-lg py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] sm:text-[13px] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${canApprove
                                ? 'bg-[#1f6d78] text-white hover:bg-[#155e68] shadow-[#1f6d78]/30 cursor-pointer'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 cursor-not-allowed opacity-80'
                            }`}
                    >
                        {canApprove ? (
                            <>
                                <span>{t('kvkk.read_understand')}</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in zoom-in duration-500">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </>
                        ) : (
                            <>
                                <span className="opacity-90">{t('kvkk.read_understand')}</span>
                                <div className="w-4 h-4 border-2 border-[#1f6d78]/40 border-t-[#1f6d78] rounded-full animate-spin"></div>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default KVKKApprovalModal;
