
import React, { useState } from 'react';
import TipsModal from './TipsModal';
import { CV, PopularCompany } from '../types';

interface SidebarRightProps {
  popularCVs?: CV[];
  popularCompanies?: PopularCompany[];
  onCVClick?: (cv: CV) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ popularCVs = [], popularCompanies = [], onCVClick }) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 h-fit">
      {/* Premium Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
        <div className="w-14 h-14 bg-gray-50 text-black rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 13L2 9Z"></path>
            <path d="M11 3 8 9l4 13 4-13-3-6"></path>
            <path d="M2 9h20"></path>
          </svg>
        </div>
        <h3 className="text-black font-bold text-base mb-2">Premium Ayrıcalığı</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Kartvizitinizi öne çıkarın, başvurularda en üstte yer alarak 5 kat daha hızlı keşfedilin.
        </p>
        <button className="w-full bg-white border border-gray-200 text-black py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-all active:scale-95">
          Planları İncele
        </button>
      </div>

      {/* Tip Card - Updated to White Background */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm group hover:border-black/20 transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
            <path d="M9 18h6"></path>
            <path d="M10 22h4"></path>
          </svg>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">PROFESYONEL İPUCU</p>
        </div>
        <p className="text-[14px] font-medium leading-relaxed italic text-gray-800 opacity-90 mb-6">
          "Profil detaylarınızda en az 3 yetenek belirtmek, işverenlerin size olan güvenini %40 oranında artırır."
        </p>
        <button
          onClick={() => setIsTipsModalOpen(true)}
          className="w-full bg-white border border-gray-200 text-black font-bold text-sm hover:bg-gray-50 py-2.5 rounded-full transition-all active:scale-95 shadow-sm block text-center"
        >
          Daha Fazla İpucu Göster
        </button>
      </div>

      {/* Popüler İşverenler */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight">Popüler İşverenler</h3>
        </div>
        <div className="p-5 space-y-4">
          {popularCompanies.length > 0 ? (
            popularCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center gap-3 cursor-default group hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-all"
              >
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-white flex items-center justify-center p-1">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
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
                  <p className="text-xs font-bold text-gray-900 truncate group-hover:text-black transition-colors">{company.name}</p>
                  <p className="text-[10px] font-medium text-gray-500 truncate">{company.industry || 'Sektör Belirtilmemiş'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">Henüz veri yok.</p>
          )}
        </div>
      </div>

      {/* Popüler Kartvizidler - Moved to bottom */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight">Popüler Kartvizidler</h3>
        </div>
        <div className="p-5 space-y-4">
          {popularCVs.length > 0 ? (
            popularCVs.map((cv) => (
              <div
                key={cv.id}
                onClick={() => onCVClick?.(cv)}
                className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-all"
              >
                {/* Photo */}
                <div className="w-10 h-10 rounded-full border border-gray-100 overflow-hidden shrink-0">
                  <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate group-hover:text-black transition-colors">{cv.name}</p>
                  <p className="text-[10px] font-medium text-gray-500 truncate">{cv.profession}</p>
                </div>
                {/* View Count Badge */}
                <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                  <span className="text-[8px] font-bold text-gray-400">👁 {cv.views || 0}</span>
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