import React from 'react';
import { Company } from '../types';

interface CompanyProfileModalProps {
    company: Company;
    onClose: () => void;
}

const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({ company, onClose }) => {

    const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
        <div className="mb-6 mt-10 first:mt-0">
            <h3 className="text-sm font-black text-black uppercase tracking-[0.15em] border-l-4 border-[#1f6d78] pl-3">{title}</h3>
            {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
        </div>
    );

    const InfoTag = ({ label, value, icon }: { label: string, value: string | undefined, icon?: string }) => (
        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</span>
            <div className="bg-gray-50 border border-gray-100 rounded-full px-5 py-3 flex items-center gap-3">
                {icon && <span className="text-sm">{icon}</span>}
                <span className="text-sm font-bold text-black">{value || '-'}</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[800px] h-[90vh] rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-black tracking-tighter">İş Veren Profili</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Kurumsal bilgiler ve detaylar</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl text-black hover:bg-[#1f6d78] hover:text-white transition-all active:scale-90 shadow-sm"
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12 bg-white">

                    {/* Bölüm 1: Kurumsal Kimlik */}
                    <section>
                        <SectionTitle title="1. KURUMSAL KİMLİK" />
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                            <div className="shrink-0">
                                <div className="w-32 h-32 rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl bg-gray-50 flex items-center justify-center">
                                    {company.logoUrl ? (
                                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                                            <path d="M9 22v-4h6v4"></path>
                                            <path d="M8 6h.01"></path>
                                            <path d="M16 6h.01"></path>
                                            <path d="M12 6h.01"></path>
                                            <path d="M12 10h.01"></path>
                                            <path d="M12 14h.01"></path>
                                            <path d="M16 10h.01"></path>
                                            <path d="M16 14h.01"></path>
                                            <path d="M8 10h.01"></path>
                                            <path d="M8 14h.01"></path>
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 w-full space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoTag label="Şirket Adı" value={company.name} />
                                    <InfoTag label="Sektör" value={company.industry} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoTag label="Şehir" value={company.city} icon="📍" />
                                    <InfoTag label="İlçe" value={company.district} icon="🏙️" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoTag label="Ülke" value={company.country} icon="🌍" />
                                    {company.website && (
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Web Sitesi</span>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="bg-gray-50 border border-gray-100 rounded-full px-5 py-3 flex items-center gap-3 hover:bg-[#1f6d78] hover:text-white transition-all group">
                                                <span className="text-sm">🌐</span>
                                                <span className="text-sm font-bold text-[#1f6d78] group-hover:text-white truncate">{company.website}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {company.address && <InfoTag label="Adres Detayı" value={company.address} icon="🏢" />}
                            </div>
                        </div>
                    </section>

                    {/* Bölüm 2: Hakkında */}
                    <section>
                        <SectionTitle title="2. HAKKINDA" />
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 italic text-gray-700 leading-relaxed text-sm font-medium">
                            "{company.description || 'Şirket hakkında bilgi girilmemiş.'}"
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default CompanyProfileModal;
