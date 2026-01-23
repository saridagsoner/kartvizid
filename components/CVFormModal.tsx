import React, { useState } from 'react';
import { CV, EducationEntry, WorkExperienceEntry, LanguageEntry, CertificateEntry } from '../types';
import { TURKEY_LOCATIONS } from '../locations';
import SearchableSelect from './SearchableSelect';
import MonthYearPicker from './MonthYearPicker';
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
import { supabase } from '../lib/supabase';

interface SelectionPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const SelectionPill: React.FC<SelectionPillProps> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full text-[11px] font-bold border transition-all ${active
      ? 'bg-[#1f6d78] border-[#1f6d78] text-white shadow-md'
      : 'bg-white border-gray-200 text-gray-500 hover:border-[#1f6d78]'
      }`}
  >
    {label}
  </button>
);


interface CVFormModalProps {
  onClose: () => void;
  onSubmit: (cv: Partial<CV>) => void;
  initialData?: Partial<CV>;
  availableCities?: Array<{ label: string }>;
}

const CVFormModal: React.FC<CVFormModalProps> = ({ onClose, onSubmit, initialData, availableCities = [] }) => {
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
    workExperience: initialData?.workExperience || [],
    workType: initialData?.workType || 'Ofis',
    employmentType: initialData?.employmentType || 'Tam Zamanlı',
    militaryStatus: initialData?.militaryStatus || 'Yapıldı',
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
    references: initialData?.references || [],
  });

  const [refInput, setRefInput] = useState({ name: '', company: '', role: '', phone: '', email: '' });

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from('cv-photos')
        .upload(filePath, file);

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
    <div className="mb-6 mt-10 first:mt-0">
      <h3 className="text-sm font-black text-black uppercase tracking-[0.15em] border-l-4 border-[#1f6d78] pl-3">{title}</h3>
      {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
    </div>
  );



  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
      <div className="bg-white w-full max-w-[800px] h-[90vh] rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">

        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-black tracking-tighter">Dijital Kartvizid'ini yani Cv'ni Oluştur</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">İşverenlerin sizi keşfetmesi için tüm detayları doldurun</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl text-black hover:bg-[#1f6d78] hover:text-white transition-all active:scale-90"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12 bg-white">

          {/* Bölüm 1: Temel Bilgiler */}
          <section>
            <SectionTitle title="1. TEMEL BİLGİLER" subtitle="Profilinizin dış dünyaya bakan yüzü" />

            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                  accept="image/*"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-44 rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#1f6d78] transition-all group overflow-hidden relative shadow-sm"
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
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Ad Soyad *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold"
                      placeholder="Örn: Mehmet Can"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Meslek / Ünvan *</label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={e => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold"
                      placeholder="Örn: Senior React Dev"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Şehir *</label>
                        <SearchableSelect
                          value={formData.city}
                          onChange={(val) => setFormData({ ...formData, city: val, district: '' })}
                          options={Object.keys(TURKEY_LOCATIONS).sort()}
                          placeholder="Şehir Seçiniz"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">İlçe</label>
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
                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Tecrübe (Yıl)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experienceYears === 0 ? '' : formData.experienceYears}
                      onChange={e => setFormData({ ...formData, experienceYears: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                      className="w-full bg-gray-50 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white rounded-full px-6 py-3.5 outline-none text-sm font-bold"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Çalışma Durumu */}
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mb-8">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Çalışma Durumu</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'active', label: 'Çalışıyorum' },
                  { id: 'passive', label: 'Çalışmıyorum' },
                  { id: 'open', label: 'İş Arıyorum' }
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
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mb-8">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">İletişim Bilgileri (Opsiyonel)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">E-posta Adresi</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({ ...formData, isEmailPublic: !formData.isEmailPublic })}>
                      <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${formData.isEmailPublic ? 'bg-[#1f6d78] border-[#1f6d78]' : 'border-gray-300 bg-white'}`}>
                        {formData.isEmailPublic && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{formData.isEmailPublic ? 'Görünür' : 'Gizli'}</span>
                    </div>
                  </div>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold ${formData.isEmailPublic ? 'bg-white border-[#1f6d78]/10' : 'bg-gray-100 border-transparent text-gray-500'}`}
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Telefon Numarası</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({ ...formData, isPhonePublic: !formData.isPhonePublic })}>
                      <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${formData.isPhonePublic ? 'bg-[#1f6d78] border-[#1f6d78]' : 'border-gray-300 bg-white'}`}>
                        {formData.isPhonePublic && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{formData.isPhonePublic ? 'Görünür' : 'Gizli'}</span>
                    </div>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full border focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold ${formData.isPhonePublic ? 'bg-white border-[#1f6d78]/10' : 'bg-gray-100 border-transparent text-gray-500'}`}
                    placeholder="0555 123 45 67"
                  />
                </div>
              </div>
              <p className="text-[9px] text-gray-400 mt-4 leading-relaxed">* Yanındaki yuvarlak kutucuğu işaretlemediğiniz sürece iletişim bilgileriniz profilinizde <strong>görünmez</strong>.</p>
            </div>
          </section>

          {/* Bölüm 2: İş Tercihleri */}
          <section>
            <SectionTitle title="2. İŞ TERCİHLERİ" subtitle="Hangi koşullarda çalışmak istiyorsunuz?" />

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Çalışma Modeli</label>
                  <div className="flex flex-wrap gap-2">
                    {WORK_TYPES.map(t => <SelectionPill key={t} label={t} active={formData.workType === t} onClick={() => setFormData({ ...formData, workType: t })} />)}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Çalışma Şekli</label>
                  <div className="flex flex-wrap gap-2">
                    {EMPLOYMENT_TYPES.map(t => <SelectionPill key={t} label={t} active={formData.employmentType === t} onClick={() => setFormData({ ...formData, employmentType: t })} />)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Maaş Beklentisi (Aylık Net)</label>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMin} onChange={e => setFormData({ ...formData, salaryMin: parseInt(e.target.value) })} className="w-full bg-gray-50 rounded-full px-6 md:px-8 py-4 outline-none font-bold text-sm" placeholder="Minimum" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 pointer-events-none">MIN</span>
                  </div>
                  <div className="w-2 md:w-4 h-0.5 bg-gray-200"></div>
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMax} onChange={e => setFormData({ ...formData, salaryMax: parseInt(e.target.value) })} className="w-full bg-gray-50 rounded-full px-6 md:px-8 py-4 outline-none font-bold text-sm" placeholder="Maximum" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 pointer-events-none">MAX</span>
                  </div>

                  {/* Currency Selector */}
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsCurrencyOpen(!isCurrencyOpen); }}
                      className="h-[52px] w-[70px] bg-gray-50 rounded-full font-bold text-sm text-gray-700 flex items-center justify-center gap-1 hover:bg-gray-100 transition-colors"
                    >
                      {formData.salaryCurrency || '₺'}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {isCurrencyOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 w-[70px]">
                        {['₺', '$', '€', '£'].map(c => (
                          <div
                            key={c}
                            onClick={() => { setFormData({ ...formData, salaryCurrency: c }); setIsCurrencyOpen(false); }}
                            className={`px-2 py-3 hover:bg-gray-50 cursor-pointer text-center font-bold text-sm ${formData.salaryCurrency === c ? 'bg-gray-50 text-black' : 'text-gray-500'}`}
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
            <SectionTitle title="2. İŞ DENEYİMİ" subtitle="Geçmiş tecrübeleriniz" />
            <div className="space-y-6">
              {/* List */}
              {formData.workExperience?.map(work => (
                <div key={work.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 relative group">
                  <button onClick={() => removeWork(work.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all font-bold">×</button>
                  <h4 className="font-bold text-black">{work.role}</h4>
                  <p className="text-xs font-bold text-gray-500">{work.company}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{work.startDate} - {work.isCurrent ? 'Devam Ediyor' : work.endDate}</p>
                </div>
              ))}

              {/* Add Form */}
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-6 space-y-4">
                <h5 className="text-xs font-black text-black uppercase tracking-widest">Yeni Deneyim Ekle</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Kurum Adı *" value={workInput.company} onChange={e => setWorkInput({ ...workInput, company: e.target.value })} className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                  <input type="text" placeholder="Pozisyon *" value={workInput.role} onChange={e => setWorkInput({ ...workInput, role: e.target.value })} className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                  <MonthYearPicker placeholder="Başlangıç" value={workInput.startDate} onChange={val => setWorkInput({ ...workInput, startDate: val })} />
                  <MonthYearPicker placeholder="Bitiş" disabled={workInput.isCurrent} value={workInput.endDate || ''} onChange={val => setWorkInput({ ...workInput, endDate: val })} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={workInput.isCurrent} onChange={e => setWorkInput({ ...workInput, isCurrent: e.target.checked })} className="accent-[#1f6d78] w-4 h-4" />
                  <span className="text-xs font-bold">Şu an burada çalışıyorum</span>
                </div>
                <button onClick={addWork} className="w-full bg-[#1f6d78] text-white font-bold py-3 rounded-xl hover:bg-[#155e68] text-xs uppercase tracking-widest">+ Ekle</button>
              </div>
            </div>
          </section>

          {/* Bölüm 3: Eğitim ve Yetenekler */}
          <section>
            <SectionTitle title="3. EĞİTİM & YETENEKLER" subtitle="Akademik geçmiş ve uzmanlık alanlarınız" />

            <div className="space-y-10">

              {/* Education List & Add */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Eğitim Bilgileri</label>
                {formData.educationDetails?.map(edu => (
                  <div key={edu.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 relative group flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm text-black">{edu.university}</h4>
                      <p className="text-xs font-medium text-gray-500">{edu.department} ({edu.level})</p>
                    </div>
                    <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-full font-bold">×</button>
                  </div>
                ))}

                <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Üniversite / Okul" value={eduInput.university} onChange={e => setEduInput({ ...eduInput, university: e.target.value })} className="w-full bg-gray-50 rounded-xl px-4 py-3 outline-none text-sm font-bold" />
                    <input type="text" placeholder="Bölüm" value={eduInput.department} onChange={e => setEduInput({ ...eduInput, department: e.target.value })} className="w-full bg-gray-50 rounded-xl px-4 py-3 outline-none text-sm font-bold" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {EDUCATION_LEVELS.map(l => <button key={l} onClick={() => setEduInput({ ...eduInput, level: l })} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${eduInput.level === l ? 'bg-[#1f6d78] text-white' : 'bg-white text-gray-500'}`}>{l}</button>)}
                  </div>
                  <button onClick={addEducation} className="w-full bg-[#1f6d78] text-white font-bold py-3 rounded-xl hover:bg-[#155e68] text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">+ Eğitim Ekle</button>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 block mb-2">Yabancı Diller</label>

                {/* Added Languages List */}
                {formData.languageDetails && formData.languageDetails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.languageDetails.map(lang => (
                      <div key={lang.id} className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                        <span className="text-xs font-bold">{lang.language} - {lang.level}</span>
                        <button onClick={() => removeLang(lang.id)} className="text-red-500 font-bold hover:bg-red-50 rounded-full px-1">×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Language Form */}
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-6 space-y-4">
                  <h5 className="text-xs font-black text-black uppercase tracking-widest">Yeni Dil Ekle</h5>
                  <div className="flex flex-col gap-4">
                    <select
                      value={langInput.language}
                      onChange={e => setLangInput({ ...langInput, language: e.target.value })}
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 outline-none font-bold text-sm appearance-none border border-transparent focus:bg-white focus:border-[#1f6d78]/10 transition-all"
                    >
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>

                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_LEVELS.map(lvl => (
                        <button key={lvl} onClick={() => setLangInput({ ...langInput, level: lvl })} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${langInput.level === lvl ? 'bg-[#1f6d78] text-white border-[#1f6d78]' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{lvl}</button>
                      ))}
                    </div>

                    <button onClick={addLang} className="w-full bg-[#1f6d78] text-white font-bold py-3 rounded-xl hover:bg-[#155e68] text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">+ Dil Ekle</button>
                  </div>
                </div>

              </div>

              {/* Certificates */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1 block mb-2">Sertifikalar & Kurslar</label>

                {/* Added Certificates List */}
                {formData.certificates && formData.certificates.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.certificates.map(cert => (
                      <div key={cert.id} className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                        <span className="text-xs font-bold">{cert.name} {cert.issuer ? `(${cert.issuer})` : ''}</span>
                        <button onClick={() => removeCertificate(cert.id)} className="text-red-500 font-bold hover:bg-red-50 rounded-full px-1">×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Certificate Form */}
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-6 space-y-4">
                  <h5 className="text-xs font-black text-black uppercase tracking-widest">Yeni Sertifika Ekle</h5>
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Sertifika / Kurs Adı *"
                      value={certInput.name}
                      onChange={e => setCertInput({ ...certInput, name: e.target.value })}
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 outline-none font-bold text-sm"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Veren Kurum (Opsiyonel)"
                        value={certInput.issuer}
                        onChange={e => setCertInput({ ...certInput, issuer: e.target.value })}
                        className="w-full bg-gray-50 rounded-xl px-4 py-3 outline-none font-bold text-sm"
                      />
                      <MonthYearPicker
                        placeholder="Alınan Tarih"
                        value={certInput.date || ''}
                        onChange={val => setCertInput({ ...certInput, date: val })}
                      />
                    </div>

                    <button onClick={addCertificate} className="w-full bg-[#1f6d78] text-white font-bold py-3 rounded-xl hover:bg-[#155e68] text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">+ Sertifika Ekle</button>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Uzmanlık Alanları (Enter)</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillAdd}
                  className="w-full bg-gray-50 border border-transparent focus:border-[#1f6d78]/10 focus:bg-white rounded-full px-8 py-4 outline-none transition-all text-sm font-bold shadow-sm"
                  placeholder="React, Proje Yönetimi, SQL, Figma..."
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills?.map((skill, idx) => (
                    <span key={idx} className="bg-[#1f6d78] text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase tracking-wider animate-in zoom-in-50">
                      {skill}
                      <button onClick={() => removeSkill(idx)} className="hover:opacity-50 text-base font-light">×</button>
                    </span>
                  ))}
                  {(!formData.skills || formData.skills.length === 0) && <p className="text-[10px] text-gray-400 italic">Henüz yetenek eklemediniz.</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 4: Kişisel Detaylar */}
          <section>
            <SectionTitle title="4. KİŞİSEL DETAYLAR" subtitle="Özel durumlar ve yasal detaylar" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Askerlik Durumu</label>
                <div className="flex flex-wrap gap-2">
                  {MILITARY_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.militaryStatus === s} onClick={() => setFormData({ ...formData, militaryStatus: s })} />)}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Sürücü Belgesi</label>
                <div className="flex flex-wrap gap-2">
                  {DRIVER_LICENSES.map(l => <SelectionPill key={l} label={l} active={formData.driverLicense?.includes(l) || false} onClick={() => toggleList('driverLicense', l)} />)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Medeni Durum</label>
                <div className="flex flex-wrap gap-2">
                  {MARITAL_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.maritalStatus === s} onClick={() => setFormData({ ...formData, maritalStatus: s })} />)}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Seyahat Durumu</label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.travelStatus === s} onClick={() => setFormData({ ...formData, travelStatus: s })} />)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Engellilik Durumu</label>
                <div className="flex flex-wrap gap-2">
                  {DISABILITY_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.disabilityStatus === s} onClick={() => setFormData({ ...formData, disabilityStatus: s })} />)}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">İşe Başlama Süresi</label>
                <div className="flex flex-wrap gap-2">
                  {NOTICE_PERIODS.map(p => <SelectionPill key={p} label={p} active={formData.noticePeriod === p} onClick={() => setFormData({ ...formData, noticePeriod: p })} />)}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 5: Özet */}
          <section>
            <SectionTitle title="5. KENDİNİZİ TANITIN" subtitle="İşverenlerin sizi tanıması için son dokunuş" />
            <div className="space-y-4">
              <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">HAKKINDA</label>
              <textarea
                value={formData.about}
                onChange={e => setFormData({ ...formData, about: e.target.value })}
                className="w-full bg-gray-50 rounded-[2rem] px-8 py-6 outline-none h-32 resize-none focus:bg-white focus:border-[#1f6d78]/10 border border-transparent transition-all font-medium text-sm leading-relaxed"
                placeholder="Deneyimlerinizden ve uzmanlığınızdan bahsederek kendinizi 1-2 cümleyle etkileyici bir şekilde tanıtın..."
              ></textarea>
            </div>
          </section>

          {/* Bölüm Ekstra: Referanslar */}
          <section>
            <SectionTitle title="REFERANSLAR" subtitle="Sizi daha yakından tanımamız için referanslarınız" />
            <div className="space-y-6">
              {/* Existing References List */}
              {formData.references && formData.references.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.references.map((ref) => (
                    <div key={ref.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 relative group">
                      <button
                        onClick={() => removeReference(ref.id)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all font-bold"
                      >
                        ×
                      </button>
                      <h4 className="font-bold text-black text-sm">{ref.name}</h4>
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
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-6">
                <h5 className="text-xs font-black text-black uppercase tracking-widest mb-4">Yeni Referans Ekle</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Ad Soyad *"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-[#1f6d78]/10 transition-all"
                    value={refInput.name}
                    onChange={e => setRefInput({ ...refInput, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Kurum Adı *"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-[#1f6d78]/10 transition-all"
                    value={refInput.company}
                    onChange={e => setRefInput({ ...refInput, company: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Pozisyon / Unvan"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-[#1f6d78]/10 transition-all"
                    value={refInput.role}
                    onChange={e => setRefInput({ ...refInput, role: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Telefon (İsteğe bağlı)"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-[#1f6d78]/10 transition-all"
                    value={refInput.phone}
                    onChange={e => setRefInput({ ...refInput, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="E-posta (İsteğe bağlı)"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-[#1f6d78]/10 transition-all"
                    value={refInput.email}
                    onChange={e => setRefInput({ ...refInput, email: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleAddReference}
                  className="w-full bg-[#1f6d78] text-white font-bold py-3 rounded-xl hover:bg-[#155e68] transition-all active:scale-[0.98] text-xs uppercase tracking-widest"
                >
                  + Listeye Ekle
                </button>
              </div>
            </div>
          </section>

          {/* KVKK Onay */}
          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-start gap-4">
            <input type="checkbox" id="cv-form-terms" className="w-6 h-6 rounded-md accent-[#1f6d78] shrink-0 mt-0.5" />
            <label htmlFor="cv-form-terms" className="text-[11px] text-gray-500 font-bold leading-relaxed">
              Verdiğim bilgilerin doğruluğunu teyit ediyorum. <span className="text-black underline cursor-pointer">KVKK Aydınlatma Metni</span> uyarınca kişisel verilerimin işlenmesini ve işverenlerin benimle iletişime geçmesi amacıyla paylaşılmasını onaylıyorum.
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-white flex gap-5 sticky bottom-0 z-10 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-white border-2 border-gray-100 text-black py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-50 hover:border-[#1f6d78] transition-all active:scale-95 shadow-sm"
          >
            Vazgeç
          </button>
          <button
            onClick={() => {
              // Sync legacy fields for backward compatibility (Business Card view)
              const syncedData = {
                ...formData,
                education: formData.educationDetails?.[0]?.university || formData.education || '',
                educationLevel: formData.educationDetails?.[0]?.level || formData.educationLevel || '',
                graduationStatus: formData.educationDetails?.[0]?.status || formData.graduationStatus || '',
                language: formData.languageDetails?.[0]?.language || formData.language || '',
                languageLevel: formData.languageDetails?.[0]?.level || formData.languageLevel || '',
              };
              onSubmit(syncedData);
            }}
            className="flex-[2] bg-[#1f6d78] text-white py-5 rounded-full font-black text-base uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-xl active:scale-[0.98]"
          >
            Kaydet ve Yayına Al
          </button>
        </div>
      </div >
    </div >
  );
};

export default CVFormModal;
