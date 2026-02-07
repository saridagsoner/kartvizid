import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CV } from '../types';
import { LEGAL_CONTENT, LegalSection } from './LegalModal';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    popularProfessions: any[];
    popularCities: any[];
    weeklyTrends: any[];
    platformStats: any[];
    jobFinders: CV[];
    popularCVs: CV[]; // Most Viewed
    popularCompanies: any[]; // Employers
    onJobFinderClick: (cv: CV) => void;
    onCVClick: (cv: CV) => void;
    onCompanyClick: (company: any) => void;
    onFilterApply: (type: 'profession' | 'city', value: string) => void;
    user?: any; // To determine visibility of logged-in features
    onOpenSettings?: () => void;
    onLogout?: () => void;
}

const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
    isOpen,
    onClose,
    popularProfessions,
    popularCities,
    weeklyTrends,
    platformStats,
    jobFinders,
    popularCVs,
    popularCompanies,
    onJobFinderClick,
    onCVClick,
    onCompanyClick,
    onFilterApply,
    user,
    onOpenSettings = () => { },
    onLogout = () => { }
}) => {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState<'professions' | 'cities' | 'jobFinders' | 'stats' | 'companies' | 'mostViewed' | 'siteUsage' | 'dataPolicy' | 'mobileApp' | LegalSection | null>(null);

    if (!isOpen) return null;

    const MenuItem = ({ label, onClick, icon }: { label: string, onClick: () => void, icon: React.ReactNode }) => (
        <button
            onClick={onClick}
            className="w-full text-left py-4 flex items-center gap-3 group"
        >
            <div className="text-gray-900 dark:text-white group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">
                {icon}
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors rounded-font tracking-tight">
                {label}
            </span>
        </button>
    );

    const PageHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
        <div className="h-14 flex items-center justify-center relative border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
            <button
                onClick={onBack}
                className="absolute left-4 p-2 -ml-2 text-black dark:text-white"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white rounded-font tracking-tight">{title}</h3>
        </div>
    );

    // Full Screen Page Component
    const FullScreenPage = () => {
        if (!activeCategory) return null;

        let content = null;
        let title = "";

        switch (activeCategory) {
            case 'professions':
                title = t('sidebar.popular_professions');
                content = (
                    <div className="flex flex-col">
                        {popularProfessions.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onFilterApply('profession', item.label);
                                    onClose();
                                }}
                                className="w-full text-left py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <span className="font-bold text-gray-700 dark:text-gray-300 rounded-font">{item.label}</span>
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{item.count}</span>
                            </button>
                        ))}
                    </div>
                );
                break;
            case 'cities':
                title = t('sidebar.featured_cities');
                content = (
                    <div className="flex flex-col">
                        {popularCities.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onFilterApply('city', item.label);
                                    onClose();
                                }}
                                className="w-full text-left py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <span className="font-bold text-gray-700 dark:text-gray-300 rounded-font">{item.label}</span>
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{item.count}</span>
                            </button>
                        ))}
                    </div>
                );
                break;
            case 'jobFinders':
                title = t('sidebar.job_finders');
                content = (
                    <div className="flex flex-col">
                        {jobFinders.length > 0 ? (
                            jobFinders.map((cv) => (
                                <div
                                    key={cv.id}
                                    onClick={() => { onJobFinderClick(cv); onClose(); }}
                                    className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-800 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                        <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate rounded-font">{cv.name}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate rounded-font">{cv.profession}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic font-medium text-center py-8 rounded-font">{t('sidebar.no_job_finders')}</p>
                        )}
                    </div>
                );
                break;
            case 'stats':
                title = t('sidebar.platform_stats');
                content = (
                    <div className="flex flex-col p-4">
                        <div className="flex flex-col">
                            {platformStats.map((stat, i) => (
                                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 rounded-font">{stat.label}</span>
                                    <span className="text-base font-black text-[#1f6d78] dark:text-[#2dd4bf] rounded-font">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                break;
            case 'companies':
                title = t('sidebar.employers');
                content = (
                    <div className="flex flex-col">
                        {popularCompanies.length > 0 ? (
                            popularCompanies.map((company) => (
                                <div
                                    key={company.id}
                                    onClick={() => { onCompanyClick(company); onClose(); }}
                                    className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-800 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0 bg-white dark:bg-gray-800 flex items-center justify-center p-0.5">
                                        {company.logoUrl ? (
                                            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                                                <path d="M9 22v-4h6v4"></path>
                                                <path d="M8 6h.01"></path>
                                                <path d="M16 6h.01"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate rounded-font">{company.name}</p>
                                        <p className="text-xs text-gray-500 truncate rounded-font">{company.city || '-'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic font-medium text-center py-8 rounded-font">{t('sidebar.no_data')}</p>
                        )}
                    </div>
                );
                break;
            case 'siteUsage':
                title = "Site Kullanımı";
                content = (
                    <div className="flex flex-col">
                        {[
                            { label: 'Genel Koşullar', key: 'general' },
                            { label: 'Güvenlik İpuçları', key: 'security' },
                            { label: 'Sıkça Sorulan Sorular', key: 'faq' },
                            { label: 'Yardım Merkezi', key: 'help' },
                            { label: 'Hizmetlerimiz', key: 'services' }
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(item.key as LegalSection)}
                                className="w-full text-left py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <span className="font-bold text-gray-700 dark:text-gray-300 rounded-font group-hover:text-[#1f6d78] transition-colors">{item.label}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#1f6d78] transition-colors"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        ))}
                    </div>
                );
                break;
            case 'dataPolicy':
                title = "Veri Politikamız";
                content = (
                    <div className="flex flex-col">
                        {[
                            { label: 'Aydınlatma Metni', key: 'privacy' },
                            { label: 'Çerez Politikası', key: 'cookie' },
                            { label: 'KVKK Aydınlatma', key: 'kvkk' },
                            { label: 'Üyelik Sözleşmesi', key: 'membership' },
                            { label: 'Veri Sahibi Başvuru Formu', key: 'data_form' }
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(item.key as LegalSection)}
                                className="w-full text-left py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <span className="font-bold text-gray-700 dark:text-gray-300 rounded-font group-hover:text-[#1f6d78] transition-colors">{item.label}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#1f6d78] transition-colors"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        ))}
                    </div>
                );
                break;
            case 'mobileApp':
                title = "Mobil Uygulama";
                content = (
                    <div className="flex flex-col p-6 items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-[#1f6d78]">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 rounded-font">İş fırsatlarını cebinizden takip edin</h3>
                        <p className="text-gray-500 text-sm">Yakında App Store ve Google Play'de!</p>
                    </div>
                );
                break;
            case 'mostViewed':
                title = t('sidebar.most_viewed');
                content = (
                    <div className="flex flex-col">
                        {popularCVs.length > 0 ? (
                            popularCVs.map((cv) => (
                                <div
                                    key={cv.id}
                                    onClick={() => { onCVClick(cv); onClose(); }}
                                    className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-800 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                        <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate rounded-font">{cv.name}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate rounded-font">{cv.profession}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic font-medium text-center py-8 rounded-font">{t('sidebar.no_featured')}</p>
                        )}
                    </div>
                );
                break;
            default:
                // Check if it's a legal section
                if (activeCategory && activeCategory in LEGAL_CONTENT) {
                    const sectionData = LEGAL_CONTENT[activeCategory as LegalSection];
                    title = sectionData.title;
                    content = (
                        <div className="p-6">
                            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300">
                                {sectionData.content}
                            </div>
                        </div>
                    );
                } else {
                    return null;
                }
        }

        return (
            <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 animate-in slide-in-from-right duration-300 flex flex-col">
                <PageHeader title={title} onBack={() => setActiveCategory(null)} />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {content}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[150]"
                onClick={() => !activeCategory && onClose()}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"></div>
            </div>

            {/* Main Menu Drawer */}
            <div className={`fixed top-0 bottom-0 left-0 w-[80%] max-w-[300px] bg-white dark:bg-gray-900 z-[160] shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col ${activeCategory ? 'hidden' : ''}`}>
                {/* Header - Brand */}
                <div className="h-24 flex flex-col justify-center px-6 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900">
                    <div className="flex items-center text-[#2b2b2b] dark:text-white text-2xl font-bold tracking-tight rounded-font leading-none">
                        <span>Kartvizi</span>
                        <span className="inline-block ml-0.5 transform rotate-[12deg] origin-center text-[#1f6d78] font-black">d</span>
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold tracking-tight mt-0.5 lowercase">dijital cv & doğru eşleşme</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="flex flex-col space-y-2">
                        <MenuItem
                            label={t('sidebar.job_finders')}
                            onClick={() => setActiveCategory('jobFinders')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>}
                        />
                        <MenuItem
                            label={t('sidebar.popular_professions')}
                            onClick={() => setActiveCategory('professions')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>}
                        />
                        <MenuItem
                            label={t('sidebar.featured_cities')}
                            onClick={() => setActiveCategory('cities')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
                        />
                        <MenuItem
                            label={t('sidebar.employers')}
                            onClick={() => setActiveCategory('companies')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>}
                        />
                        <MenuItem
                            label={t('sidebar.most_viewed')}
                            onClick={() => setActiveCategory('mostViewed')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>}
                        />
                        <MenuItem
                            label={t('sidebar.platform_stats')}
                            onClick={() => setActiveCategory('stats')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>}
                        />
                        <MenuItem
                            label="Dijital CV Doğru Eşleşme"
                            onClick={() => { /* No action specified, or placeholder */ }}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1f6d78]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                        />

                        <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>

                        <MenuItem
                            label="Site Kullanımı"
                            onClick={() => setActiveCategory('siteUsage')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
                        />
                        <MenuItem
                            label="Veri Politikamız"
                            onClick={() => setActiveCategory('dataPolicy')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                        />
                        <MenuItem
                            label="Mobil Uygulama"
                            onClick={() => setActiveCategory('mobileApp')}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>}
                        />

                        {user && (
                            <>
                                <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>

                                <MenuItem
                                    label={t('profile.settings')}
                                    onClick={onOpenSettings}
                                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>}
                                />
                                <button
                                    onClick={onLogout}
                                    className="w-full text-left py-4 flex items-center gap-3 group"
                                >
                                    <div className="text-red-500 group-hover:text-red-600 transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    </div>
                                    <span className="text-base font-bold text-red-500 group-hover:text-red-600 transition-colors rounded-font tracking-tight">
                                        {t('profile.logout')}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer info maybe? */}

            </div>

            {/* Full Screen Sub-Page */}
            <FullScreenPage />
        </>
    );
};

export default MobileMenuDrawer;
