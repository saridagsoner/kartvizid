import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Company } from '../types';

interface CompanyProfileModalProps {
    company: Company;
    onClose: () => void;
    isInline?: boolean;
}

import SEO from './SEO';

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ company, onClose, isInline = false }) => {
    const { t } = useLanguage();

    console.log('CompanyProfileModal Rendered:', { companyId: company.id, userId: company.userId });

    const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
        <div className="mb-3 sm:mb-6 mt-5 sm:mt-10 first:mt-0">
            <h3 className="text-[12px] sm:text-[15px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em] border-l-4 border-[#1f6d78] dark:border-[#2dd4bf] pl-3 leading-none logo-font">{title}</h3>
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
                <span className={`text-xs sm:text-base font-bold ${value ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                    {value || 'Boş bırakılmış'}
                </span>
            </div>
        </div>
    );

    return (
        <div className={isInline ? "h-full flex flex-col bg-white dark:bg-[#0f172a] shadow-none border-none overflow-hidden" : "fixed inset-0 z-[250] flex sm:items-center sm:justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/30 sm:dark:bg-black/60"}>
            {!isInline && (
            <SEO
                title={`${company.name} - Şirket Profili`}
                description={company.description ? company.description.substring(0, 150) + '...' : `${company.name} şirketinin profilini inceleyin.`}
                image={company.logoUrl}
            />
            )}
            <div className={isInline ? "w-full h-full relative flex flex-col overflow-hidden" : "bg-white dark:bg-black w-full h-full sm:max-w-[800px] sm:h-[90vh] sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden border-none sm:border border-gray-100 dark:border-white/10"}>

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

                {/* Modal Body - A4 Paper Wrapper */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-black ${isInline ? 'px-4 py-8 sm:px-12 sm:py-16' : 'p-5 sm:p-10'}`}>
                    <div className={isInline ? "max-w-[800px] mx-auto bg-white dark:bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 sm:p-16 min-h-[1100px]" : "space-y-8 sm:space-y-12"}>
                    {/* Bölüm: Kurumsal Kimlik (Başlık kaldırıldı) */}
                    <section>
                        <div className="flex flex-col gap-8 pt-4">
                            {/* Left-aligned Logo Section */}
                            <div className="flex flex-row gap-6 items-start">
                                <div className="border border-dashed border-gray-300 dark:border-white/20 rounded-[2.3rem] sm:rounded-[3rem] p-1 w-fit">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                                    {company.logoUrl ? (
                                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-4"
                                             style={(() => {
                                                 const colors = [
                                                     { bg: '#1f6d7820', text: '#1f6d78' },
                                                     { bg: '#2dd4bf20', text: '#2dd4bf' },
                                                     { bg: '#f59e0b20', text: '#d97706' },
                                                     { bg: '#8b5cf620', text: '#7c3aed' },
                                                     { bg: '#ec489920', text: '#db2777' },
                                                     { bg: '#3b82f620', text: '#2563eb' },
                                                     { bg: '#10b98120', text: '#059669' },
                                                     { bg: '#ef444420', text: '#dc2626' },
                                                     { bg: '#6366f120', text: '#4f46e5' }
                                                 ];
                                                 const name = company.name || 'C';
                                                 let hash = 0;
                                                 for (let i = 0; i < name.length; i++) {
                                                     hash = name.charCodeAt(i) + ((hash << 5) - hash);
                                                 }
                                                 const color = colors[Math.abs(hash) % colors.length];
                                                 return { backgroundColor: color.bg, color: color.text };
                                             })()}>
                                            <span className="text-4xl sm:text-5xl font-black opacity-80 uppercase">
                                                {(company.name || 'C').charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <div className="flex-1 pt-2 sm:pt-4">
                                    <h1 className="text-xl sm:text-3xl font-black text-black dark:text-white leading-tight tracking-tight mb-1 sm:mb-2">{company.name}</h1>
                                    <p className="text-xs sm:text-base font-bold text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-widest">{company.industry || '-'}</p>
                                </div>
                            </div>

                            <div className="flex-1 w-full space-y-6">
                                <div className="grid grid-cols-2 gap-x-3 gap-y-4 min-w-0">
                                    <InfoTag label={t('company.name')} value={company.name} />
                                    <InfoTag label={t('company.industry')} value={company.industry} />
                                    <InfoTag label={t('company.founded_year')} value={company.foundedYear?.toString()} />
                                    <InfoTag label={t('company.employee_count')} value={company.employeeCount} />
                                    <InfoTag label={t('form.city')} value={company.city} />
                                    <InfoTag label={t('form.district')} value={company.district} />
                                    <InfoTag label={t('company.country')} value={company.country} />
                                </div>
                                {company.address && <InfoTag label={t('company.address')} value={company.address} />}
                            </div>
                        </div>
                    </section>

                    <section>
                        <SectionTitle title={t('company.contact_section')} />
                        <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-4">
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
                                                <span className="text-xs sm:text-base font-bold text-[#1f6d78] dark:text-[#2dd4bf] truncate">{company.website}</span>
                                            </a>
                                        );
                                    })()}
                                </div>
                            )}
                            {!company.website && <InfoTag label={t('company.website')} value={undefined} />}

                            {company.instagramUrl && (
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Instagram</span>
                                    <a href={company.instagramUrl.startsWith('http') ? company.instagramUrl : `https://${company.instagramUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-3 px-1 py-0.5 hover:opacity-70 transition-all group">
                                        <span className="text-[10px] sm:text-sm text-[#e4405f]">
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z"/></svg>
                                        </span>
                                        <span className="text-xs sm:text-base font-bold text-[#e4405f] truncate">Instagram</span>
                                    </a>
                                </div>
                            )}
                            {!company.instagramUrl && <InfoTag label="Instagram" value={undefined} />}
                        </div>
                    </section>

                    <section>
                        <SectionTitle title={t('company.about_section')} />
                        {(() => {
                            const desc = company.description?.trim();
                            const website = company.website?.trim();
                            
                            const isOnlyWebsite = (d: string | undefined, w: string | undefined) => {
                                if (!d) return true;
                                if (!w) return false;
                                const clean = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
                                return clean(d) === clean(w);
                            };
                            
                            const showEmpty = !desc || isOnlyWebsite(desc, website);
                            
                            return (
                                <div className={`px-1 text-xs sm:text-base font-bold leading-relaxed pt-2 ${!showEmpty ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600 italic'}`}>
                                     {!showEmpty ? desc : 'Boş bırakılmış'}
                                </div>
                            );
                        })()}
                    </section>

                    </div>
                </div>
                
                {/* Content Padding Bottom */}
                <div className="pb-10"></div>
            </div>
        </div>
    );
};

export default CompanyProfileModal;
