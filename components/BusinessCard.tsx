import React from 'react';
import { CV } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from './ImageWithFallback';

interface BusinessCardProps {
  cv: CV;
  onClick: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ cv, onClick }) => {
  const { t } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="bg-transparent pl-1.5 pr-4 py-5 sm:py-4 cursor-pointer relative transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] group"
    >
      {/* Divider Line - Starts from the text as requested */}
      <div className="absolute bottom-0 right-4 sm:right-10 left-[66px] sm:left-[70px] border-b border-gray-200 dark:border-white/10" />

      <div className="flex items-start gap-4 sm:gap-5.5">
        {/* Photo Section - Medium size */}
        <div className="relative shrink-0 flex items-center">
          <div className="w-[46px] h-[55px] sm:w-[54px] sm:h-[65px] rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 dark:bg-black shadow-sm border border-gray-100 dark:border-white/10">
            <ImageWithFallback 
              src={cv.photoUrl} 
              alt={cv.name || ''} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              initialsClassName="text-2xl sm:text-4xl font-black"
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0 min-h-[55px] sm:min-h-[65px]">
          {/* Info Content - Balanced typography */}
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <h3 className="text-[15px] sm:text-[16px] font-black text-black dark:text-white tracking-tight leading-tight line-clamp-1">
              {cv.name}
            </h3>

            <p className="text-[12px] sm:text-[13px] text-[#1f6d78] dark:text-[#2dd4bf] font-bold tracking-tight line-clamp-1 min-h-[1.2em]">
              {cv.profession || t('card.no_profession')}
            </p>

            <div className="flex flex-row items-center flex-wrap gap-2.5 sm:gap-6 mt-0">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11.5px] sm:text-[12px] text-gray-500 dark:text-gray-400 font-bold whitespace-nowrap">
                <i className="fi fi-rr-marker translate-y-[0.5px]"></i>
                <span className="">{cv.city || t('card.no_city')}</span>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 text-[11.5px] sm:text-[12px] text-gray-500 dark:text-gray-400 font-bold whitespace-nowrap">
                <i className="fi fi-rr-briefcase translate-y-[0.5px]"></i>
                {cv.experienceYears > 0 
                  ? `${cv.experienceYears} ${t('common.years_experience')}` 
                  : (cv.experienceMonths && cv.experienceMonths > 0)
                    ? t('common.less_than_year')
                    : t('card.no_experience')}
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

export default BusinessCard;
