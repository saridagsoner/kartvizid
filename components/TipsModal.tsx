import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const TIPS = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
            </svg>
        ),
        title: "Profil Fotoğrafı Seçimi",
        description: "Net, aydınlık ve profesyonel bir fotoğraf seçin. Yüzünüzün net göründüğü ve hafifçe gülümsediğiniz fotoğraflar, işverenlerde %60 daha olumlu bir ilk izlenim bırakır."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
        ),
        title: "Etkileyici Bir Özet",
        description: "Hakkımda kısmını kısa tutun ama vurun. Kim olduğunuzu, ne yaptığınızı ve ne başarmak istediğinizi 2-3 cümle ile özetleyin. Anahtar kelimeler kullanmak, aramalarda çıkmanızı sağlar."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
            </svg>
        ),
        title: "Yeteneklerin Gücü",
        description: "En az 5 yetenek eklemeye özen gösterin. Hem teknik (Hard Skills) hem de sosyal (Soft Skills) yeteneklerinizi dengeleyin. 'Takım Çalışması' veya 'İletişim' gibi yetenekler her zaman değerlidir."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
        ),
        title: "Deneyimlerini Somutlaştır",
        description: "Sadece görev tanımını yazmayın, ne başardığınızı anlatın. 'Satış yaptım' yerine 'Satışları %20 artırdım' demek çok daha etkileyicidir. Rakamlar her zaman dikkat çeker."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
        ),
        title: "Eğitim ve Sertifikalar",
        description: "Aldığınız eğitimleri ve varsa sertifikalarınızı mutlaka ekleyin. Bu, sürekli öğrenmeye açık olduğunuzu ve kendinizi geliştirdiğinizi gösterir."
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
        ),
        title: "İletişim Bilgileri",
        description: "E-posta ve telefon bilgilerinizin güncel olduğundan emin olun. Ayrıca LinkedIn profilinizi veya portfolyonuzu eklemek, profesyonelliğinizi pekiştirir."
    }
];

interface TipsModalProps {
    onClose: () => void;
}

const TipsModal: React.FC<TipsModalProps> = ({ onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div
                ref={containerRef}
                className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-black tracking-tight flex items-center gap-2">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                                <path d="M9 18h6"></path>
                                <path d="M10 22h4"></path>
                            </svg>
                            Profesyonel İpuçları
                        </h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                            Kariyerinizde öne geçmenizi sağlayacak altın değerinde tavsiyeler.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl text-gray-400 hover:bg-[#1f6d78] hover:text-white transition-all shadow-sm active:scale-90"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TIPS.map((tip, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-[#1f6d78]/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="mb-4 text-black group-hover:scale-110 transition-transform duration-300">
                                    {tip.icon}
                                </div>
                                <h3 className="font-bold text-black text-sm mb-2">{tip.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    {tip.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <button
                            onClick={onClose}
                            className="bg-[#1f6d78] text-white px-10 py-4 rounded-full text-sm font-bold hover:bg-[#155e68] transition-all active:scale-95 shadow-lg shadow-[#1f6d78]/20"
                        >
                            Profili Düzenle
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TipsModal;
