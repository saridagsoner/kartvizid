import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Company } from '../types';

interface CompanyProfileModalProps {
    company: Company;
    onClose: () => void;
}

import SEO from './SEO';

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ company, onClose }) => {
    const { t } = useLanguage();

    console.log('CompanyProfileModal Rendered:', { companyId: company.id, userId: company.userId });

    const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
        <div className="mb-3 sm:mb-6 mt-5 sm:mt-10 first:mt-0">
            <h3 className="text-[12px] sm:text-lg font-black text-black dark:text-white uppercase tracking-[0.2em] border-l-4 border-[#1f6d78] pl-3 leading-none">{title}</h3>
            {subtitle && <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
        </div>
    );

    const InfoTag = ({ label, value, icon }: { label: string, value: string | undefined, icon?: string }) => (
        <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{label}</span>
            <div className="flex items-center gap-2 sm:gap-3 px-1 py-0.5">
                {icon && (
                    <span className="text-[10px] sm:text-sm text-gray-400 dark:text-gray-500">
                        {icon.startsWith('fi ') ? <i className={icon}></i> : icon}
                    </span>
                )}
                <span className="text-xs sm:text-base font-bold text-gray-700 dark:text-gray-300">
                    {value || '-'}
                </span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[250] flex sm:items-center sm:justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/30 sm:dark:bg-black/60">
            <SEO
                title={`${company.name} - Şirket Profili`}
                description={company.description ? company.description.substring(0, 150) + '...' : `${company.name} şirketinin profilini inceleyin.`}
                image={company.logoUrl}
            />
            <div className="bg-white dark:bg-black w-full h-full sm:max-w-[800px] sm:h-[90vh] sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden border-none sm:border border-gray-100 dark:border-white/10">

                {/* Header */}
                <div className="pt-safe sticky top-0 z-10 bg-white dark:bg-black shrink-0">
                    <div className="p-4 sm:p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-black gap-4">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 sm:order-2"
                        >
                             <span className="sr-only">{t('profile.close')}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block sm:hidden">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:block text-2xl leading-none">×</span>
                        </button>
                        <div className="flex-1 sm:order-1 text-center sm:text-left">
                            <h2 className="text-[19px] sm:text-2xl font-black text-black dark:text-white tracking-tight truncate">{t('profile.company_title')}</h2>
                        </div>
                        <div className="w-10 sm:hidden"></div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-10 custom-scrollbar space-y-8 sm:space-y-12 bg-white dark:bg-black">
                    {/* Bölüm 1: Kurumsal Kimlik */}
                    <section>
                        <SectionTitle title={t('company.identity')} />
                        <div className="flex flex-col gap-8 pt-4">
                            {/* Centered Logo Section */}
                            <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 block">{t('company.logo')}</span>
                                <div className="w-32 h-32 rounded-[2.5rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                                    {company.logoUrl ? (
                                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600">
                                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                                            <path d="M9 22v-4h6v4"></path>
                                            <path d="M8 6h.01"></path>
                                            <path d="M16 6h.01"></path>
                                            <path d="M12 6h.01"></path>
                                            <path d="M12 10h.01"></path>
                                            <path d="M12 14h.01"></path>
                                            <path d="M16 10h.01"></path>
                                            <path d="M16 14h.01"></path>
                                            <path d="M8 10h.01"></path>
                                            <path d="M8 14h.01"></path>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 w-full space-y-6">
                                <div className="grid grid-cols-2 gap-x-3 gap-y-4 min-w-0">
                                    <InfoTag label={t('company.name')} value={company.name} />
                                    <InfoTag label={t('company.industry')} value={company.industry} />
                                    <InfoTag label={t('form.city')} value={company.city} icon="📍" />
                                    <InfoTag label={t('form.district')} value={company.district} icon="🏙️" />
                                    <InfoTag label={t('company.country')} value={company.country} icon="🌍" />
                                    {company.website && (
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{t('company.website')}</span>
                                            {(() => {
                                                const ensureProtocol = (url: string) => {
                                                    if (!url) return '';
                                                    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
                                                };
                                                const safeUrl = ensureProtocol(company.website);
                                                return (
                                                    <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-3 px-1 py-0.5 hover:opacity-70 transition-all group">
                                                        <span className="text-[10px] sm:text-sm text-[#1f6d78] dark:text-[#2dd4bf]">🌐</span>
                                                        <span className="text-xs sm:text-base font-bold text-[#1f6d78] dark:text-[#2dd4bf] truncate">{company.website}</span>
                                                    </a>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                                {company.address && <InfoTag label={t('company.address')} value={company.address} icon="🏢" />}
                            </div>
                        </div>
                    </section>

                    {/* Bölüm 2: Hakkında */}
                    <section>
                        <SectionTitle title={t('company.about_section')} />
                        <div className="px-1 text-xs sm:text-base font-bold text-gray-500 dark:text-gray-400 leading-relaxed pt-2">
                            "{company.description || t('errors.no_about_company')}"
                        </div>
                    </section>

                </div>

            </div>
        </div>
    );
};

export default CompanyProfileModal;
