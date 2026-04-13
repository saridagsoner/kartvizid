import React from 'react';
import { CV } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

interface BusinessCardProps {
  cv: CV;
  onClick: () => void;
  isActive?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ cv, onClick, isActive }) => {
  const { t, resolveValue } = useLanguage();

  return (
    <div
      onClick={onClick}
      className={`pl-4 pr-4 py-3 sm:py-5 cursor-pointer relative transition-all duration-500 group ${
        isActive 
          ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' 
          : 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-white/[0.02]'
      }`}
    >
      {/* Active Selection Styling (Bridge Background) */}
      <div className={`absolute inset-y-0 left-[-8px] w-[8px] transition-opacity duration-500 pointer-events-none ${
        isActive ? 'opacity-100 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' : 'opacity-0'
      }`} />

      {/* Active Indicator Line */}
      <div className={`absolute left-[-8px] top-0 bottom-0 w-1.5 bg-[#1f6d78] dark:bg-[#2dd4bf] z-10 transform transition-all duration-500 ease-in-out origin-center ${
        isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      }`} />

      {/* Divider Line - Starts from the text as requested */}
      <div className="absolute bottom-0 right-4 sm:right-10 left-[92px] border-b border-gray-200 dark:border-white/20" />

      <div className="flex items-start gap-6 sm:gap-7">
        {/* Photo Section - Custom mobile size to align with text */}
        <div className="relative shrink-0 flex items-center">
          <div className="w-[58px] h-[68px] sm:w-[60px] sm:h-[72px] rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 dark:bg-black shadow-sm border border-gray-100 dark:border-white/20">
            <ImageWithFallback 
              src={cv.photoUrl} 
              alt={cv.name || ''} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              initialsClassName="text-2xl sm:text-4xl font-black"
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0 min-h-[68px] sm:min-h-[72px]">
          {/* Info Content - Balanced typography spread across the height */}
          <h3 className="text-[16px] sm:text-[18px] font-black text-black dark:text-white tracking-tight leading-tight line-clamp-1">
            {cv.name}
          </h3>

          <p className="text-[13px] sm:text-[14px] text-[#1f6d78] dark:text-[#2dd4bf] font-bold tracking-tight line-clamp-1">
            {cv.profession ? cv.profession.split(',').map(p => resolveValue('profession', p.trim())).join(', ') : t('card.no_profession')}
          </p>

          <div className="flex flex-row items-center flex-wrap gap-x-2.5 sm:gap-x-6 gap-y-1">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[11.5px] sm:text-[12px] text-gray-500 dark:text-gray-400 font-bold whitespace-nowrap">
              <i className="fi fi-rr-marker text-[10.5px] sm:text-[11px] translate-y-[0.5px]"></i>
              <span>{cv.city ? resolveValue('city', cv.city) : t('card.no_city')}</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 text-[11.5px] sm:text-[12px] text-gray-500 dark:text-gray-400 font-bold whitespace-nowrap">
              <i className="fi fi-rr-briefcase text-[10.5px] sm:text-[11px] translate-y-[0.5px]"></i>
              {cv.experienceYears > 0 
                ? `${cv.experienceYears} ${t('common.years_experience')}` 
                : (cv.experienceMonths && cv.experienceMonths > 0)
                  ? t('common.less_than_year')
                  : t('card.no_experience')}
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

export default BusinessCard;
