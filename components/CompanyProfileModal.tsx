import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Company } from '../types';
import SEO from './SEO';
import ImageWithFallback from './ImageWithFallback';

interface CompanyProfileModalProps {
    company: Company;
    onClose: () => void;
    isInline?: boolean;
}

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ company, onClose, isInline = false }) => {
    const { t } = useLanguage();

    const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
        <div className={`mb-3 mt-4 sm:mt-6 first:mt-0 ${isInline ? 'sm:mt-5 sm:mb-2' : 'sm:mb-6 sm:mt-10'}`}>
            <h3 className={`${isInline ? 'text-[11px] sm:text-[13px]' : 'text-[12px] sm:text-[15px]'} font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em] border-l-4 border-[#1f6d78] dark:border-[#2dd4bf] pl-3 leading-none logo-font`}>{title}</h3>
            {subtitle && <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
        </div>
    );

    const InfoTag = ({ label, value, icon }: { label: string, value: string | number | undefined, icon?: string }) => (
        <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{label}</span>
            <div className="flex items-center gap-2 sm:gap-3 px-1 py-0.5">
                {icon && (
                    <span className="text-[10px] sm:text-sm text-gray-400 dark:text-gray-500">
                        {icon.startsWith('fi ') ? <i className={icon}></i> : icon}
                    </span>
                )}
                <span className={`text-xs sm:text-base font-bold ${value ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                    {value || t('common.none') || 'Belirtilmedi'}
                </span>
            </div>
        </div>
    );

    return (
        <div className={isInline ? "h-full flex flex-col bg-white dark:bg-black shadow-none border-none overflow-hidden" : "fixed top-0 left-0 right-0 bottom-0 z-[250] flex sm:items-center sm:justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/30 sm:dark:bg-black/60"}>
            {!isInline && (
                <SEO
                    title={`${company.name} - ${t('profile.company_title')}`}
                    description={company.description ? company.description.substring(0, 150) + '...' : `${company.name} şirketinin profilini inceleyin.`}
                    image={company.logoUrl}
                />
            )}
            
            <div className={isInline ? "w-full h-full relative flex flex-col overflow-hidden bg-white dark:bg-black" : "w-full h-full sm:max-w-[800px] sm:h-[90vh] sm:rounded-[3rem] sm:shadow-2xl relative flex flex-col overflow-hidden bg-white dark:bg-black border-none sm:border border-gray-100 dark:border-white/20"}>
                
                {/* Header (Aligned with ProfileModal) */}
                <div className="pt-safe sticky top-0 z-10 bg-white dark:bg-black shrink-0">
                    <div className={`pt-0.5 pb-2 px-4 sm:pt-1 sm:pb-2.5 border-b border-gray-100 dark:border-white/20 flex items-center bg-white dark:bg-black gap-2 sm:gap-4 ${isInline ? 'sm:px-6' : 'sm:px-10'}`}>
                        <div className="w-8 sm:w-9 shrink-0">
                            {/* Balancing spacer */}
                        </div>
                        <div className="flex-1 text-center min-w-0">
                            <h2 className={`${isInline ? 'text-[16px] sm:text-lg' : 'text-[18px] sm:text-xl'} font-black text-black dark:text-white tracking-tight truncate logo-font`}>
                                {t('profile.company_title')}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                        >
                            <span className="sr-only">{t('profile.close')}</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block sm:hidden">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:block text-xl leading-none">×</span>
                        </button>
                    </div>
                </div>

                {/* Modal Body (Scrollable Middle Section) */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-black ${isInline ? 'pl-4 pr-8 py-6 sm:pl-6 sm:pr-14 sm:py-8' : 'p-5 sm:p-10'}`}>
                    <div className={isInline ? "max-w-[800px] space-y-8" : "space-y-8 sm:space-y-12"}>
                        
                        {/* Basic Info (Corporate Identity) */}
                        <section>
                            <SectionTitle title={t('profile.basic_info')} />
                            <div className="flex flex-col gap-6 pt-4 pl-4">
                                <div className="flex flex-row gap-4 sm:gap-6 items-start">
                                    <div className="shrink-0">
                                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-3 mb-1.5 block">LOGO</span>
                                        <div className={`${isInline ? 'w-20 h-24 sm:w-24 sm:h-28 sm:rounded-[2rem]' : 'w-20 h-24 sm:w-32 sm:h-40 sm:rounded-[2.5rem]'} overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center relative border border-gray-100 dark:border-white/5 shadow-sm mt-2`}>
                                            <ImageWithFallback src={company.logoUrl} alt={company.name || ''} className="w-full h-full object-cover" initialsClassName="text-4xl sm:text-6xl font-black" />
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-6 sm:pt-9 min-w-0">
                                        <h3 className="text-xl sm:text-3xl font-black text-black dark:text-white leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm sm:text-lg font-bold text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-widest truncate">
                                            {company.industry || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 pt-2">
                                    <InfoTag label={t('company.name')} value={company.name} />
                                    <InfoTag label={t('company.industry')} value={company.industry} />
                                    <InfoTag label={t('company.founded_year')} value={company.foundedYear} />
                                    <InfoTag label={t('company.employee_count')} value={company.employeeCount} />
                                    <InfoTag label={t('form.city')} value={company.city} />
                                    <InfoTag label={t('form.district')} value={company.district} />
                                </div>
                                {company.address && <InfoTag label={t('company.address')} value={company.address} icon="fi fi-rr-marker" />}
                            </div>
                        </section>

                        {/* Contact & Social Section */}
                        <section>
                            <SectionTitle title={t('company.contact_section')} />
                            <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-4 pl-4">
                                {company.website && (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{t('company.website')}</span>
                                        <a 
                                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-center gap-2 px-1 py-0.5 hover:opacity-70 transition-all text-[#1f6d78] dark:text-[#2dd4bf]"
                                        >
                                            <i className="fi fi-rr-world text-sm"></i>
                                            <span className="text-xs sm:text-base font-bold truncate">{company.website}</span>
                                        </a>
                                    </div>
                                )}
                                {company.instagramUrl && (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Instagram</span>
                                        <a 
                                            href={company.instagramUrl.startsWith('http') ? company.instagramUrl : `https://${company.instagramUrl}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-center gap-2 px-1 py-0.5 hover:opacity-70 transition-all text-[#e4405f]"
                                        >
                                            <i className="fi fi-brands-instagram text-sm"></i>
                                            <span className="text-xs sm:text-base font-bold truncate">@instagram</span>
                                        </a>
                                    </div>
                                )}
                                {!company.website && !company.instagramUrl && (
                                    <p className="text-xs font-bold text-gray-400 italic">İletişim bilgisi paylaşılmadı.</p>
                                )}
                            </div>
                        </section>

                        {/* About Section */}
                        <section>
                            <SectionTitle title={t('company.about_section')} />
                            <div className="pt-2 pl-4">
                                {company.description ? (
                                    <p className="text-sm sm:text-base font-bold leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                        {company.description}
                                    </p>
                                ) : (
                                    <p className="text-xs sm:text-sm font-bold text-gray-400 italic">Şirket hakkında bilgi girilmedi.</p>
                                )}
                            </div>
                        </section>

                        {/* Footer Spacer */}
                        <div className="h-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileModal;
