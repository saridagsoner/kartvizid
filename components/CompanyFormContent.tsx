import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Company } from '../types';
import { supabase } from '../lib/supabase';
import ImageCropper from './ImageCropper';
import SearchableSelect from './SearchableSelect';
import { TURKEY_LOCATIONS } from '../locations';
import { EMPLOYEE_COUNTS } from '../constants';

interface SelectionPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const SelectionPill: React.FC<SelectionPillProps> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold border transition-all ${active
      ? 'bg-[#1f6d78] border-[#1f6d78] text-white shadow-md'
      : 'bg-white dark:bg-black border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#1f6d78] dark:hover:border-[#1f6d78]'
      }`}
  >
    {label}
  </button>
);

const ExpandableSection = ({ 
  title, 
  subtitle, 
  isOpen, 
  onToggle, 
  children,
  className = ""
}: { 
  title: string, 
  subtitle?: string, 
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode,
  className?: string
}) => {
  return (
    <div className={`border-b border-black/10 dark:border-white/5 last:border-0 pb-6 group ${className}`}>
      <button 
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 group hover:bg-white dark:hover:bg-white/5 rounded-2xl pl-4 pr-0 -mx-4 transition-all"
      >
        <div className="flex items-center gap-5">
           <div className={`w-1 h-8 rounded-full transition-all duration-500 ${isOpen ? 'bg-[#1f6d78] scale-y-110' : 'bg-gray-200 dark:bg-black'}`} />
           <div className="text-left">
             <h3 className={`text-[13px] sm:text-[15px] font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-[#1f6d78]' : 'text-black dark:text-white'}`}>
               {title}
             </h3>
             {subtitle && <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{subtitle}</p>}
           </div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#1f6d78]/10 text-[#1f6d78] rotate-180' : 'text-gray-300 group-hover:bg-gray-50 dark:group-hover:bg-white/5'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="pt-6 animate-in slide-in-from-top-4 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

interface CompanyFormContentProps {
  onClose?: () => void;
  onSubmit: (company: Partial<Company>) => void;
  onDelete?: () => void;
  initialData?: Partial<Company>;
  availableCities?: Array<{ label: string }>;
  isInline?: boolean;
}

const CompanyFormContent: React.FC<CompanyFormContentProps> = ({ onClose, onSubmit, onDelete, initialData, isInline = false }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Company>>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        city: initialData?.city || '',
        district: initialData?.district || '',
        country: initialData?.country || 'Türkiye',
        address: initialData?.address || '',
        industry: initialData?.industry || '',
        website: initialData?.website || '',
        logoUrl: initialData?.logoUrl,
        foundedYear: initialData?.foundedYear || undefined,
        employeeCount: initialData?.employeeCount || '',
        instagramUrl: initialData?.instagramUrl || '',
    });

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        identity: true,
        location: false,
        contact: false,
        about: false
    });

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const [showWarning, setShowWarning] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [isConsentGiven, setIsConsentGiven] = useState(false);
    const [isKVKKModalOpen, setIsKVKKModalOpen] = useState(false);
    const [showConsentError, setShowConsentError] = useState(false);

    const getInitialsColor = (name: string) => {
        const colors = [
            { bg: '#1f6d7820', text: '#1f6d78' },
            { bg: '#2dd4bf20', text: '#2dd4bf' },
            { bg: '#f59e0b20', text: '#d97706' },
            { bg: '#8b5cf620', text: '#7c3aed' },
            { bg: '#ec489920', text: '#db2777' },
            { bg: '#3b82f620', text: '#2563eb' },
            { bg: '#10b98120', text: '#059669' },
            { bg: '#ef444420', text: '#dc2626' },
            { bg: '#6366f120', text: '#4f46e5' }
        ];
        let hash = 0;
        const hashName = name || 'Kartvizid';
        for (let i = 0; i < hashName.length; i++) {
            hash = hashName.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setTempImageSrc(reader.result as string);
                setIsCropperOpen(true);
            });
            reader.readAsDataURL(file);
            e.target.value = '';
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        try {
            setIsCropperOpen(false);
            setUploading(true);
            const fileName = `company_logo_${Math.random()}_${Date.now()}.jpeg`;
            const filePath = `${fileName}`;
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' });

            const { error: uploadError } = await supabase.storage
                .from('cv-photos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('cv-photos').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, logoUrl: data.publicUrl }));
        } catch (error: any) {
            setShowWarning({ show: true, message: t('errors.photo_upload_failed') + ': ' + error.message });
        } finally {
            setUploading(false);
            setTempImageSrc(null);
        }
    };

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-black ${isInline ? '' : 'sm:h-[90vh]'}`}>
            {/* Header */}
            <div className={`px-6 py-4 sm:px-8 sm:py-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-10 shrink-0 ${isInline ? 'sm:px-12' : ''}`}>
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tighter">{t('company.create_title')}</h2>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">{t('company.create_subtitle')}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xl sm:text-2xl text-black dark:text-white hover:bg-[#1f6d78] hover:text-white transition-all"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Form Body */}
            <div className={`flex-1 overflow-y-auto p-6 pt-10 sm:p-10 custom-scrollbar space-y-4 bg-white dark:bg-black ${isInline ? 'sm:px-12' : ''}`}>
                
                <ExpandableSection 
                    title={t('company.identity')} 
                    subtitle={t('company.identity_subtitle')}
                    isOpen={openSections.identity}
                    onToggle={() => toggleSection('identity')}
                >
                    <div className="flex flex-col sm:flex-row gap-8 mb-8">
                        <div className="shrink-0 flex justify-center">
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center cursor-pointer hover:border-[#1f6d78] transition-all group overflow-hidden relative shadow-sm"
                            >
                                {formData.logoUrl ? (
                                    <>
                                        <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 20h9"></path>
                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                            </svg>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center relative"
                                         style={(() => {
                                             const color = getInitialsColor(formData.name || 'L');
                                             return { backgroundColor: color.bg, color: color.text };
                                         })()}>
                                        <span className="text-3xl sm:text-5xl font-black uppercase opacity-80">
                                          {formData.name?.charAt(0) || 'L'}
                                        </span>
                                        <p className="absolute bottom-4 text-[8px] font-black uppercase opacity-60 tracking-widest">{t('company.logo')}</p>
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-10">
                                        <div className="w-6 h-6 border-2 border-[#1f6d78] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('company.name')} *</label>
                                <div className="w-full h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full h-full bg-transparent outline-none font-bold text-sm sm:text-base px-6 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                                        placeholder={t('company.name_placeholder')}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('company.industry')}</label>
                                <div className="w-full h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full h-full bg-transparent outline-none font-bold text-sm sm:text-base px-6 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                                        placeholder={t('company.industry_placeholder')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('company.founded_year')}</label>
                            <div className="w-full h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                                <input
                                    type="number"
                                    value={formData.foundedYear || ''}
                                    onChange={e => setFormData({ ...formData, foundedYear: parseInt(e.target.value) || undefined })}
                                    className="w-full h-full bg-transparent outline-none font-bold text-sm sm:text-base px-6 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                                    placeholder="Örn: 1995"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('company.employee_count')}</label>
                            <div className="flex flex-wrap gap-2">
                              {EMPLOYEE_COUNTS.map(count => (
                                <SelectionPill 
                                  key={count} 
                                  label={count} 
                                  active={formData.employeeCount === count} 
                                  onClick={() => setFormData({ ...formData, employeeCount: formData.employeeCount === count ? '' : count })} 
                                />
                              ))}
                            </div>
                        </div>
                    </div>
                </ExpandableSection>

                <ExpandableSection 
                    title={t('form.city')} 
                    subtitle="Kurumsal lokasyon bilgileriniz"
                    isOpen={openSections.location}
                    onToggle={() => toggleSection('location')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.city')}</label>
                            <SearchableSelect
                                value={formData.city || ''}
                                onChange={(val) => setFormData({ ...formData, city: val, district: '' })}
                                options={Object.keys(TURKEY_LOCATIONS).sort()}
                                placeholder={t('filters.city')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.district')}</label>
                            <SearchableSelect
                                value={formData.district || ''}
                                onChange={(val) => setFormData({ ...formData, district: val })}
                                options={formData.city ? TURKEY_LOCATIONS[formData.city] || [] : []}
                                placeholder={formData.city ? t('company.district_placeholder') : t('company.city_first')}
                                disabled={!formData.city}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('company.address')}</label>
                            <div className="w-full h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full h-full bg-transparent outline-none font-bold text-sm sm:text-base px-6 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                                    placeholder={t('company.address_placeholder')}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('company.country')}</label>
                            <div className="w-full h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full h-full bg-transparent outline-none font-bold text-sm sm:text-base px-6 text-gray-800 dark:text-gray-100"
                                />
                            </div>
                        </div>
                    </div>
                </ExpandableSection>

                <ExpandableSection 
                    title={t('company.contact_section')} 
                    subtitle={t('company.contact_subtitle')}
                    isOpen={openSections.contact}
                    onToggle={() => toggleSection('contact')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('company.website')}</label>
                            <div className="w-full h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full h-full bg-transparent outline-none font-bold text-sm sm:text-base px-6 text-gray-800 dark:text-gray-100 whitespace-nowrap"
                                    placeholder="https://www.sirketiniz.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">Instagram</label>
                            <div className="w-full h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                                <input
                                    type="url"
                                    value={formData.instagramUrl}
                                    onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                                    className="w-full h-full bg-transparent outline-none font-bold text-sm sm:text-base px-6 text-gray-800 dark:text-gray-100 whitespace-nowrap"
                                    placeholder="instagram.com/sirketiniz"
                                />
                            </div>
                        </div>
                    </div>
                </ExpandableSection>

                <ExpandableSection 
                    title={t('company.about_section')} 
                    subtitle={t('company.about_subtitle')}
                    isOpen={openSections.about}
                    onToggle={() => toggleSection('about')}
                >
                    <div className="space-y-2 mb-4">
                        <label className="text-[9px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.about_me')}</label>
                        <div className="w-full bg-white dark:bg-black rounded-[2rem] border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden p-6 sm:p-8">
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-transparent outline-none h-44 resize-none font-medium text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-100 custom-scrollbar"
                                placeholder={t('company.about_placeholder')}
                            ></textarea>
                        </div>
                    </div>
                </ExpandableSection>

                {/* Employer KVKK Consent */}
                <div className="bg-white dark:bg-black p-5 sm:p-6 rounded-[2.5rem] border border-black/10 dark:border-white/5 mt-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <input
                                type="checkbox"
                                id="company-kvkk-consent"
                                checked={isConsentGiven}
                                onChange={(e) => {
                                    setIsConsentGiven(e.target.checked);
                                    if (e.target.checked) setShowConsentError(false);
                                }}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md accent-[#1f6d78] shrink-0 mt-0.5 cursor-pointer border-2 ${showConsentError ? 'border-red-500 bg-red-50' : 'border-black/10'}`}
                            />
                            <label 
                                htmlFor="company-kvkk-consent" 
                                className={`text-[10px] sm:text-xs font-bold leading-relaxed cursor-pointer select-none flex-1 ${showConsentError ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                <button 
                                    type="button"
                                    onClick={() => setIsKVKKModalOpen(true)}
                                    className="text-[#1f6d78] dark:text-[#2dd4bf] hover:underline mr-1"
                                >
                                    {t('company.kvkk_modal_title')}
                                </button>
                                {t('company.kvkk_text')}
                            </label>
                        </div>
                        {showConsentError && (
                            <p className="text-red-500 text-[10px] sm:text-xs font-bold ml-9">
                                * Lütfen devam etmek için bu alanı işaretleyin.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className={`p-4 sm:px-12 sm:py-6 border-t border-black/10 dark:border-white/10 bg-white dark:bg-black flex flex-row items-stretch gap-4 sticky bottom-0 z-10 shrink-0 shadow-lg ${isInline ? 'pb-8 sm:pb-12' : 'pb-safe-bottom'}`}>
                <button
                    type="button"
                    onClick={async () => {
                        if (onDelete) {
                          if (window.confirm("İş veren profilinizi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
                            await onDelete();
                          }
                        } else if (onClose) {
                          onClose();
                        }
                    }}
                    className={`flex-1 border-2 border-red-500 text-red-500 py-3.5 sm:py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-[0.98] text-center`}
                >
                    {onDelete ? 'PROFİLİ SİL' : t('form.cancel')}
                </button>
                <button
                    onClick={() => {
                        if (!formData.name?.trim()) {
                            setShowWarning({ show: true, message: t('errors.company_name_required') || 'Şirket adı zorunludur.' });
                            return;
                        }
                        if (!isConsentGiven) {
                            setShowConsentError(true);
                            return;
                        }
                        onSubmit(formData);
                    }}
                    className="flex-[2] bg-[#1f6d78] text-white py-3.5 sm:py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg shadow-[#1f6d78]/20 active:scale-[0.98] text-center"
                >
                    {t('company.save')}
                </button>
            </div>

            {/* Modals and Overlays */}
            {isKVKKModalOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-black w-full h-full sm:max-w-2xl sm:h-[80vh] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden m-0 sm:m-4">
                        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-black">
                            <h3 className="text-sm sm:text-base font-black uppercase tracking-widest text-[#1f6d78] dark:text-[#2dd4bf]">
                                {t('company.kvkk_modal_title')}
                            </h3>
                            <button 
                                onClick={() => setIsKVKKModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xl font-bold hover:bg-gray-100 transition-all"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-bold whitespace-pre-line">
                                    {t('company.kvkk_content')}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 sm:p-8 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-gray-900/30">
                            <button 
                                onClick={() => {
                                    setIsConsentGiven(true);
                                    setIsKVKKModalOpen(false);
                                    setShowConsentError(false);
                                }}
                                className="w-full bg-[#1f6d78] text-white py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#155e68] shadow-lg transition-all"
                            >
                                {t('company.kvkk_confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showWarning.show && (
                <div className="absolute inset-0 z-[300] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6 fade-in">
                    <div className="bg-white border-2 border-red-50 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl zoom-in-95 text-center relative overflow-hidden">
                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5 text-2xl shadow-xl relative z-10">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-black mb-2 leading-tight tracking-tight relative z-10">{t('common.missing_info')}</h3>
                        <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed relative z-10">{showWarning.message}</p>
                        <button
                            onClick={() => setShowWarning({ show: false, message: '' })}
                            className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg active:scale-[0.98] relative z-10"
                        >
                            {t('common.done')}
                        </button>
                    </div>
                </div>
            )}

            {isCropperOpen && tempImageSrc && (
                <ImageCropper
                    imageSrc={tempImageSrc}
                    onCropComplete={handleCropComplete}
                    onClose={() => {
                        setIsCropperOpen(false);
                        setTempImageSrc(null);
                    }}
                    aspect={1}
                />
            )}
        </div>
    );
};

export default CompanyFormContent;
