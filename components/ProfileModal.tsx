import React from 'react';
import { CV } from '../types';
import { useAuth } from '../context/AuthContext';
import { generatePrintableCV } from '../lib/generatePrintableCV';

interface ProfileModalProps {
  cv: CV;
  onClose: () => void;
  requestStatus?: 'pending' | 'approved' | 'rejected' | 'none';
  onRequestAccess?: () => void;
  onCancelRequest?: () => void;
  onJobFound?: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ cv, onClose, requestStatus = 'none', onRequestAccess, onCancelRequest, onJobFound }) => {
  const { user } = useAuth();
  const isOwner = user?.id === cv.userId;

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

  const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6 mt-10 first:mt-0">
      <h3 className="text-sm font-black text-black uppercase tracking-[0.15em] border-l-4 border-[#1f6d78] pl-3">{title}</h3>
      {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 ml-4">{subtitle}</p>}
    </div>
  );

  const InfoTag = ({ label, value, icon }: { label: string, value: string | number | undefined, icon?: string }) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</span>
      <div className="bg-gray-50 border border-gray-100 rounded-full px-5 py-3 flex items-center gap-3">
        {icon && <span className="text-sm">{icon}</span>}
        <span className="text-sm font-bold text-black">{value || '-'}</span>
      </div>
    </div>
  );

  const ValuePill = ({ label }: { label: string }) => (
    <span className="bg-[#1f6d78] text-white px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
      {label}
    </span>
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[800px] h-[90vh] rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-black tracking-tighter">Dijital Kartvizid Profili</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Adayın profesyonel ve kişisel tüm detayları</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl text-black hover:bg-[#1f6d78] hover:text-white transition-all active:scale-90 shadow-sm"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12 bg-white">

          {/* Bölüm 1: Temel Bilgiler */}
          <section>
            <SectionTitle title="1. TEMEL BİLGİLER" />
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
              <div className="shrink-0">
                <div className="w-32 h-44 rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl bg-gray-50">
                  <img src={cv.photoUrl} alt={cv.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoTag label="Ad Soyad" value={cv.name} />
                  <InfoTag label="Meslek / Ünvan" value={cv.profession} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoTag label="Şehir / İlçe" value={`${cv.city}${cv.district ? ' / ' + cv.district : ''}`} icon="📍" />
                  <InfoTag label="Tecrübe" value={`${cv.experienceYears} Yıl`} icon="💼" />
                </div>
              </div>
            </div>


            <div className="mt-8 bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Çalışma Durumu</span>
              <div className="flex gap-2">
                {/* Working Status Display */}
                {(() => {
                  const statusMap: Record<string, string> = { active: 'Çalışıyor', passive: 'Çalışmıyor', open: 'İş Arıyor' };
                  const currentStatus = cv.workingStatus || 'open';
                  const label = statusMap[currentStatus] || 'İş Arıyor';
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
            <SectionTitle title="2. İŞ TERCİHLERİ" />
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Çalışma Modeli & Şekli</label>
                  <div className="flex flex-wrap gap-2">
                    <ValuePill label={cv.workType || 'Ofis'} />
                    <ValuePill label={cv.employmentType || 'Tam Zamanlı'} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Maaş Beklentisi</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-full px-6 py-3 flex items-center justify-between">
                    <span className="text-sm font-black text-black">
                      {cv.salaryMin.toLocaleString('tr-TR')}₺ - {cv.salaryMax.toLocaleString('tr-TR')}₺
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Aylık Net</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 2.5: İş Deneyimi (New) */}
          <section>
            <SectionTitle title="3. İŞ DENEYİMİ" />
            {cv.workExperience && cv.workExperience.length > 0 ? (
              <div className="space-y-4">
                {cv.workExperience.map((work) => (
                  <div key={work.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-black text-sm">{work.role}</h4>
                      <p className="text-xs font-bold text-gray-500 mt-1">{work.company}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-[10px] font-black uppercase text-gray-400 whitespace-nowrap">
                      {work.startDate} - {work.isCurrent ? 'Devam Ediyor' : work.endDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">İş deneyimi eklenmemiş.</p>
            )}
          </section>

          {/* Bölüm 3: Eğitim ve Yetenekler */}
          <section>
            <SectionTitle title="4. EĞİTİM & YETENEKLER" />
            <div className="space-y-8">

              {/* Education List */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Eğitim Bilgileri</label>
                {cv.educationDetails && cv.educationDetails.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {cv.educationDetails.map((edu) => (
                      <div key={edu.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-black">{edu.university}</h4>
                          <p className="text-xs font-medium text-gray-500">{edu.department} ({edu.level})</p>
                        </div>
                        <span className="bg-[#1f6d78] text-white text-[9px] font-bold px-3 py-1.5 rounded-full">{edu.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback to legacy
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-sm text-black">{cv.education}</h4>
                    <p className="text-xs font-medium text-gray-500">{cv.educationLevel} - {cv.graduationStatus}</p>
                  </div>
                )}
              </div>

              {/* Languages List */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Yabancı Diller</label>
                <div className="flex flex-wrap gap-2">
                  {cv.languageDetails && cv.languageDetails.length > 0 ? (
                    cv.languageDetails.map(lang => (
                      <div key={lang.id} className="bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 flex items-center gap-2">
                        <span className="text-xs font-bold text-black">{lang.language}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{lang.level}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 flex items-center gap-2">
                      <span className="text-xs font-bold text-black">{cv.language}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{cv.languageLevel}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-black uppercase tracking-widest ml-1">Uzmanlık Alanları</label>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-50 border border-gray-200 text-black text-[11px] font-bold px-5 py-2.5 rounded-full uppercase tracking-tight">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 4: Kişisel Detaylar */}
          <section>
            <SectionTitle title="5. KİŞİSEL DETAYLAR" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoTag label="Askerlik" value={cv.militaryStatus || 'Yapıldı'} />
              <InfoTag label="Medeni Durum" value={cv.maritalStatus || 'Bekar'} />
              <InfoTag label="Seyahat" value={cv.travelStatus || 'Sorun Yok'} />
              <InfoTag label="Engellilik" value={cv.disabilityStatus || 'Yok'} />
              <InfoTag label="İşe Başlama" value={cv.noticePeriod || 'Hemen'} />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sürücü Belgesi</span>
                <div className="flex flex-wrap gap-1.5">
                  {cv.driverLicense && cv.driverLicense.length > 0 ? (
                    cv.driverLicense.map(l => <span key={l} className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-[10px] font-black">{l}</span>)
                  ) : <span className="text-sm font-bold text-gray-300 italic">Yok</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Bölüm 5: Hakkında */}
          <section>
            <SectionTitle title="6. HAKKINDA" />
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 italic text-gray-700 leading-relaxed text-sm font-medium">
              "{cv.about || 'Aday kendini tanıtacak bir yazı eklememiş.'}"
            </div>
          </section>

          {/* Bölüm 6: Referanslar */}
          <section>
            <SectionTitle title="7. REFERANSLAR" />
            {cv.references && cv.references.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cv.references.map((ref) => (
                  <div key={ref.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
                    <h4 className="font-bold text-black text-sm">{ref.name}</h4>
                    <p className="text-xs text-gray-500 font-bold mt-1">{ref.role} @ {ref.company}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
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
              <p className="text-sm font-bold text-gray-400 italic">Referans eklenmemiş.</p>
            )}
          </section>

          {/* Bölüm 7: İletişim Bilgileri */}
          <section>
            <SectionTitle title="8. İLETİŞİM BİLGİLERİ" />
            {(cv.email || cv.phone) ? (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">

                {/* Warning: If access not granted AND at least one field hidden AND NOT OWNER */}
                {!hasAccess && !isOwner && (!cv.isEmailPublic || !cv.isPhonePublic) && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">!</div>
                    <p className="text-xs font-bold text-red-800 leading-relaxed">
                      İletişime geç isteğiniz onaylanmadan kişinin {(!cv.isEmailPublic && !cv.isPhonePublic) ? 'iletişim bilgilerini' : 'diğer iletişim bilgilerini'} göremezsiniz.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {cv.email && (
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                      </div>
                      {/* Show if Public OR Has Access OR Is Owner */}
                      {(cv.isEmailPublic || hasAccess || isOwner) ? (
                        <a href={`mailto:${cv.email}`} className="hover:text-black hover:underline truncate">{cv.email}</a>
                      ) : (
                        <span className="text-gray-400 select-none blur-[4px]">***************@*****.com</span>
                      )}
                    </div>
                  )}
                  {cv.phone && (
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.57A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                      {/* Show if Public OR Has Access OR Is Owner */}
                      {(cv.isPhonePublic || hasAccess || isOwner) ? (
                        <a href={`tel:${cv.phone}`} className="hover:text-black hover:underline">{cv.phone}</a>
                      ) : (
                        <span className="text-gray-400 select-none blur-[4px]">+90 *** *** ** **</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400 italic">İletişim bilgisi girilmemiş.</p>
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-gray-100 bg-white flex gap-5 sticky bottom-0 z-10 shrink-0">
          {isOwner && cv.workingStatus !== 'active' && (
            <button
              onClick={onJobFound}
              className="flex-[2] bg-[#1f6d78] text-white py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#155e68] transition-all active:scale-95 shadow-lg shadow-[#1f6d78]/20"
            >
              🎉 İŞİMİ BULDUM
            </button>
          )}

          {isOwner ? (
            <>
              <button
                onClick={handleDownload}
                className="flex-1 bg-white border border-[#1f6d78] text-[#1f6d78] py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#1f6d78] hover:text-white transition-all active:scale-95 shadow-xl"
              >
                CV'mi İndir
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-white border border-[#1f6d78] text-[#1f6d78] py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#1f6d78] hover:text-white transition-all active:scale-95 shadow-xl"
              >
                CV'mi Paylaş
              </button>
            </>
          ) : (
            <>
              {!hasAccess && (
                <button
                  onClick={isPending ? onCancelRequest : onRequestAccess}
                  className={`flex-[2] py-5 rounded-full font-black text-base uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] group ${isPending
                    ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:shadow-none'
                    : 'bg-[#1f6d78] text-white hover:bg-[#155e68]'
                    }`}
                >
                  {isPending ? (
                    <>
                      <span className="group-hover:hidden">İstek Gönderildi</span>
                      <span className="hidden group-hover:inline">İsteği İptal Et</span>
                    </>
                  ) : 'İletişime Geç'}
                </button>
              )}

              {hasAccess && (
                <button
                  disabled
                  className="flex-[2] bg-[#1f6d78] text-white py-5 rounded-full font-black text-base uppercase tracking-widest shadow-xl cursor-default"
                >
                  İletişim Bilgileri Açık
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
