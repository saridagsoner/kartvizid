import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
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
    onGoHome
}) => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [activeCategory, setActiveCategory] = useState<'about' | 'professions' | 'cities' | 'jobFinders' | 'stats' | 'companies' | 'shops' | 'mostViewed' | 'siteUsage' | 'securityPrivacy' | 'dataPolicy' | 'mobileApp' | 'kartvizid' | 'premium' | LegalSection | null>(null);

    // Reset state when drawer closes
    React.useEffect(() => {
        if (!isOpen) {
            setActiveCategory(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const MenuItem = ({ label, onClick, icon, showChevron, isSubMenu }: { label: string, onClick: () => void, icon?: React.ReactNode, showChevron?: boolean, isSubMenu?: boolean }) => (
        <button
            onClick={onClick}
            className={`w-full text-left py-3.5 flex items-center justify-between group ${isSubMenu ? 'px-6 py-4' : ''}`}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0 pr-2">
                {icon && (
                    <div className="text-gray-900 dark:text-gray-100 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors flex items-center justify-center shrink-0 w-7 text-xl">
                        {icon}
                    </div>
                )}
                <span className={`${isSubMenu ? 'text-[16px]' : 'text-[17px]'} font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors tracking-tight truncate`}>
                    {label}
                </span>
            </div>
            {showChevron && (
                <div className="text-gray-400 dark:text-gray-600 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </div>
            )}
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
            case 'about':
                title = "Kartvizid Nedir?";
                content = (
                    <div className="flex flex-col p-5 pb-8">
                        <div className="text-center mb-8">
                            <span className="inline-block py-1 px-3 rounded-full bg-[#1f6d78]/10 text-[#1f6d78] text-[10px] font-bold mb-3 tracking-wide uppercase">
                                Ezber Bozan Model
                            </span>
                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
                                İş Aramayın, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1f6d78] to-[#2dd4bf]">
                                    Bırakın İş Sizi Bulsun.
                                </span>
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Diğer sitelerde binlerce ilana başvurup cevap beklemekten yoruldunuz mu?
                                Kartvizid'de işverenler ilan açamaz, sadece adayları arar.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative overflow-hidden">
                                <h4 className="text-base font-black text-gray-400 mb-1">Eski Yöntem</h4>
                                <p className="text-gray-500 text-xs font-medium mb-4">Klasik Kariyer Siteleri</p>
                                <ul className="space-y-2.5">
                                    <li className="flex items-start gap-2.5 text-gray-500 text-xs font-medium">
                                        <span className="shrink-0 text-red-400">✕</span>
                                        <span>İşveren ilan açar, kraldır.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-gray-500 text-xs font-medium">
                                        <span className="shrink-0 text-red-400">✕</span>
                                        <span>Binlerce kişi aynı ilana saldırır.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-gray-500 text-xs font-medium">
                                        <span className="shrink-0 text-red-400">✕</span>
                                        <span>Cevap bile alamazsınız.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#1f6d78] rounded-2xl p-5 text-white shadow-lg shadow-[#1f6d78]/20 group">
                                <h4 className="text-base font-black text-white mb-1">Kartvizid Yöntemi</h4>
                                <p className="text-white/70 text-xs font-medium mb-4">Değer Gören Adaylar</p>
                                <ul className="space-y-2.5">
                                    <li className="flex items-start gap-2.5 text-white/90 text-xs font-medium">
                                        <span className="shrink-0 text-[#2dd4bf]">✓</span>
                                        <span>İşveren sizi arar ve bulur.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-white/90 text-xs font-medium">
                                        <span className="shrink-0 text-[#2dd4bf]">✓</span>
                                        <span>İletişim bilgileriniz gizlidir.</span>
                                    </li>
                                    <li className="flex items-start gap-2.5 text-white/90 text-xs font-medium">
                                        <span className="shrink-0 text-[#2dd4bf]">✓</span>
                                        <span>Patron sizsiniz, onayla/reddet.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Workflow Compact */}
                        <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Nasıl Çalışır?</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-[#1f6d78]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-[13px] mb-0.5">1. Profilini Oluştur</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">Seni en iyi yansıtan dijital CV'ni hazırla.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-[#1f6d78]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-[13px] mb-0.5">2. Keşfedil</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">İşverenler kriterlerine uygunlukla seni bulur.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-[#1f6d78]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-[13px] mb-0.5">3. Gizliliğini Koru</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">İletişim izni verene kadar numaran/mailin gizlidir.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-[#1f6d78]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 text-[13px] mb-0.5">4. Karar Senin</h5>
                                    <p className="text-xs text-gray-500 leading-relaxed">İsteği onayla veya reddet.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <img src="/info-mockup.png" alt="Kartvizid Mobile App Mockup" className="w-full h-auto rounded-3xl" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        </div>
                    </div>
                );
                break;
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
                                className="w-full text-left py-3.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <span className="font-semibold text-[16px] text-gray-700 dark:text-gray-300">{item.label}</span>
                                <span className="text-[12px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">{item.count}</span>
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
                                className="w-full text-left py-3.5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <span className="font-semibold text-[16px] text-gray-700 dark:text-gray-300">{item.label}</span>
                                <span className="text-[12px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">{item.count}</span>
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
                                    className="flex items-center gap-3 py-3.5 border-b border-gray-100 dark:border-gray-800 px-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                        <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[15px] text-gray-900 dark:text-white truncate">{cv.name}</h4>
                                        <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate">{cv.profession}</p>
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
                        {/* Premium Header - Professional/Corporate feel */}
                        <div className="bg-white dark:bg-gray-900 px-6 py-12 text-center border-b border-gray-50 dark:border-gray-800">
                            <div className="w-20 h-20 bg-[#1f6d78]/5 dark:bg-[#2dd4bf]/5 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-[#1f6d78]/10 group">
                                <i className="fi fi-rr-briefcase text-4xl text-[#1f6d78] dark:text-[#2dd4bf] group-hover:scale-110 transition-transform"></i>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                                Güçlü Kadrolar, <br /> Büyük Hedefler
                            </h3>
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                Sektörün öncü firmalarıyla tanışın, kariyerinizde yeni bir kapı aralayın. Doğru yetenek, doğru şirketle burada buluşuyor.
                            </p>
                        </div>

                        <div className="pt-6">
                            {popularCompanies.length > 0 ? (
                                <div className="flex flex-col">
                                    <div className="px-6 mb-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Öne Çıkan Şirketler</h4>
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
                                    Tüm İş Verenleri Gör
                                </button>
                                
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="absolute w-full border-t border-gray-100 dark:border-gray-800"></div>
                                    <span className="relative px-3 bg-white dark:bg-gray-900 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">veya</span>
                                </div>

                                <button
                                    onClick={() => { onOpenAuth('signup', 'employer'); onClose(); }}
                                    className="w-full py-4 bg-white dark:bg-gray-800 text-[#1f6d78] dark:text-[#2dd4bf] border-2 border-[#1f6d78]/20 dark:border-[#2dd4bf]/20 rounded-[24px] font-black text-xs uppercase tracking-[0.15em] transition-all hover:bg-[#1f6d78]/5 active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm"
                                >
                                    <i className="fi fi-rr-briefcase-arrow-right text-lg"></i>
                                    İş Veren Kaydı Oluştur
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;
            case 'shops':
                title = "Hizmetler";
                content = (
                    <div className="flex flex-col pb-10">
                        {/* New Refined Header - White background, centered large title */}
                        <div className="bg-white dark:bg-gray-900 px-6 py-12 text-center border-b border-gray-50 dark:border-gray-800">
                            <div className="w-20 h-20 bg-[#1f6d78]/5 dark:bg-[#2dd4bf]/5 rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-[#1f6d78]/10 group">
                                <i className="fi fi-rr-shop text-4xl text-[#1f6d78] dark:text-[#2dd4bf] group-hover:scale-110 transition-transform"></i>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                                Profesyonel <br /> Hizmet Keşfi
                            </h3>
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                Ustalığını konuşturan uzmanlarla doğrudan iletişime geçin. Aracı yok, komisyon yok, sadece doğru eşleşme.
                            </p>
                        </div>
                        
                        <div className="pt-6">
                            {shops.length > 0 ? (
                                <div className="flex flex-col">
                                    <div className="px-6 mb-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Öne Çıkanlar</h4>
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
                                                <p className="text-[11px] text-gray-500 truncate rounded-font">{shop.category || 'Hizmet Sağlayıcı'}</p>
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
                                    Tüm Hizmetleri Keşfet
                                </button>
                                
                                <div className="relative flex items-center justify-center py-2">
                                    <div className="absolute w-full border-t border-gray-100 dark:border-gray-800"></div>
                                    <span className="relative px-3 bg-white dark:bg-gray-900 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">veya</span>
                                </div>

                                <button
                                    onClick={() => { onClose(); onOpenAuth('signup', 'shop'); }}
                                    className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] rounded-[20px] font-black text-xs uppercase tracking-[0.2em] transition-all hover:border-[#1f6d78]/30"
                                >
                                    Hizmet Vermeye Başla
                                </button>
                            </div>
                        </div>
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
                            { label: 'Hizmetlerimiz', key: 'services' },
                            { label: 'İletişim', key: 'iletisim' }
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
                title = "Mobil Uygulama";
                content = (
                    <div className="flex flex-col p-6 items-center text-center space-y-5">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#1f6d78] border border-gray-100">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                        </div>
                        <h3 className="text-[17px] font-bold text-gray-900 rounded-font leading-snug">İş fırsatlarını cebinizden takip edin</h3>
                        <p className="text-gray-500 text-[13px]">Yakında App Store ve Google Play'de!</p>
                    </div>
                );
                break;
            case 'kartvizid':
                title = t('menu.kartvizid');
                content = (
                    <div className="flex flex-col">
                        <MenuItem
                            label="Kartvizid Nedir?"
                            onClick={() => setActiveCategory('about')}
                            showChevron={true}
                            isSubMenu={true}
                        />
                        <MenuItem
                            label="Kartvizid'te İş Bulanlar"
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
                title = "Premium";
                content = (
                    <div className="flex flex-col p-6 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 rounded-[28px] flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] border border-[#1f6d78]/10 shadow-sm transition-transform duration-500 hover:scale-105">
                                <i className="fi fi-rr-membership-vip text-4xl"></i>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight uppercase">Geleceğin Kariyer Vizyonu</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-[13.5px] leading-relaxed max-w-[300px] mx-auto">
                                    Kartvizid Premium, hem adaylar hem de işverenler için sınırları ortadan kaldıran bir ekosistem olarak tasarlanıyor.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="px-4 mb-4">
                                    <span className="text-[10px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.3em]">Adaylar İçin</span>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { icon: 'fi-rr-star', title: 'Vitrin Özelliği', desc: 'Aramalarda en üstte görünün.' },
                                        { icon: 'fi-rr-badge-check', title: 'Pro Rozeti', desc: 'Profesyonelliğinizi kanıtlayın.' },
                                        { icon: 'fi-rr-palette', title: 'Özel Tasarım', desc: 'Profilinizi tarzınıza göre özelleştirin.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] shadow-sm">
                                                <i className={`fi ${item.icon} text-lg`}></i>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-[14px] font-black text-gray-900 dark:text-gray-100">{item.title}</h4>
                                                <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="px-4 mb-4">
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">İşverenler İçin</span>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { icon: 'fi-rr-filter', title: 'Gelişmiş Filtreleme', desc: 'Adayları saniyeler içinde bulun.' },
                                        { icon: 'fi-rr-messages', title: 'Sınırsız İletişim', desc: 'Adaylarla doğrudan bağlantı kurun.' },
                                        { icon: 'fi-rr-chart-line-up', title: 'Veri Analitiği', desc: 'Sektörel yetenek trendlerini izleyin.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start space-x-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-500/10">
                                            <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                                                <i className={`fi ${item.icon} text-lg`}></i>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="text-[14px] font-black text-gray-900 dark:text-gray-100">{item.title}</h4>
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
                               <span className="text-[10px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em]">Platform Gelişimi</span>
                           </div>
                           <p className="text-gray-600 dark:text-gray-300 text-[13px] font-bold relative z-10">
                               Kariyerinizi bir üst seviyeye taşımak için devrim niteliğinde yeniliklerle çok yakında buradayız.
                           </p>
                        </div>
                    </div>
                );
                break;
            case 'securityPrivacy':
                title = "Güvenlik ve Gizlilik";
                content = (
                    <div className="flex flex-col p-6 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-[28px] flex items-center justify-center text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20 shadow-sm transition-transform duration-500 hover:scale-105">
                                <i className="fi fi-rr-shield-check text-4xl"></i>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Verileriniz Bizimle Güvende</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-[13.5px] leading-relaxed max-w-[280px] mx-auto">
                                    Dijital dünyada güvenin ne kadar değerli olduğunu biliyoruz. Kartvizid olarak, kişisel bilgilerinizin korunmasını en büyük sorumluluğumuz olarak görüyoruz.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { icon: 'fi-rr-lock', title: 'Tam Veri Şifreleme', desc: 'Tüm bilgileriniz banka düzeyinde güvenlik protokolleri ile şifrelenir ve izinsiz erişimlere kapatılır.' },
                                { icon: 'fi-rr-user-lock', title: 'Gizlilik Taahhüdü', desc: 'Verileriniz reklam amaçlı asla satılmaz ve izniniz olmadan üçüncü taraflarla paylaşılmaz.' },
                                { icon: 'fi-rr-settings-sliders', title: 'Sizin Kontrolünüzde', desc: 'Hangi bilgilerinizi kimlerin göreceğine tamamen siz karar verirsiniz. Kontrol her zaman sizdedir.' },
                                { icon: 'fi-rr-cloud-check', title: 'Güvenli Altyapı', desc: 'Sunucularımız 7/24 siber saldırılara karşı taranır ve modern güvenlik duvarları ile korunur.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-4 p-4 transition-all duration-200">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400">
                                        <i className={`fi ${item.icon} text-lg`}></i>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[14.5px] font-bold text-gray-900 dark:text-gray-100 leading-none">{item.title}</h4>
                                        <p className="text-[12.5px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 p-5 rounded-[24px] border border-[#1f6d78]/10 text-center">
                            <p className="text-[#1f6d78] dark:text-[#2dd4bf] text-[13px] font-bold">
                                Şeffaf, dürüst ve güvenli bir kariyer yolculuğu için buradayız.
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
                                    onClick={() => { onCVClick(cv); onClose(); }}
                                    className="flex items-center gap-3 py-3.5 border-b border-gray-100 dark:border-gray-800 px-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
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
                // Check if it's a legal section
                if (activeCategory && activeCategory in LEGAL_CONTENT) {
                    const sectionData = LEGAL_CONTENT[activeCategory as LegalSection];
                    title = sectionData.title;
                    content = (
                        <div className="p-5">
                            <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300">
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
                            dijital cv & doğru eşleşme
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 pt-0 pb-4 custom-scrollbar">
                    <div className="flex flex-col space-y-1">
                        <MenuItem
                            label={t('menu.job_seekers')}
                            onClick={() => {
                                onGoHome();
                                onClose();
                            }}
                            icon={<i className="fi fi-rr-ballot"></i>}
                        />
                        <MenuItem
                            label="İş Verenler"
                            onClick={() => { onEmployersViewAll(); onClose(); }}
                            icon={<i className="fi fi-rr-building"></i>}
                        />
                        <MenuItem
                            label="Hizmetler"
                            onClick={() => { onShopsViewAll(); onClose(); }}
                            icon={<i className="fi fi-rr-shop"></i>}
                        />
                        <div className="my-1 border-t border-gray-50 dark:border-gray-800/30"></div>
                        <MenuItem
                            label="Kariyer Rehberi"
                            onClick={() => {
                                window.location.href = '/rehber';
                                onClose();
                            }}
                            icon={<i className="fi fi-rr-book-alt text-[#1f6d78] dark:text-[#2dd4bf]"></i>}
                        />
                        <MenuItem
                            label="Bize Ulaşın"
                            onClick={() => {
                                window.location.href = '/iletisim';
                                onClose();
                            }}
                            icon={<i className="fi fi-rr-envelope"></i>}
                        />

                        {isEmployer && (
                            <MenuItem
                                label="Kaydettiklerim"
                                onClick={onOpenSavedCVs}
                                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>}
                            />
                        )}
                        <MenuItem
                            label={t('menu.kartvizid')}
                            onClick={() => setActiveCategory('kartvizid')}
                            icon={<i className="fi fi-rr-document-signed"></i>}
                        />
                        <MenuItem
                            label="Premium"
                            onClick={() => setActiveCategory('premium')}
                            icon={<i className="fi fi-rr-membership-vip"></i>}
                        />
                        <MenuItem
                            label={t('profile.settings')}
                            onClick={onOpenSettings}
                            icon={<i className="fi fi-rr-settings"></i>}
                        />

                        <div className="my-3 border-t border-gray-100 dark:border-gray-800"></div>

                        <MenuItem
                            label="Site Kullanımı"
                            onClick={() => setActiveCategory('siteUsage')}
                            icon={<i className="fi fi-rr-browser"></i>}
                        />
                        <MenuItem
                            label="Güvenlik ve Gizlilik"
                            onClick={() => setActiveCategory('securityPrivacy')}
                            icon={<i className="fi fi-rr-shield-check"></i>}
                        />
                        <MenuItem
                            label="Veri Politikamız"
                            onClick={() => setActiveCategory('dataPolicy')}
                            icon={<i className="fi fi-rr-lock"></i>}
                        />
                        <MenuItem
                            label="Mobil Uygulama"
                            onClick={() => setActiveCategory('mobileApp')}
                            icon={<i className="fi fi-rr-mobile-button"></i>}
                        />

                        {user && (
                            <>
                                <div className="my-3 border-t border-gray-100 dark:border-gray-800"></div>


                                <button
                                    onClick={onLogout}
                                    className="w-full text-left py-3 flex items-center gap-3 group"
                                >
                                    <div className="text-red-500 group-hover:text-red-600 transition-colors flex items-center justify-center shrink-0 w-6">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    </div>
                                    <span className="text-[15px] font-black text-red-500 group-hover:text-red-600 transition-colors rounded-font tracking-tight">
                                        Çıkış Yap
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
