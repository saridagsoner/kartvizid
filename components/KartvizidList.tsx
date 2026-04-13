import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CV, ContactRequest, NotificationItem } from '../types';
import NotificationDropdown from './NotificationDropdown';

interface KartvizidListProps {
    type: 'job-finders' | 'professions' | 'cities' | 'most-viewed' | 'stats' | 'premium' | 'settings' | 'cv-tips' | 'employer-tips' | 'notifications';
    jobFinders: CV[];
    popularProfessions: any[];
    popularCities: any[];
    popularCVs: CV[];
    platformStats: any[];
    onFilterApply: (type: 'profession' | 'city', value: string) => void;
    // Notification props
    notifications?: any[];
    onNotificationAction?: (requestId: string, action: 'approved' | 'rejected') => void;
    onMarkRead?: (id: string) => void;
    onMarkAllRead?: () => void;
    user?: any;
}

const KartvizidList: React.FC<KartvizidListProps> = ({
    type,
    jobFinders,
    popularProfessions,
    popularCities,
    popularCVs,
    platformStats,
    onFilterApply,
    notifications = [],
    onNotificationAction,
    onMarkRead,
    onMarkAllRead,
    user
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
            case 'premium': return t('sidebar.premium');
            case 'settings': return t('sidebar.settings');
            case 'cv-tips': return t('sidebar.cv_tips');
            case 'employer-tips': return t('sidebar.employer_tips');
            case 'notifications': return t('sidebar.notifications_tab');
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
            case 'premium': return 'fi-rr-membership-vip';
            case 'settings': return 'fi-rr-settings';
            case 'cv-tips': return 'fi-rr-graduation-cap';
            case 'employer-tips': return 'fi-rr-briefcase';
            case 'notifications': return 'fi-rr-bell';
            default: return 'fi-rr-document-signed';
        }
    };

    const renderContent = () => {
        switch (type) {
            case 'job-finders':
            case 'most-viewed':
                const list = type === 'job-finders' ? jobFinders : popularCVs;
                const isClickable = type === 'job-finders';
                return (
                    <div className="flex flex-col">
                        {list.length > 0 ? (
                            list.map((cv) => (
                                <div
                                    key={cv.id}
                                    onClick={() => {
                                        if (isClickable) {
                                            navigate(`/cv/${cv.slug || cv.id}`);
                                        }
                                    }}
                                    className={`flex items-center gap-4 py-5 border-b border-gray-100 dark:border-white/5 px-6 transition-all group relative ${
                                        isClickable ? 'cursor-pointer hover:bg-[#1f6d78]/5 dark:hover:bg-[#1f6d78]/10' : ''
                                    } ${
                                        location.pathname.includes(cv.id) ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' : ''
                                    }`}
                                >
                                    {isClickable && location.pathname.includes(cv.id) && (
                                        <div className="absolute left-[-8px] top-0 bottom-0 w-1 bg-[#1f6d78] dark:bg-[#2dd4bf]"></div>
                                    )}
                                    <div className={`w-[42px] h-[52px] rounded-[14px] bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-white/20 transition-transform ${isClickable ? 'group-hover:scale-105' : ''}`}>
                                        <img src={cv.photoUrl || "https://picsum.photos/seed/user-placeholder/100/100"} alt={cv.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-[16px] text-gray-900 dark:text-white truncate tracking-tight">{cv.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate font-semibold uppercase tracking-wider">{cv.profession}</p>
                                            {(cv.isPlaced || cv.workingStatus === 'active') && (
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">{t('list.job_placed')}</span>
                                            )}
                                        </div>
                                    </div>
                                    {isClickable && (
                                        <div className="text-gray-300 dark:text-gray-700 group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">
                                            <i className="fi fi-rr-angle-small-right text-xl"></i>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-300 dark:text-gray-800 mb-6">
                                    <i className="fi fi-rr-search-user text-4xl"></i>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{t('list.empty_title')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold max-w-[240px]">
                                    {type === 'job-finders' 
                                        ? t('list.job_finders_empty')
                                        : t('list.generic_empty')}
                                </p>
                            </div>
                        )}
                    </div>
                );
            case 'professions':
            case 'cities':
                const items = type === 'professions' ? popularProfessions : popularCities;
                return (
                    <div className="flex flex-col">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="w-full py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center px-8 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf]">
                                        <i className={`fi ${type === 'professions' ? 'fi-rr-briefcase' : 'fi-rr-map-marker'} text-lg`}></i>
                                    </div>
                                    <span className="font-bold text-[16px] text-gray-700 dark:text-gray-300">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[13px] font-black text-gray-400 dark:text-gray-600 tracking-tight">
                                        {item.count} {type === 'professions' ? t('list.count_people') : t('list.count_total')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'stats':
                return (
                    <div className="flex flex-col">
                        {platformStats.map((stat, i) => (
                            <div 
                                key={i} 
                                className="flex justify-between items-center py-6 px-8 border-b border-gray-100 dark:border-white/5 last:border-0"
                            >
                                <span className="text-[14px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em]">{stat.label}</span>
                                <span className="text-2xl font-black text-[#1f6d78] dark:text-[#2dd4bf] tracking-tighter">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'premium':
                const seekerFeatures = [
                    { icon: 'fi-rr-star', title: t('premium.item_vitrin'), desc: t('premium.item_vitrin_desc') },
                    { icon: 'fi-rr-badge-check', title: t('premium.item_badge'), desc: t('premium.item_badge_desc') },
                    { icon: 'fi-rr-palette', title: t('premium.item_design'), desc: t('premium.item_design_desc') }
                ];
                const employerFeatures = [
                    { icon: 'fi-rr-filter', title: t('premium.item_filter'), desc: t('premium.item_filter_desc') },
                    { icon: 'fi-rr-messages', title: t('premium.item_unlimited'), desc: t('premium.item_unlimited_desc') },
                    { icon: 'fi-rr-chart-line-up', title: t('premium.item_analytics'), desc: t('premium.item_analytics_desc') }
                ];
                return (
                    <div className="flex flex-col pb-20">
                        {/* Seekers Section */}
                        <div className="px-8 py-3 bg-gray-50/50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5">
                            <span className="text-[10px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.3em]">{t('list.seeker_advantages')}</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {seekerFeatures.map((f, i) => (
                                <div key={`s-${i}`} className="px-8 py-6 flex gap-5 hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-colors group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1f6d78]/5 dark:bg-[#2dd4bf]/5 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] shrink-0 border border-[#1f6d78]/10 dark:border-white/5 group-hover:scale-110 transition-transform">
                                        <i className={`fi ${f.icon} text-xl`}></i>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <h4 className="font-extrabold text-[15px] text-gray-900 dark:text-white mb-1 tracking-tight">{f.title}</h4>
                                        <p className="text-[13px] text-gray-400 dark:text-gray-500 font-medium leading-[1.6]">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Employers Section */}
                        <div className="px-8 py-3 mt-8 bg-blue-50/30 dark:bg-blue-900/10 border-y border-blue-100/50 dark:border-blue-900/20">
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">{t('premium.employer_advantages')}</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {employerFeatures.map((f, i) => (
                                <div key={`e-${i}`} className="px-8 py-6 flex gap-5 hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-colors group">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-50 dark:border-blue-900/20 group-hover:scale-110 transition-transform">
                                        <i className={`fi ${f.icon} text-xl`}></i>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <h4 className="font-extrabold text-[15px] text-gray-900 dark:text-white mb-1 tracking-tight">{f.title}</h4>
                                        <p className="text-[13px] text-gray-400 dark:text-gray-500 font-medium leading-[1.6]">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'settings':
                const settingsTabs = [
                    { id: 'account', label: t('settings.account_summary_tab'), icon: 'fi-rr-user', path: '/ayarlar/hesap', protected: true },
                    { id: 'general', label: t('settings.general_tab'), icon: 'fi-rr-opacity', path: '/ayarlar/genel', protected: false },
                    { id: 'security', label: t('settings.security_tab'), icon: 'fi-rr-lock', path: '/ayarlar/guvenlik', protected: true },
                    { id: 'notifications', label: t('settings.notifications_tab'), icon: 'fi-rr-bell', path: '/ayarlar/bildirimler', protected: true }
                ].filter(tab => !tab.protected || user);
                return (
                    <div className="flex flex-col py-4">
                        {settingsTabs.map((tab) => {
                            const isActive = location.pathname === tab.path || (tab.id === 'account' && location.pathname === '/ayarlar');
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => navigate(tab.path)}
                                    className={`flex items-center gap-4 px-8 py-5 transition-all relative group ${
                                        isActive 
                                        ? 'bg-[#1f6d78]/5 dark:bg-[#2dd4bf]/5' 
                                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1f6d78] dark:bg-[#2dd4bf]"></div>
                                    )}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        isActive 
                                        ? 'bg-[#1f6d78] text-white shadow-lg shadow-[#1f6d78]/20' 
                                        : 'bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                    }`}>
                                        <i className={`fi ${tab.icon} text-lg`}></i>
                                    </div>
                                    <div className="text-left">
                                        <span className={`text-[14px] font-black tracking-tight block ${
                                            isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                        }`}>{tab.label}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-tight">
                                            {tab.id === 'account' ? t('settings.account_desc') : tab.id === 'general' ? t('settings.general_desc_tab') : tab.id === 'security' ? t('settings.security_desc_tab') : t('settings.notifications_desc_tab')}
                                        </span>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <i className="fi fi-rr-angle-small-right text-gray-300"></i>
                                    </div>
                                </button>
                            );
                        })}
                        
                        {!user && (
                            <div className="px-8 py-6 mt-2 border-t border-gray-50 dark:border-white/5 opacity-60">
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                                    {t('settings.login_required')}
                                </p>
                            </div>
                        )}
                    </div>
                );
            case 'employer-tips':
                const employerTips = [
                    { id: 1, title: t('tips.emp_item1_title'), desc: t('tips.emp_item1_desc'), icon: 'fi-rr-bullhorn', color: 'bg-blue-50 text-blue-600' },
                    { id: 2, title: t('tips.emp_item2_title'), desc: t('tips.emp_item2_desc'), icon: 'fi-rr-building', color: 'bg-green-50 text-green-600' },
                    { id: 3, title: t('tips.emp_item3_title'), desc: t('tips.emp_item3_desc'), icon: 'fi-rr-share', color: 'bg-purple-50 text-purple-600' },
                    { id: 4, title: t('tips.emp_item4_title'), desc: t('tips.emp_item4_desc'), icon: 'fi-rr-marker', color: 'bg-orange-50 text-orange-600' },
                    { id: 5, title: t('tips.emp_item5_title'), desc: t('tips.emp_item5_desc'), icon: 'fi-rr-users-alt', color: 'bg-teal-50 text-[#1f6d78]' }
                ];
                return (
                    <div className="flex flex-col gap-1 py-6 px-4 no-scrollbar">
                        <div className="mb-6 px-4">
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 leading-relaxed">
                                {t('sidebar.employer_tips')}
                            </p>
                            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                                {t('tips.employer_title')}
                            </h3>
                        </div>
                        {employerTips.map((tip) => (
                            <div
                                key={tip.id}
                                className="flex items-start gap-4 p-5 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group border border-transparent hover:border-gray-100 dark:hover:border-white/5"
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${tip.color} dark:bg-white/5`}>
                                    <i className={`fi ${tip.icon} text-lg`}></i>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[13px] font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">{tip.title}</h4>
                                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-8 p-6 rounded-3xl bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 border border-[#1f6d78]/10 mx-2">
                             <div className="flex items-center gap-3 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#1f6d78] animate-pulse"></span>
                                <span className="text-[10px] font-black text-[#1f6d78] uppercase tracking-widest">{t('list.brand_note')}</span>
                             </div>
                             <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                {t('list.brand_quote')}
                             </p>
                        </div>
                    </div>
                );
            case 'cv-tips':
                const tips = [
                    { id: 1, title: t('tips.cv_item1_title'), desc: t('tips.cv_item1_desc'), icon: 'fi-rr-comment-user', color: 'bg-blue-50 text-blue-600' },
                    { id: 2, title: t('tips.cv_item2_title'), desc: t('tips.cv_item2_desc'), icon: 'fi-rr-briefcase', color: 'bg-green-50 text-green-600' },
                    { id: 3, title: t('tips.cv_item3_title'), desc: t('tips.cv_item3_desc'), icon: 'fi-rr-camera', color: 'bg-orange-50 text-orange-600' },
                    { id: 4, title: t('tips.cv_item4_title'), desc: t('tips.cv_item4_desc'), icon: 'fi-rr-target', color: 'bg-purple-50 text-purple-600' },
                    { id: 5, title: t('tips.cv_item5_title'), desc: t('tips.cv_item5_desc'), icon: 'fi-rr-document-signed', color: 'bg-teal-50 text-[#1f6d78]' }
                ];
                return (
                    <div className="flex flex-col gap-1 py-6 px-4 no-scrollbar">
                        <div className="mb-6 px-4">
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 leading-relaxed">
                                {t('sidebar.cv_tips')}
                            </p>
                            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                                {t('tips.cv_title')}
                            </h3>
                        </div>
                        {tips.map((tip) => (
                            <div
                                key={tip.id}
                                className="flex items-start gap-4 p-5 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group border border-transparent hover:border-gray-100 dark:hover:border-white/5"
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${tip.color} dark:bg-white/5`}>
                                    <i className={`fi ${tip.icon} text-lg`}></i>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[13px] font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-[#1f6d78] dark:group-hover:text-[#2dd4bf] transition-colors">{tip.title}</h4>
                                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-8 p-6 rounded-3xl bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 border border-[#1f6d78]/10 mx-2">
                             <div className="flex items-center gap-3 mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#1f6d78] animate-pulse"></span>
                                <span className="text-[10px] font-black text-[#1f6d78] uppercase tracking-widest">{t('list.tip_title')}</span>
                             </div>
                             <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                {t('list.tip_quote')}
                             </p>
                        </div>
                    </div>
                );
            case 'notifications':
                if (!user) {
                    return (
                        <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] mb-8 shadow-sm">
                                <i className="fi fi-rr-bell text-4xl"></i>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">{t('list.auth_required_notif_title')}</h3>
                            <p className="text-[15px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[320px]">
                                {t('notif.login_required_desc')}
                            </p>
                        </div>
                    );
                }
                return (
                    <div className="flex flex-col h-[calc(100vh-180px)] overflow-hidden">
                         <div className="flex-1 overflow-y-auto no-scrollbar">
                            <NotificationDropdown
                                onClose={() => {}}
                                notifications={notifications}
                                onAction={onNotificationAction || (() => {})}
                                onMarkRead={onMarkRead}
                                onMarkAllRead={onMarkAllRead}
                                embedded={true}
                            />
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
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-white/20 px-8 py-8 shrink-0">
                <div className="flex items-center gap-4">
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
