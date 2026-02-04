import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

import LegalModal, { LegalSection } from './LegalModal'; // Check path

const Footer = () => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [legalSection, setLegalSection] = React.useState<LegalSection | null>(null);

    const openLegal = (section: LegalSection) => (e: React.MouseEvent) => {
        e.preventDefault();
        setLegalSection(section);
    };

    const handleAppClick = () => {
        showToast("Mobil uygulamamız çok yakında! Şimdilik web sitemizden devam edebilirsiniz.", "info");
    };

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
                            {/* X (Twitter) */}
                            <SocialIcon href="https://x.com/kartvizid" path="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            {/* Instagram */}
                            <SocialIcon href="https://instagram.com/kartvizid" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            {/* YouTube */}
                            <SocialIcon href="https://youtube.com/@kartvizid" path="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            {/* Facebook */}
                            <SocialIcon href="#" path="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 text-black dark:text-white">{t('footer.usage')}</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                            <li><a href="#" onClick={openLegal('general')} className="hover:text-black dark:hover:text-white transition-colors">{t('footer.general_terms')}</a></li>
                            <li><a href="#" onClick={openLegal('security')} className="hover:text-black transition-colors">{t('footer.security')}</a></li>
                            <li><a href="#" onClick={openLegal('faq')} className="hover:text-black transition-colors">{t('footer.faq')}</a></li>
                            <li><a href="#" onClick={openLegal('help')} className="hover:text-black transition-colors">{t('footer.help')}</a></li>
                            <li><a href="#" onClick={openLegal('services')} className="hover:text-black transition-colors">{t('footer.services')}</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 text-black dark:text-white">{t('footer.data_policy')}</h3>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                            <li><a href="#" onClick={openLegal('privacy')} className="hover:text-black dark:hover:text-white transition-colors">Aydınlatma Metni</a></li>
                            <li><a href="#" onClick={openLegal('cookie')} className="hover:text-black dark:hover:text-white transition-colors">{t('footer.cookie_policy')}</a></li>
                            <li><a href="#" onClick={openLegal('kvkk')} className="hover:text-black dark:hover:text-white transition-colors">{t('footer.kvkk')}</a></li>
                            <li><a href="#" onClick={openLegal('membership')} className="hover:text-black dark:hover:text-white transition-colors">{t('footer.membership_agreement')}</a></li>
                            <li><a href="#" onClick={openLegal('data_form')} className="hover:text-black dark:hover:text-white transition-colors">{t('footer.data_owner_form')}</a></li>
                        </ul>
                    </div>

                    {/* App Download */}
                    <div className="col-span-2 lg:col-span-1 mt-4 lg:mt-0">
                        <h3 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 text-black dark:text-white">{t('footer.mobile_app')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">{t('footer.mobile_desc')}</p>
                        <div className="flex flex-row sm:flex-col gap-3">
                            <AppButton
                                onClick={handleAppClick}
                                store="App Store"
                                subtitle="'dan İndirin"
                                icon={<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.17.66-.42v-1.61c-2.78.48-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-1.55.9-2.07-.09-.25-.39-.98.09-2.04 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.48 1.06.19 1.79.09 2.04.52.52.9.96.9 2.07 0 3.81-2.35 4.66-4.56 4.91.36.31.69.94.69 1.92v2.85c0 .25.16.51.67.42C19.13 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />}
                            />
                            <AppButton
                                onClick={handleAppClick}
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

            {legalSection && (
                <LegalModal
                    initialSection={legalSection}
                    onClose={() => setLegalSection(null)}
                />
            )}
        </footer>
    );
};

const SocialIcon = ({ path, href = "#" }: { path: string, href?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white hover:border-[#1f6d78] transition-all shadow-sm">
        <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d={path} />
        </svg>
    </a>
);

const AppButton = ({ store, subtitle, icon, onClick }: { store: string, subtitle: string, icon: React.ReactNode, onClick?: () => void }) => (
    <button onClick={onClick} className="flex-1 sm:flex-none bg-[#1f6d78] border border-[#1f6d78] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 hover:bg-[#155e68] hover:border-[#155e68] transition-all group w-full sm:w-fit sm:min-w-[160px] shadow-sm active:scale-95">
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
