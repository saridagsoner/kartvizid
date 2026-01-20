
import React, { useState } from 'react';
interface SidebarLeftProps {
  popularProfessions: Array<{ label: string; count: number }>;
  popularCities: Array<{ label: string; count: number }>;
  platformStats: Array<{ label: string; value: string }>;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ popularProfessions, popularCities, platformStats }) => {
  const [isCitiesExpanded, setIsCitiesExpanded] = useState(false);
  const [isProfessionsExpanded, setIsProfessionsExpanded] = useState(false);

  // Filter visibility for cities and professions
  // Use prop instead of constant
  // Filter visibility for cities and professions
  // Use prop instead of constant
  const visibleCities = isCitiesExpanded ? (popularCities || []) : (popularCities || []).slice(0, 5);
  // Use prop instead of constant
  const visibleProfessions = isProfessionsExpanded ? (popularProfessions || []) : (popularProfessions || []).slice(0, 5);

  return (
    <div className="flex flex-col gap-5 sticky top-20 pt-4 h-fit">
      {/* Popüler Meslekler Section */}
      {/* Popüler Meslekler Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight">Popüler Meslekler</h3>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            {visibleProfessions.map((prof, i) => (
              <div key={i} className="flex items-center justify-between text-[13px] group cursor-pointer animate-fade-in">
                <span className="text-gray-600 group-hover:text-black font-medium transition-colors">{prof.label}</span>
                <span className="text-gray-400 font-normal">{prof.count}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsProfessionsExpanded(!isProfessionsExpanded)}
            className="mt-5 w-full bg-white border border-gray-200 text-black font-bold text-sm hover:bg-gray-50 py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
          >
            {isProfessionsExpanded ? 'Daha Az Gör' : 'Tümünü Gör'}
          </button>
        </div>
      </div>

      {/* Popüler Şehirler Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight">Popüler Şehirler</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 transition-all duration-500">
            {visibleCities.map((city, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-full border border-gray-100 cursor-pointer hover:bg-black hover:text-white hover:border-black transition-all uppercase tracking-wide animate-fade-in"
              >
                {city.label}
              </span>
            ))}
          </div>
          <button
            onClick={() => setIsCitiesExpanded(!isCitiesExpanded)}
            className="mt-5 w-full bg-white border border-gray-200 text-black font-bold text-sm hover:bg-gray-50 py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
          >
            {isCitiesExpanded ? 'Daha Az Gör' : 'Tümünü Gör'}
          </button>
        </div>
      </div>

      {/* Stats Card - Platform İstatistikleri */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight">Kartvizid İstatistikleri</h3>
        </div>
        <div className="p-5 space-y-4">
          {platformStats.map((stat, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">{stat.label}</span>
              <span className="font-bold text-black">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
