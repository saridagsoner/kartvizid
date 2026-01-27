import React from 'react';
import { CV } from '../types';

interface BusinessCardProps {
  cv: CV;
  onClick: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ cv, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-[2.5rem] p-3 sm:p-6 border border-gray-200 dark:border-gray-700 card-hover cursor-pointer relative animate-fade-in shadow-sm"
    >
      <div className="flex flex-row items-start gap-2.5 sm:gap-8">
        {/* Photo Section - Mobile: Small Frame, Desktop: Larger Rectangle */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 sm:w-24 sm:h-28 rounded-lg sm:rounded-[1.75rem] border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm group bg-gray-50 dark:bg-gray-700">
            {cv.photoUrl ? (
              <img
                src={cv.photoUrl}
                alt={cv.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                👤
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0 pt-0 sm:pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 mb-0.5 sm:mb-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-2xl font-black text-black dark:text-white tracking-tight leading-tight sm:leading-none line-clamp-1">
                {cv.name}
              </h3>
              {/* Mobile Only Icons Inline */}
              <div className="flex sm:hidden items-center gap-1">
                {cv.isEmailPublic && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                {cv.isPhonePublic && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 ml-4 self-center">
              {cv.isEmailPublic && (
                <div
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                  title="E-posta Görünür"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
              )}
              {cv.isPhonePublic && (
                <div
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
                  title="Telefon Görünür"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.57A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] sm:text-base text-gray-500 dark:text-gray-400 font-bold mb-1.5 sm:mb-4 tracking-tight line-clamp-1">{cv.profession}</p>

          {/* Details Section with Simple Icons */}
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-6 gap-y-1 text-[9px] sm:text-[13px] text-gray-500 dark:text-gray-400 font-bold">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-gray-300">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {cv.city}
            </span>

            <span className="hidden sm:flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-gray-300">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              {cv.experienceYears} Yıl Deneyim
            </span>
            {/* Mobile Compact Exp */}
            <span className="flex sm:hidden items-center gap-1">
              <span className="font-black text-black dark:text-gray-300">{cv.experienceYears} Yıl</span>
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-gray-300">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              {cv.language}
            </span>

          </div>

          {/* Summary Section - Visible on all screens now, but very clamped on mobile */}
          <div className="mt-2 sm:mt-6 block">
            <p className="text-[9px] sm:text-[13px] text-gray-600 dark:text-gray-300 font-medium leading-relaxed line-clamp-2 italic">
              "{cv.about}"
            </p>
          </div>
        </div>

        {/* Action Button - Mobile: Arrow Icon, Desktop: Button */}
        <div className="flex items-center self-center sm:self-center shrink-0 ml-auto sm:ml-0">
          <button className="hidden sm:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-black dark:text-white px-8 py-3 rounded-full font-black text-xs hover:bg-[#1f6d78] hover:text-white hover:border-[#1f6d78] dark:hover:border-[#1f6d78] transition-all active:scale-95 shadow-sm uppercase tracking-widest">
            Görüntüle
          </button>
          <button className="sm:hidden w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
