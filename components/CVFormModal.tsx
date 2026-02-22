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
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#1f6d78] dark:hover:border-[#1f6d78]'
      }`}
  >
    {label}
  </button>
);


interface CVFormModalProps {
  onClose: () => void;
  onSubmit: (cv: Partial<CV>, consentGiven?: boolean) => void;
  initialData?: Partial<CV>;
  availableCities?: Array<{ label: string }>;
}

const CVFormModal: React.FC<CVFormModalProps> = ({ onClose, onSubmit, initialData, availableCities = [] }) => {
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
  });

  const [refInput, setRefInput] = useState({ name: '', company: '', role: '', phone: '', email: '' });
  const [showWarning, setShowWarning] = useState<{ show: boolean, missing: string[] }>({ show: false, missing: [] });
  const [showKVKKModal, setShowKVKKModal] = useState(false);
  const [hasPriorConsent, setHasPriorConsent] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [loadingConsent, setLoadingConsent] = useState(true);

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
      alert('Referans Eklemek için İsim ve Kurum girmelisiniz.');
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
      alert('Fotoğraf yüklenirken hata oluştu: ' + error.message);
    } finally {
      setUploading(false);
    }
  };



  const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-4 sm:mb-6 mt-6 sm:mt-10 first:mt-0">
      <h3 className="text-xs sm:text-sm font-black text-black dark:text-white uppercase tracking-[0.15em] border-l-4 border-[#1f6d78] pl-3">{title}</h3>
      {subtitle && <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
    </div>
  );



  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center sm:p-4 pb-[84px] sm:pb-0 bg-white dark:bg-gray-900 sm:bg-black/60 sm:backdrop-blur-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-10 duration-300 sm:duration-500">
      <div className="bg-white dark:bg-gray-900 w-full h-full sm:w-full sm:max-w-[800px] sm:h-[90vh] rounded-none sm:rounded-[3rem] shadow-none sm:shadow-2xl relative flex flex-col overflow-hidden">

        {tempImageSrc && (
          <ImageCropper
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
            onClose={() => setTempImageSrc(null)}
            aspect={3 / 4} // Portrait aspect ratio for CV
          />
        )}

        {/* Header */}
        <div className="p-4 sm:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-black dark:text-white tracking-tighter">{t('form.cv_create_title')}</h2>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t('form.cv_create_subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl sm:text-2xl text-black dark:text-white hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white transition-all active:scale-90"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 custom-scrollbar space-y-8 sm:space-y-12 bg-white dark:bg-gray-900">

          {/* Bölüm 1: Temel Bilgiler */}
          <section>
            <SectionTitle title={t('form.basic_info')} subtitle={t('form.basic_info_subtitle')} />

            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 mb-5 sm:mb-8">
              <div className="shrink-0 flex justify-center sm:block">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileSelect}
                  className="hidden"
                  accept="image/*"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-32 sm:w-32 sm:h-44 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-[#1f6d78] transition-all group overflow-hidden relative shadow-sm"
                >
                  {formData.photoUrl ? (
                    <>
                      <img src={formData.photoUrl} alt="CV Photo" className="w-full h-full object-cover" />
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
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-black group-hover:scale-110 transition-transform duration-300"
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                      </svg>
                      <p className="text-[10px] font-black uppercase mt-3 text-gray-400 group-hover:text-black tracking-widest transition-colors">Fotoğraf</p>
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
              <div className="flex-1 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.fullname')} *</label>
                    <div className="w-full h-[42px] sm:h-[48px] bg-gray-50 dark:bg-gray-800 rounded-full border border-transparent focus-within:border-[#1f6d78]/10 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all overflow-hidden">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-[117.6%] h-[49px] sm:h-[56px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-5 sm:px-7 py-0 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder={t('form.fullname_example')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.profession')} *</label>
                    <div className="w-full h-[42px] sm:h-[48px] bg-gray-50 dark:bg-gray-800 rounded-full border border-transparent focus-within:border-[#1f6d78]/10 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all overflow-hidden">
                      <input
                        type="text"
                        value={formData.profession}
                        onChange={e => setFormData({ ...formData, profession: e.target.value })}
                        className="w-[117.6%] h-[49px] sm:h-[56px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-5 sm:px-7 py-0 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder={t('form.profession_example')}
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1 ml-1 font-bold">Birden fazla ünvan için virgül (,) ile ayırınız.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.city')} *</label>
                        <SearchableSelect
                          value={formData.city}
                          onChange={(val) => setFormData({ ...formData, city: val, district: '' })}
                          options={Object.keys(TURKEY_LOCATIONS).sort()}
                          placeholder="Şehir Seçiniz"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.district')}</label>
                        <SearchableSelect
                          value={formData.district || ''}
                          onChange={(val) => setFormData({ ...formData, district: val })}
                          options={formData.city ? TURKEY_LOCATIONS[formData.city] || [] : []}
                          placeholder="İlçe"
                          disabled={!formData.city}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.experience')}</label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="w-full h-[42px] sm:h-[48px] bg-gray-50 dark:bg-gray-800 rounded-full border border-transparent focus-within:border-[#1f6d78]/10 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all overflow-hidden">
                          <input
                            type="number"
                            min="0"
                            value={formData.experienceYears === 0 ? '' : formData.experienceYears}
                            onChange={e => setFormData({ ...formData, experienceYears: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                            className="w-[117.6%] h-[49px] sm:h-[56px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-5 sm:px-7 py-0 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                            placeholder="Yıl"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="w-full h-[42px] sm:h-[48px] bg-gray-50 dark:bg-gray-800 rounded-full border border-transparent focus-within:border-[#1f6d78]/10 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all overflow-hidden">
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
                            className="w-[117.6%] h-[49px] sm:h-[56px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-5 sm:px-7 py-0 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                            placeholder="Ay"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Çalışma Durumu */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-gray-100 dark:border-gray-700 mb-5 sm:mb-8">
              <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 sm:mb-4 block">{t('form.work_status')}</label>
              <div className="flex flex-wrap gap-2">
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

            {/* İletişim Bilgileri */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-gray-100 dark:border-gray-700 mb-5 sm:mb-8">
              <h4 className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 sm:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{t('form.contact_info')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest">{t('form.email')}</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({ ...formData, isEmailPublic: !formData.isEmailPublic })}>
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border transition-all flex items-center justify-center ${formData.isEmailPublic ? 'bg-[#1f6d78] border-[#1f6d78]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'}`}>
                        {formData.isEmailPublic && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">{formData.isEmailPublic ? t('form.visible') : t('form.hidden')}</span>
                    </div>
                  </div>
                  <div className={`w-full h-[42px] sm:h-[48px] rounded-full border transition-all overflow-hidden focus-within:bg-white dark:focus-within:bg-gray-700 ${formData.isEmailPublic ? 'bg-white dark:bg-gray-700 border-[#1f6d78]/10' : 'bg-gray-100 dark:bg-gray-900 border-transparent'}`}>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={`w-[117.6%] h-[49px] sm:h-[56px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-5 sm:px-7 py-0 ${formData.isEmailPublic ? 'text-black dark:text-white' : 'text-gray-500'}`}
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest">{t('form.phone')}</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({ ...formData, isPhonePublic: !formData.isPhonePublic })}>
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border transition-all flex items-center justify-center ${formData.isPhonePublic ? 'bg-[#1f6d78] border-[#1f6d78]' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'}`}>
                        {formData.isPhonePublic && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">{formData.isPhonePublic ? t('form.visible') : t('form.hidden')}</span>
                    </div>
                  </div>
                  <div className={`w-full h-[42px] sm:h-[48px] rounded-full border transition-all overflow-hidden focus-within:bg-white dark:focus-within:bg-gray-700 ${formData.isPhonePublic ? 'bg-white dark:bg-gray-700 border-[#1f6d78]/10' : 'bg-gray-100 dark:bg-gray-900 border-transparent'}`}>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-[117.6%] h-[49px] sm:h-[56px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-5 sm:px-7 py-0 ${formData.isPhonePublic ? 'text-black dark:text-white' : 'text-gray-500'}`}
                      placeholder="0555 123 45 67"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[8px] sm:text-[9px] text-gray-400 mt-3 sm:mt-4 leading-relaxed">* Yanındaki yuvarlak kutucuğu işaretlemediğiniz sürece iletişim bilgileriniz profilinizde <strong>görünmez</strong>.</p>
            </div>
          </section>

          {/* Bölüm 2: İş Tercihleri */}
          <section>
            <SectionTitle title={t('form.work_pref')} subtitle={t('form.work_pref_subtitle')} />

            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Tercih Edilen Şehir</label>
                  <SearchableSelect
                    value={formData.preferredCity || ''}
                    onChange={(val) => setFormData({ ...formData, preferredCity: val })}
                    options={Object.keys(TURKEY_LOCATIONS).sort()}
                    placeholder="Şehir Seçiniz"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Tercih Edilen Alanlar</label>
                  <div className="w-full h-[42px] sm:h-[48px] bg-gray-50 dark:bg-gray-800 rounded-full border border-transparent focus-within:border-[#1f6d78]/10 focus-within:bg-white dark:focus-within:bg-gray-700 transition-all overflow-hidden">
                    <input
                      type="text"
                      value={roleInput}
                      onChange={e => setRoleInput(e.target.value)}
                      onKeyDown={handleRoleAdd}
                      className="w-[117.6%] h-[49px] sm:h-[56px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-6 sm:px-8 py-0 dark:text-white placeholder:text-gray-400"
                      placeholder="Alan ekleyip Enter'a basın..."
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
                  <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.work_model')}</label>
                  <div className="flex flex-wrap gap-2">
                    {WORK_TYPES.map(t => <SelectionPill key={t} label={t} active={formData.workType === t} onClick={() => setFormData({ ...formData, workType: t })} />)}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.employment_type')}</label>
                  <div className="flex flex-wrap gap-2">
                    {EMPLOYMENT_TYPES.map(t => <SelectionPill key={t} label={t} active={formData.employmentType === t} onClick={() => setFormData({ ...formData, employmentType: t })} />)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.salary_exp')}</label>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMin} onChange={e => setFormData({ ...formData, salaryMin: parseInt(e.target.value) })} className="w-full bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-3 sm:px-8 sm:py-4 outline-none font-bold text-xs sm:text-sm dark:text-white" placeholder="Minimum" />
                    <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-black text-gray-400 pointer-events-none">MIN</span>
                  </div>
                  <div className="w-2 md:w-4 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMax} onChange={e => setFormData({ ...formData, salaryMax: parseInt(e.target.value) })} className="w-full bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-3 sm:px-8 sm:py-4 outline-none font-bold text-xs sm:text-sm dark:text-white" placeholder="Maximum" />
                    <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-black text-gray-400 pointer-events-none">MAX</span>
                  </div>

                  {/* Currency Selector */}
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsCurrencyOpen(!isCurrencyOpen); }}
                      className="h-[44px] w-[60px] sm:h-[52px] sm:w-[70px] bg-gray-50 dark:bg-gray-800 rounded-full font-bold text-xs sm:text-sm text-gray-700 dark:text-white flex items-center justify-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {formData.salaryCurrency || '₺'}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {isCurrencyOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-30 w-[70px]">
                        {['₺', '$', '€', '£'].map(c => (
                          <div
                            key={c}
                            onClick={() => { setFormData({ ...formData, salaryCurrency: c }); setIsCurrencyOpen(false); }}
                            className={`px-2 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-center font-bold text-sm ${formData.salaryCurrency === c ? 'bg-gray-50 dark:bg-gray-700 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
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

          </section>


          {/* Bölüm 2: İş Deneyimi (New) */}
          <section>
            <SectionTitle title={t('form.work_history')} subtitle={t('form.history_subtitle')} />
            <div className="space-y-6">
              {/* List */}
              {formData.workExperience?.map(work => (
                <div key={work.id} className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-700 relative group">
                  <button onClick={() => removeWork(work.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all font-bold">×</button>
                  <h4 className="font-bold text-black dark:text-white">{work.role}</h4>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{work.company}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{work.startDate} - {work.isCurrent ? 'Devam Ediyor' : work.endDate}</p>
                </div>
              ))}

              {/* Add Form */}
              <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-300 uppercase tracking-widest">{t('form.add_experience')}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                    <input type="text" placeholder={`${t('form.institution')} *`} value={workInput.company} onChange={e => setWorkInput({ ...workInput, company: e.target.value })} className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white" />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                    <input type="text" placeholder={`${t('form.position')} *`} value={workInput.role} onChange={e => setWorkInput({ ...workInput, role: e.target.value })} className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white" />
                  </div>
                  <MonthYearPicker placeholder={t('form.start_date_label')} value={workInput.startDate} onChange={val => setWorkInput({ ...workInput, startDate: val })} />
                  <MonthYearPicker placeholder={t('form.end_date_label')} disabled={workInput.isCurrent} value={workInput.endDate || ''} onChange={val => setWorkInput({ ...workInput, endDate: val })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={workInput.isCurrent} onChange={e => setWorkInput({ ...workInput, isCurrent: e.target.checked })} className="accent-[#1f6d78] w-4 h-4" />
                  <span className="text-xs font-bold dark:text-gray-300">{t('form.currently_working')}</span>
                </div>
                <button onClick={addWork} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest">+ {t('form.add')}</button>
              </div>
            </div>
          </section>

          {/* Bölüm 3: Eğitim ve Yetenekler */}
          <section>
            <SectionTitle title={t('form.exp_skills')} subtitle={t('form.exp_skills_subtitle')} />

            <div className="space-y-10">

              {/* Education List & Add */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.education_info')}</label>
                {formData.educationDetails?.map(edu => (
                  <div key={edu.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 relative group flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-black dark:text-white">{edu.university}</h4>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{edu.department} ({edu.level})</p>
                    </div>
                    <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full font-bold">×</button>
                  </div>
                ))}

                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                      <input type="text" placeholder={t('form.university')} value={eduInput.university} onChange={e => setEduInput({ ...eduInput, university: e.target.value })} className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white" />
                    </div>
                    <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                      <input type="text" placeholder={t('form.department')} value={eduInput.department} onChange={e => setEduInput({ ...eduInput, department: e.target.value })} className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {EDUCATION_LEVELS.map(l => <button key={l} onClick={() => setEduInput({ ...eduInput, level: l })} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${eduInput.level === l ? 'bg-[#1f6d78] text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>{l}</button>)}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setEduInput({ ...eduInput, status: 'Devam Ediyor' })} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${eduInput.status === 'Devam Ediyor' ? 'bg-[#1f6d78] text-white border-[#1f6d78]' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>Devam Ediyor</button>
                    <button onClick={() => setEduInput({ ...eduInput, status: 'Mezun' })} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${eduInput.status === 'Mezun' ? 'bg-[#1f6d78] text-white border-[#1f6d78]' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>Mezun</button>
                  </div>
                  <button onClick={addEducation} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">+ {t('form.add_education')}</button>
                </div>
              </div>


              {/* Internship (Staj) Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Staj Deneyimi</label>
                {formData.internshipDetails?.map(intern => (
                  <div key={intern.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 relative group flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-black dark:text-white">{intern.role}</h4>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{intern.company}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{intern.startDate} - {intern.isCurrent ? 'Devam Ediyor' : intern.endDate}</p>
                    </div>
                    <button onClick={() => removeInternship(intern.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-full font-bold">×</button>
                  </div>
                ))}

                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                  <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-300 uppercase tracking-widest">+ Staj Ekle</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                      <input type="text" placeholder="Kurum Adı *" value={internInput.company} onChange={e => setInternInput({ ...internInput, company: e.target.value })} className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white" />
                    </div>
                    <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                      <input type="text" placeholder="Pozisyon / Departman *" value={internInput.role} onChange={e => setInternInput({ ...internInput, role: e.target.value })} className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white" />
                    </div>
                    <MonthYearPicker placeholder={t('form.start_date_label')} value={internInput.startDate} onChange={val => setInternInput({ ...internInput, startDate: val })} />
                    <MonthYearPicker placeholder={t('form.end_date_label')} disabled={internInput.isCurrent} value={internInput.endDate || ''} onChange={val => setInternInput({ ...internInput, endDate: val })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={internInput.isCurrent} onChange={e => setInternInput({ ...internInput, isCurrent: e.target.checked })} className="accent-[#1f6d78] w-4 h-4" />
                    <span className="text-xs font-bold dark:text-gray-300">{t('form.currently_working')}</span>
                  </div>
                  <button onClick={addInternship} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">+ Ekle</button>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1 block mb-2">{t('form.languages')}</label>

                {/* Added Languages List */}
                {formData.languageDetails && formData.languageDetails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.languageDetails.map(lang => (
                      <div key={lang.id} className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2">
                        <span className="text-xs font-bold dark:text-white">{lang.language} - {lang.level}</span>
                        <button onClick={() => removeLang(lang.id)} className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full px-1">×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Language Form */}
                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                  <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-300 uppercase tracking-widest">{t('form.add_language')}</h5>
                  <div className="flex flex-col gap-4">
                    <select
                      value={langInput.language}
                      onChange={e => setLangInput({ ...langInput, language: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 sm:px-4 sm:py-3 outline-none font-bold text-[11px] sm:text-sm appearance-none border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-[#1f6d78]/10 transition-all dark:text-white"
                    >
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>

                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_LEVELS.map(lvl => (
                        <button key={lvl} onClick={() => setLangInput({ ...langInput, level: lvl })} className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold border transition-all ${langInput.level === lvl ? 'bg-[#1f6d78] text-white border-[#1f6d78]' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{lvl}</button>
                      ))}
                    </div>

                    <button onClick={addLang} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">+ {t('form.add')}</button>
                  </div>
                </div>

              </div>

              {/* Certificates */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1 block mb-2">{t('form.certificates')}</label>

                {/* Added Certificates List */}
                {formData.certificates && formData.certificates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.certificates.map(cert => (
                      <div key={cert.id} className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                        <span className="text-[10px] sm:text-xs font-bold dark:text-white">{cert.name} {cert.issuer ? `(${cert.issuer})` : ''}</span>
                        <button onClick={() => removeCertificate(cert.id)} className="text-red-500 font-bold hover:bg-red-50 rounded-full px-1">×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Certificate Form */}
                <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 space-y-4">
                  <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-300 uppercase tracking-widest">{t('form.add_certificate')}</h5>
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                      <input
                        type="text"
                        placeholder={`${t('form.cert_name')} *`}
                        value={certInput.name}
                        onChange={e => setCertInput({ ...certInput, name: e.target.value })}
                        className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                        <input
                          type="text"
                          placeholder={t('form.cert_issuer')}
                          value={certInput.issuer}
                          onChange={e => setCertInput({ ...certInput, issuer: e.target.value })}
                          className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white"
                        />
                      </div>
                      <MonthYearPicker
                        placeholder={t('form.cert_date')}
                        value={certInput.date || ''}
                        onChange={val => setCertInput({ ...certInput, date: val })}
                      />
                    </div>

                    <button onClick={addCertificate} className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">+ {t('form.add')}</button>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <label className="text-[9px] sm:text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.skills')}</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillAdd}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white dark:focus:bg-gray-700 rounded-full px-5 py-3 sm:px-8 sm:py-4 outline-none transition-all text-[11px] sm:text-sm font-bold shadow-sm dark:text-white"
                  placeholder="React, Proje Yönetimi, SQL, Figma..."
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills?.map((skill, idx) => (
                    <span key={idx} className="bg-[#1f6d78] text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase tracking-wider animate-in zoom-in-50">
                      {skill}
                      <button onClick={() => removeSkill(idx)} className="hover:opacity-50 text-base font-light">×</button>
                    </span>
                  ))}
                  {(!formData.skills || formData.skills.length === 0) && <p className="text-[10px] text-gray-400 italic">{t('form.no_skills')}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 4: Kişisel Detaylar */}
          <section>
            <SectionTitle title={t('form.personal')} subtitle={t('form.personal_subtitle')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.military')}</label>
                <div className="flex flex-wrap gap-2">
                  {MILITARY_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.militaryStatus === s} onClick={() => setFormData({ ...formData, militaryStatus: formData.militaryStatus === s ? '' : s })} />)}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.driving_license')}</label>
                <div className="flex flex-wrap gap-2">
                  {DRIVER_LICENSES.map(l => <SelectionPill key={l} label={l} active={formData.driverLicense?.includes(l) || false} onClick={() => toggleList('driverLicense', l)} />)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 mt-5 sm:mt-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.marital')}</label>
                <div className="flex flex-wrap gap-2">
                  {MARITAL_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.maritalStatus === s} onClick={() => setFormData({ ...formData, maritalStatus: s })} />)}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.travel')}</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.travelStatus === s} onClick={() => setFormData({ ...formData, travelStatus: s })} />)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10 mt-5 sm:mt-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.disability')}</label>
                <div className="flex flex-wrap gap-2">
                  {DISABILITY_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.disabilityStatus === s} onClick={() => setFormData({ ...formData, disabilityStatus: s })} />)}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.start_date')}</label>
                <div className="flex flex-wrap gap-2">
                  {NOTICE_PERIODS.map(p => <SelectionPill key={p} label={p} active={formData.noticePeriod === p} onClick={() => setFormData({ ...formData, noticePeriod: p })} />)}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 5: Özet */}
          <section>
            <SectionTitle title={t('form.about')} subtitle={t('form.about_subtitle')} />
            <div className="space-y-4">
              <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.about_me')}</label>
              <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-[1.5rem] sm:rounded-[2rem] border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden h-24 sm:h-32">
                <textarea
                  value={formData.about}
                  onChange={e => setFormData({ ...formData, about: e.target.value })}
                  className="w-[117.6%] h-[117.6%] bg-transparent outline-none resize-none px-5 py-4 sm:px-8 sm:py-6 text-[16px] origin-top-left scale-[0.85] font-medium leading-[1.4] text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder={t('form.about_placeholder')}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Bölüm Ekstra: Referanslar */}
          <section>
            <SectionTitle title={t('form.references')} subtitle={t('form.references_subtitle')} />
            <div className="space-y-6">
              {/* Existing References List */}
              {formData.references && formData.references.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.references.map((ref) => (
                    <div key={ref.id} className="bg-gray-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 relative group">
                      <button
                        onClick={() => removeReference(ref.id)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all font-bold"
                      >
                        ×
                      </button>
                      <h4 className="font-bold text-black dark:text-white text-sm">{ref.name}</h4>
                      <p className="text-xs text-gray-500 font-bold">{ref.role} @ {ref.company}</p>
                      {(ref.email || ref.phone) && (
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                          {ref.email && <p className="text-[10px] text-gray-400 font-medium">✉️ {ref.email}</p>}
                          {ref.phone && <p className="text-[10px] text-gray-400 font-medium">📞 {ref.phone}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Reference Form */}
              <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6">
                <h5 className="text-[10px] sm:text-xs font-black text-black dark:text-gray-300 uppercase tracking-widest mb-3 sm:mb-4">{t('form.add_reference')}</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                    <input
                      type="text"
                      placeholder={`${t('form.fullname')} *`}
                      className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.name}
                      onChange={e => setRefInput({ ...refInput, name: e.target.value })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                    <input
                      type="text"
                      placeholder={`${t('form.institution')} *`}
                      className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.company}
                      onChange={e => setRefInput({ ...refInput, company: e.target.value })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                    <input
                      type="text"
                      placeholder={t('form.profession')}
                      className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.role}
                      onChange={e => setRefInput({ ...refInput, role: e.target.value })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                    <input
                      type="tel"
                      placeholder={`${t('form.phone')} (${t('form.optional')})`}
                      className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.phone}
                      onChange={e => setRefInput({ ...refInput, phone: e.target.value })}
                    />
                  </div>
                  <div className="w-full h-[38px] sm:h-[46px] bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:border-[#1f6d78]/10 transition-all overflow-hidden">
                    <input
                      type="email"
                      placeholder={`${t('form.email')} (${t('form.optional')})`}
                      className="w-[117.6%] h-[42.22px] sm:h-[54.11px] bg-transparent outline-none font-bold text-[16px] origin-top-left scale-[0.85] px-4 py-0 sm:px-5 dark:text-white"
                      value={refInput.email}
                      onChange={e => setRefInput({ ...refInput, email: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddReference}
                  className="w-full bg-[#1f6d78] text-white font-bold py-2.5 sm:py-3 rounded-xl hover:bg-[#155e68] transition-all active:scale-[0.98] text-[10px] sm:text-xs uppercase tracking-widest"
                >
                  + {t('form.add_list')}
                </button>
              </div>
            </div>
          </section>

          {/* KVKK Onay Checkbox */}
          <div className="p-4 sm:p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 flex items-start gap-4 mt-8">
            <input
              type="checkbox"
              id="cv-form-terms"
              checked={isConsentGiven}
              onChange={handleCheckboxChange}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md accent-[#1f6d78] shrink-0 mt-0.5 cursor-pointer"
            />
            <label htmlFor="cv-form-terms" className="text-[10px] sm:text-[11px] text-gray-500 font-bold leading-relaxed cursor-pointer select-none">
              {t('form.kvkk_text')}
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-3 sm:gap-5 sticky bottom-0 z-10 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-white dark:bg-gray-800 border-2 border-[#1f6d78] text-[#1f6d78] py-3 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-[#1f6d78] hover:text-white transition-all active:scale-95 shadow-sm"
          >
            {t('form.cancel')}
          </button>
          <button
            onClick={() => {
              // Validation
              const requiredFields = [
                { key: 'name', label: t('form.fullname') },
                { key: 'photoUrl', label: 'Profil Fotoğrafı' },
                { key: 'profession', label: t('form.profession') },
                { key: 'city', label: t('form.city') },
                { key: 'email', label: t('form.email') },
                { key: 'phone', label: t('form.phone') },
                { key: 'about', label: t('form.about_me') },
                { key: 'educationDetails', label: t('form.education_info') },
                { key: 'languageDetails', label: t('form.languages') }
              ];

              const missing = requiredFields.filter(field => {
                const val = formData[field.key as keyof CV];
                if (Array.isArray(val)) return val.length === 0;
                return !val;
              });

              if (missing.length > 0) {
                setShowWarning({ show: true, missing: missing.map(m => m.label) });
                return;
              }

              // Consent Validation
              if (!isConsentGiven) {
                alert('Lütfen KVKK metnini okuyup onaylayınız.');
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

              onSubmit(syncedData, !hasPriorConsent);
            }}
            className={`flex-[2] py-3 sm:py-5 rounded-full font-black text-xs sm:text-base uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] ${isConsentGiven
              ? 'bg-[#1f6d78] text-white hover:bg-[#155e68]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {t('form.save_publish')}
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
            <div className="absolute inset-0 z-[150] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6 animate-in fade-in duration-300">
              <div className="bg-white border-2 border-red-50 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-300 text-center relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#1f6d78]/5 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5 text-2xl shadow-xl relative z-10">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-black text-black mb-2 leading-tight tracking-tight relative z-10">
                  Eksik Bilgiler Var
                </h3>
                <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider relative z-10">
                  Lütfen aşağıdaki alanları doldurunuz:
                </p>

                <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100 relative z-10">
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
                  className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg shadow-[#1f6d78]/20 active:scale-95 relative z-10"
                >
                  Tamam, Dolduracağım
                </button>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default CVFormModal;
