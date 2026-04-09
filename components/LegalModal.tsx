import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type LegalSection =
    | 'general'
    | 'security'
    | 'faq'
    | 'help'
    | 'services'
    | 'privacy'
    | 'cookie'
    | 'kvkk'
    | 'membership'
    | 'data_form'
    | 'iletisim'
    | 'about';

interface LegalModalProps {
    initialSection?: LegalSection;
    onClose: () => void;
    onNavigate?: (section: LegalSection) => void;
    isInline?: boolean; // If true, it renders inside the 3-column shell
}

export const LEGAL_CONTENT: Record<LegalSection, { title: string; content: React.ReactNode }> = {
    about: {
        title: "Hakkımızda",
        content: (
            <div className="space-y-6">
                <p className="text-lg font-bold text-[#1f6d78] dark:text-[#2dd4bf]">Kartvizid.com: Dijital Kariyerinizin Yeni Nesil Yüzü</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">Kartvizid, modern iş dünyasının en büyük problemlerinden biri olan "doğru aday ve doğru işveren eşleşmesi" sorununa yenilikçi bir çözüm sunmak amacıyla kurulmuş bir "Tersine İşe Alım" platformudur.</p>
                
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Vizyonumuz</h4>
                <p className="font-medium text-gray-700 dark:text-gray-300">İş arama sürecini, adayların birer "başvuru numarası" olmaktan çıkıp, kendi yeteneklerini ve profesyonel kimliklerini sergiledikleri bir dijital vitrine dönüştürmektir. Bizim dünyamızda işler adayları bulur, adaylar ise sadece kendilerine en uygun olanı seçer.</p>

                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Neden Kartvizid?</h4>
                <p className="font-medium text-gray-700 dark:text-gray-300">Geleneksel iş ilanları arasında kaybolmak, yüzlerce yere başvurup yanıt alamamak yorucudur. Kartvizid ile bir kez profilinizi oluşturursunuz ve işverenlerin gelişmiş filtreleme sistemimizle size ulaşmasını sağlarsınız.</p>
                
                <p className="font-medium text-gray-700 dark:text-gray-300">2026 yılı itibariyle dijitalleşen iş dünyasında, kağıt üzerindeki CV'lerin yerini interaktif, paylaşılabilir ve karekod destekli dijital kartvizitler alıyor. Biz bu geleceğin öncüsü olmayı hedefliyoruz.</p>
            </div>
        )
    },
    general: {
        title: "Genel Koşullar",
        content: (
            <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                <p><strong className="text-gray-900 dark:text-white">1. Platformun Amacı</strong><br />Kartvizid.com, iş arayanların ("Aday") dijital profillerini sergilediği ve işverenlerin ("İşveren") bu profilleri inceleyerek doğrudan iletişim kurabildiği bir ekosistemdir.</p>
                <p><strong className="text-gray-900 dark:text-white">2. Tersine İşe Alım Modeli</strong><br />Platformda klasik usülde ilan açma ve başvuru yapma özellikleri bulunmamaktadır. İşverenler, adaylara "İletişim Talebi" gönderirler.</p>
                <p><strong className="text-gray-900 dark:text-white">3. Hesap Oluşturma ve Doğruluk</strong><br />Adaylar, profillerinde yer verdikleri bilgilerin gerçeği yansıttığını taahhüt ederler.</p>
            </div>
        )
    },
    security: {
        title: "Güvenlik İpuçları",
        content: (
            <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                <p>İnternet üzerinde iş ararken güvenliğinizi korumak en önemli önceliğiniz olmalıdır:</p>
                <ul className="list-disc pl-5 space-y-3">
                    <li><strong className="text-gray-900 dark:text-white">Hassas Veri Paylaşımı:</strong> T.C. Kimlik numaranız veya banka bilgileriniz gibi verileri ilk yazışmalarda paylaşmayın.</li>
                    <li><strong className="text-gray-900 dark:text-white">İşveren Profilini İnceleyin:</strong> Sizi davet eden şirketin kurumsal kimliğinden emin olun.</li>
                    <li><strong className="text-gray-900 dark:text-white">Asla Para Ödemeyin:</strong> Gerçek işverenler hiçbir ad altında sizden para talep etmez.</li>
                    <li><strong className="text-gray-900 dark:text-white">Güvenli İletişim:</strong> İlk görüşmelerinizi platform üzerinden yapmanızı öneririz.</li>
                </ul>
            </div>
        )
    },
    faq: {
        title: "Sıkça Sorulan Sorular",
        content: (
            <div className="space-y-6">
                <div>
                    <h4 className="font-black text-gray-900 dark:text-white border-l-4 border-[#1f6d78] pl-3 mb-2 tracking-tight">Kartvizid.com tam olarak nedir?</h4>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Kartvizid bir "tersine işe alım" platformudur. Burada adaylar ilanlara başvurmak yerine, dijital kartlarını oluşturur ve işverenlerin kendilerine ulaşmasını sağlar.</p>
                </div>
                <div>
                    <h4 className="font-black text-gray-900 dark:text-white border-l-4 border-[#1f6d78] pl-3 mb-2 tracking-tight">Ücretli mi?</h4>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Hayır, Kartvizid'de profil oluşturmak ve işverenlerle iletişime geçmek adaylar için tamamen ücretsizdir.</p>
                </div>
                <div>
                    <h4 className="font-black text-gray-900 dark:text-white border-l-4 border-[#1f6d78] pl-3 mb-2 tracking-tight">Bilgilerim güvende mi?</h4>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Evet, iletişim bilgileriniz onay vermediğiniz sürece işverenlere gösterilmez.</p>
                </div>
            </div>
        )
    },
    help: {
        title: "Yardım Merkezi",
        content: (
            <div className="space-y-6">
                <p className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic border-l-4 border-[#1f6d78] pl-4">Sorunlarınız ve geri bildirimleriniz için bize her zaman ulaşabilirsiniz.</p>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="font-black uppercase tracking-widest text-[10px] text-gray-400 mb-1">E-posta Desteği</p>
                    <p className="text-xl font-black text-[#1f6d78] dark:text-[#2dd4bf]">destek@kartvizid.com</p>
                </div>
                <p className="font-medium text-gray-500 text-sm">Teknik sorunlar, hesap erişim problemleri veya kötüye kullanım bildirimleri için lütfen yukarıdaki adresten bizimle iletişime geçin.</p>
            </div>
        )
    },
    iletisim: {
        title: "İletişim",
        content: (
            <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed italic border-l-4 border-gray-100 dark:border-white/5 pl-4">Kartvizid ekibi olarak size yardımcı olmak için buradayız. Her türlü soru için aşağıdaki kanalları kullanabilirsiniz.</p>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="w-10 h-10 bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] rounded-full flex items-center justify-center mb-4">
                            <i className="fi fi-rr-envelope"></i>
                        </div>
                        <h4 className="font-black text-gray-900 dark:text-white mb-1 uppercase text-xs tracking-widest">Genel İletişim</h4>
                        <a href="mailto:iletisim@kartvizid.com" className="text-lg font-black text-[#1f6d78] dark:text-[#2dd4bf] hover:underline transition-all">iletisim@kartvizid.com</a>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="w-10 h-10 bg-[#1f6d78]/10 text-[#1f6d78] dark:text-[#2dd4bf] rounded-full flex items-center justify-center mb-4">
                            <i className="fi fi-rr-headset"></i>
                        </div>
                        <h4 className="font-black text-gray-900 dark:text-white mb-1 uppercase text-xs tracking-widest">Destek Merkezi</h4>
                        <a href="mailto:destek@kartvizid.com" className="text-lg font-black text-[#1f6d78] dark:text-[#2dd4bf] hover:underline transition-all">destek@kartvizid.com</a>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl">
                    <h5 className="font-black text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-tight">Yanıt Süresi</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">Gönderdiğiniz tüm e-postalar ekibimiz tarafından incelenir. Genellikle <strong>2 ile 24 saat</strong> içerisinde dönüş sağlamaktayız.</p>
                </div>
            </div>
        )
    },
    services: {
        title: "Hizmetlerimiz",
        content: (
            <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                    <h4 className="font-black text-[#1f6d78] dark:text-[#2dd4bf] mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <i className="fi fi-rr-user"></i> Aday Çözümleri
                    </h4>
                    <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <li className="flex gap-3"><span className="text-[#1f6d78]">•</span> <strong>Dinamik Dijital Profil:</strong> Saniyeler içinde oluşturulabilen profesyonel web profili.</li>
                        <li className="flex gap-3"><span className="text-[#1f6d78]">•</span> <strong>Akıllı PDF CV:</strong> Profil verilerinizden tek tıkla ATS uyumlu çıktı.</li>
                        <li className="flex gap-3"><span className="text-[#1f6d78]">•</span> <strong>QR Kod:</strong> Doğrudan dijital profilinize yönlendiren özel karekod.</li>
                    </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                    <h4 className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                        <i className="fi fi-rr-building"></i> İşveren Çözümleri
                    </h4>
                    <ul className="space-y-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <li className="flex gap-3"><span className="text-gray-400">•</span> <strong>Gelişmiş Filtreleme:</strong> Nokta atışı aday arama motoru.</li>
                        <li className="flex gap-3"><span className="text-gray-400">•</span> <strong>Doğrudan Davet:</strong> Aracı olmadan anında iletişim talebi.</li>
                    </ul>
                </div>
            </div>
        )
    },
    privacy: {
        title: "Aydınlatma Metni",
        content: (
            <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                <p>Kartvizid.com olarak kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz.</p>
                <p><strong className="text-gray-900 dark:text-white uppercase text-xs tracking-widest">İşlenen Veriler:</strong> Ad-soyad, iletişim bilgileri, eğitim ve iş geçmişi.</p>
                <p><strong className="text-gray-900 dark:text-white uppercase text-xs tracking-widest">İşleme Amacı:</strong> İstihdam süreçlerinin yürütülmesi ve aday-işveren eşleşmesi.</p>
            </div>
        )
    },
    cookie: {
        title: "Çerez Politikası",
        content: (
            <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                <p>Platformumuzda kullanıcı deneyimini iyileştirmek amacıyla çerezler (cookies) kullanılmaktadır.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Zorunlu Çerezler:</strong> Sitenin çalışması için gereklidir.</li>
                    <li><strong>İşlevsel Çerezler:</strong> Tercihlerinizi hatırlar.</li>
                </ul>
            </div>
        )
    },
    kvkk: {
        title: "KVKK Aydınlatma",
        content: (
            <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                <p>KVKK'nın 11. maddesi uyarınca sahip olduğunuz haklar:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                    <li>İşlenme amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                    <li>Verilerinizin silinmesini veya yok edilmesini talep etme.</li>
                </ul>
            </div>
        )
    },
    membership: {
        title: "Üyelik Sözleşmesi",
        content: (
            <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                <p>Üye olarak platform kullanım şartlarını kabul etmiş sayılırsınız.</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Kullanıcı, platformu hukuka aykırı amaçlarla kullanamaz.</li>
                    <li>Kullanıcı, hesabını başkasına devredemez.</li>
                </ul>
            </div>
        )
    },
    data_form: {
        title: "Veri Sahibi Başvuru Formu",
        content: (
            <div className="space-y-4 font-medium text-gray-700 dark:text-gray-300">
                <p>KVKK kapsamındaki talepleriniz için bize ulaşabilirsiniz:</p>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5">
                    <p className="font-black text-gray-900 dark:text-white italic mb-2">Başvuru Kanalı:</p>
                    <p className="text-lg font-black text-[#1f6d78] dark:text-[#2dd4bf]">kvkk@kartvizid.com</p>
                </div>
            </div>
        )
    }
};

const LegalModal: React.FC<LegalModalProps> = ({ initialSection = 'general', onClose, onNavigate, isInline = false }) => {
    const [activeSection, setActiveSection] = useState<LegalSection>(initialSection);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveSection(initialSection);
    }, [initialSection]);

    useEffect(() => {
        if (!isInline) {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    onClose();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.body.style.overflow = 'unset';
            };
        }
    }, [onClose, isInline]);

    const content = (
        <div 
            ref={containerRef}
            className={isInline 
                ? "h-full flex flex-col min-w-0 bg-white dark:bg-black overflow-hidden" 
                : "bg-white w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden"
            }
        >
            {/* Sidebar Navigation - Only shown in full modal mode */}
            {!isInline && (
                <div className="w-64 bg-gray-50 border-r border-gray-100 flex flex-col hidden md:flex">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-black text-xl text-gray-900">Yasal Merkez</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        <button
                            key="about"
                            onClick={() => {
                                if (onNavigate) onNavigate('about');
                                else setActiveSection('about');
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-black transition-all ${activeSection === 'about'
                                ? 'bg-[#1f6d78] text-white shadow-md shadow-[#1f6d78]/20'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Hakkımızda
                        </button>
                        {Object.entries(LEGAL_CONTENT).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    if (onNavigate) onNavigate(key as LegalSection);
                                    else setActiveSection(key as LegalSection);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === key
                                    ? 'bg-[#1f6d78] text-white shadow-md shadow-[#1f6d78]/20'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {data.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black overflow-hidden">
                {/* Header */}
                <div className={`sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center shrink-0 ${isInline ? 'px-6 py-4 justify-between' : 'p-6 justify-between'}`}>
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        {isInline && (
                            <div className="w-9 h-9 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] shrink-0 border border-gray-100 dark:border-white/10">
                                <i className="fi fi-rr-document-signed"></i>
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className={`${isInline ? 'text-[15px]' : 'text-2xl'} font-black text-gray-900 dark:text-white tracking-tight truncate uppercase leading-none`}>
                                {LEGAL_CONTENT[activeSection].title}
                            </h2>
                            {isInline && <span className="text-[9px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em] mt-0.5 block leading-none">Destek & Yasal</span>}
                        </div>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className={`${isInline ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm shrink-0 border border-gray-100 dark:border-white/10 active:scale-95`}
                    >
                        {isInline ? (
                            <i className="fi fi-rr-apps"></i>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className={`flex-1 overflow-y-auto ${isInline ? 'p-6 md:p-12 no-scrollbar' : 'p-8'} custom-scrollbar`}>
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:font-medium">
                        {LEGAL_CONTENT[activeSection].content}
                    </div>
                </div>

                {/* Mobile Navigation - Hidden in inline mode */}
                {!isInline && (
                    <div className="md:hidden p-4 border-t border-gray-100 overflow-x-auto whitespace-nowrap bg-gray-50 space-x-2">
                        {Object.entries(LEGAL_CONTENT).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => {
                                    if (onNavigate) onNavigate(key as LegalSection);
                                    else setActiveSection(key as LegalSection);
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all inline-block ${activeSection === key
                                    ? 'bg-[#1f6d78] text-white'
                                    : 'bg-white border border-gray-200 text-gray-500'
                                    }`}
                            >
                                {data.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (isInline) return content;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            {content}
        </div>,
        document.body
    );
};

export default LegalModal;
export type { LegalSection };
