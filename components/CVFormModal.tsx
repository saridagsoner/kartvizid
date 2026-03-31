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

interface SelectionPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const SelectionPill: React.FC<SelectionPillProps> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full text-[13px] sm:text-[14px] font-bold border transition-all flex items-center gap-2 ${active
      ? 'bg-[#1f6d78] border-[#1f6d78] text-white shadow-lg scale-[1.02]'
      : 'bg-gray-50 dark:bg-white/5 border-black/5 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-[#1f6d78] dark:hover:border-[#1f6d78] hover:bg-white dark:hover:bg-black'
      }`}
  >
    {active && <i className="fi fi-rr-check text-[10px] sm:text-[12px]"></i>}
    {label}
  </button>
);


interface CVFormModalProps {
  onClose: () => void;
  onSubmit: (cv: Partial<CV>, consentGiven?: boolean) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  initialData?: Partial<CV>;
  availableCities?: Array<{ label: string }>;
}

const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toLocaleUpperCase('tr') + word.slice(1);
  }).join(' ');
};

const validateInput = (val: string, maxLength: number) => {
  // Letters (Turkish support) and space only
  let filtered = val.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '');
  
  // Prevent more than 3 consecutive identical characters (case-insensitive)
  // We use a function to check character matches regardless of case
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
  
  // Limit length
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

const CVFormModal: React.FC<CVFormModalProps> = ({ onClose, onSubmit, onDelete, initialData, availableCities = [] }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<CV>>({
    name: initialData?.name || '',
    profession: initialData?.profession || '',
    city: initialData?.city || '',
    district: initialData?.district || '',
    experienceYears: initialData?.experienceYears || 0,
    language: initialData?.language || '',
    languageLevel: initialData?.languageLevel || '',
    languageDetails: initialData?.languageDetails || [],
    about: initialData?.about || '',
    skills: initialData?.skills || [],
    salaryMin: initialData?.salaryMin || 0,
    salaryMax: initialData?.salaryMax || 0,
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
  });

  const [refInput, setRefInput] = useState({ name: '', company: '', role: '', phone: '', email: '' });
  const [showWarning, setShowWarning] = useState<{ show: boolean, missing: string[] }>({ show: false, missing: [] });
  const [showKVKKModal, setShowKVKKModal] = useState(false);
  const [hasPriorConsent, setHasPriorConsent] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);
  const [loadingConsent, setLoadingConsent] = useState(true);
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
    // 1. Basic Info (25%)
    if (formData.name) score += 5;
    if (formData.profession) score += 5;
    if (formData.city) score += 5;
    if (formData.birthDate) score += 5;
    if (formData.photoUrl) score += 5;

    // 2. About Me (20%)
    if (formData.about && formData.about.length > 100) score += 20;
    else if (formData.about && formData.about.length > 20) score += 10;
    else if (formData.about) score += 5;

    // 3. Work Experience (15%)
    if (formData.workExperience && formData.workExperience.length > 0) score += 15;

    // 4. Education (20%)
    if (formData.educationDetails && formData.educationDetails.length > 0) score += 20;
    else if (formData.education) score += 10;

    // 5. Other (10%) - Internships, Languages, Certificates, References, etc.
    let otherCount = 0;
    if (formData.internshipDetails && formData.internshipDetails.length > 0) otherCount++;
    if (formData.languageDetails && formData.languageDetails.length > 0) otherCount++;
    if (formData.certificates && formData.certificates.length > 0) otherCount++;
    if (formData.references && formData.references.length > 0) otherCount++;
    
    score += Math.min(otherCount * 2.5, 10);

    return Math.round(Math.min(score, 100));
  };

  const completion = calculateCompletion();

  // Fetch initial consent status
  React.useEffect(() => {
    const fetchConsent = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('kvkk_consent')
            .eq('id', user.id)
            .single();

          if (data && data.kvkk_consent) {
            setHasPriorConsent(true);
            setIsConsentGiven(true);
          }
        }
      } catch (e) {
        console.error('Error fetching consent:', e);
      } finally {
        setLoadingConsent(false);
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

  const handleAddReference = () => {
    if (refInput.name && refInput.company) {
      const newRef = { ...refInput, id: Math.random().toString() };
      setFormData(prev => ({
        ...prev,
        references: [...(prev.references || []), newRef]
      }));
      setRefInput({ name: '', company: '', role: '', phone: '', email: '' });
    } else {
      setShowWarning({ show: true, missing: [t('errors.ref_name_required')] });
    }
  };

  const removeReference = (id: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references?.filter(r => r.id !== id)
    }));
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
    setFormData(prev => ({
      ...prev,
      preferredRoles: prev.preferredRoles?.filter((_, i) => i !== idx)
    }));
  };

  // --- Dynamic List Management ---

  // Work Experience
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

  // Education
  const [eduInput, setEduInput] = useState<Partial<EducationEntry>>({ 
    university: '', 
    department: '', 
    level: 'Lisans', 
    status: 'Mezun',
    startDate: '',
    endDate: '',
    isCurrent: false
  });
  const addEducation = () => {
    if (eduInput.university && eduInput.department) {
      const newEdu = { ...eduInput, id: Math.random().toString() } as EducationEntry;
      setFormData(prev => ({ ...prev, educationDetails: [...(prev.educationDetails || []), newEdu] }));
      setEduInput({ 
        university: '', 
        department: '', 
        level: 'Lisans', 
        status: 'Mezun',
        startDate: '',
        endDate: '',
        isCurrent: false 
      });
    }
  };
  const removeEducation = (id: string) => {
    setFormData(prev => ({ ...prev, educationDetails: prev.educationDetails?.filter(e => e.id !== id) }));
  };

  // Internship
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

  // Language
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

  // Certificates
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
    const newList = currentList.includes(value)
      ? currentList.filter(v => v !== value)
      : [...currentList, value];
    setFormData({ ...formData, [key]: newList });
  };

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMinFocused, setIsMinFocused] = useState(false);
  const [isMaxFocused, setIsMaxFocused] = useState(false);

  // Helper functions for salary formatting
  const formatSalary = (val: number | string | undefined) => {
    if (val === undefined || val === null || val === '' || val === 0) return '0';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseSalary = (val: string) => {
    const clean = val.replace(/\./g, '').replace(/^0+/, '');
    const numStr = clean.slice(0, 9);
    const num = parseInt(numStr);
    if (isNaN(num)) return 0;
    return num;
  };

  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setTempImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setTempImageSrc(null); // Close cropper
    setUploading(true);

    try {
      const fileExt = 'jpg'; // Cropped image is usually jpeg/png
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cv-photos')
        .upload(filePath, croppedBlob);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('cv-photos').getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photoUrl: data.publicUrl }));
    } catch (error: any) {
      setShowWarning({ show: true, missing: [t('errors.photo_upload_failed') + ': ' + error.message] });
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/60 sm:backdrop-blur-xl">
      <div className="bg-white dark:bg-black w-full h-full sm:w-full sm:max-w-[800px] sm:h-[90vh] rounded-none sm:rounded-[3rem] shadow-none sm:shadow-2xl relative flex flex-col overflow-hidden">

        {tempImageSrc && (
          <ImageCropper
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
            onClose={() => setTempImageSrc(null)}
            aspect={3 / 4} // Portrait aspect ratio for CV
          />
        )}

        {/* Header */}
        <div className="pt-6 pb-3 px-4 sm:pt-10 sm:pb-4 sm:px-8 flex justify-between items-center bg-white dark:bg-black sticky top-0 z-50 shrink-0 border-b border-gray-100 dark:border-white/5">
          <div className="flex-1 min-w-0 pr-12">
            <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight leading-none mb-2">
              {t('form.cv_create_title')}
            </h2>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wide leading-none whitespace-nowrap overflow-hidden text-ellipsis">
              {t('form.cv_create_subtitle')}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-6 right-2 sm:top-10 sm:right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white z-50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form Body - Compressing layout further as per user request */}
        <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4 sm:p-10 custom-scrollbar space-y-4 sm:space-y-6 bg-white dark:bg-black">

          <section>

            <div className="flex flex-row gap-4 sm:gap-8 mb-5 sm:mb-8 items-stretch">
              <div className="shrink-0 space-y-1.5 flex flex-col w-20 sm:w-28">
                <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-[11px]">FOTOĞRAF</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-xl sm:rounded-[2rem] border-2 border-dashed border-black/10 dark:border-white/20 bg-white dark:bg-black flex flex-col items-center justify-center cursor-pointer hover:border-[#1f6d78] transition-all group overflow-hidden shadow-sm relative min-h-[100px]"
                >
                  {formData.photoUrl ? (
                    <>
                      <img src={formData.photoUrl} alt={t('form.cv_photo') || "CV Photo"} className="w-full h-full object-cover" />
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
                        fill="currentColor"
                        className="text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform sm:scale-125"
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                      </svg>
                    </>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-10">
                      <div className=" w-6 h-6 border-2 border-[#1f6d78] border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.fullname')}</label>
                  <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => {
                        const validated = validateInput(e.target.value, 50);
                        setFormData({ ...formData, name: capitalizeWords(validated) });
                      }}
                      onFocus={(e) => {
                        setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                      }}
                      maxLength={50}
                      className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-4 sm:px-6 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                      placeholder={t('form.fullname')}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">MESLEK</label>
                  <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={e => {
                        const validated = validateInput(e.target.value, 60);
                        setFormData({ ...formData, profession: capitalizeWords(validated) });
                      }}
                      onFocus={(e) => {
                        setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                      }}
                      maxLength={60}
                      className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-4 sm:px-6 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                      placeholder="Meslek"
                    />
                  </div>
                </div>
                <p className="hidden sm:block text-[9px] text-gray-400 mt-1 ml-4 font-bold">{t('form.profession_hint') || "Birden fazla ünvan için virgül (,) ile ayırınız."}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">TECRÜBE</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                        <input
                          type="number"
                          min="0"
                          value={formData.experienceYears === 0 ? '' : formData.experienceYears}
                          onChange={e => setFormData({ ...formData, experienceYears: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                          className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-5 sm:px-7 py-0 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                          placeholder={t('common.year')}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={formData.experienceMonths === 0 ? '' : formData.experienceMonths}
                          onChange={e => {
                            let val = parseInt(e.target.value);
                            if (val > 11) val = 11;
                            setFormData({ ...formData, experienceMonths: e.target.value === '' ? 0 : val });
                          }}
                          className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[16px] px-5 sm:px-7 py-0 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                          placeholder={t('common.month')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.city')}</label>
                    <SearchableSelect
                      value={formData.city}
                      onChange={(val) => setFormData({ ...formData, city: val, district: '' })}
                      options={Object.keys(TURKEY_LOCATIONS).sort()}
                      placeholder={t('form.city')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.district')}</label>
                    <SearchableSelect
                      value={formData.district || ''}
                      onChange={(val) => setFormData({ ...formData, district: val })}
                      options={formData.city ? TURKEY_LOCATIONS[formData.city] || [] : []}
                      placeholder={t('form.district')}
                      disabled={!formData.city}
                    />
                  </div>
                </div>
            </div>
          </section>



          <section>
            <div className="space-y-1.5">
              <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.about_clean') || 'Hakkında'}</label>
              <div className="w-full bg-white dark:bg-black rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center h-24 sm:h-32">
                <textarea
                  value={formData.about}
                  onChange={e => setFormData({ ...formData, about: e.target.value })}
                  onFocus={(e) => {
                    setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                  }}
                  className="w-full h-full bg-transparent outline-none resize-none px-6 py-3.5 sm:px-10 sm:py-5 text-[16px] font-semibold leading-relaxed text-black dark:text-white placeholder:text-gray-400/50 tracking-wide"
                  placeholder="Kendinizi kısaca tanıtın"
                ></textarea>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 dark:text-gray-500 leading-relaxed px-4 pt-1.5 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-black/30 dark:text-white/30">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Profilini hemen yayınla ya da CV'ni güçlendir.
              </p>
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-white/5 my-12" />

          {/* Master Expandable Section for "More Details" */}
          <ExpandableSection
            title="Profilini Güçlendir & Detay Ekle"
            subtitle="İş tercihlerin, deneyimlerin, eğitimin ve daha fazlası için bu alanı açabilirsin (Opsiyonel)"
            isOpen={openSections.more}
            onToggle={() => toggleSection('more')}
            className="mb-12 border-none"
          >
            <div className="space-y-6">
          <ExpandableSection
            title={t('form.work_pref_clean')}
            subtitle={t('form.work_pref_subtitle')}
            isOpen={openSections.jobPrep}
            onToggle={() => toggleSection('jobPrep')}
          >
            <div className="space-y-8">
               {/* Countries and Cities Selection (Max 3 each) */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <div className="px-4">
                     <label className="text-[10.5px] sm:text-[11px] font-bold text-black dark:text-white uppercase tracking-[0.14em] leading-none">Çalışmak İstenilen Ülkeler</label>
                   </div>
                   <SearchableSelect
                     value=""
                     onChange={(val) => {
                       if (val && !formData.preferredCountries?.includes(val) && (formData.preferredCountries?.length || 0) < 3) {
                         setFormData({ ...formData, preferredCountries: [...(formData.preferredCountries || []), val] });
                       }
                     }}
                     options={COUNTRIES.sort()}
                     placeholder="Ülke Seçiniz (Maks 3)"
                   />
                   <div className="flex flex-wrap gap-2 px-1">
                     {formData.preferredCountries?.map((country, idx) => (
                       <span key={idx} className="bg-[#1f6d78]/10 text-[#1f6d78] dark:bg-[#1f6d78]/20 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest border border-[#1f6d78]/20 shadow-sm">
                         {country}
                         <button type="button" onClick={() => setFormData({ ...formData, preferredCountries: formData.preferredCountries?.filter((_, i) => i !== idx) })} className="hover:text-red-500 transition-colors text-xs">×</button>
                       </span>
                     ))}
                   </div>
                  </div>

                 <div className="space-y-2">
                   <div className="px-4">
                     <label className="text-[10.5px] sm:text-[11px] font-bold text-black dark:text-white uppercase tracking-[0.14em] leading-none">Çalışmak İstenilen Şehirler</label>
                   </div>
                   <SearchableSelect
                     value=""
                     onChange={(val) => {
                       if (val && !formData.preferredCities?.includes(val) && (formData.preferredCities?.length || 0) < 3) {
                         setFormData({ ...formData, preferredCities: [...(formData.preferredCities || []), val] });
                       }
                     }}
                     options={Object.keys(TURKEY_LOCATIONS).sort()}
                     placeholder="Şehir Seçiniz (Maks 3)"
                   />
                   <div className="flex flex-wrap gap-2 px-1">
                     {formData.preferredCities?.map((city, idx) => (
                       <span key={idx} className="bg-[#1f6d78]/10 text-[#1f6d78] dark:bg-[#1f6d78]/20 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest border border-[#1f6d78]/20 shadow-sm">
                         {city}
                         <button type="button" onClick={() => setFormData({ ...formData, preferredCities: formData.preferredCities?.filter((_, i) => i !== idx) })} className="hover:text-red-500 transition-colors text-xs">×</button>
                       </span>
                     ))}
                   </div>
                 </div>
                </div>

                {/* Work Model and Mode Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-0 mt-0">
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.work_model')}</label>
                    <SearchableSelect
                      value={formData.workType || ''}
                      onChange={(val) => setFormData({ ...formData, workType: val })}
                      options={WORK_TYPES}
                      placeholder={t('form.work_model')}
                      searchable={false}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.employment_type')}</label>
                    <SearchableSelect
                      value={formData.employmentType || ''}
                      onChange={(val) => setFormData({ ...formData, employmentType: val })}
                      options={EMPLOYMENT_TYPES}
                      placeholder={t('form.employment_type')}
                      searchable={false}
                    />
                  </div>
                </div>

                {/* Preferred Roles / Positions */}
                <div className="space-y-2 pt-0 mt-0">
                  <div className="px-4">
                    <label className="text-[10.5px] sm:text-[11px] font-bold text-black dark:text-white uppercase tracking-[0.14em] leading-none">ÇALIŞMAK İSTENİLEN POZİSYONLAR</label>
                  </div>
                  <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      value={roleInput}
                      onChange={e => setRoleInput(e.target.value)}
                      onKeyDown={handleRoleAdd}
                      onFocus={(e) => {
                        setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                      }}
                      className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-5 sm:px-6 py-0 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                      placeholder="Enter ile ekleyin... (Örn: Satış Sorumlusu)"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 px-1">
                    {formData.preferredRoles?.map((role, idx) => (
                      <span key={idx} className="bg-[#1f6d78] text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-3 uppercase tracking-widest shadow-sm">
                        {role}
                        <button type="button" onClick={() => removeRole(idx)} className="hover:text-red-500 transition-colors text-sm">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary Expectation Clean UI */}
                <div className="space-y-2 pt-0 mt-0">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.salary_exp')}</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all relative flex items-center group">
                        <input 
                          type="text" 
                          value={formatSalary(formData.salaryMin)} 
                          onChange={e => setFormData({ ...formData, salaryMin: parseSalary(e.target.value) })} 
                          onFocus={(e) => {
                            setIsMinFocused(true);
                            setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                          }}
                          onBlur={() => setIsMinFocused(false)}
                          className={`w-full h-full bg-transparent outline-none text-[14px] sm:text-[15px] px-6 sm:px-8 tracking-tight transition-colors ${formData.salaryMin === 0 ? 'text-gray-300 dark:text-white/20 font-medium' : 'text-black dark:text-white font-semibold'}`} 
                          placeholder="0" 
                        />
                        <span className={`absolute right-5 sm:right-8 text-[10px] sm:text-[11px] font-black text-black/10 dark:text-white/10 uppercase tracking-widest pointer-events-none transition-opacity duration-200 ${(isMinFocused || formData.salaryMin !== 0) ? 'opacity-0' : 'opacity-100'}`}>En Az</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all relative flex items-center group">
                        <input 
                          type="text" 
                          value={formatSalary(formData.salaryMax)} 
                          onChange={e => setFormData({ ...formData, salaryMax: parseSalary(e.target.value) })} 
                          onFocus={(e) => {
                            setIsMaxFocused(true);
                            setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                          }}
                          onBlur={() => setIsMaxFocused(false)}
                          className={`w-full h-full bg-transparent outline-none text-[14px] sm:text-[15px] px-6 sm:px-8 tracking-tight transition-colors ${formData.salaryMax === 0 ? 'text-gray-300 dark:text-white/20 font-medium' : 'text-black dark:text-white font-semibold'}`} 
                          placeholder="0" 
                        />
                        <span className={`absolute right-5 sm:right-8 text-[10px] sm:text-[11px] font-black text-black/10 dark:text-white/10 uppercase tracking-widest pointer-events-none transition-opacity duration-200 ${(isMaxFocused || formData.salaryMax !== 0) ? 'opacity-0' : 'opacity-100'}`}>En Çok</span>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsCurrencyOpen(!isCurrencyOpen); }}
                        className={`h-[42px] w-[54px] sm:h-[48px] sm:w-[64px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 font-black text-sm flex items-center justify-center gap-1 transition-all ${isCurrencyOpen ? 'border-[#1f6d78] text-[#1f6d78]' : 'text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                      >
                        {formData.salaryCurrency || '₺'}
                        <i className={`fi fi-rr-angle-small-down transition-transform duration-300 ${isCurrencyOpen ? 'rotate-180' : ''}`}></i>
                      </button>

                      {isCurrencyOpen && (
                        <div className="absolute right-0 top-full mt-3 bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden flex flex-col z-[500] w-[80px] p-2 gap-1 animate-in fade-in slide-in-from-top-2">
                          {['₺', '$', '€', '£'].map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => { setFormData({ ...formData, salaryCurrency: c }); setIsCurrencyOpen(false); }}
                              className={`h-10 w-full rounded-xl hover:bg-[#1f6d78]/10 dark:hover:bg-[#2dd4bf]/10 font-black text-lg transition-colors ${formData.salaryCurrency === c ? 'text-black dark:text-white' : 'text-gray-400'}`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              </ExpandableSection>

          <ExpandableSection
            title={t('form.work_history_clean')}
            subtitle={t('form.history_subtitle')}
            isOpen={openSections.workExp}
            onToggle={() => toggleSection('workExp')}
          >
            <div className="space-y-6">
              {/* List */}
              {formData.workExperience?.map(work => (
                <div key={work.id} className="bg-white dark:bg-black p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/5 relative group">
                  <button onClick={() => removeWork(work.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all font-bold">×</button>
                  <h4 className="font-semibold text-black dark:text-white tracking-tight">{work.role}</h4>
                  <p className="text-xs font-semibold text-black/60 dark:text-white/60 tracking-tight">{work.company}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{work.startDate} - {work.isCurrent ? t('form.currently_working_short') : work.endDate}</p>
                </div>
              ))}

              {/* Add Form - Clean Style */}
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">ÇALIŞILAN KURUM ADI *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input 
                        type="text" 
                        placeholder="Kurum Adı" 
                        value={workInput.company} 
                        onChange={e => setWorkInput({ ...workInput, company: e.target.value })} 
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.position')} *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input 
                        type="text" 
                        placeholder={t('form.position')} 
                        value={workInput.role} 
                        onChange={e => setWorkInput({ ...workInput, role: e.target.value })} 
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">İŞE BAŞLAMA TARİHİ *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder="GG.AA.YYYY"
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight"
                        value={workInput.startDate}
                        onChange={e => setWorkInput({ ...workInput, startDate: handleDateMask(e.target.value) })}
                      />
                    </div>
                  </div>
                  {!workInput.isCurrent && (
                    <div className="space-y-2">
                      <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">İŞTEN AYRILMA TARİHİ</label>
                      <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                        <input
                          type="text"
                          placeholder="GG.AA.YYYY"
                          className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight"
                          value={workInput.endDate}
                          onChange={e => setWorkInput({ ...workInput, endDate: handleDateMask(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2 pl-2">
                    <input 
                      type="checkbox" 
                      id="work-is-current"
                      checked={workInput.isCurrent} 
                      onChange={e => setWorkInput({ ...workInput, isCurrent: e.target.checked })} 
                      className="w-5 h-5 rounded-md accent-[#1f6d78]" 
                    />
                    <label htmlFor="work-is-current" className="text-[11px] font-black text-gray-500 uppercase tracking-widest cursor-pointer">
                      {t('form.currently_working')}
                    </label>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={addWork} 
                  className="w-full mt-2 bg-[#1f6d78] text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-[#155e68] transition-all active:scale-[0.98] text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20"
                >
                  + {t('form.add')}
                </button>
              </div>
            </div>
          </ExpandableSection>



          <ExpandableSection
            title={t('form.internships_clean')}
            subtitle={t('form.internships_subtitle')}
            isOpen={openSections.internship}
            onToggle={() => toggleSection('internship')}
          >
            <div className="space-y-8 sm:space-y-12">
              {/* Existing Internships List */}
              {formData.internshipDetails && formData.internshipDetails.length > 0 && (
                <div className="space-y-6 sm:space-y-8">
                  {formData.internshipDetails.map((intern) => (
                    <div key={intern.id} className="bg-white dark:bg-black p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-black/10 dark:border-white/10 relative group shadow-sm hover:shadow-md transition-all">
                      <button
                        type="button"
                        onClick={() => removeInternship(intern.id)}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all font-bold z-10"
                      >
                        ×
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('form.intern_role')}</label>
                          <p className="text-base sm:text-lg font-semibold text-black dark:text-white tracking-tight">{intern.role}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('form.institution')}</label>
                          <p className="text-base sm:text-lg font-semibold text-black dark:text-white tracking-tight">{intern.company}</p>
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('form.intern_period')}</label>
                          <p className="text-sm sm:text-base font-semibold text-black/60 dark:text-white/60 tracking-tight">{intern.startDate} - {intern.isCurrent ? t('common.ongoing') : intern.endDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Internship Form - Clean Style */}
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.intern_role')} *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder={t('form.position')}
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                        value={internInput.role}
                        onChange={e => setInternInput({ ...internInput, role: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">STAJ YAPILAN KURUM ADI *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder="Kurum Adı"
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                        value={internInput.company}
                        onChange={e => setInternInput({ ...internInput, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">STAJ BAŞLAMA TARİHİ *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder="GG.AA.YYYY"
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight"
                        value={internInput.startDate}
                        onChange={e => setInternInput({ ...internInput, startDate: handleDateMask(e.target.value) })}
                      />
                    </div>
                  </div>
                  {!internInput.isCurrent && (
                    <div className="space-y-2">
                      <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">STAJ BİTİŞ TARİHİ</label>
                      <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                        <input
                          type="text"
                          placeholder="GG.AA.YYYY"
                          className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight"
                          value={internInput.endDate}
                          onChange={e => setInternInput({ ...internInput, endDate: handleDateMask(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2 pl-2">
                    <input
                      type="checkbox"
                      id="intern-is-current"
                      checked={internInput.isCurrent}
                      onChange={e => setInternInput({ ...internInput, isCurrent: e.target.checked })}
                      className="w-5 h-5 rounded-md accent-[#1f6d78]"
                    />
                    <label htmlFor="intern-is-current" className="text-[11px] font-black text-gray-500 uppercase tracking-widest cursor-pointer">
                      {t('common.ongoing')}
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addInternship}
                  className="w-full mt-6 bg-[#1f6d78] text-white font-semibold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] transition-all active:scale-[0.98] text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20"
                >
                  + {t('form.add_list')}
                </button>
              </div>
            </div>
          </ExpandableSection>


          <ExpandableSection
            title={t('form.education_info_clean')}
            subtitle={t('form.education_info_subtitle')}
            isOpen={openSections.edu}
            onToggle={() => toggleSection('edu')}
          >
            <div className="space-y-6">
              {/* Education List & Add */}
              <div className="space-y-4">
                {formData.educationDetails?.map(edu => (
                  <div key={edu.id} className="bg-white dark:bg-black p-4 rounded-2xl border border-black/10 dark:border-white/5 relative group flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base text-black dark:text-white tracking-tight">{edu.university}</h4>
                      <p className="text-xs sm:text-sm font-semibold text-black/60 dark:text-white/60 tracking-tight">{edu.department} ({edu.level})</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <p className="text-[10px] font-black text-[#1f6d78] uppercase tracking-widest">{edu.status}</p>
                        {edu.startDate && (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">{edu.startDate} - {edu.isCurrent ? 'DEVAM EDİYOR' : edu.endDate || '?'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button type="button" onClick={() => removeEducation(edu.id)} className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full px-1">×</button>
                  </div>
                ))}

                {/* Add Education Form - Clean Style */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                    <div className="space-y-2">
                      <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.university')} *</label>
                      <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                        <input type="text" placeholder={t('form.university')} value={eduInput.university} onChange={e => setEduInput({ ...eduInput, university: e.target.value })} className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.department')} *</label>
                      <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                        <input type="text" placeholder={t('form.department') || ''} value={eduInput.department || ''} onChange={e => setEduInput({ ...eduInput, department: e.target.value })} className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">EĞİTİM SEVİYESİ *</label>
                      <SearchableSelect
                        value={eduInput.level}
                        onChange={val => setEduInput({ ...eduInput, level: val })}
                        options={EDUCATION_LEVELS}
                        placeholder="Seviye Seçin"
                        searchable={false}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">MEZUNİYET DURUMU *</label>
                      <SearchableSelect
                        value={eduInput.status}
                        onChange={val => setEduInput({ ...eduInput, status: val, isCurrent: val === 'Öğrenci' })}
                        options={GRADUATION_STATUSES}
                        placeholder="Durum Seçin"
                        searchable={false}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">EĞİTİM BAŞLAMA TARİHİ *</label>
                      <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                        <input
                          type="text"
                          placeholder="GG.AA.YYYY"
                          className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight"
                          value={eduInput.startDate}
                          onChange={e => setEduInput({ ...eduInput, startDate: handleDateMask(e.target.value) })}
                        />
                      </div>
                    </div>
                    {!eduInput.isCurrent && (
                      <div className="space-y-2">
                        <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">MEZUNİYET TARİHİ</label>
                        <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                          <input
                            type="text"
                            placeholder="GG.AA.YYYY"
                            className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight"
                            value={eduInput.endDate}
                            onChange={e => setEduInput({ ...eduInput, endDate: handleDateMask(e.target.value) })}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-2 pl-2 md:col-span-2">
                      <input
                        type="checkbox"
                        id="edu-is-current"
                        checked={eduInput.isCurrent}
                        onChange={e => setEduInput({ ...eduInput, isCurrent: e.target.checked })}
                        className="w-5 h-5 rounded-md accent-[#1f6d78]"
                      />
                      <label htmlFor="edu-is-current" className="text-[11px] font-black text-gray-500 uppercase tracking-widest cursor-pointer">
                        BU OKULDA EĞİTİMİM DEVAM EDİYOR
                      </label>
                    </div>
                  </div>
                  <button type="button" onClick={addEducation} className="w-full mt-2 bg-[#1f6d78] text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20 transition-all active:scale-95">+ {t('form.add')}</button>
                </div>
              </div>
            </div>
          </ExpandableSection>


          <ExpandableSection
            title={t('form.languages')}
            subtitle={t('form.add_language')}
            isOpen={openSections.lang}
            onToggle={() => toggleSection('lang')}
          >
            <div className="space-y-8">
              {/* Added Languages List */}
              {formData.languageDetails && formData.languageDetails.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-2">
                  {formData.languageDetails.map(lang => (
                    <div key={lang.id} className="inline-flex items-center gap-3 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 border border-[#1f6d78]/20 rounded-full px-5 py-2.5 shadow-sm group">
                      <span className="text-[11px] font-black text-[#1f6d78] dark:text-white uppercase tracking-widest">{lang.language} — {lang.level}</span>
                      <button type="button" onClick={() => removeLang(lang.id)} className="text-[#1f6d78] hover:text-red-500 transition-colors font-bold text-lg leading-none">×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Language Form - Minimal Style */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">DİL</label>
                    <SearchableSelect
                      value={langInput.language || ''}
                      onChange={val => setLangInput({ ...langInput, language: val })}
                      options={LANGUAGES}
                      placeholder="Dil Seçin"
                      searchable={false}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">SEVİYE</label>
                    <SearchableSelect
                      value={langInput.level || ''}
                      onChange={val => setLangInput({ ...langInput, level: val })}
                      options={LANGUAGE_LEVELS}
                      placeholder="Seviye Seçin"
                      searchable={false}
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={addLang} 
                  className="w-full bg-[#1f6d78] text-white font-black py-3.5 sm:py-4 rounded-2xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20 transition-all active:scale-95"
                >
                  + DİL EKLE
                </button>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('form.certificates')}
            subtitle={t('form.add_certificate')}
            isOpen={openSections.cert}
            onToggle={() => toggleSection('cert')}
          >
            <div className="space-y-6">
              {/* Added Certificates List */}
              {formData.certificates && formData.certificates.length > 0 && (
                <div className="space-y-4">
                  {formData.certificates.map(cert => (
                    <div key={cert.id} className="bg-white dark:bg-black p-4 rounded-2xl border border-black/10 dark:border-white/5 relative group flex justify-between items-center shadow-sm">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base text-black dark:text-white tracking-tight">{cert.name}</h4>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {cert.issuer && <p className="text-[10px] font-black text-[#1f6d78] uppercase tracking-widest">{cert.issuer}</p>}
                          {cert.date && (
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <p className="text-[10px] font-bold uppercase tracking-widest">{cert.date}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeCertificate(cert.id)} className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full px-1">×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Certificate Form - Minimal Style */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.cert_name')} *</label>
                  <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                    <input
                      type="text"
                      placeholder={t('form.cert_name')}
                      value={certInput.name}
                      onChange={e => setCertInput({ ...certInput, name: e.target.value })}
                      className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.cert_issuer')}</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder="Kurum Adı"
                        value={certInput.issuer}
                        onChange={e => setCertInput({ ...certInput, issuer: e.target.value })}
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.cert_date')}</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder="GG.AA.YYYY"
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight"
                        value={certInput.date || ''}
                        onChange={e => setCertInput({ ...certInput, date: handleDateMask(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={addCertificate} 
                  className="w-full bg-[#1f6d78] text-white font-black py-3.5 sm:py-4 rounded-2xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20 transition-all active:scale-95"
                >
                  + SERTİFİKA EKLE
                </button>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('form.personal_clean')}
            subtitle={t('form.personal_subtitle')}
            isOpen={openSections.additional}
            onToggle={() => toggleSection('additional')}
          >
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.birth_date')} *</label>
                <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                  <input
                    type="text"
                    placeholder="GG.AA.YYYY"
                    className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/50 tracking-tight text-center sm:text-left"
                    value={formData.birthDate || ''}
                    onChange={e => setFormData({ ...formData, birthDate: handleDateMask(e.target.value) })}
                    onFocus={(e) => {
                      setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.military')}</label>
                  <SearchableSelect
                    value={formData.militaryStatus || ''}
                    onChange={(val) => setFormData({ ...formData, militaryStatus: val })}
                    options={MILITARY_STATUSES}
                    placeholder={t('form.military')}
                    searchable={false}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.driving_license')}</label>
                  <SearchableSelect
                    value=""
                    onChange={(val) => {
                      if (val && !formData.driverLicense?.includes(val)) {
                        toggleList('driverLicense', val);
                      }
                    }}
                    options={DRIVER_LICENSES}
                    placeholder={t('form.driving_license')}
                    searchable={false}
                  />
                  {formData.driverLicense && formData.driverLicense.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-4">
                      {formData.driverLicense.map(l => (
                        <span key={l} className="bg-[#1f6d78]/10 text-[#1f6d78] dark:bg-[#1f6d78]/20 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest border border-[#1f6d78]/20 shadow-sm">
                          {l}
                          <button type="button" onClick={() => toggleList('driverLicense', l)} className="hover:text-red-500 transition-colors text-xs font-bold leading-none">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.marital')}</label>
                  <SearchableSelect
                    value={formData.maritalStatus || ''}
                    onChange={(val) => setFormData({ ...formData, maritalStatus: val })}
                    options={MARITAL_STATUSES}
                    placeholder={t('form.marital')}
                    searchable={false}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.travel')}</label>
                  <SearchableSelect
                    value={formData.travelStatus || ''}
                    onChange={(val) => setFormData({ ...formData, travelStatus: val })}
                    options={TRAVEL_STATUSES}
                    placeholder={t('form.travel')}
                    searchable={false}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.disability')}</label>
                  <SearchableSelect
                    value={formData.disabilityStatus || ''}
                    onChange={(val) => setFormData({ ...formData, disabilityStatus: val })}
                    options={DISABILITY_STATUSES}
                    placeholder={t('form.disability')}
                    searchable={false}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.start_date')}</label>
                  <SearchableSelect
                    value={formData.noticePeriod || ''}
                    onChange={(val) => setFormData({ ...formData, noticePeriod: val })}
                    options={NOTICE_PERIODS}
                    placeholder={t('form.start_date')}
                    searchable={false}
                  />
                </div>
              </div>
            </div>
          </ExpandableSection>



          <ExpandableSection
            title={t('form.references')}
            subtitle={t('form.references_subtitle')}
            isOpen={openSections.ref}
            onToggle={() => toggleSection('ref')}
          >
            <div className="space-y-6">
              {/* Existing References List */}
              {formData.references && formData.references.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.references.map((ref) => (
                    <div key={ref.id} className="bg-white dark:bg-black p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/5 relative group">
                      <button
                        type="button"
                        onClick={() => removeReference(ref.id)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all font-bold"
                      >
                        ×
                      </button>
                      <h4 className="font-semibold text-black dark:text-white text-sm tracking-tight">{ref.name}</h4>
                      <p className="text-xs font-semibold text-black/60 dark:text-white/60 tracking-tight">{ref.role} @ {ref.company}</p>
                      {(ref.email || ref.phone) && (
                        <div className="mt-3 pt-3 border-t border-black/10 space-y-1">
                          {ref.email && <p className="text-[10px] text-gray-400 font-medium">✉️ {ref.email}</p>}
                          {ref.phone && <p className="text-[10px] text-gray-400 font-medium">📞 {ref.phone}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Reference Form - Premium Style */}
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  {/* Ad Soyad */}
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.fullname')} *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder="Ad Soyad"
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                        value={refInput.name}
                        onChange={e => setRefInput({ ...refInput, name: capitalizeWords(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Kurum Adı */}
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.institution')} *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder={t('form.institution')}
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                        value={refInput.company}
                        onChange={e => setRefInput({ ...refInput, company: capitalizeWords(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Meslek / Ünvan */}
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.profession')} *</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder={t('form.profession')}
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                        value={refInput.role}
                        onChange={e => setRefInput({ ...refInput, role: capitalizeWords(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* TELEFON */}
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.phone')} ({t('form.optional')})</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="tel"
                        placeholder={t('form.phone')}
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                        value={refInput.phone}
                        onChange={e => setRefInput({ ...refInput, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* E-POSTA */}
                  <div className="space-y-2">
                    <label className="text-[9.5px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.14em] ml-4">{t('form.email')} ({t('form.optional')})</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="email"
                        placeholder={t('form.email')}
                        className="w-full h-full bg-transparent outline-none font-semibold text-[14px] sm:text-[15px] px-6 sm:px-8 text-black dark:text-white placeholder:text-gray-400/60 tracking-tight"
                        value={refInput.email}
                        onChange={e => setRefInput({ ...refInput, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddReference}
                  className="w-full mt-2 bg-[#1f6d78] text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-[#155e68] transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-[#1f6d78]/20"
                  type="button"
                >
                  + {t('form.add_list')}
                </button>
              </div>
            </div>
          </ExpandableSection>


          {/* Completion Indicator Box previously here */}
          <div className="pt-8 pb-4 px-2 sm:px-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest">
                {t('form.completion_rate') || 'CV TAMAMLANMA ORANI'}
              </span>
              <span className={`text-[11px] sm:text-xs font-black tracking-tight ${completion === 100 ? 'text-[#1f6d78]' : 'text-black dark:text-white'}`}>
                %{completion}
              </span>
            </div>
            <div className="h-2 sm:h-2.5 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full shadow-md bg-[#1f6d78] dark:bg-white`}
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

        </div>
      </ExpandableSection>
    <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4">
      {/* KVKK Box */}
      <div className="bg-white dark:bg-black p-5 sm:p-6 rounded-3xl sm:rounded-[2.5rem] border border-black/10 dark:border-white/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 sm:gap-6">
            <input
              type="checkbox"
              id="cv-form-terms"
              checked={isConsentGiven}
              onChange={(e) => {
                handleCheckboxChange(e);
                if (e.target.checked) setShowConsentError(false);
              }}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md accent-[#1f6d78] shrink-0 mt-0.5 cursor-pointer border-2 ${showConsentError ? 'border-red-500 bg-red-50' : 'border-black/10'}`}
            />
            <label htmlFor="cv-form-terms" className={`text-[10px] sm:text-xs font-bold leading-relaxed cursor-pointer select-none ${showConsentError ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {t('form.kvkk_text')} <span className="text-[#1f6d78] font-black">(ZORUNLU)</span>
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
  </div>

    {/* Footer Actions */}
    <div className="p-3 sm:px-10 sm:py-5 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md flex flex-row items-center gap-3 sm:gap-4 sticky bottom-0 z-10 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)] pb-safe-bottom">
      <button
        disabled={isSubmitting || !isConsentGiven}
        onClick={async () => {
          if (!formData.name) {
            setShowWarning({ show: true, missing: [t('form.fullname')] });
            return;
          }
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
        className={`flex-[2] h-11 sm:h-14 flex items-center justify-center gap-2.5 sm:gap-3 transition-all active:scale-[0.98] rounded-2xl sm:rounded-full font-black text-[11px] sm:text-[13px] uppercase tracking-widest shadow-xl ${
          !isConsentGiven 
          ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed opacity-50 shadow-none' 
          : 'bg-[#1f6d78] text-white hover:bg-[#155e68] shadow-[#1f6d78]/20 hover:shadow-[#1f6d78]/30'
        }`}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <i className="fi fi-rs-paper-plane text-[15px] sm:text-[18px]"></i>
            <span>{t('settings.save') === 'Kaydet' ? 'YAYINLA' : t('settings.save')}</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("CV'nizi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
            if (onDelete) await onDelete();
          }
        }}
        className="flex-1 h-11 sm:h-14 flex items-center justify-center gap-2 sm:gap-2.5 border-2 border-red-500/10 hover:border-red-500 bg-red-50/30 dark:bg-red-950/10 text-red-500 rounded-2xl sm:rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-[0.98] group"
      >
        <i className="fi fi-rr-trash text-[13px] sm:text-[16px] group-hover:scale-110 transition-transform"></i>
        <span>CV'Mİ SİL</span>
      </button>
    </div>

    {/* Modals */}
    {showKVKKModal && (
      <KVKKApprovalModal
        onCancel={() => setShowKVKKModal(false)}
        onApprove={async () => {
          setShowKVKKModal(false);
          setIsConsentGiven(true);
          setHasPriorConsent(true);
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ kvkk_consent: true, kvkk_consent_date: new Date().toISOString() }).eq('id', user.id);
            }
          } catch (err) { console.error('Error saving consent:', err); }
        }}
      />
    )}

    {showWarning.show && (
      <div className="absolute inset-0 z-[150] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6 fade-in">
        <div className="bg-white border-2 border-red-50 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl zoom-in-95 text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5 text-2xl shadow-xl relative z-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-xl font-black text-black mb-2 leading-tight tracking-tight relative z-10">
            {showWarning.missing.length === 1 && showWarning.missing[0].length > 50 ? t('common.info_msg') : t('common.missing_info')}
          </h3>
          <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider relative z-10">
            {showWarning.missing.length === 1 && showWarning.missing[0].length > 50 ? t('common.please_note') : t('common.please_fill')}
          </p>
          <div className="bg-white rounded-2xl p-4 mb-8 border border-black/10 relative z-10">
            <ul className="text-left space-y-2">
              {showWarning.missing.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setShowWarning({ show: false, missing: [] })}
            className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg shadow-[#1f6d78]/20 active:scale-95 z-10"
          >
            {t('common.ok_fill')}
          </button>
        </div>
      </div>
    )}
  </div>
</div>
);
};

export default CVFormModal;
