import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#F0F2F5] text-gray-800 pt-16 pb-8 mt-auto border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex flex-col shrink-0 w-fit cursor-pointer hover:opacity-80 transition-opacity group">
                            <div className="flex items-center text-[#2b2b2b] text-[32px] font-bold tracking-tight rounded-font leading-none">
                                <span>Kartvizi</span>
                                <span className="inline-block ml-1 transform rotate-[12deg] origin-center translate-y-[-1px] text-[#1f6d78] font-black">d</span>
                            </div>
                            <span className="text-[11px] font-semibold text-gray-400 tracking-[-0.01em] mt-0.5 leading-none whitespace-nowrap">
                                Dijital Cv & Doğru Eşleşme
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Türkiye'nin yeni nesil dijital CV ve iş eşleşme platformu.
                            Kariyer yolculuğunuzda size en uygun fırsatları sunmak için buradayız.
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
                        <h3 className="text-lg font-bold mb-6 text-black">Site Kullanımı</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-black transition-colors">Genel Koşullar</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Güvenlik İpuçları</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Sıkça Sorulan Sorular</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Yardım Merkezi</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Hizmetlerimiz</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-black">Veri Politikamız</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-black transition-colors">Aydınlatma Metni</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Çerez Politikası</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">KVKK Aydınlatma</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Üyelik Sözleşmesi</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Veri Sahibi Başvuru Formu</a></li>
                        </ul>
                    </div>

                    {/* App Download */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-black">Mobil Uygulama</h3>
                        <p className="text-gray-500 text-sm mb-6">İş fırsatlarını cebinizden takip edin.</p>
                        <div className="flex flex-col gap-3">
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

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs font-medium">
                        © 2024 Kartvizid Elektronik İletişim ve Yayıncılık Hizmetleri A.Ş. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ path }: { path: string }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
        </svg>
    </a>
);

const AppButton = ({ store, subtitle, icon }: { store: string, subtitle: string, icon: React.ReactNode }) => (
    <button className="bg-black border border-gray-800 rounded-xl px-4 py-2.5 flex items-center gap-3 hover:bg-gray-800 hover:border-gray-700 transition-all group w-fit min-w-[160px] shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300 group-hover:text-white transition-colors">
            {icon}
        </svg>
        <div className="text-left">
            <p className="text-[9px] text-gray-400 uppercase leading-tight">{subtitle}</p>
            <p className="text-sm font-bold text-white leading-tight">{store}</p>
        </div>
    </button>
);

export default Footer;
