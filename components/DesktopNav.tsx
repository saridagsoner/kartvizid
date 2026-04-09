
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
    unreadMessageCount = 0
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
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group mb-1 ${
                active 
                ? 'text-black dark:text-white' 
                : 'text-black dark:text-gray-200 hover:bg-gray-50/10 dark:hover:bg-gray-800/10'
            }`}
        >
            <div className="flex items-center gap-x-[clamp(8px,1vw,16px)]">
                <i className={`fi ${active ? icon.replace('fi-rr-', 'fi-sr-') : icon} transition-all duration-300 group-hover:scale-110 ${
                    active 
                    ? 'text-[clamp(18px,1.4vw,22px)] text-black dark:text-white font-black' 
                    : 'text-[clamp(16px,1.2vw,20px)] text-black dark:text-gray-300 font-medium'
                }`}></i>
                <span className={`tracking-tight transition-all duration-300 ${
                    active 
                    ? 'text-[clamp(14px,1.1vw,17px)] font-black text-black dark:text-white' 
                    : 'text-[clamp(13px,1vw,16px)] font-medium text-black dark:text-gray-200'
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
            className={`w-[calc(100%-24px)] ml-6 flex items-center px-4 py-2 rounded-xl transition-all duration-200 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis ${
                active 
                ? 'bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white font-bold' 
                : 'text-gray-500 hover:text-black hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
            }`}
        >
            <span className="text-[clamp(12px,0.9vw,14px)] leading-none transform translate-y-[1px]">{label}</span>
        </button>
    );



    return (
        <div className="flex flex-col h-full pt-8 pb-8 lg:pl-6 xl:pl-12 pr-0 no-scrollbar overflow-y-auto">
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

            <div className="my-2 border-t border-gray-100 dark:border-gray-800/30"></div>


            <NavItem 
                label="Kariyer Rehberi" 
                icon="fi-rr-book-alt" 
                active={location.pathname.startsWith('/rehber')}
                onClick={() => navigate('/rehber')}
            />
            <NavItem 
                label="Kartvizid" 
                icon="fi-rr-document-signed" 
                active={isKartvizidOpen || isActive('/hakkimizda')}
                onClick={() => setIsKartvizidOpen(!isKartvizidOpen)}
                hasChildren
                isOpen={isKartvizidOpen}
            />

            {isKartvizidOpen && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300 space-y-0.5">
                    <SubNavItem 
                        label="Kartvizid Nedir?" 
                        onClick={() => navigate('/hakkimizda')} 
                        active={isActive('/hakkimizda')} 
                    />
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
                label="Ayarlar" 
                icon="fi-rr-settings" 
                active={isActive('/ayarlar')}
                onClick={() => navigate('/ayarlar')}
            />

            <NavItem 
                label="Mesajlar" 
                icon="fi-rr-comment" 
                active={location.pathname.startsWith('/mesajlar')}
                onClick={() => navigate('/mesajlar')}
                badge={unreadMessageCount > 0 ? unreadMessageCount.toString() : undefined}
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
                active={false}
                onClick={() => {}}
            />

            <div className="my-2 border-t border-gray-100 dark:border-gray-800/30"></div>
            <NavItem 
                label="Destek & Yasal" 
                icon="fi-rr-interrogation" 
                active={isSupportOpen || [
                    '/iletisim', '/sikca-sorulan-sorular', '/yardim-merkezi', 
                    '/hizmetlerimiz', '/aydinlatma-metni', '/cerez-politikasi', 
                    '/kvkk-aydinlatma', '/uyelik-sozlesmesi', '/veri-sahibi-basvuru-formu'
                ].includes(location.pathname)}
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                hasChildren
                isOpen={isSupportOpen || [
                    '/iletisim', '/sikca-sorulan-sorular', '/yardim-merkezi', 
                    '/hizmetlerimiz', '/aydinlatma-metni', '/cerez-politikasi', 
                    '/kvkk-aydinlatma', '/uyelik-sozlesmesi', '/veri-sahibi-basvuru-formu'
                ].includes(location.pathname)}
            />

            {isSupportOpen && (
                <div className="mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <SubNavItem 
                        label="Bize Ulaşın" 
                        active={isActive('/iletisim')}
                        onClick={() => navigate('/iletisim')}
                    />
                    <SubNavItem 
                        label="Site Kullanımı" 
                        active={isActive('/sitemap')}
                        onClick={() => navigate('/sitemap')}
                    />
                    <SubNavItem 
                        label="KVKK Aydınlatma" 
                        active={isActive('/kvkk-aydinlatma')}
                        onClick={() => navigate('/kvkk-aydinlatma')}
                    />
                    <SubNavItem 
                        label="Gizlilik & Güvenlik" 
                        active={isActive('/guvenlik-ipuclari')}
                        onClick={() => navigate('/guvenlik-ipuclari')}
                    />
                </div>
            )}

            <NavItem 
                label="Mobil Uygulama" 
                icon="fi-rr-mobile-button" 
                active={false}
                onClick={() => {}}
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
