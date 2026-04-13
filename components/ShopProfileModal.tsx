import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface ShopProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: {
    id: string;
    user_id?: string;
    name: string;
    profession: string;
    city: string;
    district?: string;
    phone?: string;
    logo_url?: string;
    description?: string;
    views?: number;
  };
  onOpenChat?: () => void;
}

const ShopProfileModal: React.FC<ShopProfileModalProps> = ({ isOpen, onClose, shop, onOpenChat }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  if (!isOpen) return null;

  const isOwner = user && shop.user_id === user.id;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-2xl sm:rounded-[40px] shadow-2xl overflow-hidden animate-slide-up sm:animate-in sm:zoom-in-95 duration-300 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-50 shadow-sm"
        >
          <i className="fi fi-rr-cross-small text-xl text-gray-500"></i>
        </button>

        <div className="flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header/Cover */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-[#1f6d78] to-[#2dd4bf] relative shrink-0">
             <div className="absolute -bottom-10 left-6 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 rounded-[25px] sm:rounded-[35px] border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                {shop.logo_url ? (
                  <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">
                    <i className="fi fi-rr-shop"></i>
                  </div>
                )}
             </div>
          </div>

          <div className="pt-14 px-6 sm:px-10 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                  {shop.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs sm:text-sm font-bold text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-widest">
                    {shop.profession}
                  </span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
                  <span className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500">
                    {shop.city}{shop.district ? `, ${shop.district}` : ''}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                 {!isOwner && (
                   <button 
                    onClick={onOpenChat}
                    className="flex-1 sm:flex-none bg-[#1f6d78] text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#155e68] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1f6d78]/20"
                   >
                      <i className="fi fi-rr-paper-plane"></i>
                      <span>{t('profile.send_message')}</span>
                   </button>
                 )}
                 {isOwner && (
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl">
                      {t('shop.owner_tag')}
                   </div>
                 )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{t('shop.location')}</p>
                  <p className="font-bold text-gray-900 dark:text-white truncate">{shop.city}</p>
               </div>
               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{t('shop.views')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{shop.views || 0}</p>
               </div>
               <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{t('shop.account_type')}</p>
                  <p className="font-bold text-[#1f6d78] dark:text-[#2dd4bf]">{t('shop.pro_service')}</p>
               </div>
            </div>

            {shop.description && (
              <div className="mt-8">
                <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{t('shop.about_section')}</h3>
                <div className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed bg-white dark:bg-gray-800 border-l-4 border-[#1f6d78] pl-5 py-2">
                  {shop.description}
                </div>
              </div>
            )}
            
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
               <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[200px]">
                  {t('shop.verification_text')}
               </p>
               <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-[#1f6d78] transition-colors shadow-sm">
                    <i className="fi fi-rr-share"></i>
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                    <i className="fi fi-rr-heart"></i>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfileModal;
