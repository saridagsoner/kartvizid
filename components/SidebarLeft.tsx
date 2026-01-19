
import React, { useState } from 'react';
import { STATISTICS, POPULAR_PROFESSIONS, POPULAR_CITIES } from '../constants';

const SidebarLeft: React.FC = () => {
  const [isCitiesExpanded, setIsCitiesExpanded] = useState(false);
  const [isProfessionsExpanded, setIsProfessionsExpanded] = useState(false);

  // Filter visibility for cities and professions
  const visibleCities = isCitiesExpanded ? POPULAR_CITIES : POPULAR_CITIES.slice(0, 5);
  const visibleProfessions = isProfessionsExpanded ? POPULAR_PROFESSIONS : POPULAR_PROFESSIONS.slice(0, 5);

  return (
    <div className="flex flex-col gap-5 sticky top-20 pt-4 h-fit">
      {/* Popüler Meslekler Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300">
        <h3 className="text-black font-bold text-sm mb-4">Popüler Meslekler</h3>
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
      
      {/* Popüler Şehirler Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300">
        <h3 className="text-black font-bold text-sm mb-4">Popüler Şehirler</h3>
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

      {/* Stats Card - Platform İstatistikleri */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight">Platform İstatistikleri</h3>
        </div>
        <div className="p-5 space-y-4">
          {STATISTICS.map((stat, i) => (
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
