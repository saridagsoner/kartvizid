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
      <div className="flex sm:hidden items-start justify-between px-4 mt-4 mb-0 pl-6">
        <div className="flex flex-col gap-0 w-full pt-2 pb-0.5">
          {((viewMode === 'cvs') || 
            (viewMode === 'shops') || 
            (viewMode === 'employers')) && (
            <div className="pb-2 flex items-center gap-2">
              <div className="text-[22px] font-black tracking-tighter text-black dark:text-white transition-all leading-none">
                {viewMode === 'cvs' ? 'İş Arayanlar' : viewMode === 'shops' ? 'Hizmetler' : 'İş Verenler'}
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
            {viewMode === 'cvs' ? 'İş Arayanlar' : viewMode === 'shops' ? 'Hizmetler' : 'İş Verenler'}
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
            )) : <div className="p-16 text-center font-bold">Şirket bulunamadı.</div>}
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
            )) : <div className="p-16 text-center font-black italic opacity-50">Henüz Kayıtlı Hizmet Yok</div>}
          </div>
        )}
      </div>

      {filteredCVs.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center items-center gap-4 pb-12 sm:pb-8">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 border rounded-full">←</button>
          <span className="font-bold text-sm text-gray-500">{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 border rounded-full">→</button>
        </div>
      )}
    </>
  );
};

export default HomeDiscoveryContent;
