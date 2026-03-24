import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  const isOwner = user ? user.id === cv.userId : false;

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
      <h3 className="text-[12px] sm:text-lg font-black text-black dark:text-white uppercase tracking-[0.2em] border-l-4 border-[#1f6d78] pl-3 leading-none">{title}</h3>
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
    <div className="fixed top-0 left-0 right-0 bottom-16 z-[250] flex sm:items-center sm:justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/30 sm:dark:bg-black/60">
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
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex flex-row gap-4 sm:gap-8 items-start">
                <div className="shrink-0">
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-3 mb-1.5 block">{t('company.logo')}</span>
                  <div className="w-20 h-28 sm:w-32 sm:h-44 rounded-xl sm:rounded-[2.5rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-900 mt-2.5">
                    <img src={cv.photoUrl} alt={cv.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-4 min-w-0">
                  <InfoTag label={t('form.fullname')} value={cv.name} />
                  <InfoTag label={t('form.city')} value={`${cv.city}${cv.district ? ' / ' + cv.district : ''}`} />
                  <InfoTag label={t('form.profession')} value={cv.profession} />
                  <InfoTag label={t('form.experience')} value={`${cv.experienceYears} ${t('common.year')}${cv.experienceMonths ? ' ' + cv.experienceMonths + ' ' + t('common.month') : ''}`} icon="fi fi-rr-briefcase" />
                  {cv.birthDate && <InfoTag label={t('form.birth_date')} value={cv.birthDate} />}
                  {(cv.personalDetails?.maritalStatus || cv.maritalStatus) && (
                    <InfoTag label={t('form.marital')} value={cv.personalDetails?.maritalStatus || cv.maritalStatus} />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 5: Hakkında (Moved) */}
          <section>
            <SectionTitle title={t('profile.about')} />
            <div className="px-1 text-xs sm:text-base font-bold text-gray-500 dark:text-gray-400 leading-relaxed pt-2">
              {cv.about || t('errors.no_about')}
            </div>
          </section>

          {/* Bölüm 2: İş Tercihleri */}
          <section>
            <SectionTitle title={t('profile.work_pref')} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-4">
              <InfoTag label={t('form.work_status')} value={(() => {
                const statusMap: Record<string, string> = { active: t('form.working'), passive: t('form.not_working'), open: t('form.job_seeking') };
                const currentStatus = cv.workingStatus || 'open';
                return (
                  <span className={`text-xs sm:text-base font-bold ${currentStatus === 'passive' ? 'text-gray-400' : 'text-black dark:text-white'}`}>
                    {statusMap[currentStatus] || t('form.job_seeking')}
                  </span>
                );
              })()} />
               <InfoTag label={t('form.salary_exp')} value={`${(cv.salaryMin || 0).toLocaleString('tr-TR')}₺ - ${(cv.salaryMax || 0).toLocaleString('tr-TR')}₺`} />
              <InfoTag label={t('form.work_model')} value={cv.workType || t('work.office')} />
              <InfoTag label={t('form.employment_type')} value={cv.employmentType || t('emp.full_time')} />
              <InfoTag label={t('form.preferred_city')} value={cv.preferredCity || '-'} />
              <InfoTag label={t('form.preferred_roles')} value={cv.preferredRoles?.length ? cv.preferredRoles.join(', ') : '-'} />
            </div>
          </section>

          {/* Bölüm 2.5: İş Deneyimi (New) */}
          <section>
            <SectionTitle title={t('profile.work_exp')} />
            {cv.workExperience && cv.workExperience.length > 0 ? (
              <div className="space-y-6 pt-4">
                {cv.workExperience.map((work, idx) => (
                  <React.Fragment key={work.id}>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      <div className="col-span-2 sm:col-span-1">
                        <InfoTag label={t('form.position')} value={work.role} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <InfoTag label={t('form.institution')} value={work.company} />
                      </div>
                      <div className="col-span-2">
                        <InfoTag label={t('form.work_period')} value={`${work.startDate} - ${work.isCurrent ? t('common.ongoing') : work.endDate}`} />
                      </div>
                    </div>
                    {idx !== cv.workExperience.length - 1 && (
                      <div className="w-24 h-0.5 bg-[#1f6d78] dark:bg-[#2dd4bf] rounded-full opacity-30 my-2" />
                    )}
                  </React.Fragment>
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
              <div className="space-y-6 pt-4">
                {cv.internshipDetails.map((intern, idx) => (
                  <React.Fragment key={intern.id}>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      <div className="col-span-2 sm:col-span-1">
                        <InfoTag label={t('form.intern_role')} value={intern.role} />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <InfoTag label={t('form.institution')} value={intern.company} />
                      </div>
                      <div className="col-span-2">
                        <InfoTag label={t('form.intern_period')} value={`${intern.startDate} - ${intern.isCurrent ? t('common.ongoing') : intern.endDate}`} />
                      </div>
                    </div>
                    {idx !== cv.internshipDetails.length - 1 && (
                      <div className="w-24 h-0.5 bg-[#1f6d78] dark:bg-[#2dd4bf] rounded-full opacity-30 my-2" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">{t('errors.no_intern')}</p>
            )}
          </section>

          {/* Bölüm 3: Eğitim ve Yetenekler */}
          <section>
            <SectionTitle title={t('profile.edu_skills')} />
            <div className="space-y-8">

              {/* Education List */}
              <div className="space-y-6 pt-4">
                {cv.educationDetails && cv.educationDetails.length > 0 ? (
                  <div className="space-y-6">
                    {cv.educationDetails.map((edu, idx) => (
                      <React.Fragment key={edu.id}>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                          <div className="col-span-2 sm:col-span-1">
                            <InfoTag label={t('form.university')} value={edu.university} />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <InfoTag label={t('form.department')} value={`${edu.department} (${resolveValue(edu.level)})`} />
                          </div>
                          <div className="col-span-2">
                            <InfoTag label={t('form.status')} value={edu.status || resolveValue(edu.level)} />
                          </div>
                        </div>
                        {idx !== cv.educationDetails.length - 1 && (
                          <div className="w-24 h-0.5 bg-[#1f6d78] dark:bg-[#2dd4bf] rounded-full opacity-30 my-2" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  // Fallback to legacy
                  <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-4">
                    <div className="col-span-2 sm:col-span-1">
                      <InfoTag label={t('form.university')} value={cv.education || '-'} />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <InfoTag label={t('form.status')} value={`${resolveValue(cv.educationLevel)} - ${resolveValue(cv.graduationStatus)}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Languages List */}
              <div className="space-y-4">
                <div className="w-24 h-0.5 bg-[#1f6d78] dark:bg-[#2dd4bf] rounded-full opacity-30 mb-6" />
                <label className="text-[10px] font-black text-black dark:text-gray-100 uppercase tracking-widest ml-1 block mb-2">{t('form.languages')}</label>
                <div className="flex flex-wrap gap-x-6 gap-y-4 pt-2">
                  {cv.languageDetails && cv.languageDetails.length > 0 ? (
                    cv.languageDetails.map(lang => (
                      <div key={lang.id} className="min-w-[120px]">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">{resolveValue(lang.language)}</span>
                        <span className="text-sm sm:text-base font-bold text-black dark:text-white">
                          {(() => {
                            const val = resolveValue(lang.level) || '';
                            return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                          })()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="min-w-[120px]">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">{resolveValue(cv.language)}</span>
                      <span className="text-sm sm:text-base font-bold text-black dark:text-white">
                        {(() => {
                          const val = resolveValue(cv.languageLevel) || '';
                          return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-24 h-0.5 bg-[#1f6d78] dark:bg-[#2dd4bf] rounded-full opacity-30 mb-6" />
                <label className="text-[10px] font-black text-black dark:text-gray-100 uppercase tracking-widest ml-1 block mb-2">{t('form.skills')}</label>
                {cv.skills && cv.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-3 pt-2">
                    {cv.skills.map((skill, idx) => (
                      <span key={idx} className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-sm font-bold uppercase tracking-tight">
                        {skill}{idx !== cv.skills.length - 1 ? <span className="text-gray-300 dark:text-gray-700 mx-2">•</span> : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base font-bold text-gray-400">{t('form.no_skills')}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="w-24 h-0.5 bg-[#1f6d78] dark:bg-[#2dd4bf] rounded-full opacity-30 mb-6" />
                <label className="text-[10px] font-black text-black dark:text-gray-100 uppercase tracking-widest ml-1 block mb-2">{t('form.certificates')}</label>
                {cv.certificates && cv.certificates.length > 0 ? (
                  <div className="flex flex-col gap-y-5 pt-2">
                    {cv.certificates.map((cert) => (
                      <div key={cert.id} className="flex flex-col gap-0.5">
                        <span className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-sm font-bold uppercase tracking-tight">
                          {cert.name}
                        </span>
                        {cert.issuer && (
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-medium">
                            ({cert.issuer})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base font-bold text-gray-400">{t('errors.no_cert')}</p>
                )}
              </div>
            </div>
          </section>

          {/* Bölüm 4: Kişisel Detaylar */}
          <section>
            <SectionTitle title={t('profile.personal')} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-4">
              {cv.militaryStatus && (
                <div className="col-span-2">
                  <InfoTag label={t('form.military')} value={resolveValue(cv.militaryStatus)} />
                  <div className="w-24 h-0.5 bg-gray-100 dark:bg-gray-800 rounded-full my-4 opacity-50" />
                </div>
              )}

              <InfoTag label={t('form.travel')} value={resolveValue(cv.travelStatus)} />
              <InfoTag label={t('form.disability')} value={resolveValue(cv.disabilityStatus)} />
              <InfoTag label={t('form.start_date')} value={resolveValue(cv.noticePeriod)} />

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('form.driving_license')}</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 px-1">
                  {cv.driverLicense && cv.driverLicense.length > 0 ? (
                    cv.driverLicense.map((l, idx) => (
                      <span key={l} className="text-xs sm:text-base font-bold text-black dark:text-white uppercase">
                        {l}{idx !== cv.driverLicense.length - 1 ? <span className="text-gray-300 dark:text-gray-700 mx-2">•</span> : ''}
                      </span>
                    ))
                  ) : <span className="text-sm sm:text-base font-bold text-gray-400">{t('common.none')}</span>}
                </div>
              </div>
            </div>
          </section>


          {/* Bölüm 6: Referanslar */}
          <section>
            <SectionTitle title={t('profile.references')} />
            {cv.references && cv.references.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cv.references.map((ref) => (
                  <div key={ref.id} className="bg-gray-50 dark:bg-black p-6 rounded-3xl border border-gray-200 dark:border-white/10">
                    <h4 className="font-bold text-black dark:text-white text-sm">{ref.name}</h4>
                    <p className="text-xs text-gray-500 font-bold mt-1">{ref.role} @ {ref.company}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-2">
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
              <p className="text-sm sm:text-base font-bold text-gray-400">{t('errors.no_ref')}</p>
            )}
          </section>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 px-3 pb-2 sm:p-8 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-black flex gap-2 sm:gap-5 sticky bottom-0 z-10 shrink-0">
          {isOwner && cv.workingStatus !== 'active' && (
            <button
              onClick={onJobFound}
              className="flex-[1.5] bg-[#1f6d78] text-white py-2 sm:py-5 rounded-xl sm:rounded-full font-black text-[10px] sm:text-sm uppercase tracking-wider sm:tracking-widest hover:bg-[#155e68] transition-all active: shadow-md sm:shadow-lg shadow-[#1f6d78]/20"
            >
              {t('profile.job_found')}
            </button>
          )}

          {isOwner ? (
            <>
              <button
                onClick={handleDownload}
                className="flex-1 bg-white dark:bg-black border border-[#1f6d78] text-[#1f6d78] dark:text-[#2dd4bf] dark:border-[#2dd4bf] py-2 sm:py-5 rounded-xl sm:rounded-full font-black text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white transition-all active: shadow-sm sm:shadow-xl"
              >
                {t('profile.download_cv')}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-white dark:bg-black border border-[#1f6d78] text-[#1f6d78] dark:text-[#2dd4bf] dark:border-[#2dd4bf] py-2 sm:py-5 rounded-xl sm:rounded-full font-black text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest hover:bg-[#1f6d78] dark:hover:bg-[#1f6d78] hover:text-white transition-all active: shadow-sm sm:shadow-xl"
              >
                {t('profile.share_cv')}
              </button>
            </>
          ) : (
            <>
                <button
                  onClick={() => {
                    if (user?.user_metadata?.role === 'job_seeker') {
                      setShowRoleWarning(true);
                      return;
                    }
                    onOpenChat?.();
                  }}
                  className="flex-[2] bg-[#1f6d78] text-white py-4 sm:py-5 rounded-xl sm:rounded-full font-black text-[10px] sm:text-base uppercase tracking-wider sm:tracking-widest transition-all shadow-md sm:shadow-xl active:scale-95 hover:bg-[#155e68]"
                >
                  {t('profile.send_message') || 'Mesaj Gönder'}
                </button>


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
                    className={`w-12 h-12 sm:w-16 sm:h-auto rounded-full flex items-center justify-center border transition-all active: shadow-xl ${isSaved
                    ? 'bg-white dark:bg-black border-[#1f6d78] text-[#1f6d78]'
                    : 'bg-white dark:bg-black border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#1f6d78] hover:border-[#1f6d78]'
                    }`}
                  title={isSaved ? t('common.unsave') : t('common.save')}
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
