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
}

export const LEGAL_CONTENT: Record<LegalSection, { title: string; content: React.ReactNode }> = {
    about: {
        title: "Hakkımızda",
        content: (
            <div className="space-y-6">
                <p className="text-lg font-medium text-[#1f6d78] dark:text-[#2dd4bf]">Kartvizid.com: Dijital Kariyerinizin Yeni Nesil Yüzü</p>
                <p>Kartvizid, modern iş dünyasının en büyük problemlerinden biri olan "doğru aday ve doğru işveren eşleşmesi" sorununa yenilikçi bir çözüm sunmak amacıyla kurulmuş bir "Tersine İşe Alım" platformudur.</p>
                
                <h4 className="font-bold text-gray-900">Vizyonumuz</h4>
                <p>İş arama sürecini, adayların birer "başvuru numarası" olmaktan çıkıp, kendi yeteneklerini ve profesyonel kimliklerini sergiledikleri bir dijital vitrine dönüştürmektir. Bizim dünyamızda işler adayları bulur, adaylar ise sadece kendilerine en uygun olanı seçer.</p>

                <h4 className="font-bold text-gray-900">Neden Kartvizid?</h4>
                <p>Geleneksel iş ilanları arasında kaybolmak, yüzlerce yere başvurup yanıt alamamak yorucudur. Kartvizid ile bir kez profilinizi oluşturursunuz ve işverenlerin gelişmiş filtreleme sistemimizle size ulaşmasını sağlarsınız. Sadece iletişim izni verdiğiniz işverenler sizinle iletişime geçebilir, bu da gizliliğinizi en üst düzeyde korur.</p>
                
                <p>2026 yılı itibariyle dijitalleşen iş dünyasında, kağıt üzerindeki CV'lerin yerini interaktif, paylaşılabilir ve karekod destekli dijital kartvizitler alıyor. Biz bu geleceğin öncüsü olmayı hedefliyoruz.</p>
            </div>
        )
    },
    general: {
        title: "Genel Koşullar",
        content: (
            <div className="space-y-4">
                <p><strong>1. Platformun Amacı</strong><br />Kartvizid.com, iş arayanların ("Aday") dijital profillerini sergilediği ve işverenlerin ("İşveren") bu profilleri inceleyerek doğrudan iletişim kurabildiği bir ekosistemdir. Platform, bir "ilan sitesi" değil, bir "yetenek vitrini"dir.</p>
                <p><strong>2. Tersine İşe Alım Modeli</strong><br />Platformda klasik usülde ilan açma ve başvuru yapma özellikleri bulunmamaktadır. İşverenler, aradıkları kriterlere uygun adayları özel algoritmalarla filtreler ve adaylara "İletişim Talebi" gönderirler.</p>
                <p><strong>3. Hesap Oluşturma ve Doğruluk</strong><br />Adaylar, profillerinde yer verdikleri eğitim, deneyim ve yetenek bilgilerinin gerçeği yansıttığını taahhüt ederler. Yanıltıcı beyanlardan doğacak hukuki sorumluluk kullanıcıya aittir.</p>
                <p><strong>4. Kullanım Şartları Değişikliği</strong><br />Kartvizid, platformun gelişimine göre kullanım şartlarında güncelleme yapma hakkını saklı tutar. Güncellemeler yapıldığında kullanıcılar haberdar edilecektir.</p>
            </div>
        )
    },
    security: {
        title: "Güvenlik İpuçları",
        content: (
            <div className="space-y-4">
                <p>İnternet üzerinde iş ararken güvenliğinizi korumak en önemli önceliğiniz olmalıdır. İşte Kartvizid üzerinde ve genel kariyer yolculuğunuzda dikkat etmeniz gerekenler:</p>
                <ul className="list-disc pl-5 space-y-3">
                    <li><strong>Hassas Veri Paylaşımı:</strong> T.C. Kimlik numaranız, banka hesap bilgileriniz veya ev adresiniz gibi çok özel verileri ilk yazışmalarda kesinlikle paylaşmayın. Bu veriler ancak resmi işe alım aşamasında (SGK girişi vb.) gereklidir.</li>
                    <li><strong>İşveren Profilini İnceleyin:</strong> Sizi davet eden şirketin profilini Kartvizid üzerinden inceleyin. Varsa web sitelerini ve LinkedIn sayfalarını kontrol ederek kurumsal kimliklerinden emin olun.</li>
                    <li><strong>Asla Para Ödemeyin:</strong> Hiçbir gerçek işveren; dosya masrafı, eğitim ücreti, ekipman temini veya vize işlemleri adı altında sizden para talep etmez. Para isteyen kişileri derhal "Bildir" butonuyla bize iletin.</li>
                    <li><strong>Güvenli İletişim:</strong> İlk görüşmelerinizi platform üzerinden yapmanızı öneririz. WhatsApp veya Telegram gibi platformlara geçmeden önce işverenin kurumsal bir hat kullandığından emin olun.</li>
                    <li><strong>Şüpheli Bağlantılar:</strong> E-posta veya mesaj yoluyla gelen, kaynağı belirsiz "Hemen başvur" veya "Formu doldur" gibi linklere tıklamadan önce URL yapısını kontrol edin.</li>
                </ul>
            </div>
        )
    },
    faq: {
        title: "Sıkça Sorulan Sorular",
        content: (
            <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-gray-900 border-l-4 border-[#1f6d78] pl-3 mb-2">Kartvizid.com tam olarak nedir?</h4>
                    <p>Kartvizid, geleneksel iş ilanlarının aksine, "tersine işe alım" modeliyle çalışan bir platformdur. Burada adaylar ilanlara başvurmak yerine, kendi profesyonel dijital kartlarını (CV) oluştururlar ve işverenlerin kendilerini bulmasını beklerler. Bu sayede doğru eşleşme ihtimali yükselir.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 border-l-4 border-[#1f6d78] pl-3 mb-2">Platformu kullanmak adaylar için ücretli mi?</h4>
                    <p>Kesinlikle hayır. Kartvizid'de profil oluşturmak, dijital kartınızı yayınlamak ve işverenlerle iletişime geçmek adaylar için tamamen ücretsiz bir hizmettir.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 border-l-4 border-[#1f6d78] pl-3 mb-2">Kişisel bilgilerim ve iletişim verilerim güvende mi?</h4>
                    <p>Güvenliğiniz bizim önceliğimizdir. Telefon numaranız ve e-posta adresiniz varsayılan olarak gizlidir. Bir işveren size iletişim isteği gönderdiğinde, bu isteği onaylamadığınız sürece bilgileriniz karşı tarafa gösterilmez.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 border-l-4 border-[#1f6d78] pl-3 mb-2">Neden hiç iş ilanı göremiyorum?</h4>
                    <p>Kartvizid bir "ilan tahtası" değildir. Bizim modelimizde "iş sizi bulur". Profilinizi ne kadar detaylı ve profesyonel doldurursanız, işverenlerin arama sonuçlarında üst sıralarda çıkma ve teklif alma şansınız o kadar artar.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 border-l-4 border-[#1f6d78] pl-3 mb-2">Profilimi nasıl daha etkili hale getirebilirim?</h4>
                    <p>İyi bir profil fotoğrafı, net bir meslek tanımı ve "Hakkımda" bölümünde başarılarınızı anlatan öz bir yazı, işverenlerin dikkatini çekmek için en önemli unsurlardır. Ayrıca "Yetenekler" ve "Deneyim" kısımlarını güncel tutmanız kritik önemdedir.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 border-l-4 border-[#1f6d78] pl-3 mb-2">Hesabımı ve verilerimi silebilir miyim?</h4>
                    <p>Evet, dilediğiniz zaman ayarlar bölümünden hesabınızı tamamen silebilirsiniz. KVKK uyumluluğumuz gereği, hesabınızı sildiğinizde tüm verileriniz sunucularımızdan kalıcı olarak temizlenir.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 border-l-4 border-[#1f6d78] pl-3 mb-2">İşverenlerle nasıl iletişim kuracağım?</h4>
                    <p>Bir işveren sizinle ilgilendiğinde size bir "İletişim Talebi" gönderir. Bu talep size bildirim olarak gelir. Onay verdiğiniz takdirde platform üzerinden mesajlaşmaya başlayabilir veya doğrudan telefon/e-posta yoluyla görüşebilirsiniz.</p>
                </div>
            </div>
        )
    },
    help: {
        title: "Yardım Merkezi",
        content: (
            <div className="space-y-4">
                <p>Sorunlarınız ve geri bildirimleriniz için bize her zaman ulaşabilirsiniz.</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="font-bold">E-posta Desteği</p>
                    <p className="text-[#1f6d78]">destek@kartvizid.com</p>
                </div>
                <p>Teknik sorunlar, hesap erişim problemleri veya kötüye kullanım bildirimleri için lütfen yukarıdaki adresten bizimle iletişime geçin. Talepleriniz en geç 24 saat içinde yanıtlanacaktır.</p>
            </div>
        )
    },
    iletisim: {
        title: "İletişim",
        content: (
            <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed">Kartvizid ekibi olarak size yardımcı olmak için buradayız. Her türlü soru, geri bildirim veya iş birliği talebiniz için aşağıdaki kanalları kullanabilirsiniz.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                        <div className="w-10 h-10 bg-[#1f6d78] text-white rounded-full flex items-center justify-center mb-4">
                            <i className="fi fi-rr-envelope"></i>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Genel İletişim</h4>
                        <p className="text-xs text-gray-500 mb-3">Tüm sorularınız ve iş birliği için</p>
                        <a href="mailto:iletisim@kartvizid.com" className="text-[#1f6d78] dark:text-[#2dd4bf] font-black hover:underline">iletisim@kartvizid.com</a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                        <div className="w-10 h-10 bg-[#1f6d78] text-white rounded-full flex items-center justify-center mb-4">
                            <i className="fi fi-rr-headset"></i>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Destek Merkezi</h4>
                        <p className="text-xs text-gray-500 mb-3">Teknik sorunlar ve yardım için</p>
                        <a href="mailto:destek@kartvizid.com" className="text-[#1f6d78] dark:text-[#2dd4bf] font-black hover:underline">destek@kartvizid.com</a>
                    </div>
                </div>

                <div className="bg-[#F0F2F5] dark:bg-gray-900 p-6 rounded-3xl">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-2 italic">Ekibimiz Ne Zaman Yanıt Veriyor?</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gönderdiğiniz tüm e-postalar ekibimiz tarafından titizlikle incelenir. Genellikle <strong>2 ile 24 saat</strong> içerisinde tüm taleplerinize resmi dönüş sağlamaktayız. Lütfen talebinizle ilgili detaylı (ekran görüntüsü, işlem numarası vb.) bilgi vermeyi unutmayın.</p>
                </div>
            </div>
        )
    },
    services: {
        title: "Hizmetlerimiz",
        content: (
            <div className="space-y-6">
                <div className="bg-[#1f6d78]/5 p-6 rounded-2xl border border-[#1f6d78]/10">
                    <h4 className="font-bold text-[#1f6d78] mb-3 flex items-center gap-2">
                        <i className="fi fi-rr-user"></i> Adaylar İçin Profesyonel Çözümler
                    </h4>
                    <p className="text-sm mb-4">Kartvizid, adayların iş arama sürecini pasif bir bekleyişten aktif bir sergilemeye dönüştürür:</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        <li><strong>Dinamik Dijital Profil:</strong> Saniyeler içinde oluşturulabilen, her cihazda kusursuz görünen profesyonel bir web profili.</li>
                        <li><strong>Akıllı PDF CV Oluşturucu:</strong> Profil verilerinizden tek tıkla modern ve ATS uyumlu PDF çıktısı alma imkanı.</li>
                        <li><strong>QR Kod (Karekod) Entegrasyonu:</strong> Fiziksel kartvizitlerinize veya basılı CV'lerinize ekleyebileceğiniz, doğrudan dijital profilinize yönlendiren özel karekod.</li>
                        <li><strong>Gizlilik Kontrollü İletişim:</strong> Bilgilerinizin kiminle paylaşılacağına sadece sizin karar verdiğiniz gelişmiş onay mekanizması.</li>
                        <li><strong>Kariyer Rehberi Erişimi:</strong> Sektör profesyonelleri tarafından hazırlanan güncel kariyer tavsiyelerine ve mülakat tekniklerine ücretsiz erişim.</li>
                    </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="fi fi-rr-building"></i> İşverenler İçin Verimli İşe Alım
                    </h4>
                    <p className="text-sm mb-4">Doğru yeteneğe ulaşmanın en kısa ve en düşük maliyetli yolu:</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        <li><strong>Gelişmiş Filtreleme:</strong> Şehir, deneyim, meslek ve yetenek bazlı nokta atışı aday arama motoru.</li>
                        <li><strong>Aday Havuzu Yönetimi:</strong> Beğendiğiniz profilleri kategorize etme ve daha sonra incelemek üzere kaydetme özelliği.</li>
                        <li><strong>Doğrudan Davet Sistemi:</strong> Aracı kurumlar olmadan, doğru adaya anında iletişim talebi gönderme kolaylığı.</li>
                        <li><strong>Şeffaf Profil Yapısı:</strong> Adayların tüm yetkinliklerini tek bir sayfada, karmaşadan uzak görme imkanı.</li>
                    </ul>
                </div>
            </div>
        )
    },
    privacy: {
        title: "Aydınlatma Metni",
        content: (
            <div className="space-y-4">
                <p>Kartvizid.com olarak kişisel verilerinizin güvenliğine en üst düzeyde önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, verilerinizi mevzuata uygun olarak işliyoruz.</p>
                <p><strong>İşlenen Veriler:</strong> Ad-soyad, iletişim bilgileri, eğitim ve iş geçmişi, yetenekler ve profil fotoğrafı.</p>
                <p><strong>İşleme Amacı:</strong> İstihdam süreçlerinin yürütülmesi, aday-işveren eşleşmesinin sağlanması ve platform güvenliğinin temini.</p>
                <p>Verileriniz, açık rızanız olmaksızın üçüncü kişilerle (iletişim izni verdiğiniz işverenler hariç) paylaşılmamaktadır.</p>
            </div>
        )
    },
    cookie: {
        title: "Çerez Politikası",
        content: (
            <div className="space-y-4">
                <p>Platformumuzda kullanıcı deneyimini iyileştirmek, oturum sürekliliğini sağlamak ve analitik veriler toplamak amacıyla çerezler (cookies) kullanılmaktadır.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Zorunlu Çerezler:</strong> Sitenin çalışması için gereklidir (örn. oturum açma).</li>
                    <li><strong>İşlevsel Çerezler:</strong> Tercihlerinizi hatırlar (örn. dil seçimi).</li>
                    <li><strong>Analitik Çerezler:</strong> Site trafiğini analiz etmemizi sağlar.</li>
                </ul>
                <p>Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman yönetebilir veya silebilirsiniz.</p>
            </div>
        )
    },
    kvkk: {
        title: "KVKK Aydınlatma",
        content: (
            <div className="space-y-4">
                <p>KVKK'nın 11. maddesi uyarınca sahip olduğunuz haklar:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                    <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                    <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                    <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
                    <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                    <li>Silinmesini veya yok edilmesini talep etme.</li>
                </ul>
                <p>Bu haklarınızı kullanmak için "Veri Sahibi Başvuru Formu"nu doldurarak bize iletebilirsiniz.</p>
            </div>
        )
    },
    membership: {
        title: "Üyelik Sözleşmesi",
        content: (
            <div className="space-y-4">
                <p>İşbu sözleşme, Kartvizid.com ile kullanıcı arasında, kullanıcının platforma üye olmasıyla yürürlüğe girer.</p>
                <p><strong>Tarafların Yükümlülükleri:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Kullanıcı, platformu hukuka ve ahlaka aykırı amaçlarla kullanamaz.</li>
                    <li>Platform, teknik arızalar nedeniyle hizmetin kesilmesinden sorumlu değildir.</li>
                    <li>Kullanıcı, hesabını başkasına devredemez veya kullandıramaz.</li>
                </ul>
                <p>İhlal durumunda Platform, kullanıcının üyeliğini tek taraflı olarak sonlandırma hakkını saklı tutar.</p>
            </div>
        )
    },
    data_form: {
        title: "Veri Sahibi Başvuru Formu",
        content: (
            <div className="space-y-4">
                <p>KVKK kapsamındaki talepleriniz için aşağıdaki yöntemlerle bize başvurabilirsiniz:</p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <p className="font-bold mb-2">Başvuru Yöntemleri:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Sistemimizde kayıtlı e-posta adresinizden <strong>kvkk@kartvizid.com</strong> adresine e-posta göndererek.</li>
                        <li>Yazılı olarak şirket adresimize şahsen veya noter kanalıyla başvurarak.</li>
                    </ol>
                </div>
                <p>Başvurunuzda ad, soyad, T.C. kimlik numarası (yabancılar için pasaport no), tebligata esas yerleşim yeri, e-posta adresi ve talep konusunun bulunması zorunludur.</p>
            </div>
        )
    }
};

const LegalModal: React.FC<LegalModalProps> = ({ initialSection = 'general', onClose, onNavigate }) => {
    const [activeSection, setActiveSection] = useState<LegalSection>(initialSection);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveSection(initialSection);
    }, [initialSection]);

    useEffect(() => {
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
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div
                ref={containerRef}
                className="bg-white w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden"
            >
                {/* Sidebar Navigation */}
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

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            {LEGAL_CONTENT[activeSection].title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm active:"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
                            {LEGAL_CONTENT[activeSection].content}
                        </div>
                    </div>

                    {/* Mobile Navigation (Visible only on small screens) */}
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
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LegalModal;
export type { LegalSection };
