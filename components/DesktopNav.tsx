
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

import { CV } from '../types';
import { JobFinderSkeleton, StatsSkeleton } from './Skeleton';

interface DesktopNavProps {
    viewMode: 'cvs' | 'employers' | 'shops';
    onViewModeChange: (mode: 'cvs' | 'employers' | 'shops') => void;
    user?: any;
    isEmployer?: boolean;
    onOpenAuth?: (mode: 'signin' | 'signup', role?: string) => void;
    onSignOut?: () => void;
    onOpenSavedCVs?: () => void;
    // Discovery Data
    popularProfessions?: Array<{ label: string; count: number }>;
    popularCities?: Array<{ label: string; count: number }>;
    platformStats?: Array<{ label: string; value: string }>;
    jobFinders?: CV[];
    onCVClick?: (cv: CV) => void;
    loading?: boolean;
    unreadMessageCount?: number;
    notificationCount?: number;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
    viewMode,
    onViewModeChange,
    user,
    isEmployer,
    onOpenAuth,
    onSignOut,
    onOpenSavedCVs,
    popularProfessions = [],
    popularCities = [],
    platformStats = [],
    jobFinders = [],
    onCVClick,
    loading = false,
    unreadMessageCount = 0,
    notificationCount = 0
}) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [isKartvizidOpen, setIsKartvizidOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;
    const isModeActive = (mode: string) => {
        if (mode === 'cvs') return location.pathname === '/' || location.pathname === '' || location.pathname.startsWith('/cv/');
        if (mode === 'employers') return location.pathname === '/is-verenler' || location.pathname.startsWith('/company/');
        if (mode === 'shops') return location.pathname === '/hizmetler';
        return false;
    };

    const NavItem = ({ label, icon, onClick, active, badge, hasChildren, isOpen }: { label: string, icon: string, onClick: () => void, active?: boolean, badge?: string, hasChildren?: boolean, isOpen?: boolean }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between pl-4 pr-4 py-3 rounded-2xl transition-all duration-300 group mb-1 overflow-visible ${
                active 
                ? 'text-black dark:text-white' 
                : 'text-black dark:text-gray-200 hover:bg-gray-50/10 dark:hover:bg-gray-800/10'
            }`}
        >
            <div className="flex items-center gap-3 overflow-visible">
                <div className="w-8 flex items-center justify-center flex-shrink-0 overflow-visible">
                    <i className={`fi ${active ? icon.replace('fi-rr-', 'fi-sr-') : icon} transition-all duration-300 group-hover:scale-110 ${
                        active 
                        ? 'text-xl text-black dark:text-white font-black' 
                        : 'text-lg text-black dark:text-gray-300 font-medium'
                    }`}></i>
                </div>
                <span className={`tracking-tight transition-all duration-300 truncate ${
                    active 
                    ? 'text-[15px] font-black text-black dark:text-white' 
                    : 'text-[14px] font-medium text-black dark:text-gray-200'
                }`}>{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {badge && (
                    <span className="bg-[#1f6d78] text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                        {badge}
                    </span>
                )}
                {hasChildren && (
                    <i className={`fi fi-rr-angle-small-down transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}></i>
                )}
            </div>
        </button>
    );

    const SubNavItem = ({ label, onClick, active }: { label: string, onClick: () => void, active?: boolean }) => (
        <button
            onClick={onClick}
            className={`w-[calc(100%-24px)] ml-6 flex items-center px-4 py-2 rounded-xl transition-all duration-200 mb-0.5 group overflow-hidden ${
                active 
                ? 'bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white font-bold' 
                : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
            }`}
        >
            <span className="text-[13px] leading-none transform translate-y-[1px] truncate">{label}</span>
        </button>
    );



    return (
        <div className="flex flex-col h-full pt-8 pb-8 lg:pl-4 xl:pl-8 pr-0 no-scrollbar overflow-y-auto">
            {/* Main Navigation */}
            <NavItem 
                label="İş Arayanlar" 
                icon="fi-rr-users" 
                active={isModeActive('cvs')}
                onClick={() => {
                    navigate('/');
                }}
            />
            <NavItem 
                label="İş Verenler" 
                icon="fi-rr-briefcase" 
                active={isModeActive('employers')}
                onClick={() => {
                    navigate('/is-verenler');
                }}
            />
            <NavItem 
                label="Hizmetler" 
                icon="fi-rr-shop" 
                active={isModeActive('shops')}
                onClick={() => {
                    navigate('/hizmetler');
                }}
            />

            <div className="my-2 border-t border-gray-200/70 dark:border-white/10"></div>


            <NavItem 
                label="Kariyer Rehberi" 
                icon="fi-rr-book-alt" 
                active={location.pathname.startsWith('/rehber')}
                onClick={() => navigate('/rehber')}
            />
            <NavItem 
                label="Kartvizid" 
                icon="fi-rr-document-signed" 
                active={isKartvizidOpen || location.pathname.startsWith('/kartvizid/')}
                onClick={() => setIsKartvizidOpen(!isKartvizidOpen)}
                hasChildren
                isOpen={isKartvizidOpen}
            />

            {isKartvizidOpen && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300 space-y-0.5">
                    <SubNavItem 
                        label={t('sidebar.job_finders')} 
                        onClick={() => navigate('/kartvizid/is-bulanlar')} 
                        active={location.pathname.startsWith('/kartvizid/is-bulanlar')} 
                    />
                    <SubNavItem 
                        label={t('sidebar.popular_professions')} 
                        onClick={() => navigate('/kartvizid/populer-meslekler')} 
                        active={location.pathname === '/kartvizid/populer-meslekler'} 
                    />
                    <SubNavItem 
                        label={t('sidebar.featured_cities')} 
                        onClick={() => navigate('/kartvizid/one-cikan-sehirler')} 
                        active={location.pathname === '/kartvizid/one-cikan-sehirler'} 
                    />
                    <SubNavItem 
                        label={t('sidebar.most_viewed')} 
                        onClick={() => navigate('/kartvizid/en-cok-gorununtulenenler')} 
                        active={location.pathname.startsWith('/kartvizid/en-cok-gorununtulenenler')} 
                    />
                    <SubNavItem 
                        label={t('sidebar.platform_stats')} 
                        onClick={() => navigate('/kartvizid/istatistikler')} 
                        active={location.pathname === '/kartvizid/istatistikler'} 
                    />
                </div>
            )}

            <NavItem 
                label="İş Görüşmeleri" 
                icon="fi-rr-comment" 
                active={location.pathname.startsWith('/mesajlar')}
                onClick={() => navigate('/mesajlar')}
                badge={unreadMessageCount > 0 ? unreadMessageCount.toString() : undefined}
            />

            <NavItem 
                label="Bildirimler" 
                icon="fi-rr-bell" 
                active={location.pathname === '/bildirimler'}
                onClick={() => navigate('/bildirimler')}
                badge={notificationCount > 0 ? notificationCount.toString() : undefined}
            />

            {isEmployer && onOpenSavedCVs && (
                <NavItem 
                    label="Kaydettiklerim" 
                    icon="fi-rr-bookmark" 
                    active={false}
                    onClick={onOpenSavedCVs}
                />
            )}

            <NavItem 
                label="Premium" 
                icon="fi-rr-membership-vip" 
                active={location.pathname === '/premium'}
                onClick={() => navigate('/premium')}
            />

            <div className="my-2 border-t border-gray-200/70 dark:border-white/10"></div>

            <NavItem 
                label="Ayarlar" 
                icon="fi-rr-settings" 
                active={isActive('/ayarlar')}
                onClick={() => navigate('/ayarlar')}
            />

            <NavItem 
                label="Kurumsal" 
                icon="fi-rr-info" 
                active={[
                    '/iletisim', '/sikca-sorulan-sorular', '/yardim-merkezi', 
                    '/hizmetlerimiz', '/aydinlatma-metni', '/cerez-politikasi', 
                    '/kvkk-aydinlatma', '/uyelik-sozlesmesi', '/veri-sahibi-basvuru-formu',
                    '/hakkimizda', '/kullanim-kosullari', '/guvenlik-ipuclari'
                ].includes(location.pathname)}
                onClick={() => navigate('/iletisim')}
            />


            {/* Account Management (Contextual) */}
            <div className="mt-auto pt-8">
                {!user ? (
                    <button 
                        onClick={() => onOpenAuth?.('signin')}
                        className="w-full bg-[#1f6d78] text-white py-3.5 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-lg shadow-[#1f6d78]/10 flex items-center justify-center gap-3"
                    >
                        <i className="fi fi-rr-sign-in-alt"></i>
                        Giriş Yap
                    </button>
                ) : (
                    <button 
                        onClick={onSignOut}
                        className="w-full bg-white dark:bg-transparent text-black dark:text-white py-3 rounded-2xl font-black text-sm border border-black dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                    >
                        <i className="fi fi-rr-sign-out-alt"></i>
                        Çıkış Yap
                    </button>
                )}
            </div>
        </div>
    );
};

export default DesktopNav;
