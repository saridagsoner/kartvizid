
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BLOG_ARTICLES } from '../constants/articles';
import { useLanguage } from '../context/LanguageContext';
import SEO from './SEO';

const BlogRoute: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (slug) {
    const article = BLOG_ARTICLES.find(a => a.slug === slug);
    if (!article) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Makale bulunamadı</h2>
          <button 
            onClick={() => navigate('/rehber')}
            className="bg-[#1f6d78] text-white px-6 py-2 rounded-full font-bold"
          >
            Rehber'e Dön
          </button>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-300">
        {/* Sticky Detail Header */}
        <div className="sticky top-0 z-50 flex justify-between items-center px-4 py-4 md:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
           <button 
             onClick={() => navigate('/rehber')}
             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center gap-2 group"
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <line x1="19" y1="12" x2="5" y2="12"></line>
               <polyline points="12 19 5 12 12 5"></polyline>
             </svg>
             <span className="hidden md:inline font-bold text-sm">Geri</span>
           </button>
           <div className="flex-1 text-center truncate px-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Okuyorsunuz</span>
               <h2 className="text-xs font-black truncate dark:text-white uppercase">{article.title}</h2>
           </div>
           <button 
             onClick={() => navigate('/')}
             className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-full transition-colors"
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <SEO 
            title={`${article.title} | Kartvizid Rehber`}
            description={article.excerpt}
          />
          
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-gray-400 text-xs font-medium">{article.publishedAt} • {article.readTime} okuma</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic border-l-4 border-[#1f6d78] pl-6">
              {article.excerpt}
            </p>
          </header>
  
          <article 
            className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-[#1f6d78] dark:prose-strong:text-[#2dd4bf]
            prose-img:rounded-3xl prose-img:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
  
          <footer className="mt-16 pt-8 pb-20 border-t border-gray-100 dark:border-gray-800">
            <div className="bg-[#F0F2F5] dark:bg-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-[#1f6d78] rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                K
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-black text-lg mb-2">Kartvizid Editör Ekibi</h4>
                <p className="text-gray-500 text-sm">Bu içerik kariyer yolculuğunuzda size rehberlik etmek amacıyla profesyonel danışmanlarımız tarafından hazırlanmıştır.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      {/* Mobile Back Button / Close */}
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
         <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#1f6d78] dark:text-[#2dd4bf]">Kariyer Rehberi</span>
         </div>
         <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <SEO 
          title="Kariyer Rehberi | Kartvizid" 
          description="Profesyonel hayatta bir adım öne geçmek için ihtiyacınız olan tüm rehber makaleler ve mülakat teknikleri."
        />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Kariyer Rehberi</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            İş arama sürecinden kişisel marka yönetimine kadar her aşamada yanınızdayız.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {BLOG_ARTICLES.map(article => (
            <Link 
              key={article.id} 
              to={`/rehber/${article.slug}`}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="h-48 bg-[#F0F2F5] dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#1f6d78]/20 to-transparent group-hover:scale-110 transition-transform duration-700"></div>
                 <i className={`fi ${
                   article.category === 'Mülakat Teknikleri' ? 'fi-rr-comment-user' : 
                   article.category === 'Kariyer Tavsiyeleri' ? 'fi-rr-briefcase' : 'fi-rr-star'
                 } text-5xl text-[#1f6d78] dark:text-[#2dd4bf] opacity-80`}></i>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1f6d78] dark:text-[#2dd4bf]">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{article.readTime} okuma</span>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-[#1f6d78] transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6">
                  {article.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[#1f6d78] font-black text-sm group-hover:translate-x-2 transition-transform">
                  Devamını Oku
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogRoute;
