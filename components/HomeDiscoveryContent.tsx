import React from 'react';
import { useLocation } from 'react-router-dom';
import BusinessCard from './BusinessCard';
import CompanyCard from './CompanyCard';
import ShopCard from './ShopCard';
import SortDropdown from './SortDropdown';
import Filters from './Filters';
import { BusinessCardSkeleton } from './Skeleton';
import { CV, Company } from '../types';

interface HomeDiscoveryContentProps {
  viewMode: 'cvs' | 'shops' | 'employers';
  sortBy: string;
  setSortBy: (val: string) => void;
  isDesktopFilterOpen: boolean;
  activeFilters: any;
  handleFilterUpdate: (filters: any) => void;
  availableProfessions: any[];
  availableCities: any[];
  activeFilterModal: string | null;
  setActiveFilterModal: (val: string | null) => void;
  loading: boolean;
  currentItems: CV[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  handleCVClick: (cv: CV) => void;
  handleCompanyClick: (company: Company) => void;
  filteredEmployers: Company[];
  filteredShops: any[];
  filteredCVs: CV[];
  ITEMS_PER_PAGE: number;
  showEndMessage: boolean;
  activeShop: any;
  setActiveShop: (shop: any) => void;
  isShopProfileOpen: boolean;
  setIsShopProfileOpen: (open: boolean) => void;
  t: (key: string) => string;
}

const HomeDiscoveryContent: React.FC<HomeDiscoveryContentProps> = ({
  viewMode,
  sortBy,
  setSortBy,
  isDesktopFilterOpen,
  activeFilters,
  handleFilterUpdate,
  availableProfessions,
  availableCities,
  activeFilterModal,
  setActiveFilterModal,
  loading,
  currentItems,
  currentPage,
  totalPages,
  setCurrentPage,
  handleCVClick,
  handleCompanyClick,
  filteredEmployers,
  filteredShops,
  filteredCVs,
  ITEMS_PER_PAGE,
  showEndMessage,
  activeShop,
  setActiveShop,
  isShopProfileOpen,
  setIsShopProfileOpen,
  t
}) => {
  const location = useLocation();

  return (
    <>
      <div className="flex sm:hidden items-start justify-between px-4 mt-2 mb-0 pl-6">
        <div className="flex flex-col gap-0 w-full pt-1 pb-0.5">
          {((viewMode === 'cvs') || 
            (viewMode === 'shops') || 
            (viewMode === 'employers')) && (
            <div className="pb-2 flex items-center gap-2">
              <div className="text-[22px] font-[1000] tracking-tighter text-black dark:text-white transition-all leading-none [text-shadow:0_0_0.5px_rgba(0,0,0,0.5)] dark:[text-shadow:0_0_0.5px_rgba(255,255,255,0.5)]">
                {viewMode === 'cvs' ? t('menu.job_seekers') : viewMode === 'shops' ? t('menu.services') : t('menu.employers')}
              </div>
              <div className="flex items-center pt-0.5">
                <SortDropdown value={sortBy} onChange={setSortBy} minimal={true} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters are now moved to Top Navbar */}
      {isDesktopFilterOpen && viewMode === 'cvs' && (
        <div className="hidden sm:block mb-3 pb-4 mt-2 lg:-ml-4 mr-8 px-1 border-b border-gray-100 dark:border-gray-800/50">
          <Filters
            currentFilters={activeFilters}
            onChange={handleFilterUpdate}
            availableProfessions={availableProfessions}
            availableCities={availableCities}
            activeModal={activeFilterModal}
            onActiveModalChange={setActiveFilterModal}
          />
        </div>
      )}

      {/* Desktop Category Title & Sort */}
      <div className="hidden sm:block mt-8 mb-3 lg:pl-1.5 px-1">
        <div className="flex items-center justify-start gap-4">
          <h1 className="text-[24px] font-black tracking-tighter text-black dark:text-white leading-none">
            {viewMode === 'cvs' ? t('home.discovery_seekers') : viewMode === 'shops' ? t('home.discovery_services') : t('home.discovery_employers')}
          </h1>
          <SortDropdown value={sortBy} onChange={setSortBy} minimal={true} />
        </div>
      </div>

      <div className="flex flex-col sm:gap-0 -mt-1 sm:mt-0 lg:pl-0">
        {loading ? (
          <div className="space-y-6">
            <BusinessCardSkeleton />
            <BusinessCardSkeleton />
            <BusinessCardSkeleton />
            <BusinessCardSkeleton />
            <BusinessCardSkeleton />
          </div>
        ) : viewMode === 'cvs' ? (
          currentItems.length > 0 ? (
            <>
              {currentItems.map(cv => (
                <BusinessCard 
                  key={cv.id} 
                  cv={cv} 
                  onClick={() => handleCVClick(cv)} 
                  isActive={location.pathname === `/cv/${cv.slug}` || location.pathname === `/cv/${cv.id}`}
                />
              ))}
              {currentPage === totalPages && showEndMessage && (
                <div className="mt-4 mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <h3 className="text-[13px] font-black text-gray-900 dark:text-white">{t('feed.end_title')}</h3>
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{t('feed.end_desc')}</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-16 text-center text-gray-800 dark:text-white font-bold">{t('feed.no_results')}</div>
          )
        ) : viewMode === 'employers' ? (
          <div className="flex flex-col">
            {filteredEmployers.length > 0 ? filteredEmployers.map(company => (
              <CompanyCard 
                key={company.id} 
                company={company} 
                onClick={() => handleCompanyClick(company)}
                isActive={location.pathname === `/company/${company.slug}` || location.pathname === `/company/${company.id}`}
              />
            )) : <div className="p-16 text-center font-bold text-gray-500 dark:text-gray-400">{t('feed.no_results')}</div>}
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredShops.length > 0 ? filteredShops.map(shop => (
              <ShopCard 
                key={shop.id} 
                shop={shop} 
                onClick={() => { setActiveShop(shop); setIsShopProfileOpen(true); }} 
                isActive={activeShop?.id === shop.id && isShopProfileOpen}
              />
            )) : <div className="p-16 text-center font-black italic opacity-50 text-gray-500 dark:text-gray-400">{t('sidebar.no_data')}</div>}
          </div>
        )}
      </div>

      {filteredCVs.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex flex-col items-center gap-4 pb-44 sm:pb-8 animate-in fade-in duration-700">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Previous Button */}
            <button 
              disabled={currentPage === 1} 
              onClick={() => {
                setCurrentPage(p => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={`flex items-center gap-1 sm:gap-2 px-2 py-2 rounded-xl text-sm font-bold transition-all ${
                currentPage === 1 
                  ? 'opacity-20 cursor-not-allowed dark:bg-transparent' 
                  : 'text-[#1f6d78] hover:opacity-70 dark:text-[#2dd4bf]'
              }`}
            >
              <i className="fi fi-rr-arrow-small-left text-lg"></i>
              <span className="text-xs sm:text-sm">{t('pagination.prev')}</span>
            </button>

            {/* Page Numbers - Direct Access */}
            <div className="flex items-center gap-1 sm:gap-2 mx-0.5 sm:mx-2">
              {(() => {
                const pages = [];
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-black transition-all flex items-center justify-center ${
                        currentPage === i
                          ? 'bg-[#1f6d78] text-white shadow-lg shadow-[#1f6d78]/20 dark:bg-[#2dd4bf] dark:text-black dark:shadow-[#2dd4bf]/20'
                          : 'bg-white text-gray-400 border border-gray-100 hover:border-[#1f6d78]/30 dark:bg-black dark:text-gray-500 dark:border-white/5 dark:hover:border-[#2dd4bf]/30'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                return pages;
              })()}
            </div>

            {/* Next Button */}
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => {
                setCurrentPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={`flex items-center gap-1 sm:gap-2 px-2 py-2 rounded-xl text-sm font-bold transition-all ${
                currentPage === totalPages 
                  ? 'opacity-20 cursor-not-allowed dark:bg-transparent' 
                  : 'text-[#1f6d78] hover:opacity-70 dark:text-[#2dd4bf]'
              }`}
            >
              <span className="text-xs sm:text-sm">{t('pagination.next')}</span>
              <i className="fi fi-rr-arrow-small-right text-lg"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeDiscoveryContent;
