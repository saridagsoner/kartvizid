
import React, { useState, useRef } from 'react';
import { Company } from '../types';
import { supabase } from '../lib/supabase';
import ImageCropper from './ImageCropper';
import SearchableSelect from './SearchableSelect';
import { TURKEY_LOCATIONS } from '../locations';

interface CompanyFormModalProps {
    onClose: () => void;
    onSubmit: (company: Partial<Company>) => void;
    initialData?: Partial<Company>;
    availableCities?: Array<{ label: string }>;
}

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Partial<Company>>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        city: initialData?.city || '',
        district: initialData?.district || '',
        country: initialData?.country || 'Türkiye', // Default to Turkiye
        address: initialData?.address || '',
        industry: initialData?.industry || '',
        website: initialData?.website || '',
        logoUrl: initialData?.logoUrl,
    });

    // Update form data when initialData changes
    React.useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                name: initialData.name || '',
                description: initialData.description || '',
                city: initialData.city || '',
                district: initialData.district || '',
                country: initialData.country || 'Türkiye',
                address: initialData.address || '',
                industry: initialData.industry || '',
                website: initialData.website || '',
                logoUrl: initialData.logoUrl,
            }));
        }
    }, [initialData]);

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cropper State
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setTempImageSrc(reader.result as string);
                setIsCropperOpen(true);
            });
            reader.readAsDataURL(file);
            // Reset input value so same file can be selected again
            e.target.value = '';
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        try {
            setIsCropperOpen(false);
            setUploading(true);

            const fileExt = 'jpeg'; // Cropped image is jpeg
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' });

            const { error: uploadError } = await supabase.storage
                .from('cv-photos')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('cv-photos').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, logoUrl: data.publicUrl }));
        } catch (error: any) {
            alert('Logo yüklenirken hata oluştu: ' + error.message);
        } finally {
            setUploading(false);
            setTempImageSrc(null);
        }
    };

    const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
        <div className="mb-6 mt-10 first:mt-0">
            <h3 className="text-sm font-black text-black uppercase tracking-[0.15em] border-l-4 border-[#1f6d78] pl-3">{title}</h3>
            {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <div className="bg-white dark:bg-gray-900 w-full max-w-[800px] h-[90vh] rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">

                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-black dark:text-white tracking-tighter">İş Veren Profilinizi Oluşturun</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Adayların sizi tanıması için kurumsal bilgilerinizi girin</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl text-black dark:text-white hover:bg-[#1f6d78] hover:text-white transition-all active:scale-90"
                    >
                        ×
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12 bg-white dark:bg-gray-900">

                    {/* Bölüm 1: Temel Bilgiler */}
                    <section>
                        <SectionTitle title="1. KURUMSAL KİMLİK" subtitle="İş veren profilinizin görünen yüzü" />

                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="shrink-0">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-32 h-32 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-[#1f6d78] transition-all group overflow-hidden relative shadow-sm"
                                >
                                    {formData.logoUrl ? (
                                        <>
                                            <img src={formData.logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                                            {/* Hover Overlay for Edit */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 20h9"></path>
                                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                                </svg>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="text-black group-hover:scale-110 transition-transform duration-300"
                                            >
                                                <path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-4h8v4" />
                                            </svg>
                                            <p className="text-[10px] font-black uppercase mt-2 text-gray-400 group-hover:text-black tracking-widest transition-colors">Logo*</p>
                                        </>
                                    )}

                                    {/* Loading Overlay */}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                            <div className="animate-spin w-6 h-6 border-2 border-[#1f6d78] border-t-transparent rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">İş Veren / Kurum Adı *</label>
                                        <span className="text-[10px] font-bold text-[#1f6d78] bg-[#1f6d78]/5 px-2 py-0.5 rounded-full">Zorunlu</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-gray-700 rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold text-gray-800 dark:text-gray-100"
                                        placeholder="Örn: Acme A.Ş."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Sektör *</label>
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-gray-700 rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold text-gray-800 dark:text-gray-100"
                                            placeholder="Örn: Teknoloji"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Web Sitesi</label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-gray-700 rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold text-gray-800 dark:text-gray-100"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Şehir *</label>
                                </div>
                                <SearchableSelect
                                    value={formData.city || ''}
                                    onChange={(val) => setFormData({ ...formData, city: val, district: '' })}
                                    options={Object.keys(TURKEY_LOCATIONS).sort()}
                                    placeholder="Şehir Seçiniz"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">İlçe *</label>
                                <SearchableSelect
                                    value={formData.district || ''}
                                    onChange={(val) => setFormData({ ...formData, district: val })}
                                    options={formData.city ? TURKEY_LOCATIONS[formData.city] || [] : []}
                                    placeholder={formData.city ? "İlçe Seçiniz" : "Önce Şehir Seçin"}
                                    disabled={!formData.city}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Ülke</label>
                                </div>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-gray-700 rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold text-gray-800 dark:text-gray-100"
                                    placeholder="Türkiye"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Adres Detayı</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-gray-700 rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold text-gray-800 dark:text-gray-100"
                                    placeholder="Mahalle, Cadde, Sokak No..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Bölüm 2: Hakkımızda */}
                    <section>
                        <SectionTitle title="2. İŞ VEREN HAKKINDA" subtitle="Kültürünüzü ve vizyonunuzu anlatın" />
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">HAKKINDA *</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-[2rem] px-8 py-6 outline-none h-32 resize-none focus:bg-white dark:focus:bg-gray-700 focus:border-[#1f6d78]/10 border border-transparent transition-all font-medium text-sm leading-relaxed text-gray-800 dark:text-gray-100"
                                placeholder="Kendinizden ve şirketinizden bahsedin..."
                            ></textarea>
                            <p className="text-[10px] text-gray-400 font-bold ml-4">Bu bilgiler adayların şirketinizi tanıması için önemlidir.</p>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-5 sticky bottom-0 z-10 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-black dark:text-white py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#1f6d78] transition-all active:scale-95 shadow-sm"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={() => {
                            // Validation
                            if (!formData.logoUrl) {
                                alert('Devam etmek için lütfen şirket logosu yükleyiniz. (Zorunlu)');
                                return;
                            }
                            if (!formData.name?.trim()) {
                                alert('Lütfen şirket adı giriniz. (Zorunlu)');
                                return;
                            }
                            if (!formData.city) {
                                alert('Lütfen şehir seçiniz. (Zorunlu)');
                                return;
                            }
                            if (!formData.district) {
                                alert('Lütfen ilçe seçiniz. (Zorunlu)');
                                return;
                            }
                            if (!formData.industry) {
                                alert('Lütfen sektör giriniz. (Zorunlu)');
                                return;
                            }
                            if (!formData.description?.trim()) {
                                alert('Lütfen hakkında yazısı ekleyiniz. (Zorunlu)');
                                return;
                            }

                            onSubmit(formData);
                        }}
                        className="flex-[2] bg-[#1f6d78] text-white py-5 rounded-full font-black text-base uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-xl active:scale-[0.98]"
                    >
                        Profili Kaydet
                    </button>
                </div>
            </div>

            {/* Cropper Modal */}
            {isCropperOpen && tempImageSrc && (
                <ImageCropper
                    imageSrc={tempImageSrc}
                    onCropComplete={handleCropComplete}
                    onClose={() => {
                        setIsCropperOpen(false);
                        setTempImageSrc(null);
                    }}
                    aspect={1} // Square aspect ratio for logos
                />
            )}
        </div>
    );
};

export default CompanyFormModal;
