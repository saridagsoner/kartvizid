
import React, { useState } from 'react';
import { CV } from '../types';

interface SidebarLeftProps {
  popularProfessions: Array<{ label: string; count: number }>;
  popularCities: Array<{ label: string; count: number }>;
  weeklyTrends: Array<{ label: string; growth: number }>;
  platformStats: Array<{ label: string; value: string }>;
  jobFinders?: CV[];
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ popularProfessions, popularCities, weeklyTrends = [], platformStats, jobFinders = [] }) => {
  const [isCitiesExpanded, setIsCitiesExpanded] = useState(false);
  const [isProfessionsExpanded, setIsProfessionsExpanded] = useState(false);

  // Filter visibility for cities and professions
  const visibleCities = isCitiesExpanded ? (popularCities || []) : (popularCities || []).slice(0, 5);
  const visibleProfessions = isProfessionsExpanded ? (popularProfessions || []) : (popularProfessions || []).slice(0, 5);

  return (
    <div className="flex flex-col gap-5 h-fit">
      {/* İş Bulanlar Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-black font-bold text-sm tracking-tight flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Kartvizid'te İş Bulanlar
          </h3>
        </div>
        <div className="p-5">
          {jobFinders.length > 0 ? (
            <div className="space-y-4">
              {jobFinders.slice(0, 5).map((cv) => (
                <div key={cv.id} className="flex items-center gap-3 group cursor-pointer animate-fade-in bg-gray-50 p-2 rounded-xl border border-gray-100 hover:bg-black hover:text-white hover:border-black transition-all">
                  <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden shrink-0">
                    <img src={cv.photoUrl} alt={cv.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate leading-tight group-hover:text-white transition-colors text-black">{cv.name}</p>
                    <p className="text-gray-500 text-[10px] truncate group-hover:text-gray-300 transition-colors">{cv.profession}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">Henüz iş bulan yok.</p>
          )}
        </div>
      </div>
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

      {/* Haftalık Yükselenler (Moved from Right Sidebar) */}
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
