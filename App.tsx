
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CV, FilterState, ContactRequest, Company, NotificationItem } from './types';
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
import CompanyProfileModal from './components/CompanyProfileModal';
import CVFormModal from './components/CVFormModal';
import Footer from './components/Footer';
import SettingsModal from './components/SettingsModal';
import CompanyFormModal from './components/CompanyFormModal';

const SortDropdown: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = [
    { id: 'default', label: 'Varsayılan' },
    { id: 'newest', label: 'En Yeniler' },
    { id: 'oldest', label: 'En Eskiler' }
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
        className={`flex items-center gap-3 bg-white border ${isOpen ? 'border-[#1f6d78] shadow-md' : 'border-gray-200'} rounded-full px-5 py-2 text-xs font-bold text-gray-800 transition-all hover:border-[#1f6d78] active:scale-95`}
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
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[60] animate-in slide-in-from-top-2 duration-200 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onChange(opt.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-xs font-bold transition-all flex items-center justify-between ${value === opt.id ? 'bg-[#1f6d78]/5 text-[#1f6d78]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1f6d78]'
                }`}
            >
              {opt.label}
              {value === opt.id && <span className="text-[10px] font-black text-black">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const getFriendlyErrorMessage = (error: any): string => {
  const message = error.message || error.toString();

  if (message.includes('Could not find the table') || message.includes('relation "public.companies" does not exist')) {
    return 'Sistem hatası: Veritabanı tablosu bulunamadı. Lütfen "companies" tablosunun oluşturulduğundan emin olun (Migration gerekli).';
  }
  if (message.includes('duplicate key')) {
    return 'Bu kayıt zaten mevcut.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.';
  }
  if (message.includes('JWT') || message.includes('auth')) {
    return 'Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.';
  }

  return 'Bir hata oluştu: ' + message;
};

const App: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [isCVFormOpen, setIsCVFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([]);
  const [generalNotifications, setGeneralNotifications] = useState<NotificationItem[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);
  const [cvList, setCvList] = useState<CV[]>([]);
  const [popularCVs, setPopularCVs] = useState<CV[]>([]);
  const [jobFinders, setJobFinders] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [popularCompanies, setPopularCompanies] = useState<any[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [selectedCompanyProfile, setSelectedCompanyProfile] = useState<Company | null>(null);

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
  const [authRole, setAuthRole] = useState<'job_seeker' | 'employer' | undefined>(undefined);

  const handleAuthOpen = (mode: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => {
    setAuthMode(mode);
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    fetchCVs();
    fetchPopularCVs();
    fetchJobFinders();
    fetchPopularCompanies();
    if (user) {
      if (user.user_metadata?.role === 'employer') {
        fetchCompany();
      }
      fetchSentRequests();
      fetchSentRequests();
      fetchReceivedRequests();
      fetchGeneralNotifications();

      // Realtime Subscriptions
      const notificationsChannel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          () => {
            fetchGeneralNotifications();
          }
        )
        .subscribe();

      const requestsChannel = supabase
        .channel('realtime-requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'contact_requests', filter: `target_user_id=eq.${user.id}` },
          () => {
            fetchReceivedRequests();
          }
        )
        .subscribe();

      // Also subscribe to SENT requests updates (e.g. when approved/rejected by other party)
      const sentRequestsChannel = supabase
        .channel('realtime-sent-requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'contact_requests', filter: `requester_id=eq.${user.id}` },
          () => {
            fetchSentRequests();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsChannel);
        supabase.removeChannel(requestsChannel);
        supabase.removeChannel(sentRequestsChannel);
      };

    } else {
      setActiveCompany(null);
    }
  }, [user]);

  // Handle Incremented View
  const handleCVClick = async (cv: CV) => {
    setSelectedCV(cv);

    // Increment view ONLY if user is NOT the owner
    // If user is not logged in, we still count views (visitor views)
    if (!user || user.id !== cv.userId) {
      try {
        await supabase.rpc('increment_cv_view', { cv_id: cv.id });
        // Optionally refresh stats after some time or optimistic update
      } catch (err) {
        console.error('Failed to increment view', err);
      }
    }
  };

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

  const fetchGeneralNotifications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGeneralNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      fetchGeneralNotifications();
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const fetchPopularCVs = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .order('views', { ascending: false })
        .limit(5);

      if (error) throw error;

      const mapped: CV[] = (data || []).map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        name: item.name || '',
        profession: item.profession || '',
        city: item.city || '',
        experienceYears: item.experience_years || 0,
        language: item.language || '',
        languageLevel: item.language_level || '',
        photoUrl: item.photo_url || '',
        salaryMin: item.salary_min || 0,
        salaryMax: item.salary_max || 0,
        about: item.about || '',
        skills: item.skills || [],
        education: item.education || '',
        educationLevel: item.education_level || '',
        graduationStatus: item.graduation_status || '',
        workType: item.work_type || '',
        employmentType: item.employment_type || '',
        militaryStatus: item.military_status || '',
        maritalStatus: item.marital_status || '',
        disabilityStatus: item.disability_status || '',
        noticePeriod: item.notice_period || '',
        travelStatus: item.travel_status || '',
        driverLicense: item.driver_license || [],
        isNew: item.is_new,
        views: item.views || 0,
        email: item.email,
        phone: item.phone,
        isEmailPublic: item.is_email_public,
        isPhonePublic: item.is_phone_public,
        workingStatus: item.working_status,
        references: item.references || []
      }));
      setPopularCVs(mapped);
    } catch (err) {
      console.error('Error fetching popular cvs:', err);
    }
  };

  const fetchPopularCompanies = async () => {
    try {
      // Direct query to companies table as fallback/primary
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching popular companies:', error);
        return;
      }

      // Map to ensure properties are consistent
      const mapped = (data || []).map((c: any) => ({
        id: c.id,
        name: c.company_name,
        logoUrl: c.logo_url,
        userId: c.user_id,
        description: c.description,
        city: c.city,
        district: c.district,
        country: c.country,
        address: c.address,
        industry: c.industry,
        website: c.website
      }));

      setPopularCompanies(mapped);
    } catch (err) {
      console.error('Error fetching popular companies:', err);
    }
  };


  const fetchJobFinders = async () => {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('working_status', 'active') // active = Working / Found Job
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const mapped: CV[] = (data || []).map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        name: item.name || '',
        profession: item.profession || '',
        city: item.city || '',
        experienceYears: item.experience_years || 0,
        language: item.language || '',
        languageLevel: item.language_level || '',
        photoUrl: item.photo_url || '',
        salaryMin: item.salary_min || 0,
        salaryMax: item.salary_max || 0,
        about: item.about || '',
        skills: item.skills || [],
        education: item.education || '',
        educationLevel: item.education_level || '',
        graduationStatus: item.graduation_status || '',
        workType: item.work_type || '',
        employmentType: item.employment_type || '',
        militaryStatus: item.military_status || '',
        maritalStatus: item.marital_status || '',
        disabilityStatus: item.disability_status || '',
        noticePeriod: item.notice_period || '',
        travelStatus: item.travel_status || '',
        driverLicense: item.driver_license || [],
        isNew: item.is_new,
        views: item.views || 0,
        email: item.email,
        phone: item.phone,
        isEmailPublic: item.is_email_public,
        isPhonePublic: item.is_phone_public,
        workingStatus: item.working_status,
        references: item.references || []
      }));
      setJobFinders(mapped);
    } catch (err) {
      console.error('Error fetching job finders:', err);
    }
  };

  const handleJobFound = async () => {
    if (!currentUserCV) return;

    try {
      const { error } = await supabase
        .from('cvs')
        .update({ working_status: 'active' }) // active = found job
        .eq('id', currentUserCV.id);

      if (error) throw error;

      showToast('Tebrikler! Yeni işinizde başarılar dileriz. 🎉', 'success');

      // Refresh lists
      fetchCVs();
      fetchJobFinders();

      // Update local state and close modal
      if (selectedCV?.id === currentUserCV.id) {
        setSelectedCV(prev => prev ? { ...prev, workingStatus: 'active' } : null);
        setTimeout(() => setSelectedCV(null), 2000); // Close after 2 seconds
      }

    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Bir hata oluştu.', 'error');
    }
  };


  const fetchReceivedRequests = async () => {
    if (!user) return;
    try {
      // 1. Fetch pending requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('contact_requests')
        .select(`
          *,
          requester:profiles!requester_id (
            full_name,
            role,
            avatar_url
          )
        `)
        .eq('target_user_id', user.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      setReceivedRequests(requestsData || []);

      // 2. Fetch general notifications
      const { data: notifData, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (notifError) {
        console.log('Notifications table might not exist yet:', notifError.message);
        // Do not throw here to allow app to function without notifications table
      } else {
        setGeneralNotifications(notifData || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSendRequest = async (targetUserId: string) => {
    if (!user) {
      handleAuthOpen('signup');
      showToast('İletişim isteği göndermek için lütfen önce kayıt olun veya giriş yapın.', 'info');
      return;
    }

    // Check if user is employer and has no company profile
    if (user.user_metadata?.role === 'employer' && !activeCompany) {
      showToast('İletişime geçmek için lütfen önce iş veren profilinizi oluşturun.', 'warning');
      setIsCompanyFormOpen(true);
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
      // 1. Call Secure RPC to Create Request AND Notification
      let senderName = user.user_metadata?.full_name || 'Bir Kullanıcı';
      if (user.user_metadata?.role === 'employer' && activeCompany) {
        senderName = activeCompany.name;
      }

      const { data, error } = await supabase.rpc('create_contact_request_secure', {
        p_target_user_id: targetUserId,
        p_sender_name: senderName
      });

      if (error) {
        setSentRequests(prev => prev.filter(r => r.id !== tempId));
        throw error;
      }

      // RPC returns { id: uuid, status: 'pending' }
      const confirmedRequest = {
        ...newRequest,
        id: (data as any).id,
        status: (data as any).status
      };

      setSentRequests(prev => prev.map(r => r.id === tempId ? confirmedRequest : r));
      showToast('İletişim isteği gönderildi!', 'success');

    } catch (error: any) {
      console.error('Error sending request:', error);
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };

  const handleCancelRequest = async (targetUserId: string) => {
    if (!user) return;

    // Find local request to remove optimistically
    const requestToRemove = sentRequests.find(r => r.target_user_id === targetUserId && r.status === 'pending');

    // Optimistic update
    if (requestToRemove) {
      setSentRequests(prev => prev.filter(r => r.id !== requestToRemove.id));
    } else {
      // Even if local state is missing, try to delete from DB to sync
    }

    try {
      // Use Secure RPC for cancellation to bypass RLS issues
      const { error } = await supabase.rpc('cancel_contact_request_secure', {
        p_target_user_id: targetUserId
      });

      if (error) {
        if (requestToRemove) setSentRequests(prev => [...prev, requestToRemove]); // Revert
        throw error;
      }

      showToast('İletişim isteği geri alındı.', 'info');
    } catch (error) {
      console.error('Error cancelling request:', error);
      showToast('İstek geri alınırken bir hata oluştu.', 'error');
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    // Determine the request being acted upon for notification info
    const relatedRequest = receivedRequests.find(r => r.id === requestId);

    // Optimistic update
    setReceivedRequests(prev => prev.filter(r => r.id !== requestId));

    try {
      // Identify self (the approver)
      let approverName = user?.user_metadata?.full_name || 'Bir Kullanıcı';
      if (user?.user_metadata?.role === 'employer' && activeCompany) {
        approverName = activeCompany.name;
      } else if (currentUserCV) {
        approverName = currentUserCV.name;
      }

      const { error } = await supabase.rpc('respond_to_request_secure', {
        p_request_id: requestId,
        p_action: action,
        p_responder_name: approverName
      });

      if (error) throw error;

      showToast(`İstek ${action === 'approved' ? 'onaylandı' : 'reddedildi'}.`, 'success');

    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Bir hata oluştu.', 'error');
      // Revert optimism
      fetchReceivedRequests();
    }
  };



  const handleMarkNotificationRead = async (id: string) => {
    try {
      setGeneralNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch (e) {
      console.error('Error marking read', e);
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
          name: item.name || '',
          profession: item.profession || '',
          city: item.city || '',
          experienceYears: item.experience_years || 0,
          language: item.language || '',
          languageLevel: item.language_level || '',
          photoUrl: item.photo_url || '',
          salaryMin: item.salary_min || 0,
          salaryMax: item.salary_max || 0,
          about: item.about || '',
          skills: item.skills || [],
          education: item.education || '',
          educationLevel: item.education_level || '',
          graduationStatus: item.graduation_status || '',
          workType: item.work_type || '',
          employmentType: item.employment_type || '',
          militaryStatus: item.military_status || '',
          maritalStatus: item.marital_status || '',
          disabilityStatus: item.disability_status || '',
          driverLicense: item.driver_license || [],
          travelStatus: item.travel_status || '',
          noticePeriod: item.notice_period || '',
          isNew: item.is_new,
          isActive: item.is_active,
          views: item.views || 0,
          isPlaced: item.is_placed,
          email: item.email || '',
          phone: item.phone || '',
          isEmailPublic: item.is_email_public,
          isPhonePublic: item.is_phone_public,
          workingStatus: item.working_status || 'open',
          references: item.references || [],
          created_at: item.created_at
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

  const fetchCompany = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error fetching company:', error);
      }

      if (data && data.length > 0) {
        const company = data[0];
        console.log('Company data fetched:', company);
        setActiveCompany({
          id: company.id,
          userId: company.user_id,
          name: company.company_name,
          description: company.description,
          website: company.website,
          industry: company.industry,
          city: company.city,
          district: company.district,
          country: company.country,
          address: company.address,
          logoUrl: company.logo_url,
          createdAt: company.created_at
        });
      } else {
        console.log('No company data found for user');
        setActiveCompany(null);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    }
  };

  const handleCompanySubmit = async (companyData: Partial<Company>) => {
    if (!user) return;

    try {
      const dbData = {
        user_id: user.id,
        company_name: companyData.name,
        description: companyData.description,
        website: companyData.website,
        industry: companyData.industry,
        city: companyData.city,
        district: companyData.district,
        country: companyData.country,
        address: companyData.address,
        logo_url: companyData.logoUrl
      } as any;

      // Clean up undefined values
      Object.keys(dbData).forEach(key => dbData[key] === undefined && delete dbData[key]);

      let error;
      if (activeCompany) {
        const { error: updateError } = await supabase
          .from('companies')
          .update(dbData)
          .eq('user_id', user.id);
        error = updateError;
        if (!error) showToast('İş veren profili güncellendi!', 'success');
      } else {
        const { error: insertError } = await supabase
          .from('companies')
          .insert([dbData]);
        error = insertError;
        if (!error) showToast('İş veren profili oluşturuldu!', 'success');
      }

      if (error) throw error;
      setIsCompanyFormOpen(false);
      fetchCompany();

    } catch (error: any) {
      console.error('Error saving company:', error);
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };

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
        district: cvData.district,
        experience_years: cvData.experienceYears,
        work_experience: cvData.workExperience,
        education_details: cvData.educationDetails,
        language_details: cvData.languageDetails,
        certificates: cvData.certificates,
        language: cvData.language,
        language_level: cvData.languageLevel,
        about: cvData.about,
        skills: cvData.skills,
        salary_min: cvData.salaryMin,

        salary_max: cvData.salaryMax,
        salary_currency: cvData.salaryCurrency,
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
        photo_url: cvData.photoUrl || '',
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
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };

  const filteredCVs = useMemo(() => {
    let result = cvList.filter((cv) => {
      // Global Search
      const searchLower = searchQuery.toLocaleLowerCase('tr');
      const matchesSearch =
        cv.name.toLocaleLowerCase('tr').includes(searchLower) ||
        cv.profession.toLocaleLowerCase('tr').includes(searchLower) ||
        cv.city.toLocaleLowerCase('tr').includes(searchLower) ||
        cv.skills.some(s => s.toLocaleLowerCase('tr').includes(searchLower));

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
    // 3. Filter by Working Status (Default: Show only 'open' / Job Seekers)
    // IMPORTANT: Users with 'active' status (Found Job) should NOT appear in main list
    result = result.filter(cv => cv.workingStatus === 'open');

    // Sorting Logic
    // Sorting Logic
    // Sorting Logic
    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    }

    return result;
  }, [cvList, searchQuery, activeFilters, sortBy]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, sortBy]);

  const totalPages = Math.ceil(filteredCVs.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCVs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCVs, currentPage]);

  const availableProfessions = useMemo(() => {
    const unique = new Set(cvList.map(cv => cv.profession).filter(Boolean));
    return Array.from(unique).sort().map(p => ({ label: p }));
  }, [cvList]);

  const availableCities = useMemo(() => {
    const unique = new Set(cvList.map(cv => cv.city).filter(Boolean));
    return Array.from(unique).sort().map(c => ({ label: c }));
  }, [cvList]);

  const handleFilterUpdate = (key: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRequestResponse = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state by removing the handled request from the list (so it disappears from notification list)
      // And update sentRequests if necessary? 
      // Actually receivedRequests are the ones being approved/rejected.
      setReceivedRequests(prev => prev.filter(req => req.id !== requestId));

      showToast(action === 'approved' ? 'İstek onaylandı' : 'İstek reddedildi', 'success');

      // Also invalidate visible cache if necessary? No need, local state updated.
    } catch (error: any) {
      console.error('Error updating request:', error);
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };

  const professionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    cvList.forEach(cv => {
      if (cv.profession) {
        counts[cv.profession] = (counts[cv.profession] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [cvList]);

  const cityStats = useMemo(() => {
    const counts: Record<string, number> = {};
    cvList.forEach(cv => {
      if (cv.city) {
        counts[cv.city] = (counts[cv.city] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [cvList]);

  const weeklyRisingStats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentCVs = cvList.filter(cv => {
      if (!cv.created_at) return false;
      return new Date(cv.created_at) > oneWeekAgo;
    });

    const counts: Record<string, number> = {};
    recentCVs.forEach(cv => {
      if (cv.profession) {
        counts[cv.profession] = (counts[cv.profession] || 0) + 1;
      }
    });

    const stats = Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3

    if (stats.length === 0) return [];

    const maxCount = Math.max(...stats.map(s => s.count));

    return stats.map(s => ({
      label: s.label,
      growth: Math.round((s.count / maxCount) * 100)
    }));
  }, [cvList]);

  // Platform Statistics Calculation
  const [approvedRequestCount, setApprovedRequestCount] = useState(0);

  const platformStats = useMemo(() => {
    // 1. Total CVs
    const totalCVs = cvList.length;

    // 2. Active Job Seekers (workingStatus === 'open')
    const activeJobSeekers = cvList.filter(cv => cv.workingStatus === 'open').length;

    // 3. New This Week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = cvList.filter(cv => cv.created_at && new Date(cv.created_at) > oneWeekAgo).length;

    // 4. Total Views
    const totalViews = cvList.reduce((acc, cv) => acc + (cv.views || 0), 0);

    return [
      { label: 'Toplam CV', value: totalCVs.toLocaleString('tr-TR') },
      { label: 'Aktif İş Arayan', value: activeJobSeekers.toLocaleString('tr-TR') },
      { label: 'Bu Hafta Yeni', value: `+${newThisWeek}` },
      { label: 'Toplam Görüntülenme', value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString() },
      { label: 'Başarılı Eşleşme', value: approvedRequestCount.toLocaleString('tr-TR') }
    ];
  }, [cvList, approvedRequestCount]);

  useEffect(() => {
    // Fetch Global Approved Requests for "Başarılı Eşleşme"
    const fetchApprovedCount = async () => {
      const { count } = await supabase
        .from('contact_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (count !== null) setApprovedRequestCount(count);
    };

    fetchApprovedCount();
  }, []); // Run once on mount or consider polling if needed

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F5]">
      <Navbar
        onSearch={setSearchQuery}
        onCreateCV={() => setIsCVFormOpen(true)}
        onOpenCompanyProfile={() => {
          fetchCompany();
          setIsCompanyFormOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCV={!!currentUserCV}
        userPhotoUrl={currentUserCV?.photoUrl || activeCompany?.logoUrl}

        // Notifications Props
        notificationCount={receivedRequests.length + generalNotifications.filter(n => !n.is_read).length}
        notifications={[...receivedRequests, ...generalNotifications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
        onNotificationAction={handleRequestAction}
        onMarkNotificationRead={handleMarkNotificationRead}

        onOpenAuth={(mode, role) => handleAuthOpen(mode, role)}
        isAuthModalOpen={isAuthModalOpen}
        onCloseAuth={() => setIsAuthModalOpen(false)}
        authMode={authMode}
        authRole={authRole}
      />


      <div className="flex-1 flex justify-center pt-20 px-4 md:px-6">
        <div className="max-w-[1440px] w-full flex items-start gap-6 pb-12">
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[80px] h-fit pb-4">
            <SidebarLeft
              popularProfessions={professionStats}
              popularCities={cityStats}
              weeklyTrends={weeklyRisingStats}
              platformStats={platformStats}
              jobFinders={jobFinders}
            />
          </aside>

          <aside className="hidden xl:block w-[304px] shrink-0 sticky top-[80px] h-fit pb-4 order-last">
            <SidebarRight
              popularCVs={popularCVs}
              popularCompanies={popularCompanies}
              onCVClick={handleCVClick}
              onCompanyClick={(company) => setSelectedCompanyProfile(company)}
            />
          </aside>

          <section className="flex-1 min-w-0 flex flex-col gap-4">
            <Filters
              currentFilters={activeFilters}
              onChange={handleFilterUpdate}
              availableProfessions={availableProfessions}
              availableCities={availableCities}
            />

            <div className="bg-white rounded-2xl border border-gray-200 px-6 py-3 mb-2 flex items-center justify-between shadow-sm">
              <h2 className="text-sm font-bold text-[#1f6d78]">
                Kartvizid Listesi <span className="text-gray-400 font-normal ml-1">({filteredCVs.length} sonuç)</span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sıralama:</span>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {currentItems.length > 0 ? (
                currentItems.map(cv => {
                  const request = sentRequests.find(r => r.target_user_id === cv.userId);
                  const status = request ? request.status : 'none';

                  return (
                    <BusinessCard
                      key={cv.id}
                      cv={cv}
                      onClick={() => handleCVClick(cv)}
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

            {/* Pagination Controls */}
            {filteredCVs.length > ITEMS_PER_PAGE && (
              <div className="mt-6 flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-black border border-gray-200 hover:bg-black hover:text-white hover:border-black shadow-sm'
                    }`}
                >
                  ← Önceki
                </button>

                <span className="text-sm font-medium text-gray-500">
                  Sayfa {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-black border border-gray-200 hover:bg-[#1f6d78] hover:text-white hover:border-[#1f6d78] shadow-sm'
                    }`}
                >
                  Sonraki →
                </button>
              </div>
            )}
          </section>


        </div>
      </div>

      <Footer />



      {selectedCV && (
        <ProfileModal
          cv={selectedCV}
          onClose={() => setSelectedCV(null)}
          requestStatus={sentRequests.find(r => r.target_user_id === selectedCV.userId)?.status || 'none'}
          onRequestAccess={() => handleSendRequest(selectedCV.userId)}
          onCancelRequest={() => handleCancelRequest(selectedCV.userId)}
          onJobFound={handleJobFound}
        />
      )}
      {isCVFormOpen && (
        <CVFormModal
          onClose={() => setIsCVFormOpen(false)}
          onSubmit={handleCreateCV}
          initialData={currentUserCV || undefined}
          availableCities={availableCities}
        />
      )}
      {isCompanyFormOpen && (
        <CompanyFormModal
          onClose={() => setIsCompanyFormOpen(false)}
          onSubmit={handleCompanySubmit}
          initialData={activeCompany || undefined}
          availableCities={availableCities}
        />
      )}
      {selectedCompanyProfile && (
        <CompanyProfileModal
          company={selectedCompanyProfile}
          onClose={() => setSelectedCompanyProfile(null)}
        />
      )}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default App;
