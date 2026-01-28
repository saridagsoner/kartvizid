import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-[#F0F2F5] dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 pt-8 pb-6 sm:pt-16 sm:pb-8 mt-auto border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-12 mb-8 sm:mb-16">

                    {/* Brand Column */}
                    <div className="space-y-4 sm:space-y-6 col-span-2 lg:col-span-1">
                        <div className="flex flex-col shrink-0 w-fit cursor-pointer hover:opacity-80 transition-opacity group">
                            <div className="flex items-center text-[#2b2b2b] dark:text-white text-2xl sm:text-[32px] font-bold tracking-tight rounded-font leading-none">
                                <span>Kartvizi</span>
                                <span className="inline-block ml-1 transform rotate-[12deg] origin-center translate-y-[-1px] text-[#1f6d78] font-black">d</span>
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 tracking-[-0.01em] mt-0.5 leading-none whitespace-nowrap">
                                dijital cv & doğru eşleşme
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            {t('footer.brand_desc')}
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon path="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            <SocialIcon path="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                            <SocialIcon path="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M16 2H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4z" />
                            <SocialIcon path="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 text-black dark:text-white">{t('footer.usage')}</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.general_terms')}</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">{t('footer.security')}</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">{t('footer.faq')}</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">{t('footer.help')}</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">{t('footer.services')}</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 text-black dark:text-white">{t('footer.data_policy')}</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Aydınlatma Metni</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.cookie_policy')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.kvkk')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.membership_agreement')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.data_owner_form')}</a></li>
                        </ul>
                    </div>

                    {/* App Download */}
                    <div className="col-span-2 lg:col-span-1 mt-4 lg:mt-0">
                        <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 text-black dark:text-white">{t('footer.mobile_app')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">{t('footer.mobile_desc')}</p>
                        <div className="flex flex-row sm:flex-col gap-3">
                            <AppButton
                                store="App Store"
                                subtitle="'dan İndirin"
                                icon={<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.17.66-.42v-1.61c-2.78.48-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-1.55.9-2.07-.09-.25-.39-.98.09-2.04 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.48 1.06.19 1.79.09 2.04.52.52.9.96.9 2.07 0 3.81-2.35 4.66-4.56 4.91.36.31.69.94.69 1.92v2.85c0 .25.16.51.67.42C19.13 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />}
                            />
                            <AppButton
                                store="Google Play"
                                subtitle="'den Edinin"
                                icon={<path d="M5 3.135L19.5 12 5 20.865V3.135z M20.5 12.5L6.5 21.5 8 13z M6.5 2.5L20.5 11.5 8 11z" />} // Simplified Play icon shape
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-[10px] sm:text-xs font-medium text-center sm:text-left">
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ path }: { path: string }) => (
    <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white hover:border-[#1f6d78] transition-all shadow-sm">
        <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
        </svg>
    </a>
);

const AppButton = ({ store, subtitle, icon }: { store: string, subtitle: string, icon: React.ReactNode }) => (
    <button className="flex-1 sm:flex-none bg-[#1f6d78] border border-[#1f6d78] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 hover:bg-[#155e68] hover:border-[#155e68] transition-all group w-full sm:w-fit sm:min-w-[160px] shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300 group-hover:text-white transition-colors sm:w-6 sm:h-6">
            {icon}
        </svg>
        <div className="text-left">
            <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase leading-tight">{subtitle}</p>
            <p className="text-xs sm:text-sm font-bold text-white leading-tight">{store}</p>
        </div>
    </button>
);

export default Footer;
