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
  LANGUAGE_LEVELS
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
    className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold border transition-all ${active
      ? 'bg-[#1f6d78] border-[#1f6d78] text-white shadow-md'
      : 'bg-white dark:bg-black border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#1f6d78] dark:hover:border-[#1f6d78]'
      }`}
  >
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

const CVFormModal: React.FC<CVFormModalProps> = ({ onClose, onSubmit, onDelete, initialData, availableCities = [] }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<CV>>({
    name: initialData?.name || '',
    profession: initialData?.profession || '',
    city: initialData?.city || '',
    district: initialData?.district || '',
    experienceYears: initialData?.experienceYears || 0,
    language: initialData?.language || 'İngilizce', // Legacy fallback
    languageLevel: initialData?.languageLevel || 'Orta', // Legacy fallback
    languageDetails: initialData?.languageDetails || [],
    about: initialData?.about || '',
    skills: initialData?.skills || [],
    salaryMin: initialData?.salaryMin || 40000,
    salaryMax: initialData?.salaryMax || 50000,
    education: initialData?.education || '', // Legacy fallback
    educationLevel: initialData?.educationLevel || 'Lisans', // Legacy fallback
    graduationStatus: initialData?.graduationStatus || 'Mezun', // Legacy fallback
    educationDetails: initialData?.educationDetails || [],
    internshipDetails: initialData?.internshipDetails || [],
    workExperience: initialData?.workExperience || [],
    workType: initialData?.workType || 'Ofis',
    employmentType: initialData?.employmentType || 'Tam Zamanlı',
    militaryStatus: initialData?.militaryStatus || '',
    maritalStatus: initialData?.maritalStatus || 'Bekar',
    disabilityStatus: initialData?.disabilityStatus || 'Yok',
    travelStatus: initialData?.travelStatus || 'Seyahat Engeli Yok',
    driverLicense: initialData?.driverLicense || [],
    noticePeriod: initialData?.noticePeriod || 'Hemen',
    photoUrl: initialData?.photoUrl,
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    isEmailPublic: initialData?.isEmailPublic || false,
    isPhonePublic: initialData?.isPhonePublic || false,
    workingStatus: initialData?.workingStatus || 'open',
    preferredCity: initialData?.preferredCity || '',
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

    // 4. Education (10%)
    if (formData.educationDetails && formData.educationDetails.length > 0) score += 10;
    else if (formData.education) score += 5;

    // 5. Skills (10%)
    if (formData.skills && formData.skills.length > 0) score += 10;

    // 6. Contact Info (10%)
    if (formData.email) score += 5;
    if (formData.phone) score += 5;

    // 7. Other (10%) - Internships, Languages, Certificates, References, etc.
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

  const [skillInput, setSkillInput] = useState('');

  const handleSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills?.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...(prev.skills || []), skillInput.trim()]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== idx)
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
  const [eduInput, setEduInput] = useState<Partial<EducationEntry>>({ university: '', department: '', level: 'Lisans', status: 'Mezun' });
  const addEducation = () => {
    if (eduInput.university && eduInput.department) {
      const newEdu = { ...eduInput, id: Math.random().toString() } as EducationEntry;
      setFormData(prev => ({ ...prev, educationDetails: [...(prev.educationDetails || []), newEdu] }));
      setEduInput({ university: '', department: '', level: 'Lisans', status: 'Mezun' });
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


const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-4 sm:mb-6">
    <h3 className="text-[14px] sm:text-[16px] font-black text-black dark:text-white uppercase tracking-[0.2em] border-l-[3px] border-[#1f6d78] pl-5 leading-none transition-all">{title}</h3>
    {subtitle && (
      <p className={`text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-2.5 ml-6 tracking-widest hidden sm:block ${title === t('form.basic_info_clean') ? 'hidden sm:block' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
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
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 transform translate-x-1.5 sm:translate-x-2 ${isOpen ? 'bg-[#1f6d78] text-white rotate-180 shadow-lg shadow-[#1f6d78]/20' : 'bg-white dark:bg-black text-gray-400'}`}>
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 custom-scrollbar space-y-8 sm:space-y-12 bg-white dark:bg-black">

          <section>

            <div className="flex flex-row sm:flex-row gap-4 sm:gap-8 mb-5 sm:mb-8 items-start">
              <div className="shrink-0 space-y-1.5 flex flex-col">
                <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">FOTOĞRAF</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-24 sm:w-28 sm:h-36 rounded-xl sm:rounded-[2rem] border-2 border-dashed border-black/10 dark:border-white/20 bg-white dark:bg-black flex flex-col items-center justify-center cursor-pointer hover:border-[#1f6d78] transition-all group overflow-hidden shadow-sm relative"
                >
                  {formData.photoUrl ? (
                    <>
                      <img src={formData.photoUrl} alt={t('form.cv_photo') || "CV Photo"} className="w-full h-full object-cover" />
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
                        fill="currentColor"
                        className="text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform sm:scale-125"
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                      </svg>
                    </>
                  )}

                  {/* Loading Overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-10">
                      <div className=" w-6 h-6 border-2 border-[#1f6d78] border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-3 sm:space-y-6 min-w-0">
                <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.fullname')}</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => {
                          const validated = validateInput(e.target.value, 50);
                          setFormData({ ...formData, name: capitalizeWords(validated) });
                        }}
                        maxLength={50}
                        className="w-full h-full bg-transparent outline-none font-bold text-[14px] sm:text-[16px] px-4 sm:px-6 text-gray-500 dark:text-gray-400 placeholder:text-gray-400"
                        placeholder={t('form.fullname')}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.profession')}</label>
                    <div className="w-full h-[38px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={e => {
                          const validated = validateInput(e.target.value, 60);
                          setFormData({ ...formData, profession: capitalizeWords(validated) });
                        }}
                        maxLength={60}
                        className="w-full h-full bg-transparent outline-none font-bold text-[14px] sm:text-[16px] px-4 sm:px-6 text-gray-500 dark:text-gray-400 placeholder:text-gray-400"
                        placeholder={t('form.profession')}
                      />
                    </div>
                  </div>
                </div>
                <p className="hidden sm:block text-[9px] text-gray-400 mt-1 ml-4 font-bold">{t('form.profession_hint') || "Birden fazla ünvan için virgül (,) ile ayırınız."}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.city')}</label>
                    <SearchableSelect
                      value={formData.city}
                      onChange={(val) => setFormData({ ...formData, city: val, district: '' })}
                      options={Object.keys(TURKEY_LOCATIONS).sort()}
                      placeholder={t('form.city')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.district')}</label>
                    <SearchableSelect
                      value={formData.district || ''}
                      onChange={(val) => setFormData({ ...formData, district: val })}
                      options={formData.city ? TURKEY_LOCATIONS[formData.city] || [] : []}
                      placeholder={t('form.district')}
                      disabled={!formData.city}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.experience')}</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                        <input
                          type="number"
                          min="0"
                          value={formData.experienceYears === 0 ? '' : formData.experienceYears}
                          onChange={e => setFormData({ ...formData, experienceYears: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                          className="w-full h-full bg-transparent outline-none font-bold text-[14px] sm:text-[16px] px-5 sm:px-7 py-0 text-gray-500 dark:text-gray-400 placeholder:text-gray-400"
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
                          className="w-full h-full bg-transparent outline-none font-bold text-[14px] sm:text-[16px] px-5 sm:px-7 py-0 text-gray-500 dark:text-gray-400 placeholder:text-gray-400"
                          placeholder={t('common.month')}
                        />
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </section>



          <section>
            <div className="space-y-4">
              <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.about_clean') || 'Hakkında'}</label>
              <div className="w-full bg-white dark:bg-black rounded-[1.5rem] sm:rounded-[2rem] border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center h-40 sm:h-56">
                <textarea
                  value={formData.about}
                  onChange={e => setFormData({ ...formData, about: e.target.value })}
                  className="w-full h-full bg-transparent outline-none resize-none px-6 py-8 sm:px-10 sm:py-10 text-[15px] font-medium leading-relaxed text-gray-500 dark:text-gray-400 placeholder:text-gray-400/70 tracking-wide"
                  placeholder={t('form.about_placeholder')}
                ></textarea>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 dark:text-gray-500 leading-relaxed px-4 pt-2">
                Temel bilgilerinizle iş aramaya hemen başlayabilirsiniz. Profilinizi öne çıkarmak için aşağıdaki <strong>"Profilini Güçlendir"</strong> bölümünden eğitim ve deneyimlerinizi eklemeyi unutmayın.
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
            <div className="space-y-10 sm:space-y-14">
              {/* Çalışma Durumu */}
              <div className="bg-white dark:bg-black p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-black/10 dark:border-white/5">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 sm:mb-6 block">{t('form.work_status')}</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'active', label: t('form.working') },
                    { id: 'passive', label: t('form.not_working') },
                    { id: 'open', label: t('form.job_seeking') }
                  ].map(status => (
                    <SelectionPill
                      key={status.id}
                      label={status.label}
                      active={formData.workingStatus === status.id}
                      onClick={() => setFormData({ ...formData, workingStatus: status.id as any })}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.preferred_city')}</label>
                  <SearchableSelect
                    value={formData.preferredCity || ''}
                    onChange={(val) => setFormData({ ...formData, preferredCity: val })}
                    options={Object.keys(TURKEY_LOCATIONS).sort()}
                    placeholder={t('form.city')}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.preferred_roles')}</label>
                  <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      value={roleInput}
                      onChange={e => setRoleInput(e.target.value)}
                      onKeyDown={handleRoleAdd}
                      className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-6 sm:px-8 py-0 dark:text-white placeholder:text-gray-400"
                      placeholder={t('form.roles_placeholder')}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.preferredRoles?.map((role, idx) => (
                      <span key={idx} className="bg-[#1f6d78] text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-wider">
                        {role}
                        <button onClick={() => removeRole(idx)} className="hover:opacity-50">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.work_model')}</label>
                  <div className="flex flex-wrap gap-2">
                    {WORK_TYPES.map(t => <SelectionPill key={t} label={t} active={formData.workType === t} onClick={() => setFormData({ ...formData, workType: t })} />)}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.employment_type')}</label>
                  <div className="flex flex-wrap gap-2">
                    {EMPLOYMENT_TYPES.map(t => <SelectionPill key={t} label={t} active={formData.employmentType === t} onClick={() => setFormData({ ...formData, employmentType: t })} />)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.salary_exp')}</label>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMin} onChange={e => setFormData({ ...formData, salaryMin: parseInt(e.target.value) })} className="w-full bg-white dark:bg-black rounded-full px-4 py-3 sm:px-8 sm:py-4 outline-none border border-black/10 dark:border-white/10 font-bold text-xs sm:text-sm dark:text-white" placeholder={t('filter.salary_min')} />
                    <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-black text-gray-400 pointer-events-none">{t('filter.salary_min').toUpperCase()}</span>
                  </div>
                  <div className="w-2 md:w-4 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMax} onChange={e => setFormData({ ...formData, salaryMax: parseInt(e.target.value) })} className="w-full bg-white dark:bg-black rounded-full px-4 py-3 sm:px-8 sm:py-4 outline-none border border-black/10 dark:border-white/10 font-bold text-xs sm:text-sm dark:text-white" placeholder={t('filter.salary_max')} />
                    <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-black text-gray-400 pointer-events-none">{t('filter.salary_max').toUpperCase()}</span>
                  </div>

                  {/* Currency Selector */}
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsCurrencyOpen(!isCurrencyOpen); }}
                      className="h-[44px] w-[60px] sm:h-[52px] sm:w-[70px] bg-white dark:bg-black rounded-full font-bold text-xs sm:text-sm text-gray-700 dark:text-white flex items-center justify-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {formData.salaryCurrency || '₺'}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {isCurrencyOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-black rounded-xl shadow-xl border border-black/10 dark:border-gray-700 overflow-hidden flex items-center z-30 w-[70px]">
                        {['₺', '$', '€', '£'].map(c => (
                          <div
                            key={c}
                            onClick={() => { setFormData({ ...formData, salaryCurrency: c }); setIsCurrencyOpen(false); }}
                            className={`px-2 py-3 hover:bg-white dark:hover:bg-gray-700 cursor-pointer text-center font-bold text-sm ${formData.salaryCurrency === c ? 'bg-white dark:bg-gray-700 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                          >
                            {c}
                          </div>
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
                  <h4 className="font-bold text-black dark:text-white">{work.role}</h4>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{work.company}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{work.startDate} - {work.isCurrent ? t('form.currently_working_short') : work.endDate}</p>
                </div>
              ))}

              {/* Add Form */}
              <div className="bg-white dark:bg-black border-2 border-dashed border-black/10 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-500 uppercase tracking-widest">{t('form.add_experience')}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input type="text" placeholder={`${t('form.institution')} *`} value={workInput.company} onChange={e => setWorkInput({ ...workInput, company: e.target.value })} className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white" />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input type="text" placeholder={`${t('form.position')} *`} value={workInput.role} onChange={e => setWorkInput({ ...workInput, role: e.target.value })} className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white" />
                  </div>
                  <MonthYearPicker placeholder={t('form.start_date_label')} value={workInput.startDate} onChange={val => setWorkInput({ ...workInput, startDate: val })} />
                  <MonthYearPicker placeholder={t('form.end_date_label')} disabled={workInput.isCurrent} value={workInput.endDate || ''} onChange={val => setWorkInput({ ...workInput, endDate: val })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={workInput.isCurrent} onChange={e => setWorkInput({ ...workInput, isCurrent: e.target.checked })} className="accent-[#1f6d78] w-4 h-4" />
                  <span className="text-xs font-bold dark:text-gray-500">{t('form.currently_working')}</span>
                </div>
                <button onClick={addWork} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest">+ {t('form.add')}</button>
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
                        onClick={() => removeInternship(intern.id)}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all font-bold z-10"
                      >
                        ×
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('form.intern_role')}</label>
                          <p className="text-base sm:text-lg font-black text-black dark:text-white">{intern.role}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('form.institution')}</label>
                          <p className="text-base sm:text-lg font-black text-black dark:text-white">{intern.company}</p>
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('form.intern_period')}</label>
                          <p className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-400">{intern.startDate} - {intern.isCurrent ? t('common.ongoing') : intern.endDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Internship Form */}
              <div className="bg-white dark:bg-black/50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border-2 border-dashed border-black/10 dark:border-white/5">
                <h5 className="text-[11px] sm:text-xs font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1f6d78]/10 flex items-center justify-center text-[10px]">+</span>
                  {t('form.add_internship') || "Staj Ekle"}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.intern_role')} *</label>
                    <div className="w-full h-12 sm:h-14 bg-white dark:bg-black rounded-full border border-black/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder={t('form.position')}
                        className="w-full h-full bg-transparent outline-none font-bold text-base px-6 sm:px-8 dark:text-white"
                        value={internInput.role}
                        onChange={e => setInternInput({ ...internInput, role: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.institution')} *</label>
                    <div className="w-full h-12 sm:h-14 bg-white dark:bg-black rounded-full border border-black/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="text"
                        placeholder={t('form.institution')}
                        className="w-full h-full bg-transparent outline-none font-bold text-base px-6 sm:px-8 dark:text-white"
                        value={internInput.company}
                        onChange={e => setInternInput({ ...internInput, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.start_date')} *</label>
                    <div className="w-full h-12 sm:h-14 bg-white dark:bg-black rounded-full border border-black/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                      <input
                        type="month"
                        className="w-full h-full bg-transparent outline-none font-bold text-base px-6 sm:px-8 dark:text-white"
                        value={internInput.startDate}
                        onChange={e => setInternInput({ ...internInput, startDate: e.target.value })}
                        lang="tr"
                      />
                    </div>
                  </div>
                  {!internInput.isCurrent && (
                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.end_date')}</label>
                      <div className="w-full h-12 sm:h-14 bg-white dark:bg-black rounded-full border border-black/10 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center shadow-sm">
                        <input
                          type="month"
                          className="w-full h-full bg-transparent outline-none font-bold text-base px-6 sm:px-8 dark:text-white"
                          value={internInput.endDate}
                          onChange={e => setInternInput({ ...internInput, endDate: e.target.value })}
                          lang="tr"
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
                  onClick={addInternship}
                  className="w-full mt-8 bg-[#1f6d78] text-white font-black py-4 rounded-2xl hover:bg-[#155e68] transition-all active:scale-[0.98] text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#1f6d78]/20"
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
                    <div>
                      <h4 className="font-bold text-sm text-black dark:text-white">{edu.university}</h4>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{edu.department} ({edu.level})</p>
                      <p className="text-[10px] text-gray-400 mt-1">{edu.status}</p>
                    </div>
                    <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full font-bold">×</button>
                  </div>
                ))}

                <div className="bg-white dark:bg-black border-2 border-dashed border-black/10 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                  <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-500 uppercase tracking-widest">+ {t('form.add_education')}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                      <input type="text" placeholder={t('form.university')} value={eduInput.university} onChange={e => setEduInput({ ...eduInput, university: e.target.value })} className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white" />
                    </div>
                    <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                      <input type="text" placeholder={t('form.department') || ''} value={eduInput.department || ''} onChange={e => setEduInput({ ...eduInput, department: e.target.value })} className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white" />
                    </div>
                    <select value={eduInput.level} onChange={e => setEduInput({ ...eduInput, level: e.target.value })} className="w-full bg-white dark:bg-black rounded-xl px-4 py-3 outline-none font-bold text-sm appearance-none border border-black/10 focus:bg-white dark:focus:bg-black focus:border-[#1f6d78]/10 transition-all dark:text-white">
                      {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={eduInput.status} onChange={e => setEduInput({ ...eduInput, status: e.target.value })} className="w-full bg-white dark:bg-black rounded-xl px-4 py-3 outline-none font-bold text-sm appearance-none border border-black/10 focus:bg-white dark:focus:bg-black focus:border-[#1f6d78]/10 transition-all dark:text-white">
                      {GRADUATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <button onClick={addEducation} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest transition-all active: shadow-lg">+ {t('form.add_education')}</button>
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
            <div className="space-y-4">
              {/* Added Languages List */}
              {formData.languageDetails && formData.languageDetails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.languageDetails.map(lang => (
                    <div key={lang.id} className="inline-flex items-center gap-2 bg-white dark:bg-black border border-black/10 dark:border-white/5 rounded-full px-4 py-2">
                      <span className="text-xs font-bold dark:text-white">{lang.language} - {lang.level}</span>
                      <button onClick={() => removeLang(lang.id)} className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full px-1">×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Language Form */}
              <div className="bg-white dark:bg-black border-2 border-dashed border-black/10 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-500 uppercase tracking-widest">{t('form.add_language')}</h5>
                <div className="flex flex-col gap-4">
                  <select
                    value={langInput.language}
                    onChange={e => setLangInput({ ...langInput, language: e.target.value })}
                    className="w-full bg-white dark:bg-black rounded-xl px-3 py-2 sm:px-4 sm:py-3 outline-none font-bold text-[11px] sm:text-sm appearance-none border border-black/10 focus:bg-white dark:focus:bg-black focus:border-[#1f6d78]/10 transition-all dark:text-white"
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>

                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_LEVELS.map(lvl => (
                      <button key={lvl} onClick={() => setLangInput({ ...langInput, level: lvl })} className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold border transition-all ${langInput.level === lvl ? 'bg-[#1f6d78] text-white border-[#1f6d78]' : 'bg-white dark:bg-black text-gray-500 dark:text-gray-400 border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-black'}`}>{lvl}</button>
                    ))}
                  </div>

                  <button onClick={addLang} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest transition-all active: shadow-lg">+ {t('form.add')}</button>
                </div>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('form.certificates')}
            subtitle={t('form.add_certificate')}
            isOpen={openSections.cert}
            onToggle={() => toggleSection('cert')}
          >
            <div className="space-y-4">
              {/* Added Certificates List */}
              {formData.certificates && formData.certificates.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.certificates.map(cert => (
                    <div key={cert.id} className="inline-flex items-center gap-2 bg-white dark:bg-black border border-black/10 dark:border-white/5 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                      <span className="text-[10px] sm:text-xs font-bold dark:text-white">{cert.name} {cert.issuer ? `(${cert.issuer})` : ''}</span>
                      <button onClick={() => removeCertificate(cert.id)} className="text-red-500 font-bold hover:bg-red-50 rounded-full px-1">×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Certificate Form */}
              <div className="bg-white dark:bg-black border-2 border-dashed border-black/10 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-500 uppercase tracking-widest">{t('form.add_certificate')}</h5>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      placeholder={t('form.cert_name')}
                      value={certInput.name}
                      onChange={e => setCertInput({ ...certInput, name: e.target.value })}
                      className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                      <input
                        type="text"
                        placeholder={t('form.cert_issuer')}
                        value={certInput.issuer}
                        onChange={e => setCertInput({ ...certInput, issuer: e.target.value })}
                        className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white"
                      />
                    </div>
                    <MonthYearPicker
                      placeholder={t('form.cert_date')}
                      value={certInput.date || ''}
                      onChange={val => setCertInput({ ...certInput, date: val })}
                    />
                  </div>

                  <button onClick={addCertificate} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest transition-all active: shadow-lg">+ {t('form.add')}</button>
                </div>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('form.skills')}
            subtitle={t('form.skills_placeholder')}
            isOpen={openSections.skills}
            onToggle={() => toggleSection('skills')}
          >
            <div className="space-y-4">
              <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.skills')}</label>
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillAdd}
                className="w-full bg-white dark:bg-black border border-black/10 focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-black rounded-full px-5 py-3 sm:px-8 sm:py-4 outline-none transition-all text-[11px] sm:text-sm font-bold shadow-sm dark:text-white"
                placeholder={t('form.skills_placeholder') || "React, Proje Yönetimi, SQL, Figma..."}
              />
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.skills?.map((skill, idx) => (
                  <span key={idx} className="bg-[#1f6d78] text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase tracking-wider zoom-in-50">
                    {skill}
                    <button onClick={() => removeSkill(idx)} className="hover:opacity-50 text-base font-light">×</button>
                  </span>
                ))}
                {(!formData.skills || formData.skills.length === 0) && <p className="text-[10px] text-gray-400 italic">{t('form.no_skills')}</p>}
              </div>
            </div>
          </ExpandableSection>


          <ExpandableSection
            title={t('form.personal_clean')}
            subtitle={t('form.personal_subtitle')}
            isOpen={openSections.additional}
            onToggle={() => toggleSection('additional')}
          >
            <div className="space-y-12">
              <div className="space-y-4">
                <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.birth_date')}</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center flex items-center justify-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={(formData.birthDate || '').split('.')[0] || ''}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          const parts = (formData.birthDate || '').split('.');
                          setFormData({ ...formData, birthDate: `${val}.${parts[1] || ''}.${parts[2] || ''}` });
                        }}
                        className="w-full h-full bg-transparent outline-none font-bold text-[14px] sm:text-[16px] text-center text-gray-500 dark:text-gray-400 placeholder:text-gray-400"
                        placeholder="GG"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center flex items-center justify-center">
                      <input
                        type="text"
                        maxLength={2}
                        value={(formData.birthDate || '').split('.')[1] || ''}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          const parts = (formData.birthDate || '').split('.');
                          setFormData({ ...formData, birthDate: `${parts[0] || ''}.${val}.${parts[2] || ''}` });
                        }}
                        className="w-full h-full bg-transparent outline-none font-bold text-[14px] sm:text-[16px] text-center text-gray-500 dark:text-gray-400 placeholder:text-gray-400"
                        placeholder="AA"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-[42px] sm:h-[48px] bg-white dark:bg-black rounded-full border border-black/10 dark:border-white/10 focus-within:border-[#1f6d78]/20 focus-within:bg-white dark:focus-within:bg-black transition-all overflow-hidden flex items-center flex items-center justify-center">
                      <input
                        type="text"
                        maxLength={4}
                        value={(formData.birthDate || '').split('.')[2] || ''}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          const parts = (formData.birthDate || '').split('.');
                          setFormData({ ...formData, birthDate: `${parts[0] || ''}.${parts[1] || ''}.${val}` });
                        }}
                        className="w-full h-full bg-transparent outline-none font-bold text-[14px] sm:text-[16px] text-center text-gray-500 dark:text-gray-400 placeholder:text-gray-400"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.military')}</label>
                  <div className="flex flex-wrap gap-2">
                    {MILITARY_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.militaryStatus === s} onClick={() => setFormData({ ...formData, militaryStatus: formData.militaryStatus === s ? '' : s })} />)}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.driving_license')}</label>
                  <div className="flex flex-wrap gap-2">
                    {DRIVER_LICENSES.map(l => <SelectionPill key={l} label={l} active={formData.driverLicense?.includes(l) || false} onClick={() => toggleList('driverLicense', l)} />)}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.marital')}</label>
                  <div className="flex flex-wrap gap-2">
                    {MARITAL_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.maritalStatus === s} onClick={() => setFormData({ ...formData, maritalStatus: s })} />)}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.travel')}</label>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.travelStatus === s} onClick={() => setFormData({ ...formData, travelStatus: s })} />)}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.disability')}</label>
                  <div className="flex flex-wrap gap-2">
                    {DISABILITY_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.disabilityStatus === s} onClick={() => setFormData({ ...formData, disabilityStatus: s })} />)}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.start_date')}</label>
                  <div className="flex flex-wrap gap-2">
                    {NOTICE_PERIODS.map(p => <SelectionPill key={p} label={p} active={formData.noticePeriod === p} onClick={() => setFormData({ ...formData, noticePeriod: p })} />)}
                  </div>
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
                        onClick={() => removeReference(ref.id)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all font-bold"
                      >
                        ×
                      </button>
                      <h4 className="font-bold text-black dark:text-white text-sm">{ref.name}</h4>
                      <p className="text-xs text-gray-500 font-bold">{ref.role} @ {ref.company}</p>
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

              {/* Add Reference Form */}
              <div className="bg-white dark:bg-black border-2 border-dashed border-black/10 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6">
                <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-500 uppercase tracking-widest mb-3 sm:mb-4">{t('form.add_reference')}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-black focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      placeholder={t('form.fullname')}
                      className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.name}
                      onChange={e => setRefInput({ ...refInput, name: capitalizeWords(e.target.value) })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      placeholder={t('form.institution')}
                      className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.company}
                      onChange={e => setRefInput({ ...refInput, company: capitalizeWords(e.target.value) })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input
                      type="text"
                      placeholder={t('form.profession')}
                      className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.role}
                      onChange={e => setRefInput({ ...refInput, role: capitalizeWords(e.target.value) })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input
                      type="tel"
                      placeholder={`${t('form.phone')} (${t('form.optional')})`}
                      className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.phone}
                      onChange={e => setRefInput({ ...refInput, phone: e.target.value })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-white dark:bg-black rounded-xl border border-black/10 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/20 transition-all overflow-hidden flex items-center">
                    <input
                      type="email"
                      placeholder={`${t('form.email')} (${t('form.optional')})`}
                      className="w-full h-full bg-transparent outline-none font-medium text-[14px] sm:text-[16px] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.email}
                      onChange={e => setRefInput({ ...refInput, email: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddReference}
                  className="w-full bg-[#1f6d78] text-white font-bold py-4 rounded-xl hover:bg-[#155e68] transition-all active:scale-[0.98] text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#1f6d78]/20 mt-4"
                >
                  + {t('form.add_list')}
                </button>
              </div>
            </div>
          </ExpandableSection>

          <ExpandableSection
            title={t('form.contact_info_clean')}
            subtitle={t('form.contact_info_subtitle')}
            isOpen={openSections.contact}
            onToggle={() => toggleSection('contact')}
          >
            <div className="bg-white dark:bg-black p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-black/10 dark:border-white/5 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.email')}</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({ ...formData, isEmailPublic: !formData.isEmailPublic })}>
                      <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${formData.isEmailPublic ? 'bg-[#1f6d78] border-[#1f6d78]' : 'border-gray-300 dark:border-white/20 bg-white dark:bg-black'}`}>
                        {formData.isEmailPublic && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{formData.isEmailPublic ? t('form.visible') : t('form.hidden')}</span>
                    </div>
                  </div>
                  <div className={`w-full h-14 rounded-full border transition-all overflow-hidden flex items-center focus-within:bg-white dark:focus-within:bg-black ${formData.isEmailPublic ? 'bg-white dark:bg-black border-[#1f6d78]/20' : 'bg-gray-100 dark:bg-gray-950 border-black/10'}`}>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full h-full bg-transparent outline-none font-bold text-base px-8 ${formData.isEmailPublic ? 'text-gray-500' : 'text-gray-400'}`}
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-4">{t('form.phone')}</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({ ...formData, isPhonePublic: !formData.isPhonePublic })}>
                      <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${formData.isPhonePublic ? 'bg-[#1f6d78] border-[#1f6d78]' : 'border-gray-300 dark:border-white/20 bg-white dark:bg-black'}`}>
                        {formData.isPhonePublic && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{formData.isPhonePublic ? t('form.visible') : t('form.hidden')}</span>
                    </div>
                  </div>
                  <div className={`w-full h-14 rounded-full border transition-all overflow-hidden flex items-center focus-within:bg-white dark:focus-within:bg-black ${formData.isPhonePublic ? 'bg-white dark:bg-black border-[#1f6d78]/20' : 'bg-gray-100 dark:bg-gray-950 border-black/10'}`}>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full h-full bg-transparent outline-none font-bold text-base px-8 ${formData.isPhonePublic ? 'text-gray-500' : 'text-gray-400'}`}
                      placeholder="0555 123 45 67"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed ml-2">* {t('form.contact_hint_text') || "Yanındaki yuvarlak kutucuğu işaretlemediğiniz sürece iletişim bilgileriniz profilinizde görünmez."}</p>
            </div>
          </ExpandableSection>

          {/* Completion Indicator Box previously here */}
          <div className="pt-8 pb-4 px-2 sm:px-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-100 uppercase tracking-widest">
                {t('form.completion_rate') || 'CV TAMAMLANMA ORANI'}
              </span>
              <span className={`text-[11px] sm:text-xs font-black tracking-tighter ${completion === 100 ? 'text-[#1f6d78]' : 'text-black dark:text-white'}`}>
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

      <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
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
                {t('form.kvkk_text')}
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
        <div className="p-4 sm:px-10 sm:py-6 border-t border-black/10 dark:border-white/10 bg-white dark:bg-black flex flex-row items-stretch gap-3 sm:gap-4 sticky bottom-0 z-10 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          {/* Submit Button */}
          <button
            disabled={isSubmitting}
            onClick={async () => {
              // Consent Validation (Warning only)
              if (!isConsentGiven) {
                setShowConsentError(true);
                // Scroll to checkbox if error
                const element = document.getElementById('cv-form-terms');
                if (element) {
                   element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
              }

              // Name Validation
              if (!formData.name) {
                setShowWarning({
                  show: true,
                  missing: [t('form.fullname')]
                });
                return;
              }

              // Sync legacy fields
              const syncedData = {
                ...formData,
                education: formData.educationDetails?.[0]?.university || formData.education || '',
                educationLevel: formData.educationDetails?.[0]?.level || formData.educationLevel || '',
                graduationStatus: formData.educationDetails?.[0]?.status || formData.graduationStatus || '',
                language: formData.languageDetails?.[0]?.language || formData.language || '',
                languageLevel: formData.languageDetails?.[0]?.level || formData.languageLevel || '',
              };

              setIsSubmitting(true);
              try {
                await onSubmit(syncedData, isConsentGiven);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="flex-1 bg-[#1f6d78] text-white py-3.5 sm:py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all active:scale-[0.98] shadow-lg shadow-[#1f6d78]/20 disabled:opacity-50 disabled:cursor-not-allowed order-2 text-center"
          >
            {isSubmitting ? t('settings.save') : 'YAYINLA'}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={async () => {
              if (window.confirm("CV'nizi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
                if (onDelete) await onDelete();
              }
            }}
            className={`flex-1 border-2 border-red-500 text-red-500 py-3.5 sm:py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-[0.98] order-1 text-center opacity-100 cursor-pointer`}
          >
            CV'Mİ SİL
          </button>
        </div>

        {/* KVKK Approval Modal */}
        {
          showKVKKModal && (
            <KVKKApprovalModal
              onCancel={() => setShowKVKKModal(false)}
              onApprove={async () => {
                setShowKVKKModal(false);
                setIsConsentGiven(true);
                setHasPriorConsent(true); // Optimistically set prior consent

                // Save consent immediately to DB
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await supabase
                      .from('profiles')
                      .update({
                        kvkk_consent: true,
                        kvkk_consent_date: new Date().toISOString()
                      })
                      .eq('id', user.id);
                  }
                } catch (err) {
                  console.error('Error saving consent instantly:', err);
                }
              }}
            />
          )
        }

        {/* Warning Overlay */}
        {
          showWarning.show && (
            <div className="absolute inset-0 z-[150] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6  fade-in ">
              <div className="bg-white border-2 border-red-50 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl   zoom-in-95  text-center relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#1f6d78]/5 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

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
                  className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg shadow-[#1f6d78]/20 active: relative z-10"
                >
                  {t('common.ok_fill')}
                </button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CVFormModal;
