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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-white items-center flex justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">KVKK Aydınlatma Metni</h2>
                        <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">Lütfen okuyup onaylayınız</p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/50"
                >
                    <div className="prose prose-sm prose-slate max-w-none text-gray-600">
                        <p className="font-bold text-gray-900 mb-4">6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU ("KVKK") KAPSAMINDA AYDINLATMA METNİ</p>

                        <p>Kartvizid.com olarak, veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. Bu bilinçle, platformumuzdan faydalanan siz değerli kullanıcılarımızın kişisel verilerinin 6698 sayılı Kişisel Verilerin Korunması Kanunu’na (“Kanun”), ikincil düzenlemelere ve Kişisel Verileri Koruma Kurulu kararlarına uygun olarak işlenmesine ve muhafaza edilmesine büyük önem vermekteyiz.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">1. Veri Sorumlusu</h4>
                        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz; veri sorumlusu olarak Kartvizid.com ("Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">2. Kişisel Verilerin İşlenme Amacı</h4>
                        <p>Toplanan kişisel verileriniz; platform hizmetlerinden faydalanmanız, iş arama ve bulma süreçlerinin yürütülmesi, aday-işveren eşleşmesinin sağlanması, şirketimiz tarafından sunulan ürün ve hizmetlerin ilgili kişilerin beğeni, kullanım alışkanlıkları ve ihtiyaçlarına göre özelleştirilerek sizlere önerilmesi, şirketimizin ticari ve iş stratejilerinin belirlenmesi ve uygulanması gibi amaçlarla işlenmektedir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">3. İşlenen Kişisel Verileriniz</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, doğum tarihi.</li>
                            <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, şehir, ilçe, adres bilgileri.</li>
                            <li><strong>Mesleki Deneyim:</strong> İş geçmişi, eğitim durumu, sertifikalar, yetenekler, diller.</li>
                            <li><strong>Görsel Veriler:</strong> Profil fotoğrafı.</li>
                            <li><strong>İşlem Güvenliği:</strong> IP adresi, log kayıtları, cihaz bilgileri.</li>
                        </ul>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">4. Kişisel Verilerin Aktarılması</h4>
                        <p>Kişisel verileriniz, açık rızanız doğrultusunda; platform üzerinden iletişim kurmayı kabul ettiğiniz işverenlere (üye şirketler), yasal yükümlülüklerimizin yerine getirilmesi amacıyla kanunen yetkili kamu kurumlarına ve özel kişilere Kanun’un 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları çerçevesinde aktarılabilecektir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h4>
                        <p>Kişisel verileriniz, platformumuza üyelik işlemleri, profil oluşturma ve platform üzerindeki hareketleriniz sırasında elektronik ortamda toplanmaktadır. Bu veriler, Kanun’un 5. maddesinde belirtilen "sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması", "veri sorumlusunun meşru menfaati" ve "ilgili kişinin açık rızası" hukuki sebeplerine dayanarak işlenmektedir.</p>

                        <h4 className="font-bold text-gray-900 mt-6 mb-2">6. Veri Sahibinin Hakları</h4>
                        <p>Kanun’un 11. maddesi uyarınca veri sahipleri;</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
                            <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
                            <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                            <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
                            <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme haklarına sahiptir.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer UI */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-white border-2 border-gray-200 text-gray-600 font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onApprove}
                        // disabled={!canApprove}
                        className={`flex-[2] py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${canApprove
                                ? 'bg-[#1f6d78] hover:bg-[#155e68] cursor-pointer'
                                : 'bg-gray-300 cursor-not-allowed opacity-70'
                            }`}
                    >
                        {canApprove ? 'Okudum, Onaylıyorum' : 'Lütfen metni sonuna kadar okuyunuz...'}
                        {canApprove && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
