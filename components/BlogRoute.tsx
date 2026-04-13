import React from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getLocalizedArticles } from '../constants/articles';
import { useLanguage } from '../context/LanguageContext';
import SEO from './SEO';

interface BlogRouteProps {
  isInline?: boolean; // If true, it renders inside the 3-column shell (no fixed inset)
  viewType?: 'list' | 'detail'; // Specifically force list or detail
}

const CATEGORY_STYLES: Record<string, { icon: string; color: string }> = {
  'İş Arayışında Uzmanlık': { icon: 'fi-rr-search-alt', color: '#3b82f6' },
  'Mülakat Teknikleri': { icon: 'fi-rr-comment-user', color: '#8b5cf6' },
  'Networking ve Kişisel Marka': { icon: 'fi-rr-users', color: '#ec4899' },
  'Teknoloji ve Gelecek': { icon: 'fi-rr-rocket-lunch', color: '#f59e0b' },
  'Kariyer Dönüşümü': { icon: 'fi-rr-refresh', color: '#ef4444' },
  'Maaş ve Finans': { icon: 'fi-rr-bank', color: '#10b981' },
  'Yaşam Tarzı': { icon: 'fi-rr-leaf', color: '#84cc16' },
  'Yönetim': { icon: 'fi-rr-user-gear', color: '#6366f1' },
  'İş Yeri Psikolojisi': { icon: 'fi-rr-brain', color: '#06b6d4' },
  'Kişisel Gelişim': { icon: 'fi-rr-book-open-reader', color: '#f97316' },
  'Gelecek ve Gençler': { icon: 'fi-rr-graduation-cap', color: '#14b8a6' },
  'Global Kariyer': { icon: 'fi-rr-world', color: '#0ea5e9' },
  // Localized keys for styles (added by ID/Key if needed)
  'Job Search Expertise': { icon: 'fi-rr-search-alt', color: '#3b82f6' },
  'Interview Techniques': { icon: 'fi-rr-comment-user', color: '#8b5cf6' },
  'Networking & Personal Branding': { icon: 'fi-rr-users', color: '#ec4899' },
  'Technology & Future': { icon: 'fi-rr-rocket-lunch', color: '#f59e0b' },
  'Career Transformation': { icon: 'fi-rr-refresh', color: '#ef4444' },
  'Salary & Finance': { icon: 'fi-rr-bank', color: '#10b981' },
  'Lifestyle': { icon: 'fi-rr-leaf', color: '#84cc16' },
  'Management': { icon: 'fi-rr-user-gear', color: '#6366f1' },
  'Workplace Psychology': { icon: 'fi-rr-brain', color: '#06b6d4' },
  'Personal Development': { icon: 'fi-rr-book-open-reader', color: '#f97316' },
  'Future & Youth': { icon: 'fi-rr-graduation-cap', color: '#14b8a6' },
  'Global Career': { icon: 'fi-rr-world', color: '#0ea5e9' },
  'def': { icon: 'fi-rr-star', color: '#1f6d78' }
};

const BlogRoute: React.FC<BlogRouteProps> = ({ isInline = false, viewType }) => {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const articles = getLocalizedArticles(language);

  const getStyle = (category: string) => {
    return CATEGORY_STYLES[category] || CATEGORY_STYLES['def'];
  };

  const currentPath = location.pathname;
  const activeSlug = slug || (currentPath.startsWith('/rehber/') ? currentPath.split('/rehber/')[1] : null);
  
  const isListView = viewType === 'list' || (!activeSlug && !viewType);
  const isDetailView = viewType === 'detail' || (activeSlug && activeSlug !== 'rehber' && !viewType);

  if (isDetailView && activeSlug && viewType !== 'list') {
    const article = articles.find(a => a.slug === activeSlug);
    if (!article) {
      return (
        <div className="flex flex-col items-center justify-center p-12 h-full text-center">
            <div className="text-4xl mb-4">😢</div>
            <h2 className="text-xl font-black mb-4">{t('feed.no_results')}</h2>
            <button 
                onClick={() => navigate('/rehber')}
                className="bg-[#1f6d78] text-white px-6 py-2 rounded-full font-bold"
            >
                {t('blog.back')}
            </button>
        </div>
      );
    }

    const { color } = getStyle(article.category);

    return (
      <div className={isInline ? "h-full flex flex-col overflow-hidden bg-white dark:bg-black" : "fixed inset-0 z-[200] bg-white dark:bg-gray-900 overflow-y-auto custom-scrollbar"}>
        {!isInline && (
            <SEO 
                title={`${article.title} | Kartvizid ${t('blog.title')}`}
                description={article.excerpt}
            />
        )}
        
        {/* Detail Header */}
        <div className={`sticky top-0 z-50 flex justify-between items-center bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shrink-0 ${isInline ? 'px-6 py-4' : 'px-4 py-4 md:px-8'}`}>
            <div className="flex items-center gap-4 min-w-0">
                <button 
                    onClick={() => navigate('/rehber')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center gap-2 group"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span className="hidden md:inline font-bold text-sm tracking-tight">{t('blog.back')}</span>
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-[15px] font-black text-black dark:text-white truncate tracking-tight uppercase leading-none">{article.title}</h2>
                    {isInline && <span className="text-[9px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em] mt-0.5 block">{t('blog.title')}</span>}
                </div>
            </div>
            {!isInline && (
                <button 
                    onClick={() => navigate('/')}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            )}
        </div>

        <div className={`flex-1 overflow-y-auto ${isInline ? 'no-scrollbar pt-6 pb-12' : 'custom-scrollbar'}`}>
          <div className={`max-w-4xl mx-auto px-6 py-4 md:py-8 ${isInline ? '' : ''}`}>
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{article.publishedAt} • {article.readTime} {t('blog.read_time')}</span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">
                {article.title}
              </h1>
              <p className="text-[17px] md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-bold italic border-l-4 border-[#1f6d78] pl-6">
                {article.excerpt}
              </p>
            </header>
    
            <article 
              className="prose prose-sm md:prose-base dark:prose-invert max-w-none 
              prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:font-medium
              prose-strong:text-[#1f6d78] dark:prose-strong:text-[#2dd4bf]
              prose-img:rounded-3xl prose-img:shadow-2xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
    
            <footer className="mt-20 pt-10 border-t border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] text-xl font-black shrink-0 border border-gray-100 dark:border-gray-700">
                    K
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-gray-900 dark:text-white">Kartvizid</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{t('footer.brand_desc')}</p>
                  </div>
                </div>
            </footer>
          </div>
        </div>

        {/* Action Footer */}
        {isInline && (
            <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-100 dark:border-white/10 px-6 py-4 flex items-center gap-4 shrink-0">
                <button 
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({ title: article.title, url: window.location.href });
                        }
                    }}
                    className="flex-1 bg-[#1f6d78] text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-[#1f6d78]/20 active:scale-95 transition-all text-center"
                >
                    {t('blog.share')}
                </button>
                <div className="w-px h-8 bg-gray-100 dark:bg-gray-800 mx-2"></div>
                <button onClick={() => navigate('/rehber')} className="text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-all">
                    <i className="fi fi-rr-apps text-xl"></i>
                </button>
            </div>
        )}
      </div>);
  }

  // List View Rendering
  return (
    <div className={isInline ? "bg-white dark:bg-black" : "fixed inset-0 z-[200] bg-white dark:bg-gray-900 overflow-y-auto custom-scrollbar"}>
      {!isInline && (
        <>
            <SEO 
                title={`${t('blog.title')} | Kartvizid`} 
                description="Profesyonel hayatta bir adım öne geçmek için ihtiyacınız olan tüm rehber makaleler ve mülakat teknikleri."
            />
            {/* Header for standalone list */}
            <div className="sticky top-0 z-50 flex justify-between items-center px-4 py-4 md:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                </button>
                <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1f6d78] dark:text-[#2dd4bf]">{t('blog.title')}</span>
                </div>
                <div className="w-10"></div>
            </div>
        </>
      )}

      <div className={`mx-auto ${isInline ? 'p-0 w-full' : 'max-w-6xl px-4 py-12 md:py-20'}`}>
        {!isInline && (
            <div className="text-center mb-16">
                <h1 className="text-[24px] font-black mb-6 tracking-tighter uppercase">{t('blog.title')}</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold italic border-l-4 border-gray-100 pl-4">
                    İş arama sürecinden kişisel marka yönetimine kadar her aşamada yanınızdayız.
                </p>
            </div>
        )}

        {isInline && (
            <div className="flex sm:hidden items-start justify-between px-4 mt-4 mb-0 pl-6">
                <div className="flex flex-col gap-0 w-full pt-2 pb-0.5">
                    <div className="pb-2 flex items-center gap-2">
                        <h1 className="text-[22px] font-black tracking-tighter text-black dark:text-white leading-none">
                            {t('blog.title')}
                        </h1>
                    </div>
                </div>
            </div>
        )}

        {isInline && (
            <div className="hidden sm:block mt-8 mb-4 lg:pl-1.5 px-6">
                <h1 className="text-[24px] font-black tracking-tighter text-black dark:text-white leading-none">
                    {t('blog.title')}
                </h1>
            </div>
        )}

        <div className={isInline ? "flex flex-col first:pt-0" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32"}>
          {articles.map(article => {
            const style = getStyle(article.category);
            return (
              <Link 
                key={article.id} 
                to={`/rehber/${article.slug}`}
                className={`pl-0 pr-4 py-6 sm:py-5 cursor-pointer relative transition-all duration-500 group ${
                  activeSlug === article.slug 
                    ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' 
                    : 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-white/[0.02]'
                } ${!isInline ? 'group flex flex-col bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500' : ''}`}
              >
                {/* Active Selection Styling (Bridge Background) */}
                {isInline && (
                  <div className={`absolute inset-y-0 left-[-8px] w-[8px] transition-opacity duration-500 pointer-events-none ${
                      activeSlug === article.slug ? 'opacity-100 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' : 'opacity-0'
                  }`} />
                )}

                {/* Active Indicator Line */}
                {isInline && (
                  <div className={`absolute left-[-8px] top-0 bottom-0 w-1.5 bg-[#1f6d78] dark:bg-[#2dd4bf] z-10 transform transition-all duration-500 ease-in-out origin-center ${
                      activeSlug === article.slug ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                  }`} />
                )}

                {/* Divider Line */}
                {isInline && (
                  <div className="absolute bottom-0 right-4 sm:right-10 left-[58px] sm:left-[62px] border-b border-gray-200 dark:border-white/10" />
                )}

                {isInline ? (
                  <>
                    <div className="flex items-start gap-3 sm:gap-4 w-full">
                      <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ color: style.color }}>
                          <i className={`fi ${style.icon} text-2xl`}></i>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                          <div className="flex items-center gap-2 mb-0.5">
                               <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#1f6d78] dark:text-[#2dd4bf]">{article.category}</span>
                          </div>
                          <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 dark:text-white truncate tracking-tight leading-tight">{article.title}</h3>
                      </div>
                      <div className="shrink-0 self-center flex items-center text-gray-400 dark:text-gray-500 ml-2">
                          <i className="fi fi-rr-angle-small-right text-xl"></i>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                      <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: `${style.color}10` }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:scale-110 transition-transform duration-700"></div>
                          <i className={`fi ${style.icon} text-5xl opacity-80`} style={{ color: style.color }}></i>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#1f6d78] dark:text-[#2dd4bf]">
                              {article.category}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{article.readTime} {t('blog.read_time')}</span>
                          </div>
                          <h3 className="text-2xl font-black mb-4 group-hover:text-[#1f6d78] transition-colors line-clamp-2 leading-tight">
                          {article.title}
                          </h3>
                          <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6">
                          {article.excerpt}
                          </p>
                          <div className="mt-auto flex items-center gap-2 text-[#1f6d78] font-black text-sm group-hover:translate-x-2 transition-transform">
                          {t('filters.show_more')}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                          </div>
                      </div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogRoute;
