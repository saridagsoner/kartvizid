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
    | 'data_form';

interface LegalModalProps {
    initialSection?: LegalSection;
    onClose: () => void;
}

export const LEGAL_CONTENT: Record<LegalSection, { title: string; content: React.ReactNode }> = {
    general: {
        title: "Genel Koşullar",
        content: (
            <div className="space-y-4">
                <p><strong>1. Giriş</strong><br />Kartvizid.com ("Platform"), iş arayanların ("Aday") dijital profillerini oluşturduğu ve işverenlerin ("İşveren") bu profilleri inceleyerek iletişim talebinde bulunduğu bir tersine işe alım platformudur.</p>
                <p><strong>2. Tersine İşe Alım Modeli</strong><br />Platformumuzda klasik iş ilanı mantığı bulunmamaktadır. Adaylar ilanlara başvurmaz; İşverenler, kriterlerine uygun Adayları arar ve bulur. İletişim, ancak Adayın onayı ile başlar.</p>
                <p><strong>3. Üyelik ve Kullanım</strong><br />Platforma üyelik Adaylar için ücretsizdir. İşverenler için belirli hizmetler ücretli olabilir. Kullanıcılar, profillerinde beyan ettikleri bilgilerin doğruluğundan sorumludur.</p>
                <p><strong>4. Hesap Güvenliği</strong><br />Kullanıcılar hesap şifrelerinin güvenliğinden sorumludur. Platform, yetkisiz erişimlerden doğacak zararlardan sorumlu tutulamaz.</p>
            </div>
        )
    },
    security: {
        title: "Güvenlik İpuçları",
        content: (
            <div className="space-y-4">
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Kişisel Verilerinizi Koruyun:</strong> Platform üzerindeki iletişiminizde T.C. Kimlik No, banka hesap bilgileri gibi hassas verileri paylaşmaktan kaçının.</li>
                    <li><strong>İşveren Doğrulaması:</strong> Sizinle iletişime geçen şirketin kurumsal e-posta adresini ve web sitesini kontrol edin. Şüpheli durumlarda "Bildir" seçeneğini kullanın.</li>
                    <li><strong>Para Talepleri:</strong> İşe alım süreci için sizden para talep eden (dosya masrafı, eğitim ücreti vb.) kişilere itibar etmeyin.</li>
                    <li><strong>Harici Bağlantılar:</strong> Platform dışına yönlendiren şüpheli linklere tıklamayın.</li>
                </ul>
            </div>
        )
    },
    faq: {
        title: "Sıkça Sorulan Sorular",
        content: (
            <div className="space-y-6">
                <div>
                    <h4 className="font-bold text-gray-900">Kartvizid.com ücretli mi?</h4>
                    <p>Adaylar için profil oluşturmak ve yayınlamak tamamen ücretsizdir.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">İletişim bilgilerim herkese açık mı?</h4>
                    <p>Hayır. Telefon ve e-posta bilgileriniz varsayılan olarak gizlidir. Sadece iletişim isteğini onayladığınız İşverenler bu bilgilere erişebilir.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Profilimi nasıl gizleyebilirim?</h4>
                    <p>Ayarlar menüsünden profil görünürlüğünü "Pasif" yaparak aramalarda çıkmamasını sağlayabilirsiniz.</p>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">Başvuru yapabileceğim ilanlar nerede?</h4>
                    <p>Kartvizid'de ilan yoktur. Siz profilinizi oluşturursunuz, size uygun bir pozisyon olduğunda İşveren size ulaşır.</p>
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
    services: {
        title: "Hizmetlerimiz",
        content: (
            <div className="space-y-4">
                <p><strong>Adaylar İçin:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Dijital CV ve Portfolyo Oluşturma</li>
                    <li>PDF CV Çıktısı Alma</li>
                    <li>Karekod ile Profil Paylaşımı</li>
                    <li>İşverenlerden Gelen Teklifleri Değerlendirme</li>
                </ul>
                <p className="mt-4"><strong>İşverenler İçin:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Gelişmiş Aday Arama ve Filtreleme</li>
                    <li>Aday Davet Sistemi</li>
                    <li>Aday Havuzu Oluşturma (Kaydedilenler)</li>
                </ul>
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

const LegalModal: React.FC<LegalModalProps> = ({ initialSection = 'general', onClose }) => {
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                ref={containerRef}
                className="bg-white w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-300"
            >
                {/* Sidebar Navigation */}
                <div className="w-64 bg-gray-50 border-r border-gray-100 flex flex-col hidden md:flex">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-black text-xl text-gray-900">Yasal Merkez</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                        {Object.entries(LEGAL_CONTENT).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => setActiveSection(key as LegalSection)}
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
                            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-90"
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
                                onClick={() => setActiveSection(key as LegalSection)}
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
