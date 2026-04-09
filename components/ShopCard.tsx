import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

interface ShopCardProps {
  shop: {
    id: string;
    name: string;
    profession: string;
    city: string;
    district?: string;
    phone?: string;
    logo_url?: string;
    description?: string;
  };
  onClick: () => void;
  isActive?: boolean;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onClick, isActive }) => {
  const { t } = useLanguage();

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-5 sm:gap-11 pl-1.5 pr-4 py-6 sm:p-8 border-b border-gray-100 dark:border-gray-700 transition-all duration-500 sm:border sm:rounded-[35px] sm:mb-4 cursor-pointer group relative ${
        isActive 
          ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 border-[#1f6d78]/20' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
      }`}
    >
      {/* Active Selection Styling (Bridge & Background) */}
      <div className={`absolute inset-0 left-[-20px] transition-opacity duration-500 pointer-events-none sm:rounded-[35px] ${
        isActive ? 'opacity-100 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' : 'opacity-0'
      }`} />

      {/* Active Indicator Line */}
      <div className={`absolute left-[-20px] top-0 bottom-0 w-1.5 bg-[#1f6d78] dark:bg-[#2dd4bf] z-50 transform transition-all duration-500 ease-in-out origin-center ${
        isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      }`} />
      <div className="w-[60px] h-[68px] sm:w-[104px] sm:h-[118px] rounded-xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0 bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        <ImageWithFallback 
          src={shop.logo_url} 
          alt={shop.name} 
          className="w-full h-full object-cover"
          initialsClassName="text-3xl sm:text-5xl font-black"
        />
      </div>

      <div className="flex-1 min-w-0 min-h-[68px] sm:min-h-[118px] flex flex-col justify-between py-0.5">
        <div className="flex flex-col gap-0.5 sm:gap-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] sm:text-[24px] font-bold text-black dark:text-white tracking-tight leading-tight line-clamp-1 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">
              {shop.name}
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-[#1f6d78] dark:text-[#2dd4bf] bg-[#1f6d78]/5 dark:bg-[#1f6d78]/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
               Hizmet
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[15px] font-bold text-gray-500 dark:text-gray-400">
            <i className="fi fi-rr-briefcase translate-y-[0.5px]"></i>
            <span className="truncate uppercase tracking-wider">{shop.profession || t('card.no_profession')}</span>
          </div>

          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[13px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
              <i className="fi fi-rr-marker text-[10px] sm:text-[11px]"></i>
              <span>{shop.city || t('card.no_city')}{shop.district ? `, ${shop.district}` : ''}</span>
            </div>
            
            {shop.phone && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black text-[#1f6d78] dark:text-[#2dd4bf]">
                <i className="fi fi-rr-phone-call"></i>
                <span>Tıkla & Ara</span>
              </div>
            )}
          </div>
        </div>
        
        {shop.description && (
          <p className="hidden sm:block mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed italic opacity-90">
             {shop.description}
          </p>
        )}
      </div>

      <div className="hidden sm:flex w-12 h-12 rounded-full items-center justify-center bg-gray-50 dark:bg-gray-700/50 text-gray-300 group-hover:bg-[#1f6d78]/10 group-hover:text-[#1f6d78] transition-all">
         <i className="fi fi-rr-angle-small-right text-2xl"></i>
      </div>
    </div>
  );
};

export default ShopCard;
