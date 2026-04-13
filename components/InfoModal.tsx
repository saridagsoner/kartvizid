import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// WORKFLOW_STEPS moved inside for localization

import { useLanguage } from '../context/LanguageContext';

interface InfoModalProps {
    onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const WORKFLOW_STEPS = [
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            ),
            title: t('info.step1_title_full'),
            desc: t('info.step1_desc_full')
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            ),
            title: t('info.step2_title_full'),
            desc: t('info.step2_desc_full')
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            ),
            title: t('info.step3_title_full'),
            desc: t('info.step3_desc_full')
        },
        {
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            ),
            title: t('info.step4_title_full'),
            desc: t('info.step4_desc_full')
        }
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md  fade-in ">
            <div
                ref={containerRef}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden  zoom-in-95 "
            >
                {/* Header (Preserved as requested) */}
                <div className="p-8 pb-6 flex justify-between items-center z-10 sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {t('info.title_full')}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            {t('info.subtitle_full')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm active:"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Main Value Proposition */}
                    <div className="text-center mb-12 px-4">
                        <span className="inline-block py-1 px-3 rounded-full bg-[#1f6d78]/10 text-[#1f6d78] text-xs font-bold mb-4 tracking-wide uppercase">
                            {t('info.ezber_bozan_full')}
                        </span>
                        <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: t('info.hero_title_full') }}></h3>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            {t('info.hero_desc_full')}
                        </p>
                    </div>

                    {/* Comparison / Philosophy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/50 rounded-full blur-3xl -/2 /2"></div>
                            <h4 className="text-lg font-black text-gray-400 mb-2">{t('info.old_way_full')}</h4>
                            <p className="text-gray-500 text-sm font-medium mb-6">{t('info.classic_sites_full')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-500 text-sm">
                                    <span className="shrink-0 text-red-400">✕</span>
                                    <span>{t('info.old_list1_full')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-500 text-sm">
                                    <span className="shrink-0 text-red-400">✕</span>
                                    <span>{t('info.old_list2_full')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-500 text-sm">
                                    <span className="shrink-0 text-red-400">✕</span>
                                    <span>{t('info.old_list3_full')}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-[#1f6d78] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#1f6d78]/20 group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -/2 /2"></div>
                            <h4 className="text-lg font-black text-white mb-2">{t('info.new_way_full')}</h4>
                            <p className="text-white/70 text-sm font-medium mb-6">{t('info.valued_candidates_full')}</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-white/90 text-sm font-medium">
                                    <span className="shrink-0 text-[#2dd4bf]">✓</span>
                                    <span>{t('info.new_list1_full')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-white/90 text-sm font-medium">
                                    <span className="shrink-0 text-[#2dd4bf]">✓</span>
                                    <span>{t('info.new_list2_full')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-white/90 text-sm font-medium">
                                    <span className="shrink-0 text-[#2dd4bf]">✓</span>
                                    <span>{t('info.new_list3_full')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* How It Works Steps */}
                    <div className="mb-8">
                        <h4 className="text-center font-bold text-gray-900 mb-8">{t('info.how_it_works_full')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {WORKFLOW_STEPS.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center p-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1f6d78] mb-4 shadow-sm border border-gray-100">
                                        {step.icon}
                                    </div>
                                    <h5 className="font-bold text-gray-900 text-sm mb-2">{step.title}</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed max-w-[180px]">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="text-center pt-8 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="bg-black text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-gray-900 transition-all active: shadow-lg"
                        >
                            {t('info.cta_full')}
                        </button>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};

export default InfoModal;
