
import React, { useState } from 'react';
import TipsModal from './TipsModal';
import InfoModal from './InfoModal';
import PromoCarousel from './PromoCarousel';
import { CV, PopularCompany } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { JobFinderSkeleton } from './Skeleton';

interface SidebarRightProps {
  popularCVs?: CV[];
  popularCompanies?: PopularCompany[];
  onCVClick?: (cv: CV) => void;
  onCompanyClick?: (company: PopularCompany) => void;
  loading?: boolean;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ popularCVs = [], popularCompanies = [], onCVClick, onCompanyClick, loading = false }) => {
  const { t } = useLanguage();
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 h-fit">
      {/* Dynamic Promo Carousel */}
      <PromoCarousel
        onOpenTips={() => setIsTipsModalOpen(true)}
        onOpenInfo={() => setIsInfoModalOpen(true)}
      />

      {/* Popüler İşverenler */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-black text-sm tracking-tight">{t('sidebar.employers')}</h3>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-4">
              <JobFinderSkeleton />
              <JobFinderSkeleton />
              <JobFinderSkeleton />
            </div>
          ) : popularCompanies.length > 0 ? (
            popularCompanies.map((company, index) => (
              <div
                key={company.id}
                onClick={() => onCompanyClick?.(company)}
                className={`flex items-center gap-3 cursor-pointer group transition-all ${index !== popularCompanies.length - 1 ? 'border-b border-gray-200 dark:border-gray-600 pb-3 mb-3' : ''
                  }`}
              >
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-600 overflow-hidden shrink-0 bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                      <path d="M9 22v-4h6v4"></path>
                      <path d="M8 6h.01"></path>
                      <path d="M16 6h.01"></path>
                      <path d="M12 6h.01"></path>
                      <path d="M12 10h.01"></path>
                      <path d="M12 14h.01"></path>
                      <path d="M16 10h.01"></path>
                      <path d="M16 14h.01"></path>
                      <path d="M8 10h.01"></path>
                      <path d="M8 14h.01"></path>
                    </svg>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">{company.name}</p>
                </div>

                {/* Arrow Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 text-[#1f6d78]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">{t('sidebar.no_data')}</p>
          )}
        </div>
      </div>

      {/* Popüler Kartvizidler - Moved to bottom */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-black text-sm tracking-tight">{t('sidebar.most_viewed')}</h3>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-4">
              <JobFinderSkeleton />
              <JobFinderSkeleton />
              <JobFinderSkeleton />
            </div>
          ) : popularCVs.length > 0 ? (
            popularCVs.map((cv, index) => (
              <div
                key={cv.id}
                onClick={() => onCVClick?.(cv)}
                className={`flex items-center gap-3 cursor-pointer group transition-all ${index !== popularCVs.length - 1 ? 'border-b border-gray-200 dark:border-gray-600 pb-3 mb-3' : ''
                  }`}
              >
                {/* Photo */}
                <div className="w-10 h-10 rounded-2xl border border-gray-100 dark:border-gray-600 overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                  <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">{cv.name}</p>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5">{cv.profession}</p>
                </div>

                {/* Arrow Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 text-[#1f6d78]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </div>

              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">{t('sidebar.no_featured')}</p>
          )}
        </div>
      </div>

      {isTipsModalOpen && <TipsModal onClose={() => setIsTipsModalOpen(false)} />}
      {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} />}


    </div>
  );
};

export default SidebarRight;