
import React, { useState } from 'react';
import TipsModal from './TipsModal';

interface SidebarRightProps {
  weeklyTrends?: Array<{ label: string; growth: number }>;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ weeklyTrends = [] }) => {
  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 sticky top-20 pt-4 h-fit">
      {/* Premium Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
        <div className="w-14 h-14 bg-gray-50 text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-gray-100">💎</div>
        <h3 className="text-black font-bold text-base mb-2">Premium Ayrıcalığı</h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          Kartvizitinizi öne çıkarın, başvurularda en üstte yer alarak 5 kat daha hızlı keşfedilin.
        </p>
        <button className="w-full bg-white border border-gray-200 text-black py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-all active:scale-95">
          Planları İncele
        </button>
      </div>

      {/* Trends */}
      {/* Trends */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight">Haftalık Yükselenler</h3>
        </div>
        <div className="p-5 space-y-5">
          {weeklyTrends.length > 0 ? (
            weeklyTrends.map((trend, i) => (
              <div key={i} className="flex flex-col gap-1.5 group cursor-pointer animate-fade-in">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-gray-800 group-hover:text-black transition-colors leading-tight">
                    {trend.label}
                  </p>
                </div>
                <div className="h-1 bg-gray-100 rounded-full w-full overflow-hidden">
                  <div
                    className="h-full bg-gray-300 transition-all duration-1000 ease-out"
                    style={{ width: `${trend.growth}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-4">Bu hafta henüz yeterli veri yok.</p>
          )}
        </div>
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

      {isTipsModalOpen && <TipsModal onClose={() => setIsTipsModalOpen(false)} />}


    </div>
  );
};

export default SidebarRight;