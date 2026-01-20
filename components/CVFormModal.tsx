
import React, { useState } from 'react';
import { CV } from '../types';
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
      ? 'bg-black border-black text-white shadow-md'
      : 'bg-white border-gray-200 text-gray-500 hover:border-black'
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
    city: initialData?.city || 'İstanbul',
    experienceYears: initialData?.experienceYears || 0,
    language: initialData?.language || 'İngilizce',
    languageLevel: initialData?.languageLevel || 'Orta',
    about: initialData?.about || '',
    skills: initialData?.skills || [],
    salaryMin: initialData?.salaryMin || 40000,
    salaryMax: initialData?.salaryMax || 50000,
    education: initialData?.education || '',
    educationLevel: initialData?.educationLevel || 'Lisans',
    graduationStatus: initialData?.graduationStatus || 'Mezun',
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

  const toggleList = (key: keyof CV, value: string) => {
    const currentList = (formData[key] as string[]) || [];
    const newList = currentList.includes(value)
      ? currentList.filter(v => v !== value)
      : [...currentList, value];
    setFormData({ ...formData, [key]: newList });
  };

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
      <h3 className="text-sm font-black text-black uppercase tracking-[0.15em] border-l-4 border-black pl-3">{title}</h3>
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
            className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl text-black hover:bg-black hover:text-white transition-all active:scale-90"
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
                  className="w-32 h-44 rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all group overflow-hidden relative shadow-sm"
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
                      <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full"></div>
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
                      className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold"
                      placeholder="Örn: Mehmet Can"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Meslek / Ünvan *</label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={e => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold"
                      placeholder="Örn: Senior React Dev"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Şehir *</label>
                    <select
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white rounded-full px-6 py-3.5 outline-none text-sm font-bold appearance-none cursor-pointer"
                    >
                      <option value="">Şehir Seçin</option>
                      {(availableCities.length > 0 ? availableCities : [{ label: 'İstanbul' }, { label: 'Ankara' }, { label: 'İzmir' }]).map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Tecrübe (Yıl)</label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={e => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white rounded-full px-6 py-3.5 outline-none text-sm font-bold"
                      placeholder="5"
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
                      <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${formData.isEmailPublic ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
                        {formData.isEmailPublic && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{formData.isEmailPublic ? 'Görünür' : 'Gizli'}</span>
                    </div>
                  </div>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold ${formData.isEmailPublic ? 'bg-white border-black/10' : 'bg-gray-100 border-transparent text-gray-500'}`}
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Telefon Numarası</label>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData({ ...formData, isPhonePublic: !formData.isPhonePublic })}>
                      <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${formData.isPhonePublic ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
                        {formData.isPhonePublic && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{formData.isPhonePublic ? 'Görünür' : 'Gizli'}</span>
                    </div>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full border focus:bg-white rounded-full px-6 py-3.5 outline-none transition-all text-sm font-bold ${formData.isPhonePublic ? 'bg-white border-black/10' : 'bg-gray-100 border-transparent text-gray-500'}`}
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
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Maaş Beklentisi (Aylık Net ₺)</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMin} onChange={e => setFormData({ ...formData, salaryMin: parseInt(e.target.value) })} className="w-full bg-gray-50 rounded-full px-8 py-4 outline-none font-bold text-sm" placeholder="Minimum" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">MIN</span>
                  </div>
                  <div className="w-4 h-0.5 bg-gray-200"></div>
                  <div className="flex-1 relative">
                    <input type="number" value={formData.salaryMax} onChange={e => setFormData({ ...formData, salaryMax: parseInt(e.target.value) })} className="w-full bg-gray-50 rounded-full px-8 py-4 outline-none font-bold text-sm" placeholder="Maximum" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">MAX</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 3: Eğitim ve Gelişim */}
          <section>
            <SectionTitle title="3. EĞİTİM & YETENEKLER" subtitle="Akademik geçmiş ve uzmanlık alanlarınız" />

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Üniversite / Son Mezun Olunan Okul</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={e => setFormData({ ...formData, education: e.target.value })}
                  className="w-full bg-gray-50 rounded-full px-8 py-4 outline-none font-bold text-sm"
                  placeholder="Örn: Boğaziçi Üniversitesi - İşletme"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Eğitim Seviyesi</label>
                  <div className="flex flex-wrap gap-2">
                    {EDUCATION_LEVELS.map(l => <SelectionPill key={l} label={l} active={formData.educationLevel === l} onClick={() => setFormData({ ...formData, educationLevel: l })} />)}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Mezuniyet Durumu</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADUATION_STATUSES.map(s => <SelectionPill key={s} label={s} active={formData.graduationStatus === s} onClick={() => setFormData({ ...formData, graduationStatus: s })} />)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Yabancı Dil & Seviye</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <select
                    value={formData.language}
                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                    className="flex-1 bg-gray-50 rounded-full px-6 py-4 outline-none font-bold text-sm appearance-none"
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_LEVELS.map(lvl => <SelectionPill key={lvl} label={lvl} active={formData.languageLevel === lvl} onClick={() => setFormData({ ...formData, languageLevel: lvl })} />)}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Uzmanlık Alanları (Enter'a basın)</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillAdd}
                  className="w-full bg-gray-50 border border-transparent focus:border-black/10 focus:bg-white rounded-full px-8 py-4 outline-none transition-all text-sm font-bold shadow-sm"
                  placeholder="React, Proje Yönetimi, SQL, Figma..."
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skills?.map((skill, idx) => (
                    <span key={idx} className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 uppercase tracking-wider animate-in zoom-in-50">
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
                className="w-full bg-gray-50 rounded-[2rem] px-8 py-6 outline-none h-32 resize-none focus:bg-white focus:border-black/10 border border-transparent transition-all font-medium text-sm leading-relaxed"
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
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-black/10 transition-all"
                    value={refInput.name}
                    onChange={e => setRefInput({ ...refInput, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Kurum Adı *"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-black/10 transition-all"
                    value={refInput.company}
                    onChange={e => setRefInput({ ...refInput, company: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Pozisyon / Unvan"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-black/10 transition-all"
                    value={refInput.role}
                    onChange={e => setRefInput({ ...refInput, role: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Telefon (İsteğe bağlı)"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-black/10 transition-all"
                    value={refInput.phone}
                    onChange={e => setRefInput({ ...refInput, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="E-posta (İsteğe bağlı)"
                    className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold outline-none border border-transparent focus:bg-white focus:border-black/10 transition-all"
                    value={refInput.email}
                    onChange={e => setRefInput({ ...refInput, email: e.target.value })}
                  />
                </div>
                <button
                  onClick={handleAddReference}
                  className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] text-xs uppercase tracking-widest"
                >
                  + Listeye Ekle
                </button>
              </div>
            </div>
          </section>

          {/* KVKK Onay */}
          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-start gap-4">
            <input type="checkbox" id="cv-form-terms" className="w-6 h-6 rounded-md accent-black shrink-0 mt-0.5" />
            <label htmlFor="cv-form-terms" className="text-[11px] text-gray-500 font-bold leading-relaxed">
              Verdiğim bilgilerin doğruluğunu teyit ediyorum. <span className="text-black underline cursor-pointer">KVKK Aydınlatma Metni</span> uyarınca kişisel verilerimin işlenmesini ve işverenlerin benimle iletişime geçmesi amacıyla paylaşılmasını onaylıyorum.
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-white flex gap-5 sticky bottom-0 z-10 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-white border-2 border-gray-100 text-black py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-50 hover:border-black transition-all active:scale-95 shadow-sm"
          >
            Vazgeç
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="flex-[2] bg-black text-white py-5 rounded-full font-black text-base uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98]"
          >
            Kaydet ve Yayına Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVFormModal;
