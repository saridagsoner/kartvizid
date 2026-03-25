import React from 'react';
import { CV } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BusinessCardProps {
  cv: CV;
  onClick: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ cv, onClick }) => {
  const { t } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="bg-transparent sm:bg-white dark:sm:bg-black pl-1.5 pr-4 py-4 sm:p-8 cursor-pointer relative transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] sm:hover:shadow-md group sm:border sm:border-gray-100 dark:sm:border-white/10 sm:rounded-[35px]"
    >
      {/* Offset Divider Line - Mobile Only */}
      <div className="absolute bottom-0 right-0 left-[74px] border-b border-gray-200/80 dark:border-white/15 sm:hidden" />

      <div className="flex items-start gap-4 sm:gap-10">
        {/* Photo Section */}
        <div className="relative shrink-0">
          <div className="w-14 h-16 sm:w-24 sm:h-28 rounded-lg sm:rounded-3xl overflow-hidden bg-gray-50 dark:bg-black shadow-sm sm:border sm:border-gray-100 dark:sm:border-white/10">
            {cv.photoUrl ? (
              <img
                src={cv.photoUrl}
                alt={cv.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
                <i className="fi fi-rr-user text-2xl sm:text-4xl text-gray-300 dark:text-zinc-700"></i>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Info Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-0.5 sm:gap-1.5">
              <h3 className="text-[15px] sm:text-[22px] font-bold text-black dark:text-white tracking-tight leading-tight line-clamp-1">
                {cv.name}
              </h3>

              <p className="text-[13px] sm:text-[18px] text-[#1f6d78] dark:text-[#2dd4bf] font-bold tracking-tight line-clamp-1 min-h-[1.2em]">
                {cv.profession || ""}
              </p>

              <div className="flex flex-row items-center flex-wrap gap-2.5 sm:gap-6 mt-0.5 sm:mt-1">
                <div className="flex items-center gap-1.5 text-[12px] sm:text-[15px] text-gray-500 dark:text-gray-400 font-bold sm:font-bold">
                  <i className="fi fi-rr-marker"></i>
                  <span className="lowercase first-letter:uppercase">{cv.city || ""}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[12px] sm:text-[15px] text-gray-500 dark:text-gray-400 font-bold sm:font-bold">
                  <i className="fi fi-rr-briefcase"></i>
                  {cv.experienceYears > 0 
                    ? `${cv.experienceYears} ${t('common.years_experience')}` 
                    : (cv.experienceMonths && cv.experienceMonths > 0)
                      ? t('common.less_than_year')
                      : t('common.new_graduate')}
                </div>
              </div>

              {cv.about && (
                <div className="hidden sm:block mt-3">
                  <p className="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed italic opacity-90">
                    {cv.about.replace(/^"|"$/g, '').replace(/^"|"$/g, '')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Action Button - Vertically Centered */}
          <div className="hidden sm:block shrink-0">
            <button className="bg-white dark:bg-black border-[0.5px] border-[#1f6d78] text-[#1f6d78] px-8 py-3 rounded-full font-black text-xs hover:bg-[#1f6d78] hover:text-white transition-all active:scale-95 shadow-sm uppercase tracking-widest whitespace-nowrap">
              {t('card.view')}
            </button>
          </div>
        </div>

        {/* Mobile Right Arrow */}
        <div className="shrink-0 self-center flex sm:hidden items-center text-gray-400 dark:text-gray-500">
          <i className="fi fi-rr-angle-small-right text-2xl"></i>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
