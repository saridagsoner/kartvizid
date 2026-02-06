import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PremiumModalProps {
    onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);

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
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative"
            >
                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-center z-10 sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1f6d78]/10 flex items-center justify-center text-[#1f6d78]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 3h12l4 6-10 13L2 9Z"></path>
                                <path d="M11 3 8 9l4 13 4-13-3-6"></path>
                                <path d="M2 9h20"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">
                                Premium<span className="text-[#1f6d78]">.</span>
                            </h2>
                            <p className="text-xs text-[#1f6d78] font-bold uppercase tracking-wider">Çok Yakında</p>
                        </div>
                    </div>
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Kariyerinizde <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1f6d78] to-[#2dd4bf]">
                                Sınırları Kaldırın.
                            </span>
                        </h3>
                        <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                            Premium ayrıcalıkları ile profilinizi öne çıkarın, daha fazla işveren tarafından görüntülenin ve kariyer basamaklarını hızla tırmanın.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-[#1f6d78]/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1f6d78] mb-6 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-3">Vitrin Özelliği</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Profilinizi arama sonuçlarında en üst sıralara taşıyın. İşverenlerin karşısına ilk siz çıkın.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-[#1f6d78]/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1f6d78] mb-6 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-3">Detaylı İstatistikler</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Profilinizi kimlerin gezdiğini, hangi şirketlerin ilgilendiğini anlık olarak takip edin.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-[#1f6d78]/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1f6d78] mb-6 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-3">Pro Rozeti</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                İsminizin yanına eklenen onaylı "Pro" rozeti ile profesyonelliğinizi ve güvenilirliğinizi kanıtlayın.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-[#1f6d78]/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1f6d78] mb-6 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                    <path d="M2 2l7.586 7.586"></path>
                                    <circle cx="11" cy="11" r="2"></circle>
                                </svg>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-3">Kişiselleştirilebilir Tasarım</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Standart kalıplara sığmayın. Profilinizin renklerini, yazı tiplerini ve temasını tarzınıza göre özelleştirin.
                            </p>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center bg-[#1f6d78]/5 rounded-2xl p-6 border border-[#1f6d78]/10">
                        <p className="text-[#1f6d78] font-bold text-sm">
                            Sizlerin geri bildirimiyle çok yakında
                        </p>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};

export default PremiumModal;
