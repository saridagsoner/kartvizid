
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const consent = localStorage.getItem('kartvizid_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('kartvizid_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 sm:bottom-6 left-0 right-0 z-[300] px-4 animate-in slide-in-from-bottom-10 duration-500">
            <div className="max-w-4xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-2xl rounded-[28px] p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex-1">
                    <h4 className="font-black text-gray-900 dark:text-white mb-1 text-sm md:text-base">🍪 Deneyiminizi İyileştiriyoruz</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed font-medium">
                        Sitemizde en iyi deneyimi sunmak, trafiği analiz etmek ve reklamları kişiselleştirmek için çerezleri kullanıyoruz. Sitemizi kullanmaya devam ederek çerez kullanımını kabul etmiş sayılırsınız. 
                        <a href="/cerez-politikasi" className="text-[#1f6d78] dark:text-[#2dd4bf] font-bold hover:underline ml-1">Çerez Politikası</a>
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button 
                        onClick={handleAccept}
                        className="bg-[#1f6d78] text-white px-8 py-3 rounded-2xl font-black text-sm hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-[#1f6d78]/20"
                    >
                        Anladım, Kabul Et
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
