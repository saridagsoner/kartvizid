
import React from 'react';
import { CV } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { JobFinderSkeleton, StatsSkeleton } from './Skeleton';

interface SidebarLeftProps {
  popularProfessions: Array<{ label: string; count: number }>;
  popularCities: Array<{ label: string; count: number }>;
  weeklyTrends: Array<{ label: string; growth: number }>;
  platformStats: Array<{ label: string; value: string }>;
  jobFinders?: CV[];
  loading?: boolean;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({ popularProfessions, popularCities, platformStats, jobFinders = [], loading = false }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-5 h-fit">
      {/* İş Bulanlar Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-bold text-sm tracking-tight flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            {t('sidebar.job_finders')}
          </h3>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-4">
              <JobFinderSkeleton />
              <JobFinderSkeleton />
              <JobFinderSkeleton />
            </div>
          ) : jobFinders.length > 0 ? (
            <div className="space-y-4">
              {jobFinders.slice(0, 5).map((cv) => (
                <div key={cv.id} className="flex items-center gap-3 group cursor-pointer animate-fade-in bg-[#1f6d78] dark:bg-[#155e68] p-1.5 rounded-xl border border-[#1f6d78] dark:border-[#155e68] hover:bg-white dark:hover:bg-gray-700 hover:text-black dark:hover:text-white hover:border-gray-200 dark:hover:border-gray-600 transition-all">
                  <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shrink-0">
                    <img src={cv.photoUrl} alt={cv.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] truncate leading-tight text-white group-hover:text-black dark:group-hover:text-white transition-colors">{cv.name}</p>
                    <p className="text-gray-200 text-[9px] truncate group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors">{cv.profession}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">{t('sidebar.no_job_finders')}</p>
          )}
        </div>
      </div>
      {/* Popüler Meslekler Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-black text-sm tracking-tight">{t('sidebar.popular_professions')}</h3>
        </div>
        <div className="p-5">
          <div>
            {(popularProfessions || []).slice(0, 5).map((prof, i) => (
              <div key={i} className="flex items-center justify-between text-[13px] group cursor-pointer animate-fade-in border-b border-gray-200 dark:border-gray-700 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white font-medium transition-colors">{prof.label}</span>
                <span className="text-gray-400 dark:text-gray-500 font-normal">{prof.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popüler Şehirler Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all duration-300">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-black text-sm tracking-tight">{t('sidebar.featured_cities')}</h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-x-3 gap-y-2 transition-all duration-500">
            {(popularCities || []).slice(0, 5).map((city, i) => (
              <span
                key={i}
                className={`${city.label === 'Gaziantep' ? 'text-black dark:text-white font-black text-[13px]' : 'text-gray-600 dark:text-gray-300 text-[12px] font-medium'} cursor-pointer hover:text-[#1f6d78] dark:hover:text-[#2dd4bf] transition-colors animate-fade-in`}
              >
                {city.label}
              </span>
            ))}
          </div>
        </div>
      </div>



      {/* Stats Card - Platform İstatistikleri */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-[#1f6d78] dark:text-[#2dd4bf] font-black text-sm tracking-tight">{t('sidebar.platform_stats')}</h3>
        </div>
        <div className="p-5">
          {loading ? (
            <StatsSkeleton />
          ) : platformStats.map((stat, i) => (
            <div key={i} className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 mb-3 last:pb-0 last:mb-0">
              <span className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</span>
              <span className="font-bold text-[#1f6d78] dark:text-[#2dd4bf]">
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
