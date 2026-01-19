
import React from 'react';
import { TRENDS } from '../constants';

const SidebarRight: React.FC = () => {
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
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-black font-bold text-sm mb-5 tracking-tight">Haftalık Yükselenler</h3>
        <div className="space-y-5">
          {TRENDS.map((trend, i) => (
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
          ))}
        </div>
      </div>

      {/* Tip Card - Updated to White Background */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">PROFESYONEL İPUCU</p>
        <p className="text-[14px] font-medium leading-relaxed italic text-gray-800 opacity-90">
          "Profil detaylarınızda en az 3 yetenek belirtmek, işverenlerin size olan güvenini %40 oranında artırır."
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 px-3 text-[10px] text-gray-400 font-medium">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
          <a href="#" className="hover:text-black transition-colors">Hakkımızda</a>
          <a href="#" className="hover:text-black transition-colors">Gizlilik</a>
          <a href="#" className="hover:text-black transition-colors">Yardım</a>
        </div>
        <p className="opacity-70">© 2024 Kartvizid Platformu</p>
      </div>
    </div>
  );
};

export default SidebarRight;