import React from 'react';

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
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 sm:gap-10 pl-1.5 pr-4 py-4 sm:p-8 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-750 transition-colors sm:border sm:rounded-[35px] sm:mb-4 cursor-pointer group"
    >
      <div className="w-14 h-16 sm:w-24 sm:h-28 rounded-xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0 bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        {shop.logo_url ? (
          <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
             <i className="fi fi-rr-shop text-2xl sm:text-4xl text-gray-300 dark:text-gray-600"></i>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-0.5 sm:gap-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] sm:text-[22px] font-bold text-black dark:text-white tracking-tight leading-tight line-clamp-1 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">
              {shop.name}
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-[#1f6d78] dark:text-[#2dd4bf] bg-[#1f6d78]/5 dark:bg-[#1f6d78]/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap">
               Hizmet
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-gray-500 dark:text-gray-400">
            <i className="fi fi-rr-briefcase translate-y-[0.5px]"></i>
            <span className="truncate uppercase tracking-wider">{shop.profession}</span>
          </div>

          <div className="flex items-center gap-3 mt-0.5">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500">
              <i className="fi fi-rr-marker"></i>
              <span>{shop.city}{shop.district ? `, ${shop.district}` : ''}</span>
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
          <p className="hidden sm:block mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
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
