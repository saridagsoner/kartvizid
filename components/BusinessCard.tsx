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
      className="bg-white rounded-[2.5rem] p-6 border border-gray-200 card-hover cursor-pointer relative animate-fade-in shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* Photo Section - Adjusted height and added thin frame */}
        <div className="relative shrink-0">
          <div className="w-24 h-28 rounded-[1.75rem] border border-gray-200 overflow-hidden shadow-sm group bg-gray-50">
            <img
              src={cv.photoUrl}
              alt={cv.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center sm:text-left pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1.5">
            <h3 className="text-2xl font-black text-black tracking-tight leading-none">
              {cv.name}
            </h3>
            <div className="flex items-center gap-2 ml-4 self-center">
              {cv.isEmailPublic && (
                <div
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                  title="E-posta Görünür"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
              )}
              {cv.isPhonePublic && (
                <div
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                  title="Telefon Görünür"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.57A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
              )}
            </div>
          </div>

          <p className="text-base text-gray-500 font-bold mb-4 tracking-tight">{cv.profession}</p>

          {/* Details Section with Simple Icons */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-3 text-[13px] text-gray-500 font-bold">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {cv.city}
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              {cv.experienceYears} Yıl Deneyim
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              {cv.language}
            </span>

          </div>

          {/* Summary Section */}
          <div className="mt-6">
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed line-clamp-2 italic">
              "{cv.about}"
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center mt-4 sm:mt-0 sm:self-center">
          <button className="bg-white border border-gray-200 text-black px-8 py-3 rounded-full font-black text-xs hover:bg-[#1f6d78] hover:text-white hover:border-[#1f6d78] transition-all active:scale-95 shadow-sm uppercase tracking-widest shrink-0">
            Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
