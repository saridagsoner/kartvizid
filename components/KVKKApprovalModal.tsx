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
            // Allow approval if user scrolled to near bottom (within 50px)
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setCanApprove(true);
            }
        }
    };

    // Auto-enable approve for short screens or if content fits
    useEffect(() => {
        if (contentRef.current) {
            if (contentRef.current.scrollHeight <= contentRef.current.clientHeight) {
                setCanApprove(true);
            }
        }
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center sm:p-4 bg-white sm:bg-black/70 backdrop-blur-none sm:backdrop-blur-md fade-in">
            <div className="bg-white w-full max-w-2xl h-full sm:h-[80vh] rounded-none sm:rounded-3xl shadow-none sm:shadow-2xl flex flex-col overflow-hidden zoom-in-95 border-0 sm:border border-gray-100">

                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-gray-100 bg-white items-center flex justify-between shrink-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">KVKK Aydınlatma Metni</h2>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-bold mt-0.5 sm:mt-1 uppercase tracking-wide">Lütfen okuyup onaylayınız</p>
                    </div>
                    <button onClick={onCancel} className="sm:hidden p-2 text-gray-400 hover:text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-gray-50/30"
                >
                    <div className="prose prose-sm prose-slate max-w-none text-gray-600">
                        <p className="font-bold text-gray-900 mb-4 text-center sm:text-left">6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU ("KVKK") KAPSAMINDA AYDINLATMA METNİ</p>

                        <p>Kartvizid.com olarak, veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. Bu bilinçle, platformumuzdan faydalanan siz değerli kullanıcılarımızın kişisel verilerinin (profilinizi tam olarak doldurmamış olsanız dahi, girdiğiniz tüm bilgilerin) 6698 sayılı Kişisel Verilerin Korunması Kanunu’na (“Kanun”), ikincil düzenlemelere ve Kişisel Verileri Koruma Kurulu kararlarına uygun olarak işlenmesine ve muhafaza edilmesine büyük önem vermekteyiz.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">1. Veri Sorumlusu</h4>
                        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz; veri sorumlusu olarak Kartvizid.com ("Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">2. Kişisel Verilerin İşlenme Amacı</h4>
                        <p>Toplanan kişisel verileriniz; platform hizmetlerinden faydalanmanız, iş arama ve bulma süreçlerinin yürütülmesi, aday-işveren eşleşmesinin sağlanması, şirketimiz tarafından sunulan ürün ve hizmetlerin ilgili kişilerin beğeni, kullanım habitleri ve ihtiyaçlarına göre özelleştirilerek sizlere önerilmesi, şirketimizin ticari ve iş stratejilerinin belirlenmesi ve uygulanması gibi amaçlarla işlenmektedir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">3. Kişisel Verileriniz</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, doğum tarihi.</li>
                            <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, şehir, ilçe, adres bilgileri.</li>
                            <li><strong>Mesleki:</strong> İş geçmişi, eğitim durumu, sertifikalar, yetenekler, diller.</li>
                            <li><strong>Görsel Veriler:</strong> Profil fotoğrafı.</li>
                            <li><strong>İşlem Güvenliği:</strong> IP adresi, log kayıtları, cihaz bilgileri.</li>
                        </ul>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">4. Kişisel Verilerin Aktarılması</h4>
                        <p>Kişisel verileriniz, açık rızanız doğrultusunda; platform üzerinden iletişim kurmayı kabul ettiğiniz işverenlere (üye şirketler), yasal yükümlülüklerimizin yerine getirilmesi amacıyla kanunen yetkili kamu kurumlarına ve özel kişilere Kanun’un 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları çerçevesinde aktarılabilecektir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h4>
                        <p>Kişisel verileriniz, platformumuza üyelik işlemleri, profil oluşturma ve platform üzerindeki hareketleriniz sırasında elektronik ortamda toplanmaktadır. Bu veriler, Kanun’un 5. maddesinde belirtilen "sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması", "veri sorumlusunun meşru menfaati" ve "ilgili kişinin açık rızası" hukuki sebeplerine dayanarak işlenmektedir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">6. Veri Sahibinin Hakları</h4>
                        <p>Kanun’un 11. maddesi uyarınca veri sahipleri;</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2 mb-8">
                            <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
                            <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
                            <li>Kişisel verilerin işlenmesi amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                            <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
                            <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme haklarına sahiptir.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer UI */}
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 drop-shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
                    <button
                        onClick={onCancel}
                        className="w-full sm:flex-1 bg-white border-2 border-gray-100 text-gray-400 font-bold py-3 sm:py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-gray-600 transition-all order-2 sm:order-1"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onApprove}
                        className={`w-full sm:flex-[2] py-3.5 sm:py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2 ${canApprove
                                ? 'bg-[#1f6d78] hover:bg-[#155e68] shadow-[#1f6d78]/20 cursor-pointer translate-y-0'
                                : 'bg-gray-300 cursor-not-allowed opacity-70 translate-y-0'
                            }`}
                    >
                        {canApprove ? 'Okudum, Onaylıyorum' : 'Lütfen sonuna kadar okuyunuz...'}
                        {canApprove && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in zoom-in duration-300">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        )}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default KVKKApprovalModal;
