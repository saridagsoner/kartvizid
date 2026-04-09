import React, { useState } from 'react';
import { CV, EducationEntry, WorkExperienceEntry, InternshipEntry, LanguageEntry, CertificateEntry } from '../types';
import { TURKEY_LOCATIONS } from '../locations';
import SearchableSelect from './SearchableSelect';
import MonthYearPicker from './MonthYearPicker';
import ImageCropper from './ImageCropper';
import {
  WORK_TYPES,
  EMPLOYMENT_TYPES,
  EDUCATION_LEVELS,
  GRADUATION_STATUSES,
  MILITARY_STATUSES,
  MARITAL_STATUSES,
  DISABILITY_STATUSES,
  NOTICE_PERIODS,
  DRIVER_LICENSES,
  TRAVEL_STATUSES,
  LANGUAGES,
  LANGUAGE_LEVELS,
  COUNTRIES
} from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

import KVKKApprovalModal from './KVKKApprovalModal';

interface CVFormContentProps {
  onClose?: () => void;
  onSubmit: (cv: Partial<CV>, consentGiven?: boolean) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  initialData?: Partial<CV>;
  availableCities?: Array<{ label: string }>;
  isInline?: boolean;
}

const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toLocaleUpperCase('tr') + word.slice(1);
  }).join(' ');
};

const validateInput = (val: string, maxLength: number) => {
  let filtered = val.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '');
  let result = '';
  let count = 1;
  for (let i = 0; i < filtered.length; i++) {
    if (i > 0 && filtered[i].toLowerCase() === filtered[i-1].toLowerCase()) {
      count++;
    } else {
      count = 1;
    }
    if (count <= 3) {
      result += filtered[i];
    }
  }
  return result.slice(0, maxLength);
};

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
        className="w-full flex items-center justify-between py-4 group hover:bg-white dark:hover:bg-white/5 rounded-2xl pl-6 pr-0 -mx-6 transition-all"
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
        <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-500 transform translate-x-5 sm:translate-x-8 ${isOpen ? 'text-[#1f6d78] rotate-180' : 'text-gray-400'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
};

const handleDateMask = (val: string) => {
  const digits = val.replace(/\D/g, '');
  let formatted = '';
  if (digits.length > 0) {
    formatted = digits.substring(0, 2);
    if (digits.length > 2) {
      formatted += '.' + digits.substring(2, 4);
      if (digits.length > 4) {
        formatted += '.' + digits.substring(4, 8);
      }
    }
  }
  return formatted;
};

const CVFormContent: React.FC<CVFormContentProps> = ({ onClose, onSubmit, onDelete, initialData, availableCities = [], isInline = false }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<CV>>({
    name: initialData?.name || '',
    profession: initialData?.profession || '',
    city: initialData?.city || '',
    district: initialData?.district || '',
    experienceYears: initialData?.experienceYears || 0,
    experienceMonths: initialData?.experienceMonths || 0,
    language: initialData?.language || '',
    languageLevel: initialData?.languageLevel || '',
    languageDetails: initialData?.languageDetails || [],
    about: initialData?.about || '',
    skills: initialData?.skills || [],
    salaryMin: initialData?.salaryMin || 0,
    salaryMax: initialData?.salaryMax || 0,
    salaryCurrency: initialData?.salaryCurrency || '₺',
    education: initialData?.education || '',
    educationLevel: initialData?.educationLevel || '',
    graduationStatus: initialData?.graduationStatus || '',
    educationDetails: initialData?.educationDetails || [],
    internshipDetails: initialData?.internshipDetails || [],
    workExperience: initialData?.workExperience || [],
    workType: initialData?.workType || '',
    employmentType: initialData?.employmentType || '',
    militaryStatus: initialData?.militaryStatus || '',
    maritalStatus: initialData?.maritalStatus || '',
    disabilityStatus: initialData?.disabilityStatus || '',
    travelStatus: initialData?.travelStatus || '',
    driverLicense: initialData?.driverLicense || [],
    noticePeriod: initialData?.noticePeriod || '',
    photoUrl: initialData?.photoUrl,
    preferredCities: initialData?.preferredCities || (initialData?.preferredCity ? [initialData.preferredCity] : []),
    preferredCountries: initialData?.preferredCountries || [],
    preferredRoles: initialData?.preferredRoles || [],
    references: initialData?.references || [],
    birthDate: initialData?.birthDate || '',
    certificates: initialData?.certificates || [],
  });

  const [refInput, setRefInput] = useState({ name: '', company: '', role: '', phone: '', email: '' });
  const [showWarning, setShowWarning] = useState<{ show: boolean, missing: string[] }>({ show: false, missing: [] });
  const [showKVKKModal, setShowKVKKModal] = useState(false);
  const [hasPriorConsent, setHasPriorConsent] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    jobPrep: false,
    workExp: false,
    internship: false,
    edu: false,
    skills: false,
    lang: false,
    cert: false,
    ref: false,
    additional: false,
    more: false
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateCompletion = () => {
    let score = 0;
    if (formData.name) score += 5;
    if (formData.profession) score += 5;
    if (formData.city) score += 5;
    if (formData.birthDate) score += 5;
    if (formData.photoUrl) score += 5;
    if (formData.about && formData.about.length > 100) score += 20;
    else if (formData.about && formData.about.length > 20) score += 10;
    else if (formData.about) score += 5;
    if (formData.workExperience && formData.workExperience.length > 0) score += 15;
    if (formData.educationDetails && formData.educationDetails.length > 0) score += 20;
    else if (formData.education) score += 10;
    let otherCount = 0;
    if (formData.internshipDetails && formData.internshipDetails.length > 0) otherCount++;
    if (formData.languageDetails && formData.languageDetails.length > 0) otherCount++;
    if (formData.certificates && formData.certificates.length > 0) otherCount++;
    if (formData.references && formData.references.length > 0) otherCount++;
    score += Math.min(otherCount * 2.5, 10);
    return Math.round(Math.min(score, 100));
  };

  const completion = calculateCompletion();

  React.useEffect(() => {
    const fetchConsent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profiles').select('kvkk_consent').eq('id', user.id).single();
          if (data && data.kvkk_consent) {
            setHasPriorConsent(true);
            setIsConsentGiven(true);
          }
        }
      } catch (e) {
        console.error('Error fetching consent:', e);
      }
    };
    fetchConsent();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    if (newValue && !hasPriorConsent && !isConsentGiven) {
      setShowKVKKModal(true);
    } else {
      setIsConsentGiven(newValue);
    }
  };

  const [roleInput, setRoleInput] = useState('');
  const handleRoleAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roleInput.trim()) {
      e.preventDefault();
      if (!formData.preferredRoles?.includes(roleInput.trim())) {
        setFormData(prev => ({
          ...prev,
          preferredRoles: [...(prev.preferredRoles || []), roleInput.trim()]
        }));
      }
      setRoleInput('');
    }
  };
  const removeRole = (idx: number) => {
    setFormData(prev => ({ ...prev, preferredRoles: prev.preferredRoles?.filter((_, i) => i !== idx) }));
  };

  const [workInput, setWorkInput] = useState<Partial<WorkExperienceEntry>>({ company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '' });
  const addWork = () => {
    if (workInput.company && workInput.role) {
      const newWork = { ...workInput, id: Math.random().toString() } as WorkExperienceEntry;
      setFormData(prev => ({ ...prev, workExperience: [...(prev.workExperience || []), newWork] }));
      setWorkInput({ company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '' });
    }
  };
  const removeWork = (id: string) => {
    setFormData(prev => ({ ...prev, workExperience: prev.workExperience?.filter(w => w.id !== id) }));
  };

  const [eduInput, setEduInput] = useState<Partial<EducationEntry>>({ university: '', department: '', level: 'Lisans', status: 'Mezun', startDate: '', endDate: '', isCurrent: false });
  const addEducation = () => {
    if (eduInput.university && eduInput.department) {
      const newEdu = { ...eduInput, id: Math.random().toString() } as EducationEntry;
      setFormData(prev => ({ ...prev, educationDetails: [...(prev.educationDetails || []), newEdu] }));
      setEduInput({ university: '', department: '', level: 'Lisans', status: 'Mezun', startDate: '', endDate: '', isCurrent: false });
    }
  };
  const removeEducation = (id: string) => {
    setFormData(prev => ({ ...prev, educationDetails: prev.educationDetails?.filter(e => e.id !== id) }));
  };

  const [internInput, setInternInput] = useState<Partial<InternshipEntry>>({ company: '', role: '', startDate: '', endDate: '', isCurrent: false });
  const addInternship = () => {
    if (internInput.company && internInput.role) {
      const newIntern = { ...internInput, id: Math.random().toString() } as InternshipEntry;
      setFormData(prev => ({ ...prev, internshipDetails: [...(prev.internshipDetails || []), newIntern] }));
      setInternInput({ company: '', role: '', startDate: '', endDate: '', isCurrent: false });
    }
  };
  const removeInternship = (id: string) => {
    setFormData(prev => ({ ...prev, internshipDetails: prev.internshipDetails?.filter(i => i.id !== id) }));
  };

  const [langInput, setLangInput] = useState<Partial<LanguageEntry>>({ language: 'İngilizce', level: 'Orta' });
  const addLang = () => {
    if (langInput.language) {
      const newLang = { ...langInput, id: Math.random().toString() } as LanguageEntry;
      setFormData(prev => ({ ...prev, languageDetails: [...(prev.languageDetails || []), newLang] }));
    }
  };
  const removeLang = (id: string) => {
    setFormData(prev => ({ ...prev, languageDetails: prev.languageDetails?.filter(l => l.id !== id) }));
  };

  const [certInput, setCertInput] = useState<Partial<CertificateEntry>>({ name: '', issuer: '', date: '' });
  const addCertificate = () => {
    if (certInput.name) {
      const newCert = { ...certInput, id: Math.random().toString() } as CertificateEntry;
      setFormData(prev => ({ ...prev, certificates: [...(prev.certificates || []), newCert] }));
      setCertInput({ name: '', issuer: '', date: '' });
    }
  };
  const removeCertificate = (id: string) => {
    setFormData(prev => ({ ...prev, certificates: prev.certificates?.filter(c => c.id !== id) }));
  };

  const toggleList = (key: keyof CV, value: string) => {
    const currentList = (formData[key] as string[]) || [];
    const newList = currentList.includes(value) ? currentList.filter(v => v !== value) : [...currentList, value];
    setFormData({ ...formData, [key]: newList });
  };

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);

  const formatSalary = (val: number | string | undefined) => {
    if (val === undefined || val === null || val === '' || val === 0) return '0';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const parseSalary = (val: string) => {
    const clean = val.replace(/\./g, '').replace(/^0+/, '');
    const num = parseInt(clean.slice(0, 9));
    return isNaN(num) ? 0 : num;
  };

  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setTempImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setTempImageSrc(null);
    setUploading(true);
    try {
      const fileName = `${Math.random()}.jpg`;
      const { error: uploadError } = await supabase.storage.from('cv-photos').upload(fileName, croppedBlob);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('cv-photos').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, photoUrl: data.publicUrl }));
    } catch (error: any) {
      setShowWarning({ show: true, missing: [t('errors.photo_upload_failed') + ': ' + error.message] });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-black ${isInline ? '' : 'sm:h-[90vh]'}`}>
      {tempImageSrc && <ImageCropper imageSrc={tempImageSrc} onCropComplete={handleCropComplete} onClose={() => setTempImageSrc(null)} aspect={3 / 4} />}

      {/* Header */}
      <div className={`pt-6 pb-3 px-4 sm:pt-10 sm:pb-4 sm:px-8 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-50 shrink-0 border-b border-gray-100 dark:border-white/5 ${isInline ? 'px-8 sm:px-12' : ''}`}>
        <div className="flex-1 min-w-0 pr-12">
          <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight leading-none mb-2">
            {t('form.cv_create_title')}
          </h2>
          <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wide leading-none whitespace-nowrap overflow-hidden text-ellipsis">
            {t('form.cv_create_subtitle')}
          </p>
        </div>
        
        {onClose && (
          <button onClick={onClose} className="absolute top-6 right-2 sm:top-10 sm:right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white z-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto px-5 pt-8 pb-4 sm:p-10 custom-scrollbar space-y-4 sm:space-y-6 bg-white dark:bg-black ${isInline ? 'sm:px-12' : ''}`}>
        <section>
          <div className="flex flex-row gap-4 sm:gap-8 mb-5 sm:mb-8 items-stretch">
            <div className="shrink-0 space-y-1.5 flex flex-col w-24 sm:w-28">
              <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-[11px]">FOTOĞRAF</label>
              <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*" />
              <div onClick={() => fileInputRef.current?.click()} className="flex-1 rounded-xl sm:rounded-[2.5rem] border-2 border-dashed border-black/10 dark:border-white/20 bg-white dark:bg-black flex flex-col items-center justify-center cursor-pointer hover:border-[#1f6d78] transition-all group overflow-hidden shadow-sm relative min-h-[120px]">
                {formData.photoUrl ? (
                  <>
                    <img src={formData.photoUrl} alt="CV" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </div>
                  </>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform sm:scale-125"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" /></svg>
                )}
                {uploading && <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-10"><div className=" w-6 h-6 border-2 border-[#1f6d78] border-t-transparent rounded-full animate-spin"></div></div>}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.fullname')}</label>
                <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all flex items-center">
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: capitalizeWords(validateInput(e.target.value, 50)) })} maxLength={50} className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-4 sm:px-6 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" placeholder={t('form.fullname')} />
                </div>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">MESLEK</label>
                <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all flex items-center">
                  <input type="text" value={formData.profession} onChange={e => setFormData({ ...formData, profession: capitalizeWords(validateInput(e.target.value, 60)) })} maxLength={60} className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-4 sm:px-6 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" placeholder="Meslek" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">TECRÜBE</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all flex items-center">
                      <input type="number" min="0" value={formData.experienceYears === 0 ? '' : formData.experienceYears} onChange={e => setFormData({ ...formData, experienceYears: e.target.value === '' ? 0 : parseInt(e.target.value) })} className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-5 sm:px-7 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" placeholder="Yıl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all flex items-center">
                      <input type="number" min="0" max="11" value={formData.experienceMonths === 0 ? '' : formData.experienceMonths} onChange={e => setFormData({ ...formData, experienceMonths: e.target.value === '' ? 0 : Math.min(11, parseInt(e.target.value)) })} className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-5 sm:px-7 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" placeholder="Ay" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.city')}</label>
                  <SearchableSelect value={formData.city} onChange={(val) => setFormData({ ...formData, city: val, district: '' })} options={Object.keys(TURKEY_LOCATIONS).sort()} placeholder={t('form.city')} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.district')}</label>
                  <SearchableSelect value={formData.district || ''} onChange={(val) => setFormData({ ...formData, district: val })} options={formData.city ? TURKEY_LOCATIONS[formData.city] || [] : []} placeholder={t('form.district')} disabled={!formData.city} />
                </div>
              </div>
          </div>
        </section>

        <section>
          <div className="space-y-1.5">
            <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.about_clean') || 'Hakkında'}</label>
            <div className="w-full bg-white dark:bg-black rounded-[1.5rem] sm:rounded-[2.5rem] border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all h-24 sm:h-32">
              <textarea value={formData.about} onChange={e => setFormData({ ...formData, about: e.target.value })} className="w-full h-full bg-transparent outline-none resize-none px-6 py-3.5 sm:px-10 sm:py-5 text-[16px] font-semibold leading-relaxed text-black dark:text-white placeholder:text-gray-400/50 tracking-wide" placeholder="Kendinizi kısaca tanıtın"></textarea>
            </div>
          </div>
        </section>

        <div className="h-px bg-gray-100 dark:bg-white/5 my-6 sm:my-8" />

        <ExpandableSection title="Profilini Güçlendir & Detay Ekle" subtitle="İş tercihlerin, deneyimlerin, eğitimin ve daha fazlası için (Opsiyonel)" isOpen={openSections.more} onToggle={() => toggleSection('more')} className="mb-6 border-none">
          <div className="space-y-6">
            <ExpandableSection title={t('form.work_pref_clean')} subtitle={t('form.work_pref_subtitle')} isOpen={openSections.jobPrep} onToggle={() => toggleSection('jobPrep')}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10.5px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">Tercih Edilen Ülkeler</label>
                    <SearchableSelect value="" onChange={(val) => val && !formData.preferredCountries?.includes(val) && (formData.preferredCountries?.length || 0) < 3 && setFormData({ ...formData, preferredCountries: [...(formData.preferredCountries || []), val] })} options={COUNTRIES.sort()} placeholder="Ülke Seçiniz (Maks 3)" />
                    <div className="flex flex-wrap gap-2 px-1">
                      {formData.preferredCountries?.map((country, idx) => (
                        <span key={idx} className="bg-[#1f6d78]/10 text-[#1f6d78] dark:bg-[#1f6d78]/20 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest border border-[#1f6d78]/20 shadow-sm">{country}<button type="button" onClick={() => setFormData({ ...formData, preferredCountries: formData.preferredCountries?.filter((_, i) => i !== idx) })} className="hover:text-red-500 transition-colors text-xs">×</button></span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10.5px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">Tercih Edilen Şehirler</label>
                    <SearchableSelect value="" onChange={(val) => val && !formData.preferredCities?.includes(val) && (formData.preferredCities?.length || 0) < 3 && setFormData({ ...formData, preferredCities: [...(formData.preferredCities || []), val] })} options={Object.keys(TURKEY_LOCATIONS).sort()} placeholder="Şehir Seçiniz (Maks 3)" />
                    <div className="flex flex-wrap gap-2 px-1">
                      {formData.preferredCities?.map((city, idx) => (
                        <span key={idx} className="bg-[#1f6d78]/10 text-[#1f6d78] dark:bg-[#1f6d78]/20 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest border border-[#1f6d78]/20 shadow-sm">{city}<button type="button" onClick={() => setFormData({ ...formData, preferredCities: formData.preferredCities?.filter((_, i) => i !== idx) })} className="hover:text-red-500 transition-colors text-xs">×</button></span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.work_model')}</label>
                    <SearchableSelect value={formData.workType || ''} onChange={(val) => setFormData({ ...formData, workType: val })} options={WORK_TYPES} placeholder={t('form.work_model')} searchable={false} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.employment_type')}</label>
                    <SearchableSelect value={formData.employmentType || ''} onChange={(val) => setFormData({ ...formData, employmentType: val })} options={EMPLOYMENT_TYPES} placeholder={t('form.employment_type')} searchable={false} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">Tercih Edilen Pozisyonlar</label>
                  <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all flex items-center">
                    <input type="text" value={roleInput} onChange={e => setRoleInput(e.target.value)} onKeyDown={handleRoleAdd} className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-5 sm:px-6 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" placeholder="Enter ile ekleyin... (Örn: Satış Sorumlusu)" />
                  </div>
                  <div className="flex flex-wrap gap-2 px-1">
                    {formData.preferredRoles?.map((role, idx) => (
                      <span key={idx} className="bg-[#1f6d78] text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-3 uppercase tracking-widest shadow-sm">{role}<button type="button" onClick={() => removeRole(idx)} className="hover:text-red-500 transition-colors text-sm">×</button></span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9.5px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.salary_exp')}</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all flex items-center relative">
                        <input type="text" value={formatSalary(formData.salaryMin)} onChange={e => setFormData({ ...formData, salaryMin: parseSalary(e.target.value) })} onFocus={() => setIsMinFocused(true)} onBlur={() => setIsMinFocused(false)} className={`w-full h-full bg-transparent outline-none text-[14px] sm:text-[15px] px-6 text-black dark:text-white font-semibold tracking-tight`} placeholder="0" />
                        <span className={`absolute right-5 text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest pointer-events-none transition-opacity ${(isMinFocused || formData.salaryMin !== 0) ? 'opacity-0' : 'opacity-100'}`}>En Az</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all flex items-center relative">
                        <input type="text" value={formatSalary(formData.salaryMax)} onChange={e => setFormData({ ...formData, salaryMax: parseSalary(e.target.value) })} onFocus={() => setIsMaxFocused(true)} onBlur={() => setIsMaxFocused(false)} className={`w-full h-full bg-transparent outline-none text-[14px] sm:text-[15px] px-6 text-black dark:text-white font-semibold tracking-tight`} placeholder="0" />
                        <span className={`absolute right-5 text-[10px] font-black text-black/20 dark:text-white/20 uppercase tracking-widest pointer-events-none transition-opacity ${(isMaxFocused || formData.salaryMax !== 0) ? 'opacity-0' : 'opacity-100'}`}>En Çok</span>
                      </div>
                    </div>
                    <div className="relative">
                      <button type="button" onClick={() => setIsCurrencyOpen(!isCurrencyOpen)} className={`h-[42px] w-[54px] sm:h-[48px] sm:w-[64px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 font-black text-sm flex items-center justify-center gap-1 transition-all ${isCurrencyOpen ? 'border-[#1f6d78] text-[#1f6d78]' : 'text-black dark:text-white hover:bg-gray-50'}`}>{formData.salaryCurrency}</button>
                      {isCurrencyOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden flex flex-col z-[500] w-[80px] p-2 gap-1">
                          {['₺', '$', '€', '£'].map(c => (
                            <button key={c} type="button" onClick={() => { setFormData({ ...formData, salaryCurrency: c }); setIsCurrencyOpen(false); }} className={`h-10 w-full rounded-xl hover:bg-[#1f6d78]/10 font-black text-lg transition-colors ${formData.salaryCurrency === c ? 'text-black dark:text-white' : 'text-gray-400'}`}>{c}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title={t('form.work_history_clean')} subtitle={t('form.history_subtitle')} isOpen={openSections.workExp} onToggle={() => toggleSection('workExp')}>
              <div className="space-y-6">
                {formData.workExperience?.map(work => (
                  <div key={work.id} className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl relative group">
                    <button onClick={() => removeWork(work.id)} className="absolute top-2 right-4 text-red-500 hover:text-red-700 font-bold text-xl">×</button>
                    <h4 className="font-semibold text-black dark:text-white">{work.role}</h4>
                    <p className="text-xs font-semibold text-gray-500">{work.company}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{work.startDate} - {work.isCurrent ? 'Devam Ediyor' : work.endDate}</p>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">KURUM ADI</label><div className="w-full h-[40px] bg-white dark:bg-black rounded-full border border-black/10 flex items-center"><input type="text" placeholder="Kurum Adı" value={workInput.company} onChange={e => setWorkInput({ ...workInput, company: e.target.value })} className="w-full h-full bg-transparent outline-none px-6 text-sm font-semibold" /></div></div>
                  <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">POZİSYON</label><div className="w-full h-[40px] bg-white dark:bg-black rounded-full border border-black/10 flex items-center"><input type="text" placeholder="Pozisyon" value={workInput.role} onChange={e => setWorkInput({ ...workInput, role: e.target.value })} className="w-full h-full bg-transparent outline-none px-6 text-sm font-semibold" /></div></div>
                  <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">BAŞLAMA</label><div className="w-full h-[40px] bg-white dark:bg-black rounded-full border border-black/10 flex items-center"><input type="text" placeholder="GG.AA.YYYY" value={workInput.startDate} onChange={e => setWorkInput({ ...workInput, startDate: handleDateMask(e.target.value) })} className="w-full h-full bg-transparent outline-none px-6 text-sm font-semibold" /></div></div>
                  {!workInput.isCurrent && <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">BİTİŞ</label><div className="w-full h-[40px] bg-white dark:bg-black rounded-full border border-black/10 flex items-center"><input type="text" placeholder="GG.AA.YYYY" value={workInput.endDate} onChange={e => setWorkInput({ ...workInput, endDate: handleDateMask(e.target.value) })} className="w-full h-full bg-transparent outline-none px-6 text-sm font-semibold" /></div></div>}
                  <div className="flex items-center gap-3 pl-2 sm:col-span-2">
                    <input type="checkbox" id="work-curr" checked={workInput.isCurrent} onChange={e => setWorkInput({ ...workInput, isCurrent: e.target.checked })} className="w-4 h-4 accent-[#1f6d78]" />
                    <label htmlFor="work-curr" className="text-[10px] font-bold text-gray-400 tracking-wider cursor-pointer uppercase">Devam Ediyorum</label>
                  </div>
                </div>
                <button type="button" onClick={addWork} className="w-full bg-[#1f6d78] text-white font-black py-3 rounded-xl hover:bg-[#155e68] text-[10px] uppercase tracking-widest shadow-lg">+ DENEYİM EKLE</button>
              </div>
            </ExpandableSection>

            <ExpandableSection title={t('form.education_info_clean')} subtitle={t('form.education_info_subtitle')} isOpen={openSections.edu} onToggle={() => toggleSection('edu')}>
              <div className="space-y-6">
                {formData.educationDetails?.map(edu => (
                  <div key={edu.id} className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl relative group flex justify-between items-center">
                    <div><h4 className="font-semibold text-black dark:text-white text-sm">{edu.university}</h4><p className="text-xs text-black/60 font-semibold">{edu.department} ({edu.level})</p></div>
                    <button type="button" onClick={() => removeEducation(edu.id)} className="text-red-500 font-bold hover:bg-red-50 p-2">×</button>
                  </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">ÜNİVERSİTE</label><div className="w-full h-[40px] bg-white dark:bg-black rounded-full border border-black/10 flex items-center"><input type="text" placeholder="Üniversite" value={eduInput.university} onChange={e => setEduInput({ ...eduInput, university: e.target.value })} className="w-full h-full bg-transparent outline-none px-6 text-sm font-semibold" /></div></div>
                  <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">BÖLÜM</label><div className="w-full h-[40px] bg-white dark:bg-black rounded-full border border-black/10 flex items-center"><input type="text" placeholder="Bölüm" value={eduInput.department} onChange={e => setEduInput({ ...eduInput, department: e.target.value })} className="w-full h-full bg-transparent outline-none px-6 text-sm font-semibold" /></div></div>
                  <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">SEVİYE</label><SearchableSelect value={eduInput.level} onChange={val => setEduInput({ ...eduInput, level: val })} options={EDUCATION_LEVELS} placeholder="Seviye" searchable={false} /></div>
                  <div className="space-y-1.5"><label className="text-[9.5px] font-bold ml-4">DURUM</label><SearchableSelect value={eduInput.status} onChange={val => setEduInput({ ...eduInput, status: val, isCurrent: val === 'Öğrenci' })} options={GRADUATION_STATUSES} placeholder="Durum" searchable={false} /></div>
                </div>
                <button type="button" onClick={addEducation} className="w-full bg-[#1f6d78] text-white font-black py-3 rounded-xl hover:bg-[#155e68] text-[10px] uppercase tracking-widest shadow-lg">+ EĞİTİM EKLE</button>
              </div>
            </ExpandableSection>
          </div>
        </ExpandableSection>

        <div className="pt-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest">CV TAMAMLANMA ORANI</span>
            <span className={`text-xs font-black ${completion === 100 ? 'text-[#1f6d78]' : 'text-black dark:text-white'}`}>%{completion}</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-1000 bg-[#1f6d78]`} style={{ width: `${completion}%` }} />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-black/10">
          <div className="flex items-start gap-4">
            <input type="checkbox" id="kvkk-check" checked={isConsentGiven} onChange={(e) => { handleCheckboxChange(e); setShowConsentError(false); }} className={`w-5 h-5 rounded accent-[#1f6d78] mt-0.5 cursor-pointer ${showConsentError ? 'border-red-500' : ''}`} />
            <label htmlFor="kvkk-check" className={`text-[11px] font-bold leading-relaxed cursor-pointer select-none ${showConsentError ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              <span onClick={(e) => { e.preventDefault(); setShowKVKKModal(true); }} className="text-[#1f6d78] hover:text-[#155e68] transition-colors">{t('form.kvkk_text')}</span> okudum ve onaylıyorum.
            </label>
          </div>
          {showConsentError && <p className="text-red-500 text-[10px] font-bold mt-2 ml-9">* Devam etmek için onay vermelisiniz.</p>}
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`p-4 sm:px-12 sm:py-6 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md flex flex-row items-center gap-4 sticky bottom-0 z-10 shrink-0 shadow-lg ${isInline ? 'pb-8 sm:pb-12' : 'pb-safe-bottom'}`}>
        <button
          disabled={isSubmitting || !isConsentGiven}
          onClick={async () => {
            if (!formData.name) { setShowWarning({ show: true, missing: [t('form.fullname')] }); return; }
            const syncedData = {
              ...formData,
              education: formData.educationDetails?.[0]?.university || formData.education || '',
              educationLevel: formData.educationDetails?.[0]?.level || formData.educationLevel || '',
              graduationStatus: formData.educationDetails?.[0]?.status || formData.graduationStatus || '',
              language: formData.languageDetails?.[0]?.language || formData.language || '',
              languageLevel: formData.languageDetails?.[0]?.level || formData.languageLevel || '',
            };
            setIsSubmitting(true);
            try { await onSubmit(syncedData, isConsentGiven); } finally { setIsSubmitting(false); }
          }}
          className={`flex-[2] h-12 sm:h-14 flex items-center justify-center gap-3 transition-all active:scale-[0.98] rounded-2xl sm:rounded-full font-black text-[12px] sm:text-[13px] uppercase tracking-widest shadow-xl ${!isConsentGiven ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50 shadow-none' : 'bg-[#1f6d78] text-white hover:bg-[#155e68] shadow-[#1f6d78]/20'}`}
        >
          {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><i className="fi fi-rs-paper-plane text-[18px]"></i><span>YAYINLA</span></>}
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={async () => { if (window.confirm("CV'nizi tamamen silmek istediğinize emin misiniz?")) await onDelete(); }}
            className="flex-1 h-12 sm:h-14 flex items-center justify-center gap-2 border-2 border-red-500/10 hover:border-red-500 bg-red-50/30 text-red-500 rounded-2xl sm:rounded-full font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            <i className="fi fi-rr-trash text-[16px]"></i><span>SİL</span>
          </button>
        )}
      </div>

      {showKVKKModal && (
        <KVKKApprovalModal 
          onCancel={() => setShowKVKKModal(false)} 
          onApprove={async () => {
            setShowKVKKModal(false); setIsConsentGiven(true); setHasPriorConsent(true);
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) await supabase.from('profiles').update({ kvkk_consent: true, kvkk_consent_date: new Date().toISOString() }).eq('id', user.id);
            } catch (err) { console.error('Error saving consent:', err); }
          }} 
        />
      )}

      {showWarning.show && (
        <div className="absolute inset-0 z-[150] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="bg-white border-2 border-red-50 rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg"><i className="fi fi-rr-exclamation"></i></div>
            <h3 className="text-xl font-black text-black mb-2 tracking-tight">EKSİK BİLGİ</h3>
            <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">Lütfen aşağıdaki alanları kontrol edin:</p>
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-black/5 text-left"><ul className="space-y-2">{showWarning.missing.map((item, idx) => (<li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{item}</li>))}</ul></div>
            <button onClick={() => setShowWarning({ show: false, missing: [] })} className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg active:scale-95">TAMAM</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVFormContent;
