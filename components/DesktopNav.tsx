
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface DesktopNavProps {
    viewMode: 'cvs' | 'employers' | 'shops';
    onViewModeChange: (mode: 'cvs' | 'employers' | 'shops') => void;
    user?: any;
    isEmployer?: boolean;
    onOpenAuth?: (mode: 'signin' | 'signup', role?: string) => void;
    onSignOut?: () => void;
    onOpenSavedCVs?: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
    viewMode,
    onViewModeChange,
    user,
    isEmployer,
    onOpenAuth,
    onSignOut,
    onOpenSavedCVs
}) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [isKartvizidOpen, setIsKartvizidOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;
    const isModeActive = (mode: string) => viewMode === mode && (location.pathname === '/' || location.pathname === '');

    const NavItem = ({ label, icon, onClick, active, badge, hasChildren, isOpen }: { label: string, icon: string, onClick: () => void, active?: boolean, badge?: string, hasChildren?: boolean, isOpen?: boolean }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-300 group mb-1 ${
                active 
                ? 'text-black dark:text-white translate-x-1' 
                : 'text-black dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
            }`}
        >
            <div className="flex items-center gap-4">
                <i className={`fi ${active ? icon.replace('fi-rr-', 'fi-sr-') : icon} transition-all duration-300 group-hover:scale-110 ${
                    active 
                    ? 'text-[21px] text-black dark:text-white font-black' 
                    : 'text-[19px] text-black dark:text-gray-300 font-medium'
                }`}></i>
                <span className={`tracking-tight transition-all duration-300 ${
                    active 
                    ? 'text-[16px] font-black text-black dark:text-white' 
                    : 'text-[15px] font-medium text-black dark:text-gray-200'
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
            className={`w-[calc(100%-16px)] ml-10 flex items-center px-4 py-2 rounded-xl transition-all duration-200 mb-0.5 ${
                active 
                ? 'bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white font-bold' 
                : 'text-gray-500 hover:text-black hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
            }`}
        >
            <span className="text-[13.5px] tracking-tight">{label}</span>
        </button>
    );



    return (
        <div className="flex flex-col h-full py-4 pr-4 no-scrollbar overflow-y-auto">
            {/* Main Navigation */}
            <NavItem 
                label="İş Arayanlar" 
                icon="fi-rr-users" 
                active={isModeActive('cvs')}
                onClick={() => {
                    onViewModeChange('cvs');
                    navigate('/');
                }}
            />
            <NavItem 
                label="İş Verenler" 
                icon="fi-rr-briefcase" 
                active={isModeActive('employers')}
                onClick={() => {
                    onViewModeChange('employers');
                    navigate('/');
                }}
            />
            <NavItem 
                label="Hizmetler" 
                icon="fi-rr-shop" 
                active={isModeActive('shops')}
                onClick={() => {
                    onViewModeChange('shops');
                    navigate('/hizmetler');
                }}
            />

            <div className="my-2 border-t border-gray-100 dark:border-gray-800/30"></div>


            <NavItem 
                label="Kariyer Rehberi" 
                icon="fi-rr-book-alt" 
                active={isActive('/rehber')}
                onClick={() => navigate('/rehber')}
                badge="Yeni"
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
                <div className="mb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <SubNavItem 
                        label="Kartvizid Nedir?" 
                        active={isActive('/hakkimizda')}
                        onClick={() => navigate('/hakkimizda')}
                    />
                    <SubNavItem 
                        label="İş Bulanlar" 
                        active={false}
                        onClick={() => {}}
                    />
                    <SubNavItem 
                        label="Popüler Meslekler" 
                        active={false}
                        onClick={() => {}}
                    />
                    <SubNavItem 
                        label="Öne Çıkan Şehirler" 
                        active={false}
                        onClick={() => {}}
                    />
                    <SubNavItem 
                        label="En Çok Görüntülenenler" 
                        active={false}
                        onClick={() => {}}
                    />
                    <SubNavItem 
                        label="Platform İstatistikleri" 
                        active={false}
                        onClick={() => {}}
                    />
                </div>
            )}
            <NavItem 
                label="Ayarlar" 
                icon="fi-rr-settings" 
                active={isActive('/ayarlar')}
                onClick={() => navigate('/ayarlar')}
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
                label="Bize Ulaşın" 
                icon="fi-rr-envelope" 
                active={isActive('/iletisim')}
                onClick={() => navigate('/iletisim')}
            />
            <NavItem 
                label="Site Kullanımı" 
                icon="fi-rr-map-marker" 
                active={isActive('/sitemap')}
                onClick={() => navigate('/sitemap')}
            />
            <NavItem 
                label="KVKK Aydınlatma" 
                icon="fi-rr-shield-check" 
                active={isActive('/kvkk-aydinlatma')}
                onClick={() => navigate('/kvkk-aydinlatma')}
            />
            <NavItem 
                label="Gizlilik & Güvenlik" 
                icon="fi-rr-lock" 
                active={isActive('/guvenlik-ipuclari')}
                onClick={() => navigate('/guvenlik-ipuclari')}
            />
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
