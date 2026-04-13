import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { CV } from '../types';
import { useLegalContent, LegalSection } from './LegalModal';

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
    shops: any[]; // Hizmetler
    onJobFinderClick: (cv: CV) => void;
    onCVClick: (cv: CV) => void;
    onCompanyClick: (company: any) => void;
    onShopClick: (shop: any) => void;
    onShopsViewAll: () => void;
    onEmployersViewAll: () => void;
    onFilterApply: (type: 'profession' | 'city', value: string) => void;
    user?: any; // To determine visibility of logged-in features
    isEmployer?: boolean; // More robust check than user_metadata
    onOpenSettings?: () => void;
    onOpenSavedCVs?: () => void;
    onLogout?: () => void;
    onOpenAuth?: (mode: 'signin' | 'signup', role?: string) => void;
    onGoHome: () => void;
    unreadMessageCount?: number;
    notificationCount?: number;
    isAuthModalOpen?: boolean;
    onCloseAuth?: () => void;
    authMode?: 'signin' | 'signup' | 'reset';
    authRole?: 'job_seeker' | 'employer' | 'shop';
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
    shops,
    onJobFinderClick,
    onCVClick,
    onCompanyClick,
    onShopClick,
    onShopsViewAll,
    onEmployersViewAll,
    onFilterApply,
    user,
    isEmployer = false,
    onOpenSettings = () => { },
    onOpenSavedCVs = () => { },
    onLogout = () => { },
    onOpenAuth,
    onGoHome,
    unreadMessageCount = 0,
    notificationCount = 0,
    isAuthModalOpen,
    onCloseAuth,
    authMode,
    authRole
}) => {
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const legalData = useLegalContent();
    const [activeCategory, setActiveCategory] = useState<'about' | 'professions' | 'cities' | 'jobFinders' | 'stats' | 'companies' | 'shops' | 'mostViewed' | 'siteUsage' | 'securityPrivacy' | 'dataPolicy' | 'mobileApp' | 'kartvizid' | 'premium' | LegalSection | null>(null);

    // Reset state when drawer closes
    React.useEffect(() => {
        if (!isOpen) {
            setActiveCategory(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const MenuItem = ({ label, onClick, icon, showChevron, isSubMenu, badge }: { label: string, onClick: () => void, icon?: React.ReactNode, showChevron?: boolean, isSubMenu?: boolean, badge?: string }) => (
        <button
            onClick={onClick}
            className={`w-full text-left py-4 flex items-center justify-between group active:bg-gray-50 dark:active:bg-white/[0.02] transition-all ${isSubMenu ? 'px-6 py-4' : ''}`}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
                {icon && (
                    <div className="text-black dark:text-gray-100 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors flex items-center justify-center shrink-0 w-8 text-xl font-black">
                        {icon}
                    </div>
                )}
                <span className={`${isSubMenu ? 'text-[15px]' : 'text-[16px]'} font-black text-black dark:text-gray-100 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors tracking-tight truncate`}>
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-3">
                {badge && (
                    <span className="bg-[#1f6d78] text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                        {badge}
                    </span>
                )}
                {showChevron && (
                    <div className="text-gray-400 dark:text-gray-600 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </div>
                )}
            </div>
        </button>
    );

    const PageHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
        <div className="h-20 flex items-center justify-start relative bg-white dark:bg-gray-900 shrink-0 px-6">
            <button
                onClick={onBack}
                className="mr-3 p-2 -ml-2 text-gray-900 dark:text-white"
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <h3 className="font-black text-[22px] text-gray-900 dark:text-white tracking-tighter">{title}</h3>
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
                            <div
                                key={idx}
                                className="w-full text-left py-3.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                onClick={() => { onFilterApply('profession', item.label); onClose(); }}
                            >
                                <span className="font-semibold text-[16px] text-gray-700 dark:text-gray-300">{item.label}</span>
                                <span className="text-[12px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">{item.count}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'cities':
                title = t('sidebar.featured_cities');
                content = (
                    <div className="flex flex-col">
                        {popularCities.map((item, idx) => (
                            <div
                                key={idx}
                                className="w-full text-left py-3.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                onClick={() => { onFilterApply('city', item.label); onClose(); }}
                            >
                                <span className="font-semibold text-[16px] text-gray-700 dark:text-gray-300">{item.label}</span>
                                <span className="text-[12px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">{item.count}</span>
                            </div>
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
                                    className="flex items-center gap-3 py-3.5 border-b border-gray-100 dark:border-gray-800 px-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="w-[36px] h-[44px] rounded-[10px] bg-gray-100 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                        <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-[15px] text-gray-900 dark:text-white truncate tracking-tight">{cv.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate font-semibold uppercase tracking-wider">{cv.profession}</p>
                                            {(cv.isPlaced || cv.workingStatus === 'active') && (
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">{t('common.job_found')}</span>
                                            )}
                                        </div>
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
                    <div className="flex flex-col p-2">
                        <div className="flex flex-col">
                            {platformStats.map((stat, i) => (
                                <div key={i} className="flex justify-between items-center py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-0 px-4">
                                    <span className="text-[16px] font-semibold text-gray-700 dark:text-gray-300">{stat.label}</span>
                                    <span className="text-[16px] font-black text-[#1f6d78] dark:text-[#2dd4bf]">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                break;
            case 'companies':
                title = t('sidebar.employers');
                content = (
                    <div className="flex flex-col pb-10">
                        <div className="bg-white dark:bg-gray-900 px-6 py-12 text-center border-b border-gray-50 dark:border-gray-800">
                            <div className="w-20 h-20 bg-[#1f6d78]/5 dark:bg-[#2dd4bf]/5 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-[#1f6d78]/10 group">
                                <i className="fi fi-rr-briefcase text-4xl text-[#1f6d78] dark:text-[#2dd4bf] group-hover:scale-110 transition-transform"></i>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                                {t('companies.title')}
                            </h3>
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                {t('companies.desc')}
                            </p>
                        </div>

                        <div className="pt-6">
                            {popularCompanies.length > 0 ? (
                                <div className="flex flex-col">
                                    <div className="px-6 mb-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('companies.featured')}</h4>
                                    </div>
                                    {popularCompanies.slice(0, 5).map((company) => (
                                        <div
                                            key={company.id}
                                            onClick={() => { onCompanyClick(company); onClose(); }}
                                            className="flex items-center gap-3 py-3.5 border-b border-gray-50 dark:border-gray-800 px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] border border-gray-100 dark:border-gray-700 shrink-0">
                                                {company.logoUrl ? (
                                                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
                                                ) : (
                                                    <i className="fi fi-rr-briefcase text-xl"></i>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-gray-900 dark:text-white truncate rounded-font">{company.name}</p>
                                                <p className="text-[11px] text-gray-500 truncate rounded-font">{company.city || '-'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <div className="p-6 flex flex-col gap-4">
                                <button
                                    onClick={() => { onEmployersViewAll(); onClose(); }}
                                    className="w-full py-4 bg-[#1f6d78] text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#1f6d78]/20 transition-all hover:bg-[#155e68] active:scale-[0.98]"
                                >
                                    {t('companies.view_all')}
                                </button>
                                
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="absolute w-full border-t border-gray-100 dark:border-gray-800"></div>
                                    <span className="relative px-3 bg-white dark:bg-gray-900 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{t('auth.or')}</span>
                                </div>

                                <button
                                    onClick={() => { onOpenAuth('signup', 'employer'); onClose(); }}
                                    className="w-full py-4 bg-white dark:bg-gray-800 text-[#1f6d78] dark:text-[#2dd4bf] border-2 border-[#1f6d78]/20 dark:border-[#2dd4bf]/20 rounded-[24px] font-black text-xs uppercase tracking-[0.15em] transition-all hover:bg-[#1f6d78]/5 active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm"
                                >
                                    <i className="fi fi-rr-briefcase-arrow-right text-lg"></i>
                                    {t('companies.register')}
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;
            case 'shops':
                title = t('menu.services');
                content = (
                    <div className="flex flex-col pb-10">
                        <div className="bg-white dark:bg-gray-900 px-6 py-12 text-center border-b border-gray-50 dark:border-gray-800">
                            <div className="w-20 h-20 bg-[#1f6d78]/5 dark:bg-[#2dd4bf]/5 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-[#1f6d78]/10 group">
                                <i className="fi fi-rr-shop text-4xl text-[#1f6d78] dark:text-[#2dd4bf] group-hover:scale-110 transition-transform"></i>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                                {t('services.title')}
                            </h3>
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                {t('services.desc')}
                            </p>
                        </div>
                        
                        <div className="pt-6">
                            {shops.length > 0 ? (
                                <div className="flex flex-col">
                                    <div className="px-6 mb-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('services.featured')}</h4>
                                    </div>
                                    {shops.slice(0, 5).map((shop) => (
                                        <div
                                            key={shop.id}
                                            onClick={() => { onShopClick(shop); onClose(); }}
                                            className="flex items-center gap-3 py-3.5 border-b border-gray-50 dark:border-gray-800 px-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] border border-gray-100 dark:border-gray-700 shrink-0">
                                                <i className="fi fi-rr-shop text-xl"></i>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm text-gray-900 dark:text-white truncate rounded-font">{shop.name}</p>
                                                <p className="text-[11px] text-gray-500 truncate rounded-font">{shop.category || t('nav.service_provider')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <div className="p-6 flex flex-col gap-4">
                                <button
                                    onClick={() => { onShopsViewAll(); onClose(); }}
                                    className="w-full py-4 bg-[#1f6d78] text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#1f6d78]/20 transition-all hover:bg-[#155e68] active:scale-[0.98]"
                                >
                                    {t('services.view_all')}
                                </button>
                                
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="absolute w-full border-t border-gray-100 dark:border-gray-800"></div>
                                    <span className="relative px-3 bg-white dark:bg-gray-900 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{t('auth.or')}</span>
                                </div>

                                <button
                                    onClick={() => { onClose(); onOpenAuth('signup', 'shop'); }}
                                    className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] rounded-[20px] font-black text-xs uppercase tracking-[0.2em] transition-all hover:border-[#1f6d78]/30"
                                >
                                    {t('services.start')}
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;
            case 'siteUsage':
                title = t('footer.usage');
                content = (
                    <div className="flex flex-col">
                        {[
                            { label: t('footer.general_terms'), key: 'general' },
                            { label: t('footer.security'), key: 'security' },
                            { label: t('footer.faq'), key: 'faq' },
                            { label: t('footer.help'), key: 'help' },
                            { label: t('footer.services'), key: 'services' },
                            { label: t('footer.iletisim'), key: 'iletisim' }
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(item.key as LegalSection)}
                                className="w-full text-left py-3.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <span className="font-semibold text-[16px] text-gray-700 dark:text-gray-300 group-hover:text-[#1f6d78] transition-colors">{item.label}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#1f6d78] transition-colors"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        ))}
                    </div>
                );
                break;
            case 'dataPolicy':
                title = t('footer.data_policy');
                content = (
                    <div className="flex flex-col">
                        {[
                            { label: t('footer.privacy_policy'), key: 'privacy' },
                            { label: t('footer.cookie_policy'), key: 'cookie' },
                            { label: t('footer.kvkk'), key: 'kvkk' },
                            { label: t('footer.membership_agreement'), key: 'membership' },
                            { label: t('footer.data_owner_form'), key: 'data_form' }
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(item.key as LegalSection)}
                                className="w-full text-left py-3.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                            >
                                <span className="font-semibold text-[16px] text-gray-700 dark:text-gray-300 group-hover:text-[#1f6d78] transition-colors">{item.label}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#1f6d78] transition-colors"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        ))}
                    </div>
                );
                break;
            case 'mobileApp':
                title = t('footer.mobile_app');
                content = (
                    <div className="flex flex-col p-6 items-center text-center space-y-5">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-[#1f6d78] border border-gray-100">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                        </div>
                        <h3 className="text-[17px] font-bold text-gray-900 rounded-font leading-snug">{t('footer.mobile_desc')}</h3>
                        <p className="text-gray-500 text-[13px]">{t('common.coming_soon')}</p>
                    </div>
                );
                break;
            case 'kartvizid':
                title = t('menu.kartvizid');
                content = (
                    <div className="flex flex-col">
                        <MenuItem
                            label={t('sidebar.job_finders')}
                            onClick={() => setActiveCategory('jobFinders')}
                            showChevron={true}
                            isSubMenu={true}
                        />
                        <MenuItem
                            label={t('sidebar.popular_professions')}
                            onClick={() => setActiveCategory('professions')}
                            showChevron={true}
                            isSubMenu={true}
                        />
                        <MenuItem
                            label={t('sidebar.featured_cities')}
                            onClick={() => setActiveCategory('cities')}
                            showChevron={true}
                            isSubMenu={true}
                        />
                        <MenuItem
                            label={t('sidebar.most_viewed')}
                            onClick={() => setActiveCategory('mostViewed')}
                            showChevron={true}
                            isSubMenu={true}
                        />
                        <MenuItem
                            label={t('sidebar.platform_stats')}
                            onClick={() => setActiveCategory('stats')}
                            showChevron={true}
                            isSubMenu={true}
                        />
                    </div>
                );
                break;
            case 'premium':
                title = t('menu.premium');
                content = (
                    <div className="flex flex-col p-6 pb-20 space-y-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 rounded-[28px] flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] border border-[#1f6d78]/10 shadow-sm transition-transform duration-500 hover:scale-105">
                                <i className="fi fi-rr-membership-vip text-4xl"></i>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight uppercase font-outfit">{t('premium.page_title')}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-[13.5px] leading-relaxed max-w-[300px] mx-auto">
                                    {t('premium.page_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="px-4 mb-4">
                                    <span className="text-[10px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.3em] font-outfit">{t('premium.for_candidates')}</span>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { icon: 'fi-rr-star', title: t('premium.item_vitrin'), desc: t('premium.item_vitrin_desc') },
                                        { icon: 'fi-rr-badge-check', title: t('premium.item_badge'), desc: t('premium.item_badge_desc') },
                                        { icon: 'fi-rr-palette', title: t('premium.item_design'), desc: t('premium.item_design_desc') }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] shadow-sm">
                                                <i className={`fi ${item.icon} text-lg`}></i>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-[14px] font-black text-gray-900 dark:text-gray-100 font-outfit">{item.title}</h4>
                                                <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="px-4 mb-4">
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] font-outfit">{t('premium.for_employers')}</span>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { icon: 'fi-rr-filter', title: t('premium.item_filter'), desc: t('premium.item_filter_desc') },
                                        { icon: 'fi-rr-messages', title: t('premium.item_unlimited'), desc: t('premium.item_unlimited_desc') },
                                        { icon: 'fi-rr-chart-line-up', title: t('premium.item_analytics'), desc: t('premium.item_analytics_desc') }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start space-x-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-500/10">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                                                <i className={`fi ${item.icon} text-lg`}></i>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-[14px] font-black text-gray-900 dark:text-gray-100 font-outfit">{item.title}</h4>
                                                <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f6d78]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                           <div className="flex items-center justify-center gap-2 mb-2">
                               <span className="w-1.5 h-1.5 rounded-full bg-[#1f6d78] dark:bg-[#2dd4bf] animate-pulse"></span>
                               <span className="text-[10px] font-black text-[#1f6d78] dark:bg-[#2dd4bf] uppercase tracking-[0.2em] font-outfit">{t('premium.evolution')}</span>
                           </div>
                           <p className="text-gray-600 dark:text-gray-300 text-[13px] font-bold relative z-10 leading-relaxed">
                               {t('premium.evolution_desc')}
                           </p>
                        </div>
                    </div>
                );
                break;
            case 'securityPrivacy':
                title = t('footer.security');
                content = (
                    <div className="flex flex-col p-6 pb-20 space-y-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-[28px] flex items-center justify-center text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20 shadow-sm transition-transform duration-500 hover:scale-105">
                                <i className="fi fi-rr-shield-check text-4xl"></i>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight font-outfit">{t('security.page_title')}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-[13.5px] leading-relaxed max-w-[280px] mx-auto">
                                    {t('security.page_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { icon: 'fi-rr-lock', title: t('security.item_encrypt'), desc: t('security.item_encrypt_desc') },
                                { icon: 'fi-rr-user-lock', title: t('security.item_privacy'), desc: t('security.item_privacy_desc') },
                                { icon: 'fi-rr-settings-sliders', title: t('security.item_control'), desc: t('security.item_control_desc') },
                                { icon: 'fi-rr-cloud-check', title: t('security.item_infra'), desc: t('security.item_infra_desc') }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-4 p-4 transition-all duration-200">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                                        <i className={`fi ${item.icon} text-lg`}></i>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[14.5px] font-bold text-gray-900 dark:text-gray-100 leading-none font-outfit">{item.title}</h4>
                                        <p className="text-[12.5px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 p-5 rounded-[24px] border border-[#1f6d78]/10 text-center">
                            <p className="text-[#1f6d78] dark:text-[#2dd4bf] text-[13px] font-bold">
                                {t('security.footer')}
                            </p>
                        </div>
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
                                    className="flex items-center gap-3 py-3.5 border-b border-gray-100 dark:border-gray-800 px-5"
                                >
                                    <div className="w-[36px] h-[44px] rounded-[10px] bg-gray-100 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                        <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate rounded-font">{cv.name}</h4>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate rounded-font">{cv.profession}</p>
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
                // Check if it's a legal section or about
                if (activeCategory === 'about' || (activeCategory && activeCategory in legalData)) {
                    const sectionData = activeCategory === 'about' ? { title: t('about.title'), content: t('about.desc') } : legalData[activeCategory as LegalSection];
                    title = sectionData.title;
                    content = (
                        <div className="p-5">
                            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300">
                                {sectionData.content}
                            </div>
                        </div>
                    );
                } else {
                    return null;
                }
        }

        return (
            <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 flex flex-col">
                <PageHeader title={title} onBack={() => { 
                    if (['professions', 'cities', 'mostViewed', 'stats', 'jobFinders', 'about'].includes(activeCategory as string)) {
                        setActiveCategory('kartvizid');
                    } else if (activeCategory === 'kartvizid') {
                        setActiveCategory(null);
                    } else {
                        setActiveCategory(null);
                        onClose();
                    }
                }} />
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
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            </div>

            <div className={`fixed top-0 bottom-0 left-0 w-[75%] max-w-[280px] bg-white dark:bg-gray-900 z-[160] shadow-2xl flex flex-col ${activeCategory ? 'hidden' : ''}`}>
                {/* Header - Brand */}
                <div className="h-[72px] flex flex-col justify-center px-6 shrink-0 bg-white dark:bg-gray-900 pb-2">
                    <div 
                        className="flex flex-col w-max cursor-pointer active:scale-95 transition-transform"
                        onClick={() => {
                            onGoHome();
                            onClose();
                        }}
                    >
                        <div className="flex items-center text-[#2b2b2b] dark:text-white text-[28px] font-extrabold rounded-font tracking-tight leading-none mb-0.5">
                            <span>Kartvizi</span>
                            <span className="inline-block transform rotate-[12deg] origin-center text-[#1f6d78] font-black w-[13px] ml-0.5 -mt-0.5">d</span>
                        </div>
                        <span className="text-[10px] text-[#9ca3af] dark:text-gray-500 font-bold lowercase tracking-normal pl-[2px] pr-1">
                            {t('nav.tagline')}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 pt-0 pb-4 custom-scrollbar">
                    <div className="flex flex-col space-y-1">
                        <MenuItem
                            label={t('menu.job_seekers')}
                            onClick={() => { onGoHome(); onClose(); }}
                            icon={<i className="fi fi-rr-users"></i>}
                        />
                        <MenuItem
                            label={t('menu.employers')}
                            onClick={() => { onEmployersViewAll(); onClose(); }}
                            icon={<i className="fi fi-rr-briefcase"></i>}
                        />
                        <MenuItem
                            label={t('menu.services')}
                            onClick={() => { onShopsViewAll(); onClose(); }}
                            icon={<i className="fi fi-rr-shop"></i>}
                        />
                        
                        <div className="my-2 border-t border-gray-100 dark:border-white/5"></div>

                        <MenuItem
                            label={t('menu.career_guide')}
                            onClick={() => { navigate('/rehber'); onClose(); }}
                            icon={<i className="fi fi-rr-book-alt"></i>}
                        />
                        <MenuItem
                            label={t('menu.kartvizid')}
                            onClick={() => setActiveCategory('kartvizid')}
                            icon={<i className="fi fi-rr-document-signed"></i>}
                            showChevron
                        />

                        <MenuItem
                            label={t('menu.messages')}
                            onClick={() => { navigate('/mesajlar'); onClose(); }}
                            icon={<i className="fi fi-rr-comment"></i>}
                            badge={unreadMessageCount > 0 ? unreadMessageCount.toString() : undefined}
                        />

                        <MenuItem
                            label={t('menu.notifications')}
                            onClick={() => { navigate('/bildirimler'); onClose(); }}
                            icon={<i className="fi fi-rr-bell"></i>}
                            badge={notificationCount > 0 ? notificationCount.toString() : undefined}
                        />

                        {isEmployer && (
                            <MenuItem
                                label={t('menu.saved')}
                                onClick={() => { onOpenSavedCVs(); onClose(); }}
                                icon={<i className="fi fi-rr-bookmark"></i>}
                            />
                        )}

                        <MenuItem
                            label={t('menu.premium')}
                            onClick={() => setActiveCategory('premium')}
                            icon={<i className="fi fi-rr-membership-vip"></i>}
                        />

                        <div className="my-2 border-t border-gray-100 dark:border-white/5"></div>

                        <MenuItem
                            label={t('menu.settings')}
                            onClick={() => { onOpenSettings(); onClose(); }}
                            icon={<i className="fi fi-rr-settings"></i>}
                        />

                        <MenuItem
                            label={t('menu.corporate')}
                            onClick={() => { window.location.href = '/iletisim'; onClose(); }}
                            icon={<i className="fi fi-rr-info"></i>}
                        />

                        <div className="mt-auto pt-8">
                            {!user ? (
                                <button
                                    onClick={() => { onOpenAuth?.('signin'); onClose(); }}
                                    className="w-full bg-[#1f6d78] text-white py-4 rounded-2xl font-black text-sm active:scale-[0.98] transition-all shadow-xl shadow-[#1f6d78]/10 flex items-center justify-center gap-3"
                                >
                                    <i className="fi fi-rr-sign-in-alt text-lg"></i>
                                    {t('auth.login')}
                                </button>
                            ) : (
                                <button
                                    onClick={() => { onLogout(); onClose(); }}
                                    className="w-full bg-white dark:bg-transparent text-black dark:text-white py-4 rounded-2xl font-black text-sm border-2 border-black dark:border-white/20 active:bg-gray-50 dark:active:bg-white/5 transition-all flex items-center justify-center gap-3"
                                >
                                    <i className="fi fi-rr-sign-out-alt text-lg"></i>
                                    {t('profile.logout')}
                                </button>
                            )}
                        </div>
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
