import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface KVKKApprovalModalProps {
    onApprove: () => void;
    onCancel: () => void;
}

const KVKKApprovalModal: React.FC<KVKKApprovalModalProps> = ({ onApprove, onCancel }) => {
    const [canApprove, setCanApprove] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                setCanApprove(true);
            }
        }
    };

    useEffect(() => {
        if (contentRef.current) {
            if (contentRef.current.scrollHeight <= contentRef.current.clientHeight) {
                setCanApprove(true);
            }
        }
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white dark:bg-black fade-in">
            <div className="bg-white dark:bg-black w-full h-full flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-black items-center flex justify-between shrink-0 sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">KVKK Aydınlatma Metni</h2>
                        <p className="text-[10px] sm:text-xs text-[#1f6d78] font-bold mt-0.5 sm:mt-1 capitalize">Kullanıcı verilerinin korunması ve gizlilik beyanı</p>
                    </div>
                    <button 
                        onClick={onCancel} 
                        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95"
                    >
                        <svg width="20" height="20" sm:width="24" sm:height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 sm:p-12 sm:px-20 custom-scrollbar bg-white dark:bg-black"
                >
                    <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-4xl mx-auto text-gray-600 dark:text-gray-400">
                        <div className="mb-10 sm:mb-14">
                            <p className="font-black text-gray-800 dark:text-white mb-4 text-center sm:text-left text-base sm:text-lg leading-tight uppercase">
                                6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU ("KVKK") KAPSAMINDA AYDINLATMA METNİ
                            </p>
                            <p className="italic text-sm sm:text-base leading-relaxed text-gray-500">
                                Kartvizid.com olarak, veri sorumlusu sıfatıyla, uhdemizde bulunan kişisel verilerinizin işlenmesi, muhafazası, aktarılması ve imha süreçlerinde kanuni yükümlülüklerimizin bilincinde hareket etmekteyiz. Platformumuzun işleyişini esas alan ve "Tersine İşe Alım" prensibiyle kurgulanan sistem dahilinde kişisel verilerinizin kullanım kapsamı, sınırları ve prosedürleri aşağıda hukuki terimler ve detaylı açıklamalar ışığında tarafınıza sunulmaktadır.
                            </p>
                        </div>

                        <div className="space-y-12 sm:space-y-16">
                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    Veri Sorumlusu Kimliği ve Kurumsal Taahhütler
                                </h4>
                                <p className="leading-relaxed">6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun") hükümleri dairesinde, veri sorumlusu sıfatını haiz Kartvizid.com ("Platform"), kullanıcılarından elde ettiği verilerin hukuka aykırı olarak işlenmesini önlemek, verilere hukuka aykırı olarak erişilmesini engellemek ve verilerin muhafazasını sağlamak amacıyla her türlü teknik ve idari tedbiri almayı taahhüt eder. Söz konusu veriler, şirketimizin ticari faaliyetlerini yürütmek, Platform üzerindeki hizmet kalitesini artırmak ve yasal prosedürleri eksiksiz tamamlamak adına işleme tabi tutulmaktadır.</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    İşlenen Kişisel Veri Kategorileri ve Kapsamı
                                </h4>
                                <p className="mb-4 leading-relaxed">Hizmetlerimizden yararlanmak üzere Platforma dahil olduğunuz andan itibaren; doğrudan veya dolaylı yollarla toplanan ve aşağıda kategorize edilen verileriniz, kurumsal veri envanterimizde kayıt altına alınmaktadır:</p>
                                <ul className="list-none pl-0 mt-4 space-y-4">
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>Şahsi Kimlik Verileri:</strong> İlgili kişinin ayırt edilmesini sağlayan ad, soyad, doğum tarihi, cinsiyet verileri ve Platform nezdindeki kullanıcı numaranız.
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>İletişim ve Lokasyon Verileri:</strong> Güncel e-posta adresiniz, aktif telefon numaranız, yerleşim yerinize ilişkin şehir/ilçe detayları ve Platform profilinizde paylaştığınız harici portfolyo linkleri.
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>Akademik ve Mesleki Müktesebat:</strong> Eğitim geçmişi, mezuniyet belgeleri, sertifikasyon verileri, iş tecrübesi dökümü, yabancı dil yeterlilik düzeyleri ve mesleki uzmanlık alanlarınıza dair teknik veriler.
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>Dijital Görsel Kayıtlar:</strong> Profilinizde kamuoyuna veya yetkili kullanıcılara sunulmak üzere yüklediğiniz dijital fotoğraflar.
                                    </li>
                                    <li className="flex gap-3 leading-relaxed">
                                        <span className="text-[#1f6d78] font-black shrink-0">•</span> 
                                        <strong>Siber İşlem Güvenliği Verileri:</strong> Platform erişimi sırasında kullanılan statik/dinamik IP adresleri, sistem giriş-çıkış logları, kullanılan donanım ve yazılım spesifikasyonları.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    Veri İşleme Amaçları ve Stratejik Kullanım
                                </h4>
                                <p className="leading-relaxed text-justify">Toplanan her türlü veriniz; kullanıcı sözleşmesinin tesis edilmesi, Platform hizmetlerinin kesintisiz sürdürülmesi, özgeçmiş verilerinizin Platform ekosistemindeki görünürlüğünün yönetilmesi, siber güvenlik politikalarımızın denetlenmesi, kullanıcı memnuniyet analizlerinin gerçekleştirilmesi ve yetkili kurumlarca talep edilen yasal bildirimlerin yasal süreleri içerisinde ifa edilmesi amacıyla işlenmektedir. Platformumuz, verilerinizi işlerken ölçülülük, sınırlılık ve güncellik ilkelerine riayet etmektedir.</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    Platform İşleyiş Modeli ve İşveren Erişim Yetkileri
                                </h4>
                                <p className="leading-relaxed text-justify mb-4">Kartvizid.com, "Tersine İşe Alım" (Reverse Recruitment) modeliyle kurgulanmış profesyonel bir ekosistemdir. Bu model kapsamında, aday profilinizde paylaştığınız tüm profesyonel veriler, kimlik bilgileriniz ve iletişim kanallarınız (telefon no, e-posta vb.); <strong>Platform üyesi olan ve kurumsal kimliği doğrulanmış işverenlerin erişimine her zaman açıktır.</strong></p>
                                <p className="leading-relaxed text-justify mb-4">Üye işverenler, arama motoru optimizasyonları ve Platform içi filtreleme araçlarını kullanarak profilinizi bulabilir, iletişim bilgilerinize doğrudan erişebilir, özgeçmiş dosyanızı kurumsal cihazlarına indirebilir, sistem içi mesajlaşma modülleri üzerinden tarafınıza doğrudan iş teklifi veya davet iletebilir ve profilinizi kendi iş ortaklarıyla paylaşabilirler. Üye olmayan üçüncü şahıslar verilerinize hiçbir şekilde erişim sağlayamazlar ve bu erişim yetkisi sadece Platformun güvenli veritabanı denetiminden geçen kurumsal üyelerle sınırlıdır.</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    Verilerin Üçüncü Taraflara Aktarımı
                                </h4>
                                <p className="leading-relaxed">Kişisel verileriniz; Platformun teknik altyapısını sağlayan ve veri güvenliği denetiminden geçen servis sağlayıcılarımıza, Platform üyesi olan işveren kurumlara ve ilgili mevzuat uyarınca zorunlu görülen hallerde adli/idari makamlara aktarılabilmektedir. Şirketimiz, verilerinizi ticari menfaat doğrultusunda üçüncü şahıslara / veri simsarlarına pazarlamayacağını ve devretmeyeceğini açıkça beyan ve taahhüt eder.</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    Hukuki Sebepler ve Toplama Yöntemleri
                                </h4>
                                <p className="leading-relaxed text-justify">Kişisel verileriniz, Platform üzerindeki dijital formların doldurulması, doküman yükleme araçlarının kullanılması ve siber erişim protokolleri aracılığıyla, tamamen veya kısmen otomatik yollarla toplanmaktadır. Bu süreçler; "bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması", "veri sorumlusunun yasal yükümlülüklerini yerine getirebilmesi" ve "ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla Platformun meşru menfaatlerinin korunması" hukuki zeminlerine dayanmaktadır.</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    Teknik Güvenlik ve Veri Saklama Periyodu
                                </h4>
                                <p className="leading-relaxed text-justify">Verileriniz, Platform sunucularında siber saldırılara karşı kriptografik yöntemlerle şifrelenerek muhafaza edilmektedir. Üyeliğiniz aktif olduğu sürece veya yasal zaman aşımı süreleri dolana kadar verileriniz saklı tutulur. Kullanıcının talebi, üyeliğin sonlanması veya işleme amacının ortadan kalkması hallerinde; verileriniz güvenli imha politikalarımız çerçevesinde geri dönülemez şekilde silinir, yok edilir veya anonimleştirilir.</p>
                            </section>

                            <section>
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    İlgili Kişinin Kanuni Hakları
                                </h4>
                                <p className="mb-4 leading-relaxed">Kanun’un 11. maddesi kapsamındaki haklarınız uyarınca, veri sahibi olarak Platformumuza başvurarak;</p>
                                <ul className="list-disc pl-5 mt-4 space-y-3 leading-relaxed">
                                    <li>Kişisel verilerinizin işlenme durumunu teyit etme,</li>
                                    <li>İşleme faaliyetlerine ilişkin şeffaf bilgi talep etme,</li>
                                    <li>Veri işlemenin Platformun meşru amaçlarına uygunluğunu denetleme,</li>
                                    <li>Verilerin aktarıldığı merkez içi veya dışı üçüncü tarafları öğrenme,</li>
                                    <li>Maddi hataların düzeltilmesini ve eksik verilerin tamamlanmasını talep etme,</li>
                                    <li>Şartların oluşması halinde verilerin tamamen silinmesini veya anonimleştirilmesini isteme haklarınız mahfuzdur.</li>
                                </ul>
                            </section>

                            <section className="pb-32 sm:pb-40">
                                <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg mb-4">
                                    Hukuki Başvuru ve Destek Kanalları
                                </h4>
                                <p className="leading-relaxed">KVKK kapsamındaki her türlü talebinizi, görüşünüzü veya bilgi edinme haklarınızı kullanmak üzere; Platform üzerinde kayıtlı hesabınız aracılığıyla <strong>destek ekibimizle</strong> doğrudan iletişime geçebilirsiniz. İlgili başvurularınız, tarafımıza ulaştığı andan itibaren hukuki incelemeye alınacak ve Kanun'da öngörülen azami 30 günlük süre içerisinde yanıtlanacaktır.</p>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer UI */}
                <div className="p-6 sm:p-10 border-t border-gray-100 dark:border-white/5 bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center shrink-0 z-20">
                    <button
                        onClick={() => canApprove && onApprove()}
                        className={`w-full max-w-lg py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] sm:text-[13px] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${canApprove
                                ? 'bg-[#1f6d78] text-white hover:bg-[#155e68] shadow-[#1f6d78]/30 cursor-pointer'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 cursor-not-allowed opacity-80'
                            }`}
                    >
                        {canApprove ? (
                            <>
                                <span>Okudum, Anladım</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in zoom-in duration-500">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </>
                        ) : (
                            <>
                                <span className="opacity-90">Okudum, Anladım</span>
                                <div className="w-4 h-4 border-2 border-[#1f6d78]/40 border-t-[#1f6d78] rounded-full animate-spin"></div>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default KVKKApprovalModal;
