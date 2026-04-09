import React from 'react';
import { Company } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
  isActive?: boolean;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onClick, isActive }) => {
  const { t } = useLanguage();

  return (
    <div
      onClick={onClick}
      className={`pl-1.5 pr-4 py-6 sm:py-5 cursor-pointer relative transition-all duration-500 group ${
        isActive 
          ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' 
          : 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-white/[0.02]'
      }`}
    >
      {/* Active Selection Styling (Bridge Background) */}
      <div className={`absolute inset-y-0 left-[-28px] w-[28px] transition-opacity duration-500 pointer-events-none ${
        isActive ? 'opacity-100 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' : 'opacity-0'
      }`} />

      {/* Active Indicator Line */}
      <div className={`absolute left-[-28px] top-0 bottom-0 w-1.5 bg-[#1f6d78] dark:bg-[#2dd4bf] z-50 transform transition-all duration-500 ease-in-out origin-center ${
        isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      }`} />

      {/* Divider Line */}
      <div className="absolute bottom-0 right-4 sm:right-10 left-[66px] sm:left-[70px] border-b border-gray-200 dark:border-white/10" />

      <div className="flex items-start gap-5 sm:gap-7">
        {/* Logo Section */}
        <div className="relative shrink-0 flex items-center">
          <div className="w-[50px] h-[60px] sm:w-[60px] sm:h-[72px] rounded-lg sm:rounded-xl overflow-hidden bg-white dark:bg-black shadow-sm border border-gray-100 dark:border-white/10">
            <ImageWithFallback 
              src={company.logoUrl} 
              alt={company.name || ''} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              initialsClassName="text-2xl sm:text-4xl font-black"
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0 min-h-[60px] sm:min-h-[72px]">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <h3 className="text-[16px] sm:text-[18px] font-black text-black dark:text-white tracking-tight leading-tight line-clamp-1">
              {company.name}
            </h3>

            <p className="text-[13px] sm:text-[14px] text-[#1f6d78] dark:text-[#2dd4bf] font-bold tracking-tight line-clamp-1">
              {company.industry || t('card.no_industry') || 'Sektör Belirtilmedi'}
            </p>

            <div className="flex flex-row items-center flex-wrap gap-x-2.5 sm:gap-x-6 gap-y-1 mt-0.5">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11.5px] sm:text-[12px] text-gray-500 dark:text-gray-400 font-bold whitespace-nowrap">
                <i className="fi fi-rr-marker text-[10.5px] sm:text-[11px] translate-y-[0.5px]"></i>
                <span>{company.city || t('card.no_city')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <div className="shrink-0 self-center flex items-center text-gray-400 dark:text-gray-500 ml-2">
          <i className="fi fi-rr-angle-small-right text-xl"></i>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
