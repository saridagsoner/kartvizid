import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';

type LegalSection =
    | 'general'
    | 'security'
    | 'faq'
    | 'help'
    | 'services'
    | 'privacy'
    | 'cookie'
    | 'kvkk'
    | 'membership'
    | 'data_form'
    | 'iletisim'
    | 'about';

interface LegalModalProps {
    initialSection?: LegalSection;
    onClose: () => void;
    onNavigate?: (section: LegalSection) => void;
    isInline?: boolean; // If true, it renders inside the 3-column shell
}

export const useLegalContent = () => {
    const { t } = useLanguage();

    return useMemo(() => ({
        about: {
            title: t('legal.about_title'),
            content: (
                <div className="flex flex-col">
                    <div className="text-center mb-10">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] text-[10px] font-black mb-4 tracking-widest uppercase">
                            {t('legal.ezber_bozan')}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-none">
                            <span dangerouslySetInnerHTML={{ __html: t('legal.hero_title') }}></span>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-base font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('legal.about_p1')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                <i className="fi fi-rr-cross-circle text-6xl text-red-500"></i>
                            </div>
                            <h4 className="text-lg font-black text-gray-400 dark:text-gray-600 mb-1 uppercase tracking-tight">{t('legal.old_way')}</h4>
                            <p className="text-gray-500 dark:text-gray-500 text-xs font-bold mb-6">{t('legal.classic_sites')}</p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm font-bold">
                                    <span className="shrink-0 text-red-400 font-black">✕</span>
                                    <span>{t('legal.old_item1')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm font-bold">
                                    <span className="shrink-0 text-red-400 font-black">✕</span>
                                    <span>{t('legal.old_item2')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm font-bold">
                                    <span className="shrink-0 text-red-400 font-black">✕</span>
                                    <span>{t('legal.old_item3')}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-[#1f6d78] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-[#1f6d78]/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
                                <i className="fi fi-rr-check-circle text-6xl text-[#2dd4bf]"></i>
                            </div>
                            <h4 className="text-lg font-black text-white mb-1 uppercase tracking-tight">{t('legal.new_way')}</h4>
                            <p className="text-white/60 text-xs font-bold mb-6">{t('legal.valued_candidates')}</p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-white/95 text-sm font-bold">
                                    <span className="shrink-0 text-[#2dd4bf] font-black">✓</span>
                                    <span>{t('legal.new_item1')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-white/95 text-sm font-bold">
                                    <span className="shrink-0 text-[#2dd4bf] font-black">✓</span>
                                    <span>{t('legal.new_item2')}</span>
                                </li>
                                <li className="flex items-start gap-3 text-white/95 text-sm font-bold">
                                    <span className="shrink-0 text-[#2dd4bf] font-black">✓</span>
                                    <span>{t('legal.new_item3')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-white/5">
                        <h4 className="font-black text-gray-900 dark:text-white mb-10 text-xl tracking-tight text-center uppercase">{t('legal.how_works')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div className="flex gap-5 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5 text-[#1f6d78] dark:text-[#2dd4bf] shadow-sm">
                                    <i className="fi fi-rr-user text-2xl"></i>
                                </div>
                                <div>
                                    <h5 className="font-black text-gray-900 dark:text-white text-[15px] mb-1 uppercase tracking-tight">{t('legal.step1_title')}</h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{t('legal.step1_desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5 text-[#1f6d78] dark:text-[#2dd4bf] shadow-sm">
                                    <i className="fi fi-rr-search text-2xl"></i>
                                </div>
                                <div>
                                    <h5 className="font-black text-gray-900 dark:text-white text-[15px] mb-1 uppercase tracking-tight">{t('legal.step2_title')}</h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{t('legal.step2_desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5 text-[#1f6d78] dark:text-[#2dd4bf] shadow-sm">
                                    <i className="fi fi-rr-lock text-2xl"></i>
                                </div>
                                <div>
                                    <h5 className="font-black text-gray-900 dark:text-white text-[15px] mb-1 uppercase tracking-tight">{t('legal.step3_title')}</h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{t('legal.step3_desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-5 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5 text-[#1f6d78] dark:text-[#2dd4bf] shadow-sm">
                                    <i className="fi fi-rr-rocket-lunch text-2xl"></i>
                                </div>
                                <div>
                                    <h5 className="font-black text-gray-900 dark:text-white text-[15px] mb-1 uppercase tracking-tight">{t('legal.step4_title')}</h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{t('legal.step4_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 italic">{t('legal.footer_quote')}</p>
                        <div className="w-full max-w-lg aspect-video bg-gray-100 dark:bg-gray-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-inner flex items-center justify-center text-gray-300">
                            <i className="fi fi-rr-play text-4xl"></i>
                        </div>
                    </div>
                </div>
            )
        },
        general: {
            title: t('legal.general_title'),
            content: (
                <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                    <p><strong className="text-gray-900 dark:text-white">{t('legal.general_p1_title')}</strong><br />{t('legal.general_p1_content')}</p>
                    <p><strong className="text-gray-900 dark:text-white">{t('legal.general_p2_title')}</strong><br />{t('legal.general_p2_content')}</p>
                    <p><strong className="text-gray-900 dark:text-white">{t('legal.general_p3_title')}</strong><br />{t('legal.general_p3_content')}</p>
                </div>
            )
        },
        security: {
            title: t('legal.security_title'),
            content: (
                <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                    <p>{t('legal.security_intro')}</p>
                    <ul className="list-disc pl-5 space-y-3">
                        <li><strong className="text-gray-900 dark:text-white">{t('legal.security_item1_title')}</strong> {t('legal.security_item1_desc')}</li>
                        <li><strong className="text-gray-900 dark:text-white">{t('legal.security_item2_title')}</strong> {t('legal.security_item2_desc')}</li>
                        <li><strong className="text-gray-900 dark:text-white">{t('legal.security_item3_title')}</strong> {t('legal.security_item3_desc')}</li>
                        <li><strong className="text-gray-900 dark:text-white">{t('legal.security_item4_title')}</strong> {t('legal.security_item4_desc')}</li>
                    </ul>
                </div>
            )
        },
        faq: {
            title: t('legal.faq_title'),
            content: (
                <div className="space-y-6">
                    <div>
                        <h4 className="font-black text-gray-900 dark:text-white border-l-4 border-[#1f6d78] pl-3 mb-2 tracking-tight">{t('legal.faq_q1')}</h4>
                        <p className="font-medium text-gray-700 dark:text-gray-300">{t('legal.faq_a1')}</p>
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 dark:text-white border-l-4 border-[#1f6d78] pl-3 mb-2 tracking-tight">{t('legal.faq_q2')}</h4>
                        <p className="font-medium text-gray-700 dark:text-gray-300">{t('legal.faq_a2')}</p>
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 dark:text-white border-l-4 border-[#1f6d78] pl-3 mb-2 tracking-tight">{t('legal.faq_q3')}</h4>
                        <p className="font-medium text-gray-700 dark:text-gray-300">{t('legal.faq_a3')}</p>
                    </div>
                </div>
            )
        },
        help: {
            title: t('legal.help_title'),
            content: (
                <div className="space-y-6">
                    <p className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic border-l-4 border-[#1f6d78] pl-4">{t('legal.help_intro')}</p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <p className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">{t('legal.help_email_support')}</p>
                        <p className="text-xl font-black text-[#1f6d78] dark:text-[#2dd4bf]">destek@kartvizid.com</p>
                    </div>
                    <p className="font-medium text-gray-500 text-sm">{t('legal.help_desc')}</p>
                </div>
            )
        },
        iletisim: {
            title: t('footer.iletisim'),
            content: (
                <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic border-l-4 border-gray-100 dark:border-white/5 pl-4">{t('legal.contact_intro')}</p>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="w-10 h-10 bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] rounded-full flex items-center justify-center mb-4">
                                <i className="fi fi-rr-envelope"></i>
                            </div>
                            <h4 className="font-black text-gray-900 dark:text-white mb-1 uppercase text-xs tracking-widest">{t('legal.contact_general')}</h4>
                            <a href="mailto:iletisim@kartvizid.com" className="text-lg font-black text-[#1f6d78] dark:text-[#2dd4bf] hover:underline transition-all">iletisim@kartvizid.com</a>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="w-10 h-10 bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] rounded-full flex items-center justify-center mb-4">
                                <i className="fi fi-rr-headset"></i>
                            </div>
                            <h4 className="font-black text-gray-900 dark:text-white mb-1 uppercase text-xs tracking-widest">{t('legal.contact_support')}</h4>
                            <a href="mailto:destek@kartvizid.com" className="text-lg font-black text-[#1f6d78] dark:text-[#2dd4bf] hover:underline transition-all">destek@kartvizid.com</a>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl">
                        <h5 className="font-black text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-tight">{t('legal.contact_response_title')}</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: t('legal.contact_response_desc') }}></p>
                    </div>
                </div>
            )
        },
        services: {
            title: t('legal.services_title'),
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                        <h4 className="font-black text-[#1f6d78] dark:text-[#2dd4bf] mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                            <i className="fi fi-rr-user"></i> {t('legal.candidate_solutions')}
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <li className="flex gap-3"><span className="text-[#1f6d78]">•</span> <strong>{t('legal.cand_sol1_title')}</strong> {t('legal.cand_sol1_desc')}</li>
                            <li className="flex gap-3"><span className="text-[#1f6d78]">•</span> <strong>{t('legal.cand_sol2_title')}</strong> {t('legal.cand_sol2_desc')}</li>
                            <li className="flex gap-3"><span className="text-[#1f6d78]">•</span> <strong>{t('legal.cand_sol3_title')}</strong> {t('legal.cand_sol3_desc')}</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                        <h4 className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                            <i className="fi fi-rr-building"></i> {t('legal.employer_solutions')}
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                            <li className="flex gap-3"><span className="text-gray-400">•</span> <strong>{t('legal.emp_sol1_title')}</strong> {t('legal.emp_sol1_desc')}</li>
                            <li className="flex gap-3"><span className="text-gray-400">•</span> <strong>{t('legal.emp_sol2_title')}</strong> {t('legal.emp_sol2_desc')}</li>
                        </ul>
                    </div>
                </div>
            )
        },
        privacy: {
            title: t('footer.privacy_policy'),
            content: (
                <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                    <p>{t('legal.privacy_text')}</p>
                    <p><strong className="text-gray-900 dark:text-white uppercase text-xs tracking-widest">{t('legal.privacy_processed_title')}</strong> {t('legal.privacy_processed_desc')}</p>
                    <p><strong className="text-gray-900 dark:text-white uppercase text-xs tracking-widest">{t('legal.privacy_aim_title')}</strong> {t('legal.privacy_aim_desc')}</p>
                </div>
            )
        },
        cookie: {
            title: t('footer.cookie_policy'),
            content: (
                <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                    <p>{t('legal.cookie_intro')}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>{t('legal.cookie_item1')}</li>
                        <li>{t('legal.cookie_item2')}</li>
                    </ul>
                </div>
            )
        },
        kvkk: {
            title: t('footer.kvkk'),
            content: (
                <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                    <p>{t('legal.kvkk_rights_intro')}</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>{t('legal.kvkk_right1')}</li>
                        <li>{t('legal.kvkk_right2')}</li>
                        <li>{t('legal.kvkk_right3')}</li>
                    </ul>
                </div>
            )
        },
        membership: {
            title: t('footer.membership_agreement'),
            content: (
                <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                    <p>{t('legal.membership_intro')}</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>{t('legal.membership_item1')}</li>
                        <li>{t('legal.membership_item2')}</li>
                    </ul>
                </div>
            )
        },
        data_form: {
            title: t('legal.data_form_title'),
            content: (
                <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                    <p>{t('legal.data_form_intro')}</p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                        <p className="font-black text-gray-900 dark:text-white italic mb-2">{t('legal.data_form_channel')}</p>
                        <p className="text-lg font-black text-[#1f6d78] dark:text-[#2dd4bf]">kvkk@kartvizid.com</p>
                    </div>
                </div>
            )
        }
    }), [t]);
};

const LegalModal: React.FC<LegalModalProps> = ({ initialSection = 'general', onClose, onNavigate, isInline = false }) => {
    const { t } = useLanguage();
    const legalData = useLegalContent();
    const [activeSection, setActiveSection] = useState<LegalSection>(initialSection);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveSection(initialSection);
    }, [initialSection]);

    useEffect(() => {
        if (!isInline) {
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
        }
    }, [onClose, isInline]);

    const content = (
        <div 
            ref={containerRef}
            className={isInline 
                ? "h-full flex flex-col min-w-0 bg-white dark:bg-black overflow-hidden" 
                : "bg-white dark:bg-black w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden"
            }
        >
            {/* Sidebar Navigation - Only shown in full modal mode */}
            {!isInline && (
                <div className="w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-100 dark:border-white/20 flex flex-col hidden md:flex">
                    <div className="p-6 border-b border-gray-100 dark:border-white/20">
                        <h3 className="font-black text-xl text-gray-900 dark:text-white">{t('legal.merkez')}</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {Object.entries(legalData).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    if (onNavigate) onNavigate(key as LegalSection);
                                    else setActiveSection(key as LegalSection);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === key
                                    ? 'bg-[#1f6d78] text-white shadow-md shadow-[#1f6d78]/20'
                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {data.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black overflow-hidden">
                {/* Header */}
                <div className={`sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-white/20 flex items-center shrink-0 ${isInline ? 'px-6 py-4 justify-between' : 'p-6 justify-between'}`}>
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        {isInline && (
                            <div className="w-9 h-9 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] shrink-0 border border-gray-100 dark:border-white/20">
                                <i className="fi fi-rr-document-signed"></i>
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className={`${isInline ? 'text-[15px]' : 'text-2xl'} font-black text-gray-900 dark:text-white tracking-tight truncate uppercase leading-none`}>
                                {legalData[activeSection].title}
                            </h2>
                            {isInline && <span className="text-[9px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em] mt-0.5 block leading-none">{t('legal.kurumsal')}</span>}
                        </div>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className={`${isInline ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm shrink-0 border border-gray-100 dark:border-white/20 active:scale-95`}
                    >
                        {isInline ? (
                            <i className="fi fi-rr-apps"></i>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className={`flex-1 overflow-y-auto ${isInline ? 'p-6 md:p-12 no-scrollbar' : 'p-8'} custom-scrollbar`}>
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:font-medium">
                        {legalData[activeSection].content}
                    </div>
                </div>

                {/* Mobile Navigation - Hidden in inline mode */}
                {!isInline && (
                    <div className="md:hidden p-4 border-t border-gray-100 dark:border-white/20 overflow-x-auto whitespace-nowrap bg-gray-50 dark:bg-gray-900 space-x-2 no-scrollbar">
                        {Object.entries(legalData).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    if (onNavigate) onNavigate(key as LegalSection);
                                    else setActiveSection(key as LegalSection);
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all inline-block ${activeSection === key
                                    ? 'bg-[#1f6d78] text-white'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/20 text-gray-500'
                                    }`}
                            >
                                {data.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (isInline) return content;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            {content}
        </div>,
        document.body
    );
};

export default LegalModal;
export type { LegalSection };
