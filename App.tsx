
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CV, FilterState, ContactRequest } from './types';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
// import { MOCK_CVS } from './constants'; // No longer needed
import { MOCK_CVS } from './constants';
import Navbar from './components/Navbar';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import BusinessCard from './components/BusinessCard';
import Filters from './components/Filters';
import ProfileModal from './components/ProfileModal';
import CVFormModal from './components/CVFormModal';
import SettingsModal from './components/SettingsModal';

const SortDropdown: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = [
    { id: 'default', label: 'Varsayılan' },
    { id: 'popular', label: "Popüler Cv'ler" },
    { id: 'newest', label: 'Son Oluşturulanlar' },
    { id: 'placed', label: 'İş Bulanlar' }
  ];

  const activeLabel = options.find(o => o.id === value)?.label || 'Varsayılan';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-white border ${isOpen ? 'border-black shadow-md' : 'border-gray-200'} rounded-full px-5 py-2 text-xs font-bold text-gray-800 transition-all hover:border-black active:scale-95`}
      >
        <span>{activeLabel}</span>
        <svg
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[60] animate-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onChange(opt.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-xs font-bold transition-all flex items-center justify-between ${value === opt.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
            >
              {opt.label}
              {value === opt.id && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [isCVFormOpen, setIsCVFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cvList, setCvList] = useState<CV[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    profession: '',
    city: '',
    experience: '',
    language: '',
    languageLevel: '',
    salaryMin: '',
    salaryMax: '',
    skills: [],
    workType: '',
    employmentType: '',
    educationLevel: '',
    graduationStatus: '',
    militaryStatus: '',
    maritalStatus: '',
    disabilityStatus: '',
    noticePeriod: '',
    travelStatus: '',
    driverLicenses: []
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthOpen = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    fetchCVs();
    if (user) {
      fetchSentRequests();
    }
  }, [user]);

  const fetchSentRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('requester_id', user.id);

      if (error) throw error;
      setSentRequests(data || []);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const handleSendRequest = async (targetUserId: string) => {
    if (!user) {
      handleAuthOpen('signup');
      showToast('İletişim isteği göndermek için lütfen önce kayıt olun veya giriş yapın.', 'info');
      return;
    }

    if (user.id === targetUserId) {
      showToast('Kendi kendine iletişim isteği gönderemezsin.', 'info');
      return;
    }

    // Optimistic update
    const tempId = Math.random().toString();
    const newRequest: ContactRequest = {
      id: tempId,
      requester_id: user.id,
      target_user_id: targetUserId,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setSentRequests(prev => [...prev, newRequest]);

    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .insert([{
          requester_id: user.id,
          target_user_id: targetUserId,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        // Revert on error
        setSentRequests(prev => prev.filter(r => r.id !== tempId));
        throw error;
      }

      // Update with real data
      setSentRequests(prev => prev.map(r => r.id === tempId ? data : r));
      showToast('İletişim isteği gönderildi!', 'success');
    } catch (error: any) {
      console.error('Error sending request:', error);
      showToast('İstek gönderilirken hata oluştu: ' + error.message, 'error');
    }
  };

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cvs')
        .select('*');

      if (error) {
        console.error('Error fetching CVs:', error);
      } else {
        // Map Supabase data to CV interface if field names match directly
        // Note: Supabase returns snake_case, our types are camelCase. 
        // We might need a mapper or ensure our SQL schema matches types.
        // Looking at schema: experience_years vs experienceYears. 
        // Let's map it.
        const mappedData: CV[] = (data || []).map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          name: item.name,
          profession: item.profession,
          city: item.city,
          experienceYears: item.experience_years,
          language: item.language,
          languageLevel: item.language_level,
          photoUrl: item.photo_url || 'https://picsum.photos/seed/user-placeholder/100/100', // Default if empty
          salaryMin: item.salary_min,
          salaryMax: item.salary_max,
          about: item.about,
          skills: item.skills || [],
          education: item.education,
          educationLevel: item.education_level,
          graduationStatus: item.graduation_status,
          workType: item.work_type,
          employmentType: item.employment_type,
          militaryStatus: item.military_status,
          maritalStatus: item.marital_status,
          disabilityStatus: item.disability_status,
          driverLicense: item.driver_license,
          travelStatus: item.travel_status,
          noticePeriod: item.notice_period,
          isNew: item.is_new,
          isActive: item.is_active,
          views: item.views,
          isPlaced: item.is_placed,
          email: item.email,
          phone: item.phone,
          isEmailPublic: item.is_email_public,
          isPhonePublic: item.is_phone_public,
          workingStatus: item.working_status,
          references: item.references || []
        }));
        setCvList(mappedData);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentUserCV = useMemo(() => {
    if (!user) return null;
    return cvList.find((cv: any) => cv.userId === user.id);
  }, [user, cvList]);

  const handleCreateCV = async (cvData: Partial<CV>) => {
    if (!user) {
      showToast('CV oluşturmak için giriş yapmalısınız.', 'error');
      return;
    }

    try {
      const dbData = {
        user_id: user.id,
        name: cvData.name,
        profession: cvData.profession,
        city: cvData.city,
        experience_years: cvData.experienceYears,
        language: cvData.language,
        language_level: cvData.languageLevel,
        about: cvData.about,
        skills: cvData.skills,
        salary_min: cvData.salaryMin,
        salary_max: cvData.salaryMax,
        education: cvData.education,
        education_level: cvData.educationLevel,
        graduation_status: cvData.graduationStatus,
        work_type: cvData.workType,
        employment_type: cvData.employmentType,
        military_status: cvData.militaryStatus,
        marital_status: cvData.maritalStatus,
        disability_status: cvData.disabilityStatus,
        driver_license: cvData.driverLicense,
        travel_status: cvData.travelStatus,
        notice_period: cvData.noticePeriod,
        photo_url: cvData.photoUrl || 'https://picsum.photos/seed/user-placeholder/100/100',
        email: cvData.email,
        phone: cvData.phone,
        is_email_public: cvData.isEmailPublic,
        is_phone_public: cvData.isPhonePublic,
        working_status: cvData.workingStatus,
        references: cvData.references
      } as any;

      // Clean up undefined values
      Object.keys(dbData).forEach(key => dbData[key] === undefined && delete dbData[key]);

      let error;

      if (currentUserCV) {
        // Update existing
        const { error: updateError } = await supabase
          .from('cvs')
          .update(dbData)
          .eq('user_id', user.id);
        error = updateError;
        if (!error) showToast('CV başarıyla güncellendi!', 'success');
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('cvs')
          .insert([dbData]);
        error = insertError;
        if (!error) showToast('CV başarıyla oluşturuldu!', 'success');
      }

      if (error) throw error;

      setIsCVFormOpen(false);
      fetchCVs();
    } catch (error: any) {
      console.error('Error saving CV:', error);
      showToast('Hata: ' + error.message, 'error');
    }
  };

  const filteredCVs = useMemo(() => {
    let result = cvList.filter((cv) => {
      // Global Search
      const matchesSearch =
        cv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProfession = !activeFilters.profession || cv.profession === activeFilters.profession;
      const matchesCity = !activeFilters.city || cv.city === activeFilters.city;

      // Experience Logic
      let matchesExperience = true;
      if (activeFilters.experience) {
        if (activeFilters.experience.includes('Stajyer')) matchesExperience = cv.experienceYears < 1;
        else if (activeFilters.experience.includes('Junior')) matchesExperience = cv.experienceYears >= 1 && cv.experienceYears < 3;
        else if (activeFilters.experience.includes('Mid')) matchesExperience = cv.experienceYears >= 3 && cv.experienceYears < 5;
        else if (activeFilters.experience.includes('Senior')) matchesExperience = cv.experienceYears >= 5 && cv.experienceYears < 10;
        else if (activeFilters.experience.includes('Expert')) matchesExperience = cv.experienceYears >= 10;
      }

      const matchesLanguage = !activeFilters.language || cv.language === activeFilters.language;
      const matchesLangLevel = !activeFilters.languageLevel || cv.languageLevel === activeFilters.languageLevel;
      const matchesSalaryMin = activeFilters.salaryMin === '' || cv.salaryMax >= (activeFilters.salaryMin as number);
      const matchesSalaryMax = activeFilters.salaryMax === '' || cv.salaryMin <= (activeFilters.salaryMax as number);
      const matchesSkills = activeFilters.skills.length === 0 || activeFilters.skills.every(s => cv.skills.includes(s));
      const matchesWorkType = !activeFilters.workType || cv.workType === activeFilters.workType;
      const matchesEmpType = !activeFilters.employmentType || cv.employmentType === activeFilters.employmentType;
      const matchesEduLevel = !activeFilters.educationLevel || cv.educationLevel === activeFilters.educationLevel;
      const matchesGradStatus = !activeFilters.graduationStatus || cv.graduationStatus === activeFilters.graduationStatus;
      const matchesMilitary = !activeFilters.militaryStatus || cv.militaryStatus === activeFilters.militaryStatus;
      const matchesMarital = !activeFilters.maritalStatus || cv.maritalStatus === activeFilters.maritalStatus;
      const matchesDisability = !activeFilters.disabilityStatus || cv.disabilityStatus === activeFilters.disabilityStatus;
      const matchesTravel = !activeFilters.travelStatus || cv.travelStatus === activeFilters.travelStatus;
      const matchesDriver = activeFilters.driverLicenses.length === 0 ||
        (cv.driverLicense && activeFilters.driverLicenses.some(l => cv.driverLicense?.includes(l)));

      return matchesSearch && matchesProfession && matchesCity && matchesExperience &&
        matchesLanguage && matchesLangLevel && matchesSalaryMin && matchesSalaryMax &&
        matchesSkills && matchesWorkType && matchesEmpType && matchesEduLevel &&
        matchesGradStatus && matchesMilitary && matchesMarital && matchesDisability &&
        matchesTravel && matchesDriver;
    });

    // Sorting Logic
    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
    } else if (sortBy === 'placed') {
      result = [...result].sort((a, b) => (a.isPlaced === b.isPlaced) ? 0 : a.isPlaced ? -1 : 1);
    }

    return result;
  }, [cvList, searchQuery, activeFilters, sortBy]);

  const handleFilterUpdate = (key: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F5]">
      <Navbar
        onSearch={setSearchQuery}
        onCreateCV={() => setIsCVFormOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCV={!!currentUserCV}
        userPhotoUrl={currentUserCV?.photoUrl}
        onOpenAuth={handleAuthOpen}
        isAuthModalOpen={isAuthModalOpen}
        onCloseAuth={() => setIsAuthModalOpen(false)}
        authMode={authMode}
      />

      <div className="flex-1 flex justify-center pt-14 px-4 md:px-6">
        <div className="max-w-[1440px] w-full flex gap-6 mt-6 pb-12">
          <aside className="hidden lg:block w-[280px] shrink-0">
            <SidebarLeft />
          </aside>

          <section className="flex-1 min-w-0 flex flex-col gap-4">
            <Filters currentFilters={activeFilters} onChange={handleFilterUpdate} />

            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-2 flex items-center justify-between shadow-sm">
              <h2 className="text-sm font-bold text-gray-800">
                Cv Listesi <span className="text-gray-400 font-normal ml-1">({filteredCVs.length} sonuç)</span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sıralama:</span>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredCVs.length > 0 ? (
                filteredCVs.map(cv => {
                  const request = sentRequests.find(r => r.target_user_id === cv.userId);
                  const status = request ? request.status : 'none';

                  return (
                    <BusinessCard
                      key={cv.id}
                      cv={cv}
                      onClick={() => setSelectedCV(cv)}
                    />
                  );
                })
              ) : (
                <div className="bg-white rounded-lg p-16 text-center border border-gray-200 shadow-sm">
                  <p className="text-gray-800 font-bold">Sonuç bulunamadı.</p>
                  <button onClick={() => {
                    setSortBy('default');
                    setActiveFilters({
                      profession: '', city: '', experience: '', language: '', languageLevel: '', salaryMin: '', salaryMax: '',
                      skills: [], workType: '', employmentType: '', educationLevel: '', graduationStatus: '',
                      militaryStatus: '', maritalStatus: '', disabilityStatus: '', noticePeriod: '', travelStatus: '', driverLicenses: []
                    });
                  }} className="mt-4 text-blue-500 font-bold hover:underline">Filtreleri Sıfırla</button>
                </div>
              )}
            </div>
          </section>

          <aside className="hidden md:block w-[280px] shrink-0">
            <SidebarRight />
          </aside>
        </div>
      </div>

      {selectedCV && (
        <ProfileModal
          cv={selectedCV}
          onClose={() => setSelectedCV(null)}
          requestStatus={sentRequests.find(r => r.target_user_id === selectedCV.userId)?.status || 'none'}
          onRequestAccess={() => handleSendRequest(selectedCV.userId)}
        />
      )}
      {isCVFormOpen && <CVFormModal onClose={() => setIsCVFormOpen(false)} onSubmit={handleCreateCV} initialData={currentUserCV || undefined} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default App;
