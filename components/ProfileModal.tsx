import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CV } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generatePrintableCV } from '../lib/generatePrintableCV';

import { supabase } from '../lib/supabase';

interface ProfileModalProps {
  cv: CV;
  onClose: () => void;
  requestStatus?: 'pending' | 'approved' | 'rejected' | 'none';
  onRequestAccess?: () => void;
  onCancelRequest?: () => void;
  onJobFound?: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ cv, onClose, requestStatus = 'none', onRequestAccess, onCancelRequest, onJobFound }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showRoleWarning, setShowRoleWarning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isOwner = user?.id === cv.userId;

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

  const hasAccess = requestStatus === 'approved' || isOwner;
  // Show if public OR if access is approved OR is owner
  const showEmail = cv.isEmailPublic || hasAccess;
  const showPhone = cv.isPhonePublic || hasAccess;

  // Show contact button if NOT approved AND NOT owner
  const showRequestButton = !hasAccess && !isOwner;
  const isPending = requestStatus === 'pending';

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
        alert('Link kopyalandı!');
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
    <div className="mb-4 sm:mb-6 mt-6 sm:mt-10 first:mt-0">
      <h3 className="text-xs sm:text-sm font-black text-black dark:text-white uppercase tracking-[0.15em] border-l-4 border-[#1f6d78] pl-3">{title}</h3>
      {subtitle && <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
    </div>
  );

  const InfoTag = ({ label, value, icon }: { label: string, value: string | number | undefined, icon?: string }) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</span>
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-2 sm:gap-3">
        {icon && <span className="text-xs sm:text-sm">{icon}</span>}
        <span className="text-xs sm:text-sm font-bold text-black dark:text-gray-100">
          {typeof value === 'string' ? resolveValue(value) : (value || '-')}
        </span>
      </div>
    </div>
  );

  const ValuePill = ({ label }: { label: string }) => (
    <span className="bg-[#1f6d78] text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm">
      {resolveValue(label)}
    </span>
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-[800px] h-[90vh] rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-black dark:text-white tracking-tighter">{t('profile.cv_title')}</h2>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{t('profile.cv_subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-lg sm:text-2xl text-black dark:text-white hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white transition-all active:scale-90 shadow-sm"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 custom-scrollbar space-y-8 sm:space-y-12 bg-white dark:bg-gray-900">

          {/* Bölüm 1: Temel Bilgiler */}
          <section>
            <SectionTitle title={t('profile.basic_info')} />
            <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center md:items-start">
              <div className="shrink-0">
                <div className="w-24 h-32 sm:w-32 sm:h-44 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800">
                  <img src={cv.photoUrl} alt={cv.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoTag label={t('form.fullname')} value={cv.name} />
                  <InfoTag label={t('form.profession')} value={cv.profession} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoTag label={t('form.city')} value={`${cv.city}${cv.district ? ' / ' + cv.district : ''}`} />
                  <InfoTag label={t('form.experience')} value={`${cv.experienceYears} Yıl${cv.experienceMonths ? ' ' + cv.experienceMonths + ' Ay' : ''} Deneyim`} />
                </div>
              </div>
            </div>


            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">{t('form.work_status')}</span>
              <div className="flex gap-2">
                {/* Working Status Display */}
                {(() => {
                  const statusMap: Record<string, string> = { active: t('form.working'), passive: t('form.not_working'), open: t('form.job_seeking') };
                  const currentStatus = cv.workingStatus || 'open';
                  const label = statusMap[currentStatus] || t('form.job_seeking');
                  return (
                    <span className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider ${currentStatus === 'open' ? 'bg-[#1f6d78] text-white shadow-lg shadow-[#1f6d78]/20' :
                      currentStatus === 'active' ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                      {label}
                    </span>
                  );
                })()}
              </div>
            </div>

          </section>

          {/* Bölüm 2: İş Tercihleri */}
          <section>
            <SectionTitle title={t('profile.work_pref')} />
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.work_model')} & {t('form.employment_type')}</label>
                  <div className="flex flex-wrap gap-2">
                    <ValuePill label={cv.workType || 'Ofis'} />
                    <ValuePill label={cv.employmentType || 'Tam Zamanlı'} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.salary_exp')}</label>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-6 py-3 flex items-center justify-between">
                    <span className="text-sm font-black text-black dark:text-gray-100">
                      {cv.salaryMin.toLocaleString('tr-TR')}₺ - {cv.salaryMax.toLocaleString('tr-TR')}₺
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase">{t('form.monthly_net') || 'Aylık Net'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Tercih Edilen Şehir</label>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-6 py-3 flex items-center">
                  <span className="text-sm font-black text-black dark:text-gray-100">
                    {cv.preferredCity || '-'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">Tercih Edilen Alanlar</label>
                <div className="flex flex-wrap gap-2">
                  {cv.preferredRoles && cv.preferredRoles.length > 0 ? cv.preferredRoles.map(role => (
                    <ValuePill key={role} label={role} />
                  )) : <span className="text-sm font-bold text-gray-400 italic">-</span>}
                </div>
              </div>
            </div>

          </section>

          {/* Bölüm 2.5: İş Deneyimi (New) */}
          <section>
            <SectionTitle title={t('profile.work_exp')} />
            {cv.workExperience && cv.workExperience.length > 0 ? (
              <div className="space-y-4">
                {cv.workExperience.map((work) => (
                  <div key={work.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-black dark:text-gray-100 text-sm">{work.role}</h4>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{work.company}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 whitespace-nowrap">
                      {work.startDate} - {work.isCurrent ? t('common.ongoing') : work.endDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">Henüz iş deneyimi eklenmemiş.</p>
            )}
          </section>

          {/* Bölüm 2.6: Staj Deneyimi */}
          <section>
            <SectionTitle title="Staj Deneyimi" />
            {cv.internshipDetails && cv.internshipDetails.length > 0 ? (
              <div className="space-y-4">
                {cv.internshipDetails.map((intern) => (
                  <div key={intern.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-black dark:text-gray-100 text-sm">{intern.role}</h4>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{intern.company}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-[10px] font-black uppercase text-gray-400 dark:text-gray-300 whitespace-nowrap">
                      {intern.startDate} - {intern.isCurrent ? (t('common.ongoing') || 'Devam Ediyor') : intern.endDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">Henüz staj deneyimi eklenmemiş.</p>
            )}
          </section>

          {/* Bölüm 3: Eğitim ve Yetenekler */}
          <section>
            <SectionTitle title={t('profile.edu_skills')} />
            <div className="space-y-8">

              {/* Education List */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.education_info')}</label>
                {cv.educationDetails && cv.educationDetails.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {cv.educationDetails.map((edu) => (
                      <div key={edu.id} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-black dark:text-gray-100">{edu.university}</h4>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{edu.department} ({resolveValue(edu.level)})</p>
                        </div>
                        <span className="bg-[#1f6d78] text-white text-[9px] font-bold px-3 py-1.5 rounded-full">{edu.status || resolveValue(edu.level)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback to legacy
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-sm text-black">{cv.education}</h4>
                    <p className="text-xs font-medium text-gray-500">{resolveValue(cv.educationLevel)} - {resolveValue(cv.graduationStatus)}</p>
                  </div>
                )}
              </div>

              {/* Languages List */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.languages')}</label>
                <div className="flex flex-wrap gap-2">
                  {cv.languageDetails && cv.languageDetails.length > 0 ? (
                    cv.languageDetails.map(lang => (
                      <div key={lang.id} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2.5 flex items-center gap-2">
                        <span className="text-xs font-bold text-black dark:text-gray-100">{resolveValue(lang.language)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{resolveValue(lang.level)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2.5 flex items-center gap-2">
                      <span className="text-xs font-bold text-black dark:text-gray-100">{resolveValue(cv.language)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{resolveValue(cv.languageLevel)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.skills')}</label>
                {cv.skills && cv.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cv.skills.map((skill, idx) => (
                      <span key={idx} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-gray-100 text-[11px] font-bold px-5 py-2.5 rounded-full uppercase tracking-tight">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-400 italic">Henüz uzmanlık alanı eklenmemiş.</p>
                )}
              </div>

              {/* Certificates - NEW SECTION */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black dark:text-gray-300 uppercase tracking-widest ml-1">{t('form.certificates')}</label>
                {cv.certificates && cv.certificates.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cv.certificates.map((cert) => (
                      <span key={cert.id} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-gray-100 text-[11px] font-bold px-5 py-2.5 rounded-full uppercase tracking-tight">
                        {cert.name} {cert.issuer && <span className="text-gray-400 font-medium ml-1">({cert.issuer})</span>}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-400 italic">Henüz sertifika veya kurs eklenmemiş.</p>
                )}
              </div>
            </div>
          </section>

          {/* Bölüm 4: Kişisel Detaylar */}
          <section>
            <SectionTitle title={t('profile.personal')} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cv.militaryStatus && <InfoTag label={t('form.military')} value={resolveValue(cv.militaryStatus)} />}
              <InfoTag label={t('form.marital')} value={resolveValue(cv.maritalStatus)} />
              <InfoTag label={t('form.travel')} value={resolveValue(cv.travelStatus)} />
              <InfoTag label={t('form.disability')} value={resolveValue(cv.disabilityStatus)} />
              <InfoTag label={t('form.start_date')} value={resolveValue(cv.noticePeriod)} />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('form.driving_license')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {cv.driverLicense && cv.driverLicense.length > 0 ? (
                    cv.driverLicense.map(l => (
                      <div key={l} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full px-5 py-3 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-black dark:text-gray-100">{l}</span>
                      </div>
                    ))
                  ) : <span className="text-sm font-bold text-gray-400 italic bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 border rounded-full px-4 py-2 w-full">{t('common.none')}</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 5: Hakkında */}
          <section>
            <SectionTitle title={t('profile.about')} />
            <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 italic text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-medium">
              "{cv.about || 'Kullanıcı henüz kendini tanıtan bir yazı eklememiş.'}"
            </div>
          </section>

          {/* Bölüm 6: Referanslar */}
          <section>
            <SectionTitle title={t('profile.references')} />
            {cv.references && cv.references.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cv.references.map((ref) => (
                  <div key={ref.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-black dark:text-white text-sm">{ref.name}</h4>
                    <p className="text-xs text-gray-500 font-bold mt-1">{ref.role} @ {ref.company}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                      {ref.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold">✉️</span>
                          <span className="text-xs font-bold text-gray-700">{ref.email}</span>
                        </div>
                      )}
                      {ref.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold">📞</span>
                          <span className="text-xs font-bold text-gray-700">{ref.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">Henüz referans eklenmemiş.</p>
            )}
          </section>

          {/* Bölüm 7: İletişim Bilgileri */}
          <section>
            <SectionTitle title={t('profile.contact')} />
            {(cv.email || cv.phone) ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">

                {/* Warning: If access not granted AND at least one field hidden AND NOT OWNER */}
                {!hasAccess && !isOwner && (!cv.isEmailPublic || !cv.isPhonePublic) && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">!</div>
                    <p className="text-xs font-bold text-red-800 leading-relaxed">
                      {t('profile.warning_hidden')}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {cv.email && (
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                      </div>
                      {/* Show if Public OR Has Access OR Is Owner */}
                      {(cv.isEmailPublic || hasAccess || isOwner) ? (
                        <a href={`mailto:${cv.email}`} className="hover:text-black dark:hover:text-white hover:underline truncate">{cv.email}</a>
                      ) : (
                        <span className="text-gray-400 select-none blur-[4px]">***************@*****.com</span>
                      )}
                    </div>
                  )}
                  {cv.phone && (
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800 dark:text-gray-200">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.57A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                      {/* Show if Public OR Has Access OR Is Owner */}
                      {(cv.isPhonePublic || hasAccess || isOwner) ? (
                        <a href={`tel:${cv.phone}`} className="hover:text-black dark:hover:text-white hover:underline">{cv.phone}</a>
                      ) : (
                        <span className="text-gray-400 select-none blur-[4px]">+90 *** *** ** **</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">İletişim bilgileri görüntülenemiyor.</p>
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-8 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-3 sm:gap-5 sticky bottom-0 z-10 shrink-0">
          {isOwner && cv.workingStatus !== 'active' && (
            <button
              onClick={onJobFound}
              className="flex-[2] bg-[#1f6d78] text-white py-3 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-[#155e68] transition-all active:scale-95 shadow-lg shadow-[#1f6d78]/20"
            >
              {t('profile.job_found')}
            </button>
          )}

          {isOwner ? (
            <>
              <button
                onClick={handleDownload}
                className="flex-1 bg-white dark:bg-gray-800 border border-[#1f6d78] text-[#1f6d78] dark:text-[#2dd4bf] dark:border-[#2dd4bf] py-3 sm:py-5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white transition-all active:scale-95 shadow-xl"
              >
                {t('profile.download_cv')}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-white dark:bg-gray-800 border border-[#1f6d78] text-[#1f6d78] dark:text-[#2dd4bf] dark:border-[#2dd4bf] py-3 sm:py-5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white transition-all active:scale-95 shadow-xl"
              >
                {t('profile.share_cv')}
              </button>
            </>
          ) : (
            <>
              {!hasAccess ? (
                <button
                  onClick={isPending ? onCancelRequest : () => {
                    if (user?.user_metadata?.role === 'job_seeker') {
                      setShowRoleWarning(true);
                      return;
                    }
                    onRequestAccess?.();
                  }}
                  className={`flex-[2] py-3 sm:py-5 rounded-full font-black text-xs sm:text-base uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] group ${isPending
                    ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:shadow-none'
                    : 'bg-[#1f6d78] text-white hover:bg-[#155e68]'
                    }`}
                >
                  {isPending ? (
                    <>
                      <span className="group-hover:hidden">{t('profile.request_sent')}</span>
                      <span className="hidden group-hover:inline">{t('profile.cancel_request')}</span>
                    </>
                  ) : t('profile.contact_request')}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-[2] bg-[#1f6d78] text-white py-3 sm:py-5 rounded-full font-black text-xs sm:text-base uppercase tracking-widest shadow-xl cursor-default"
                >
                  {t('profile.contact_open')}
                </button>
              )}


              {/* SAVE CV BUTTON (For Employers) */}
              {user?.user_metadata?.role === 'employer' && !isOwner && (
                <button
                  onClick={async () => {
                    try {
                      if (isSaved) {
                        // Unsave
                        const { error } = await supabase
                          .from('saved_cvs')
                          .delete()
                          .match({ employer_id: user.id, cv_id: cv.id });
                        if (error) throw error;
                        setIsSaved(false);
                        showToast('CV kaydedilenlerden çıkarıldı.', 'info');
                      } else {
                        // Save
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
                  className={`w-12 h-12 sm:w-16 sm:h-auto rounded-full flex items-center justify-center border transition-all active:scale-95 shadow-xl ${isSaved
                    ? 'bg-white border-[#1f6d78] text-[#1f6d78]'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-[#1f6d78] hover:border-[#1f6d78]'
                    }`}
                  title={isSaved ? 'Kaydedilenlerden Çıkar' : 'CV\'yi Kaydet'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              )}
            </>
          )}

        </div>
      </div >

      {/* Role Warning Modal - Centered & Themed */}
      {
        showRoleWarning && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 relative">

              {/* Close Button */}
              <button
                onClick={() => setShowRoleWarning(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

              <h3 className="text-xl font-black text-black dark:text-white mb-3">İş Veren Hesabı Gerekli</h3>

              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Başka bir iş arayanla iletişime geçmek için önce <span className="text-[#1f6d78] dark:text-[#2dd4bf] font-bold">iş veren hesabı</span> oluşturmalısınız.
              </p>

              <button
                onClick={() => setShowRoleWarning(false)}
                className="w-full bg-[#1f6d78] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#155e68] transition-all active:scale-95 shadow-lg shadow-[#1f6d78]/20"
              >
                Anladım
              </button>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default ProfileModal;
