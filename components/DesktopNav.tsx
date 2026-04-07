
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface DesktopNavProps {
    viewMode: 'cvs' | 'employers' | 'shops';
    onViewModeChange: (mode: 'cvs' | 'employers' | 'shops') => void;
    user?: any;
    isEmployer?: boolean;
    onOpenAuth?: (mode: 'signin' | 'signup', role?: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
    viewMode,
    onViewModeChange,
    user,
    isEmployer,
    onOpenAuth
}) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;
    const isModeActive = (mode: string) => viewMode === mode && (location.pathname === '/' || location.pathname === '');

    const NavItem = ({ label, icon, onClick, active, badge }: { label: string, icon: string, onClick: () => void, active?: boolean, badge?: string }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group mb-1 ${
                active 
                ? 'bg-gray-50 dark:bg-gray-800/50 text-black dark:text-white translate-x-1.5' 
                : 'text-black dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
            }`}
        >
            <div className="flex items-center gap-4">
                <i className={`fi ${icon} text-xl transition-transform group-hover:scale-110 ${active ? 'text-black dark:text-white font-black' : 'text-black dark:text-gray-300'}`}></i>
                <span className={`text-[15px] tracking-tight ${active ? 'font-black' : 'font-normal'}`}>{label}</span>
            </div>
            {badge && (
                <span className="bg-[#1f6d78] text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                    {badge}
                </span>
            )}
        </button>
    );

    const SectionTitle = ({ title, first }: { title: string, first?: boolean }) => (
        <div className={`px-4 mb-3 ${first ? 'mt-2' : 'mt-8'}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
                {title}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col h-full py-2 pr-4 custom-scrollbar overflow-y-auto">
            {/* Main Navigation */}
            <SectionTitle title="KEŞFET" first />
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

            <SectionTitle title="İÇERİK" />
            <NavItem 
                label="Kariyer Rehberi" 
                icon="fi-rr-book-alt" 
                active={isActive('/rehber')}
                onClick={() => navigate('/rehber')}
                badge="Yeni"
            />
            <NavItem 
                label="Hakkımızda" 
                icon="fi-rr-info" 
                active={isActive('/hakkimizda')}
                onClick={() => navigate('/hakkimizda')}
            />

            <SectionTitle title="DESTEK & YASAL" />
            <NavItem 
                label="Bize Ulaşın" 
                icon="fi-rr-envelope" 
                active={isActive('/iletisim')}
                onClick={() => navigate('/iletisim')}
            />
            <NavItem 
                label="Site Haritası" 
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

            {/* Account Management (Contextual) */}
            <div className="mt-auto pt-8">
                {!user ? (
                    <button 
                        onClick={() => onOpenAuth?.('signin')}
                        className="w-full bg-[#1f6d78] text-white py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-[#1f6d78]/20 flex items-center justify-center gap-3"
                    >
                        <i className="fi fi-rr-sign-in-alt"></i>
                        Giriş Yap
                    </button>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-3xl p-4 border border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Hesabınız</p>
                        <NavItem 
                            label="Ayarlar" 
                            icon="fi-rr-settings" 
                            active={isActive('/ayarlar')}
                            onClick={() => navigate('/ayarlar')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesktopNav;
