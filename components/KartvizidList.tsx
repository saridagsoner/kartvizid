import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CV } from '../types';

interface KartvizidListProps {
    type: 'job-finders' | 'professions' | 'cities' | 'most-viewed' | 'stats';
    jobFinders: CV[];
    popularProfessions: any[];
    popularCities: any[];
    popularCVs: CV[];
    platformStats: any[];
    onFilterApply: (type: 'profession' | 'city', value: string) => void;
}

const KartvizidList: React.FC<KartvizidListProps> = ({
    type,
    jobFinders,
    popularProfessions,
    popularCities,
    popularCVs,
    platformStats,
    onFilterApply
}) => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const getTitle = () => {
        switch (type) {
            case 'job-finders': return t('sidebar.job_finders');
            case 'professions': return t('sidebar.popular_professions');
            case 'cities': return t('sidebar.featured_cities');
            case 'most-viewed': return t('sidebar.most_viewed');
            case 'stats': return t('sidebar.platform_stats');
            default: return '';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'job-finders': return 'fi-rr- user-check';
            case 'professions': return 'fi-rr-briefcase';
            case 'cities': return 'fi-rr-map-marker';
            case 'most-viewed': return 'fi-rr-eye';
            case 'stats': return 'fi-rr-stats';
            default: return 'fi-rr-document-signed';
        }
    };

    const renderContent = () => {
        switch (type) {
            case 'job-finders':
            case 'most-viewed':
                const list = type === 'job-finders' ? jobFinders : popularCVs;
                return (
                    <div className="flex flex-col">
                        {list.map((cv) => (
                            <div
                                key={cv.id}
                                onClick={() => navigate(`/cv/${cv.id}`)}
                                className={`flex items-center gap-4 py-5 border-b border-gray-100 dark:border-white/5 px-6 cursor-pointer hover:bg-[#1f6d78]/5 dark:hover:bg-[#1f6d78]/10 transition-all group relative ${
                                    location.pathname === `/cv/${cv.id}` ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' : ''
                                }`}
                            >
                                {location.pathname === `/cv/${cv.id}` && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1f6d78] dark:bg-[#2dd4bf]"></div>
                                )}
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-white/10 group-hover:scale-105 transition-transform">
                                    <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-black text-[16px] text-gray-900 dark:text-white truncate tracking-tight">{cv.name}</h4>
                                    <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate font-semibold uppercase tracking-wider">{cv.profession}</p>
                                </div>
                                <div className="text-gray-300 dark:text-gray-700 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">
                                    <i className="fi fi-rr-angle-small-right text-xl"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'professions':
            case 'cities':
                const items = type === 'professions' ? popularProfessions : popularCities;
                const filterType = type === 'professions' ? 'profession' : 'city';
                return (
                    <div className="flex flex-col">
                        {items.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => onFilterApply(filterType, item.label)}
                                className="w-full text-left py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center px-6 hover:bg-[#1f6d78]/5 dark:hover:bg-[#1f6d78]/10 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] group-hover:scale-110 transition-transform">
                                        <i className={`fi ${type === 'professions' ? 'fi-rr-briefcase' : 'fi-rr-map-marker'} text-lg`}></i>
                                    </div>
                                    <span className="font-bold text-[16px] text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black text-white bg-[#1f6d78] dark:bg-[#1f6d78] px-3 py-1 rounded-full shadow-lg shadow-[#1f6d78]/20">{item.count}</span>
                                    <i className="fi fi-rr-angle-small-right text-xl text-gray-300 dark:text-gray-700 group-hover:text-[#1f6d78] transition-colors"></i>
                                </div>
                            </button>
                        ))}
                    </div>
                );
            case 'stats':
                return (
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4">
                            {platformStats.map((stat, i) => (
                                <div 
                                    key={i} 
                                    className="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-[#1f6d78]/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] shadow-sm">
                                            <i className={`fi ${
                                                stat.label.includes('Kay') ? 'fi-rr-user-add' : 
                                                stat.label.includes('İş') ? 'fi-rr-briefcase' : 
                                                stat.label.includes('Ziyaret') ? 'fi-rr-eye' : 'fi-rr-stats'
                                            } text-xl`}></i>
                                        </div>
                                        <span className="text-[15px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight">{stat.label}</span>
                                    </div>
                                    <span className="text-2xl font-black text-[#1f6d78] dark:text-[#2dd4bf] tracking-tighter">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 p-6 bg-[#1f6d78] rounded-[2.5rem] text-white text-center relative overflow-hidden group shadow-2xl shadow-[#1f6d78]/20">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h4 className="text-lg font-black mb-1">Gittikçe Büyüyoruz!</h4>
                            <p className="text-white/70 text-xs font-bold leading-relaxed">
                                Kartvizid ailesi her geçen gün genişliyor. <br />Doğru eşleşmelerle kariyer yolculuklarını değiştiriyoruz.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-w-0 h-full bg-white dark:bg-black">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 px-8 py-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] flex items-center justify-center border border-[#1f6d78]/10">
                        <i className={`fi ${getIcon()} text-2xl`}></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-1">
                            {getTitle()}
                        </h1>
                        <span className="text-[10px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.3em]">
                            Kartvizid Platform
                        </span>
                    </div>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
                {renderContent()}
            </div>
        </div>
    );
};

export default KartvizidList;
