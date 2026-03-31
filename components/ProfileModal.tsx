import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from './ImageWithFallback';
import { CV } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generatePrintableCV } from '../lib/generatePrintableCV';

import { supabase } from '../lib/supabase';
import SEO from './SEO';

interface ProfileModalProps {
  cv: CV;
  onClose: () => void;
  onOpenChat?: () => void;
  onJobFound?: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ cv, onClose, onOpenChat, onJobFound }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showRoleWarning, setShowRoleWarning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showWarning, setShowWarning] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const isOwner = user ? user.id === cv.userId : false;

  const Tooltip = ({ text, show }: { text: string, show: boolean }) => (
    <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900/95 backdrop-blur-md text-white text-[10px] font-bold rounded-xl transition-all duration-300 pointer-events-none z-[100] whitespace-nowrap shadow-2xl border border-white/10 flex items-center justify-center ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'}`}>
      {text}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/95 rotate-45 border-r border-b border-white/5" />
    </div>
  );

  // Check if saved on mount
  React.useEffect(() => {
    if (user?.user_metadata?.role === 'employer' && !isOwner) {
      checkIfSaved();
    }
  }, [user, cv.id]);

  const checkIfSaved = async () => {
    try {
      if (!user) return;
      const { data } = await supabase
        .from('saved_cvs')
        .select('id')
        .match({ employer_id: user.id, cv_id: cv.id })
        .maybeSingle();

      setIsSaved(!!data);
    } catch (e) {
      console.error('Error checking saved status:', e);
    }
  };


  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintableCV(cv));
      printWindow.document.close();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${cv.name} | Kartvizid`,
          text: `${cv.name} adlı kişinin detaylı CV'sini inceleyin.`,
          url: window.location.href,
        });
      } else {
        // Fallback for desktop: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShowWarning({ show: true, message: t('common.link_copied') });
      }
    } catch (err) {
      console.log('Share canceled or not supported');
    }
  };

  // Helper helper to translate values
  const resolveValue = (value: string | undefined): string => {
    if (!value) return '-';

    // Value Mappings
    const mapping: Record<string, string> = {
      // Work Model
      'Ofis': 'work.office',
      'Uzaktan': 'work.remote',
      'Hibrit': 'work.hybrid',
      // Employment Type
      'Tam Zamanlı': 'emp.full_time',
      'Yarı Zamanlı': 'emp.part_time',
      'Proje Bazlı': 'emp.project',
      // Military
      'Yapıldı': 'military.done',
      'Muaf': 'military.exempt',
      'Tecilli': 'military.postponed',
      'Yükümlü Değil': 'military.not_obligated',
      // Marital
      'Bekar': 'marital.single',
      'Evli': 'marital.married',
      // Education
      'Mezun': 'grad.graduated',
      'Öğrenci': 'grad.student',
      // Other
      'Yok': 'common.none',
      'Sorun Yok': 'common.no_problem',
      'Hemen': 'common.immediately',
      // Travel Status (Specific)
      'Seyahat Engeli Yok': 'travel.no_barrier',
      'Seyahat Edebilir': 'travel.yes',
      'Seyahat Edemez': 'travel.no',
      // Languages
      'İngilizce': 'lang.english',
      'Almanca': 'lang.german',
      'Fransızca': 'lang.french',
      'İspanyolca': 'lang.spanish',
      'Türkçe': 'lang.turkish',
      'Rusça': 'lang.russian',
      'Arapça': 'lang.arabic',
      // Levels
      'Başlangıç': 'level.beginner',
      'Orta': 'level.intermediate',
      'İleri': 'level.advanced',
      'Anadil': 'level.native'
    };

    if (mapping[value]) return t(mapping[value]);
    return value;
  };

  const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-3 sm:mb-6 mt-5 sm:mt-10 first:mt-0">
      <h3 className="text-[12px] sm:text-[15px] font-black text-[#1f6d78] dark:text-[#2dd4bf] uppercase tracking-[0.2em] border-l-4 border-[#1f6d78] dark:border-[#2dd4bf] pl-3 leading-none logo-font">{title}</h3>
      {subtitle && <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
    </div>
  );

  const InfoTag = ({ label, value, icon }: { label: string, value: string | number | undefined, icon?: string }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{label}</span>
      <div className="flex items-center gap-2 sm:gap-3 px-1 py-0.5">
        {icon && (
          <span className="text-[10px] sm:text-sm text-gray-400 dark:text-gray-500">
            {icon.startsWith('fi ') ? <i className={icon}></i> : icon}
          </span>
        )}
        <span className="text-xs sm:text-base font-bold text-gray-700 dark:text-gray-300">
          {typeof value === 'string' ? resolveValue(value) : (value || '-')}
        </span>
      </div>
    </div>
  );

  const ValuePill = ({ label, key }: { label: string, key?: React.Key }) => (
    <span key={key} className="bg-[#1f6d78] text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm">
      {resolveValue(label)}
    </span>
  );

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[250] flex sm:items-center sm:justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/30 sm:dark:bg-black/60">
      <SEO
        title={`${cv.name} - ${cv.profession}`}
        description={cv.about ? cv.about.substring(0, 150) + '...' : `${cv.name} adlı kullanıcının özgeçmişini inceleyin.`}
        image={cv.photoUrl}
      />
      <div className="w-full h-full sm:max-w-[800px] sm:h-[90vh] sm:rounded-[3rem] sm:shadow-2xl relative flex flex-col overflow-hidden bg-white dark:bg-black border-none sm:border border-gray-100 dark:border-white/10">
        {/* Header */}
        <div className="pt-safe sticky top-0 z-10 bg-white dark:bg-black shrink-0">
          <div className="p-4 sm:p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-black gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 sm:order-2"
            >
              <span className="sr-only">{t('profile.close')}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block sm:hidden">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:block text-2xl leading-none">×</span>
            </button>

            <div className="flex-1 sm:order-1 text-center sm:text-left">
              <h2 className="text-[19px] sm:text-2xl font-black text-black dark:text-white tracking-tight truncate">{t('profile.cv_title')}</h2>
            </div>

            <div className="w-10 sm:hidden"></div> {/* Spacer for centering title on mobile */}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 custom-scrollbar space-y-8 sm:space-y-12 bg-white dark:bg-black">

          {/* Bölüm 1: Temel Bilgiler */}
          <section>
            <SectionTitle title={t('profile.basic_info')} />
            <div className="flex flex-col gap-6 pt-4 pl-4">
              <div className="flex flex-row gap-4 sm:gap-8 items-start">
                <div className="shrink-0">
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-3 mb-1.5 block">FOTOĞRAF</span>
                  <div className="border border-dashed border-gray-300 dark:border-white/20 rounded-2xl sm:rounded-[3rem] p-1 mt-2.5 w-fit">
                    <div className="w-20 h-28 sm:w-32 sm:h-44 rounded-xl sm:rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative">
                      <ImageWithFallback 
                        src={cv.photoUrl} 
                        alt={cv.name || ''} 
                        className="w-full h-full object-cover"
                        initialsClassName="text-4xl sm:text-6xl font-black"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-4 min-w-0">
                  <InfoTag label={t('form.fullname')} value={cv.name} />
                  <InfoTag label={t('form.city')} value={`${cv.city}${cv.district ? ' / ' + cv.district : ''}`} />
                  <InfoTag label={t('form.profession')} value={cv.profession} />
                  <InfoTag label={t('form.experience')} value={`${cv.experienceYears} ${t('common.year')}${cv.experienceMonths ? ' ' + cv.experienceMonths + ' ' + t('common.month') : ''}`} />
                  <InfoTag label={t('form.birth_date')} value={cv.birthDate} />
                  <InfoTag label={t('form.marital')} value={cv.personalDetails?.maritalStatus || cv.maritalStatus} />
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 5: Hakkında (Moved) */}
          <section>
            <SectionTitle title={t('profile.about')} />
            <div className="pl-4 text-xs sm:text-base font-bold text-gray-500 dark:text-gray-400 leading-relaxed pt-2">
              {cv.about || t('errors.no_about')}
            </div>
          </section>

          {/* Bölüm 2: İş Tercihleri */}
          <section>
            <SectionTitle title={t('profile.work_pref')} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-4 pl-4">
               <InfoTag 
                label={t('form.salary_exp')} 
                value={(cv.salaryMin || cv.salaryMax) ? `${(cv.salaryMin || 0).toLocaleString('tr-TR')} - ${(cv.salaryMax || 0).toLocaleString('tr-TR')} ${cv.salaryCurrency || '₺'}` : '-'} 
              />
              <InfoTag label={t('form.work_model')} value={cv.workType} />
              <InfoTag label={t('form.employment_type')} value={cv.employmentType} />
              <div className="col-span-2">
                <InfoTag 
                  label="Çalışmak İstenilen Ülkeler" 
                  value={cv.preferredCountries?.length ? cv.preferredCountries.join(' • ') : '-'} 
                />
              </div>
              <div className="col-span-2">
                <InfoTag 
                  label="Çalışmak İstenilen Şehirler" 
                  value={cv.preferredCities?.length ? cv.preferredCities.join(' • ') : (cv.preferredCity || '-')} 
                />
              </div>
              <div className="col-span-2">
                <InfoTag label="ÇALIŞMAK İSTENİLEN POZİSYONLAR" value={cv.preferredRoles?.length ? cv.preferredRoles.join(', ') : '-'} />
              </div>
            </div>
          </section>

          {/* Bölüm 2.5: İş Deneyimi (New) */}
          <section>
            <SectionTitle title={t('profile.work_exp')} />
            {cv.workExperience && cv.workExperience.length > 0 ? (
              <div className="relative border-l-2 border-gray-100 dark:border-white/5 ml-3 pl-8 space-y-12 pt-4">
                {cv.workExperience.map((work) => (
                  <div key={work.id} className="relative">
                    <div className="absolute -left-[37px] top-1.5 w-2.5 h-2.5 rounded-full bg-white dark:bg-black border-2 border-[#1f6d78] dark:border-[#2dd4bf] z-10" />
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      <InfoTag label={t('form.position')} value={work.role} />
                      <InfoTag label={t('form.institution')} value={work.company} />
                      <InfoTag label={t('form.work_period')} value={`${work.startDate} - ${work.isCurrent ? t('common.ongoing') : work.endDate}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">{t('errors.no_exp')}</p>
            )}
          </section>

          {/* Bölüm 2.6: Staj Deneyimi */}
          <section>
            <SectionTitle title={t('form.internships')} />
            {cv.internshipDetails && cv.internshipDetails.length > 0 ? (
              <div className="relative border-l-2 border-gray-100 dark:border-white/5 ml-3 pl-8 space-y-12 pt-4">
                {cv.internshipDetails.map((intern) => (
                  <div key={intern.id} className="relative">
                    <div className="absolute -left-[37px] top-1.5 w-2.5 h-2.5 rounded-full bg-white dark:bg-black border-2 border-[#1f6d78] dark:border-[#2dd4bf] z-10" />
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      <InfoTag label={t('form.intern_role')} value={intern.role} />
                      <InfoTag label={t('form.institution')} value={intern.company} />
                      <InfoTag label={t('form.intern_period')} value={`${intern.startDate} - ${intern.isCurrent ? t('common.ongoing') : intern.endDate}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">{t('errors.no_intern')}</p>
            )}
          </section>

          {/* Bölüm: Eğitim */}
          <section>
            <SectionTitle title={t('form.education_info_clean')} />
            <div>
              {/* Education List */}
              <div className="space-y-6 pt-4">
                {cv.educationDetails && cv.educationDetails.length > 0 ? (
                  <div className="relative border-l-2 border-gray-100 dark:border-white/5 ml-3 pl-8 space-y-12 pt-4">
                    {cv.educationDetails.map((edu) => (
                      <div key={edu.id} className="relative">
                        <div className="absolute -left-[37px] top-1.5 w-2.5 h-2.5 rounded-full bg-white dark:bg-black border-2 border-[#1f6d78] dark:border-[#2dd4bf] z-10" />
                        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                          <InfoTag label={t('form.university')} value={edu.university} />
                          <InfoTag label={t('form.department')} value={`${edu.department} (${resolveValue(edu.level)})`} />
                          <InfoTag label={t('form.status')} value={edu.status || resolveValue(edu.level)} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pl-4 text-xs font-bold text-gray-400 dark:text-gray-500 italic">
                    {t('errors.no_edu')}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Bölüm: Yabancı Diller */}
          <section>
            <SectionTitle title={t('form.languages')} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 pt-2 pl-4">
              {cv.languageDetails && cv.languageDetails.length > 0 ? (
                cv.languageDetails.map(lang => (
                  <div key={lang.id}>
                    <InfoTag label={resolveValue(lang.language)} value={resolveValue(lang.level)} />
                  </div>
                ))
              ) : (
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 italic px-1">{t('errors.no_lang')}</span>
              )}
            </div>
          </section>


          {/* Bölüm: Sertifikalar & Kurslar */}
          <section>
            <SectionTitle title={t('form.certificates')} />
            {cv.certificates && cv.certificates.length > 0 ? (
              <div className="flex flex-col gap-y-5 pt-2 pl-4">
                {cv.certificates.map((cert) => (
                  <div key={cert.id} className="flex flex-col gap-0.5">
                    <span className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-sm font-bold uppercase tracking-tight">
                      {cert.name}
                    </span>
                    {cert.issuer && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                        ({cert.issuer})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="pl-4 text-xs font-bold text-gray-400 dark:text-gray-500 italic">
                {t('errors.no_cert')}
              </div>
            )}
          </section>

          {/* Bölüm 4: Kişisel Detaylar */}
          <section>
            <SectionTitle title={t('profile.personal')} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-4 pl-4">
              <InfoTag label={t('form.military')} value={cv.militaryStatus} />
              <InfoTag label={t('form.travel')} value={cv.travelStatus} />
              <InfoTag label={t('form.disability')} value={cv.disabilityStatus} />
              <InfoTag label={t('form.start_date')} value={cv.noticePeriod} />

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('form.driving_license')}</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 px-1">
                  {cv.driverLicense && cv.driverLicense.length > 0 ? (
                    cv.driverLicense.map((l, idx) => (
                      <span key={l} className="text-xs sm:text-base font-bold text-black dark:text-white uppercase">
                        {l}{idx !== cv.driverLicense.length - 1 ? <span className="text-gray-300 dark:text-gray-700 mx-2">•</span> : ''}
                      </span>
                    ))
                  ) : <span className="text-xs sm:text-base font-bold text-gray-700 dark:text-gray-300">-</span>}
                </div>
              </div>
            </div>
          </section>


          {/* Bölüm 6: Referanslar */}
          <section>
            <SectionTitle title={t('profile.references')} />
            {cv.references && cv.references.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                {cv.references.map((ref, idx) => (
                  <div key={ref.id} className="py-2">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      <div className="col-span-2 sm:col-span-1">
                        <InfoTag label={t('form.fullname')} value={ref.name} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <InfoTag label={t('form.position')} value={`${ref.role} @ ${ref.company}`} />
                      </div>
                      {ref.phone && (
                        <div className="col-span-1">
                          <InfoTag label={t('form.phone')} value={ref.phone} icon="📞" />
                        </div>
                      )}
                      {ref.email && (
                        <div className="col-span-1">
                          <InfoTag label={t('form.email')} value={ref.email} icon="✉️" />
                        </div>
                      )}
                    </div>
                    {idx !== cv.references.length - 1 && (
                      <div className="w-24 h-0.5 bg-[#1f6d78] dark:bg-[#2dd4bf] rounded-full opacity-30 my-6" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base font-bold text-gray-400">{t('errors.no_ref')}</p>
            )}
          </section>

        </div>

        <div className="py-3 px-4 sm:py-6 sm:px-10 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-black/95 backdrop-blur-md flex items-center gap-2 sm:gap-4 sticky bottom-0 z-50 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] pb-safe-bottom">
          
          {/* Action Buttons Container */}
          {!isOwner ? (
            <div className="flex w-full items-center gap-2 sm:gap-4">
              {/* Message Button - Primary Action */}
              <button
                onClick={() => {
                  if (user?.user_metadata?.role === 'job_seeker' || !user) {
                    setShowRoleWarning(true);
                    return;
                  }
                  onOpenChat?.();
                }}
                className="flex-[2.5] h-12 sm:h-14 bg-[#1f6d78] text-white rounded-2xl sm:rounded-full font-bold text-[14px] sm:text-base shadow-lg shadow-[#1f6d78]/20 active:scale-95 hover:bg-[#155e68] transition-all"
              >
                {t('profile.send_message') || 'Mesaj Gönder'}
              </button>

              {/* Share Button - Circular Blue */}
              <div className="relative">
                <Tooltip text={t('profile.share_cv')} show={activeTooltip === 'share'} />
                <button
                  onClick={() => {
                    if (user?.user_metadata?.role !== 'employer') {
                      setShowRoleWarning(true);
                      return;
                    }
                    handleShare();
                  }}
                  onMouseEnter={() => setActiveTooltip('share')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-teal-50 bg-teal-50/30 dark:border-teal-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center hover:bg-teal-50 transition-all active:scale-90"
                >
                  <i className="fi fi-rr-share-square text-lg"></i>
                </button>
              </div>

              {/* Download Button - Circular Green */}
              <div className="relative">
                <Tooltip text={t('profile.download_cv')} show={activeTooltip === 'download'} />
                <button
                  onClick={() => {
                    if (user?.user_metadata?.role !== 'employer') {
                      setShowRoleWarning(true);
                      return;
                    }
                    handleDownload();
                  }}
                  onMouseEnter={() => setActiveTooltip('download')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-teal-50 bg-teal-50/30 dark:border-teal-900/30 text-green-500 dark:text-green-400 flex items-center justify-center hover:bg-teal-50 transition-all active:scale-90"
                >
                  <i className="fi fi-rr-download text-lg"></i>
                </button>
              </div>

              {/* Save Button - Circular Teal/Rose (Role Restricted) */}
              <div className="relative">
                <Tooltip text={isSaved ? t('common.unsave') : t('common.save')} show={activeTooltip === 'save'} />
                <button
                  onClick={async () => {
                    if (user?.user_metadata?.role !== 'employer') {
                      setShowRoleWarning(true);
                      return;
                    }
                    
                    try {
                      if (isSaved) {
                        const { error } = await supabase
                          .from('saved_cvs')
                          .delete()
                          .match({ employer_id: user.id, cv_id: cv.id });
                        if (error) throw error;
                        setIsSaved(false);
                        showToast('CV kaydedilenlerden çıkarıldı.', 'info');
                      } else {
                        const { error } = await supabase
                          .from('saved_cvs')
                          .insert({ employer_id: user.id, cv_id: cv.id });
                        if (error) throw error;
                        setIsSaved(true);
                        showToast('CV başarıyla kaydedildi.', 'success');
                      }
                    } catch (error: any) {
                      console.error('Error saving CV:', error);
                      showToast('İşlem başarısız.', 'error');
                    }
                  }}
                  onMouseEnter={() => setActiveTooltip('save')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
                    isSaved 
                    ? 'bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900/50' 
                    : 'bg-teal-50/30 border-teal-50 dark:border-teal-900/30 text-[#1f6d78] dark:text-[#2dd4bf] hover:bg-teal-50'
                  }`}
                >
                  <i className={`${isSaved ? 'fi fi-sr-bookmark' : 'fi fi-rr-bookmark'} text-lg`}></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-4">
              {/* Owner Actions */}
              <button
                onClick={onJobFound}
                className="flex-1 max-w-[200px] h-12 sm:h-14 bg-[#1f6d78] text-white rounded-2xl sm:rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#155e68] transition-all shadow-lg shadow-[#1f6d78]/20"
              >
                {t('profile.job_found')}
              </button>
              
              <div className="relative">
                <Tooltip text={t('profile.download_cv')} show={activeTooltip === 'owner_download'} />
                <button
                  onClick={handleDownload}
                  onMouseEnter={() => setActiveTooltip('owner_download')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-green-50 text-green-500 flex items-center justify-center hover:bg-green-50 transition-all active:scale-90"
                >
                  <i className="fi fi-rr-download text-lg"></i>
                </button>
              </div>

              <div className="relative">
                <Tooltip text={t('profile.share_cv')} show={activeTooltip === 'owner_share'} />
                <button
                  onClick={handleShare}
                  onMouseEnter={() => setActiveTooltip('owner_share')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-50 transition-all active:scale-90"
                >
                  <i className="fi fi-rr-share-square text-lg"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning / Success Overlay */}
      {
        showWarning.show && (
          <div className="absolute inset-0 z-[300] flex items-center justify-center bg-white/90 backdrop-blur-sm p-6 rounded-[3rem]">
            <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
              <div className="w-16 h-16 bg-[#1f6d78]/10 text-[#1f6d78] rounded-full flex items-center justify-center mx-auto mb-5 text-2xl shadow-sm relative z-10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-black text-black mb-2 leading-tight tracking-tight relative z-10">
                {t('common.success')}
              </h3>
              <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed relative z-10">
                {showWarning.message}
              </p>
              <button
                onClick={() => setShowWarning({ show: false, message: '' })}
                className="w-full bg-[#1f6d78] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#155e68] transition-all shadow-lg active: relative z-10"
              >
                {t('common.done')}
              </button>
            </div>
          </div>
        )
      }

      {/* Role Warning Modal - Centered & Themed */}
      {
        showRoleWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-black rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-white/10 relative">

              {/* Close Button */}
              <button
                onClick={() => setShowRoleWarning(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ✕
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-[#1f6d78]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1f6d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-black text-black dark:text-white mb-3">{t('errors.employer_required')}</h3>

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {t('errors.employer_desc')}
              </p>

              <button
                onClick={() => setShowRoleWarning(false)}
                className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#155e68] transition-all active: shadow-lg shadow-[#1f6d78]/20"
              >
                {t('common.got_it')}
              </button>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default ProfileModal;
