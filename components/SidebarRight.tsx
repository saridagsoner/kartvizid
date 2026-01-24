
import React, { useState } from 'react';
import TipsModal from './TipsModal';
import PromoCarousel from './PromoCarousel';
import { CV, PopularCompany } from '../types';

interface SidebarRightProps {
  popularCVs?: CV[];
  popularCompanies?: PopularCompany[];
  onCVClick?: (cv: CV) => void;
  onCompanyClick?: (company: PopularCompany) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ popularCVs = [], popularCompanies = [], onCVClick, onCompanyClick }) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 h-fit">
      {/* Dynamic Promo Carousel */}
      <PromoCarousel onOpenTips={() => setIsTipsModalOpen(true)} />

      {/* Popüler İşverenler */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-bold text-sm tracking-tight">İş Verenler</h3>
        </div>
        <div className="p-5 space-y-4">
          {popularCompanies.length > 0 ? (
            popularCompanies.map((company) => (
              <div
                key={company.id}
                onClick={() => onCompanyClick?.(company)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -mx-2 rounded-xl transition-all"
              >
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-600 overflow-hidden shrink-0 bg-white dark:bg-gray-700 flex items-center justify-center">
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
                <div className="flex-1 min-w-0 flex items-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">{company.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">Henüz veri yok.</p>
          )}
        </div>
      </div>

      {/* Popüler Kartvizidler - Moved to bottom */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-bold text-sm tracking-tight">En Çok Görüntülenen Kartvizidler</h3>
        </div>
        <div className="p-5 space-y-4">
          {popularCVs.length > 0 ? (
            popularCVs.map((cv) => (
              <div
                key={cv.id}
                onClick={() => onCVClick?.(cv)}
                className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 -mx-1.5 rounded-lg transition-all"
              >
                {/* Photo */}
                <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-600 overflow-hidden shrink-0">
                  <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">{cv.name}</p>
                  <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400 truncate">{cv.profession}</p>
                </div>

              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">Henüz öne çıkan yok.</p>
          )}
        </div>
      </div>

      {isTipsModalOpen && <TipsModal onClose={() => setIsTipsModalOpen(false)} />}


    </div>
  );
};

export default SidebarRight;