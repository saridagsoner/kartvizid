
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CV, FilterState, ContactRequest, Company, NotificationItem } from './types';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
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
import SortDropdown from './components/SortDropdown';
import MobileBottomNav from './components/MobileBottomNav';
import NotificationsModal from './components/NotificationsModal';
import JobSuccessModal from './components/JobSuccessModal';
import { BusinessCardSkeleton } from './components/Skeleton';
import SavedCVsModal from './components/SavedCVsModal';
import MobileMenuDrawer from './components/MobileMenuDrawer';

// SortDropdown moved to components/SortDropdown.tsx

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
  const { t } = useLanguage();
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
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [activeModalRequest, setActiveModalRequest] = useState<ContactRequest | null>(null);
  /* REMOVING DUPLICATE DECLARATION */
  const [activeModalRequestId, setActiveModalRequestId] = useState<string | null>(null);
  const [isJobSuccessOpen, setIsJobSuccessOpen] = useState(false);
  const [isSavedCVsOpen, setIsSavedCVsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleAuthOpen = (mode: 'signin' | 'signup', role?: 'job_seeker' | 'employer') => {
    setAuthMode(mode);
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const handleOpenSavedCVs = () => {
    setIsSavedCVsOpen(true);
  };

  const handleViewSavedCV = async (cvId: string) => {
    // Try to find in current list first
    const existing = cvList.find(c => c.id === cvId);
    if (existing) {
      setSelectedCV(existing);
      return;
    }

    // Otherwise fetch
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cvs')
        .select(`
          *,
          languageDetails:cv_languages(*),
          educationDetails:cv_education(*),
          workExperience:cv_work_experience(*),
          internshipDetails:cv_internships(*),
          certificates:cv_certificates(*),
          references:cv_references(*)
        `)
        .eq('id', cvId)
        .single();

      if (error) throw error;
      if (data) setSelectedCV(data);
    } catch (e) {
      console.error('Error fetching CV:', e);
      showToast('CV detayları alınamadı.', 'error');
    } finally {
      setLoading(false);
    }
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
      fetchReceivedRequests();
      fetchGeneralNotifications();
      fixOldNotifications(); // Auto-fix legacy notifications

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
            fetchGeneralNotifications(); // Trigger this to update statuses in notifications list
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

  // Listen for custom "open-profile" event (triggered by NotificationDropdown)
  useEffect(() => {
    const handleOpenProfileEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { id, role, requestId } = customEvent.detail;
        handleOpenProfile(id, role, requestId);


      }
    };

    window.addEventListener('open-profile', handleOpenProfileEvent);
    return () => {
      window.removeEventListener('open-profile', handleOpenProfileEvent);
    };
  }, []);

  // Ensure request status is available for the modal
  useEffect(() => {
    let isMounted = true;
    setActiveModalRequest(null); // Reset when profile changes

    if (selectedCompanyProfile && user) {
      const checkRequest = async () => {
        // Fetch logic: Use explicit request ID if provided (from notification), otherwise fallback to User relationship
        let query = supabase.from('contact_requests').select('*');

        if (activeModalRequestId) {
          query = query.eq('id', activeModalRequestId);
        } else {
          // Fallback: Check if Company sent request to User
          query = query
            .eq('requester_id', selectedCompanyProfile.userId)
            .eq('target_user_id', user.id);
        }

        const { data } = await query
          .in('status', ['pending', 'approved', 'rejected'])
          .maybeSingle();

        if (isMounted) {
          if (data && activeModalRequestId) setActiveModalRequestId(data.id); // Ensure ID consistency
          if (data) setActiveModalRequest(data as any);
          else setActiveModalRequest(null);
        }
      };
      checkRequest();
    }
    return () => { isMounted = false; };
  }, [selectedCompanyProfile, user, activeModalRequestId]);

  // Handle Incremented View
  const handleCVClick = async (cv: CV) => {
    setSelectedCV(cv);

    // Increment view ONLY if user is NOT the owner
    // If user is not logged in, we still count views (visitor views)
    if (!user || user.id !== cv.userId) {
      // Optimistic Update
      setCvList(prevList => prevList.map(item =>
        item.id === cv.id ? { ...item, views: (item.views || 0) + 1 } : item
      ));

      try {
        await supabase.rpc('increment_cv_views', { target_cv_id: cv.id });
      } catch (err) {
        console.error('Failed to increment views:', err);
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
      // 1. Fetch notifications with sender profile using JOIN (Fast & Atomic)
      const { data: notificationsData, error: notifError } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!sender_id (
            id,
            full_name,
            role,
            avatar_url,
            companies ( company_name, logo_url ),
            cvs ( name, photo_url )
          )
        `)
        .eq('user_id', user.id)
        .eq('is_visible', true) // Only fetch visible notifications
        .order('created_at', { ascending: false })
        .limit(50);

      // Removed debug log
      if (notifError) throw notifError;

      if (!notificationsData || notificationsData.length === 0) {
        setGeneralNotifications([]);
        return;
      }

      // 2. Fetch status for related contact requests to avoid stale notifications
      const requestIds = notificationsData
        .filter(n => n.type === 'contact_request_received' && n.related_id)
        .map(n => n.related_id);

      let requestStatusMap: Record<string, string> = {};
      if (requestIds.length > 0) {
        const { data: reqs } = await supabase
          .from('contact_requests')
          .select('id, status')
          .in('id', requestIds);

        if (reqs) {
          reqs.forEach(r => requestStatusMap[r.id] = r.status);
        }
      }

      // 3. Map final data (Sender is already populated by JOIN)
      // MANUAL MERGE FIX: Fetch companies and cvs directly to ensure images loading
      const senderIds = notificationsData
        .map(n => n.sender_id)
        .filter(id => id ? true : false);

      const uniqueSenderIds = Array.from(new Set(senderIds));

      if (uniqueSenderIds.length > 0) {
        // Fetch Companies
        const { data: companies } = await supabase
          .from('companies')
          .select('user_id, company_name, logo_url')
          .in('user_id', uniqueSenderIds);

        // Fetch CVs
        const { data: cvs } = await supabase
          .from('cvs')
          .select('user_id, name, photo_url')
          .in('user_id', uniqueSenderIds); // Ensure strict check

        // Merge manually
        notificationsData.forEach(n => {
          if (!n.sender && n.sender_id) {
            n.sender = { id: n.sender_id };
          }
          if (n.sender) {
            const co = companies?.find(c => c.user_id === n.sender_id);
            const cv = cvs?.find(c => c.user_id === n.sender_id);

            if (co) n.sender.companies = [co];
            if (cv) n.sender.cvs = [cv];
          }
        });
      }

      const mergedNotifications = notificationsData.map(n => ({
        ...n,
        requestStatus: n.related_id ? requestStatusMap[n.related_id] : undefined
      }));

      setGeneralNotifications(mergedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Helper to backfill sender_id for old notifications
  const fixOldNotifications = async () => {
    if (!user) return;
    try {
      // Find notifications with missing sender_id but having related_id
      const { data: badNotifs } = await supabase
        .from('notifications')
        .select('id, related_id, type')
        .is('sender_id', null)
        .not('related_id', 'is', null)
        .eq('user_id', user.id);

      if (!badNotifs || badNotifs.length === 0) return;

      console.log('Backfilling sender_id for old notifications...', badNotifs.length);

      for (const notif of badNotifs) {
        // Fetch related request to find who the other party was
        const { data: request } = await supabase
          .from('contact_requests')
          .select('requester_id, target_user_id')
          .eq('id', notif.related_id)
          .maybeSingle();

        if (request) {
          let senderId = null;

          // Logic: The "other" person is the sender
          if (user.id === request.target_user_id) {
            senderId = request.requester_id; // Incoming request
          } else if (user.id === request.requester_id) {
            senderId = request.target_user_id; // Response to my request
          }

          if (senderId) {
            await supabase
              .from('notifications')
              .update({ sender_id: senderId })
              .eq('id', notif.id);
          }
        }
      }

      // Refresh after fixing
      if (badNotifs.length > 0) {
        fetchGeneralNotifications();
      }
    } catch (err) {
      console.error('Auto-fix notifications error:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!user) return;
    try {
      // Clear Notifications: Soft Delete (Hide)
      const { error } = await supabase
        .from('notifications')
        .update({ is_visible: false })
        .eq('user_id', user.id);

      if (error) throw error;

      // Optimistic update: Clear list except pending requests (which are properly separated now)
      setGeneralNotifications([]);
      showToast('Bildirimler temizlendi.', 'success');
    } catch (error: any) {
      console.error('Error clearing notifications:', error);
      showToast('Bildirimler silinemedi: ' + error.message, 'error');
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

      // Refresh lists
      fetchCVs();
      fetchJobFinders();

      // Update local state and close modal
      // Update local state and close modal
      if (selectedCV?.id === currentUserCV.id) {
        setSelectedCV(prev => prev ? { ...prev, workingStatus: 'active' } : null);
        setSelectedCV(null); // Close profile immediately
        setIsJobSuccessOpen(true); // Show success modal
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
              id,
              full_name,
              role,
              avatar_url,
              companies (
                company_name,
                logo_url
              ),
              cvs (
                name
              )
            )
          `)
        .eq('target_user_id', user.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      // MANUAL MERGE FIX: Fetch companies and cvs directly for requests too
      if (requestsData && requestsData.length > 0) {
        const requesterIds = requestsData
          .map(r => r.requester_id)
          .filter(id => id ? true : false);

        const uniqueRequesterIds = Array.from(new Set(requesterIds));

        if (uniqueRequesterIds.length > 0) {
          const { data: companies } = await supabase
            .from('companies')
            .select('user_id, company_name, logo_url')
            .in('user_id', uniqueRequesterIds);

          const { data: cvs } = await supabase
            .from('cvs')
            .select('user_id, name, photo_url')
            .in('user_id', uniqueRequesterIds);

          requestsData.forEach(r => {
            if (!r.requester && r.requester_id) {
              r.requester = { id: r.requester_id };
            }
            if (r.requester) {
              const co = companies?.find(c => c.user_id === r.requester_id);
              const cv = cvs?.find(c => c.user_id === r.requester_id);

              if (co) r.requester.companies = [co];
              if (cv) r.requester.cvs = [cv];
            }
          });
        }
      }

      setReceivedRequests(requestsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOpenProfile = async (userId: string, role?: string, requestId?: string) => {
    try {
      let found = false;

      // Helper to open company
      const openCompany = async () => {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          const company: Company = {
            id: data.id,
            userId: data.user_id,
            name: data.company_name,
            description: data.description,
            website: data.website,
            industry: data.industry,
            city: data.city,
            district: data.district,
            country: data.country,
            address: data.address,
            logoUrl: data.logo_url,
            createdAt: data.created_at
          };
          setSelectedCompanyProfile(company);
          if (requestId) setActiveModalRequestId(requestId);
          return true;
        }
        return false;
      };

      // Helper to open CV
      const openCV = async () => {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          const cv: CV = {
            id: data.id,
            userId: data.user_id,
            name: data.name || '',
            profession: data.profession || '',
            city: data.city || '',
            district: data.district,
            experienceYears: data.experience_years || 0,
            language: data.language || '',
            languageLevel: data.language_level,
            photoUrl: data.photo_url || '',
            salaryMin: data.salary_min || 0,
            salaryMax: data.salary_max || 0,
            about: data.about || '',
            skills: data.skills || [],
            education: data.education || '',
            educationLevel: data.education_level || '',
            graduationStatus: data.graduation_status || '',
            workType: data.work_type || '',
            employmentType: data.employment_type || '',
            militaryStatus: data.military_status || '',
            maritalStatus: data.marital_status || '',
            disabilityStatus: data.disability_status || '',
            noticePeriod: data.notice_period || '',
            travelStatus: data.travel_status || '',
            driverLicense: data.driver_license || [],
            isNew: data.is_new,
            views: data.views || 0,
            email: data.email,
            phone: data.phone,
            isEmailPublic: data.is_email_public,
            isPhonePublic: data.is_phone_public,
            workingStatus: data.working_status,
            references: data.references || []
          };
          setSelectedCV(cv);
          return true;
        }
        return false;
      };

      // Smart Logic: Try based on role, then fallback
      if (role === 'employer') {
        found = await openCompany();
        if (!found) found = await openCV(); // Fallback
      } else if (role === 'job_seeker') {
        found = await openCV();
        if (!found) found = await openCompany(); // Fallback
      } else {
        // No role known, try both
        found = await openCV();
        if (!found) found = await openCompany();
      }

      if (!found) {
        showToast('Kullanıcı profili bulunamadı.', 'error');
      }

    } catch (err) {
      console.error('Error opening profile:', err);
      showToast('Bir hata oluştu.', 'error');
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
    // 1. Determine request details (check local state first, then DB)
    let relatedRequest = receivedRequests.find(r => r.id === requestId);

    // IMPORTANT: If acting from "All Notifications" modal, local 'receivedRequests' might be empty or stale.
    // So we MUST fetch it if missing to ensure we know who to notify.
    if (!relatedRequest) {
      try {
        const { data: fetchedReq } = await supabase
          .from('contact_requests')
          .select('*')
          .eq('id', requestId)
          .single();
        if (fetchedReq) relatedRequest = fetchedReq;
      } catch (e) {
        console.error('Error fetching request details for action:', e);
      }
    }

    // Optimistic update: Update status instead of removing
    setReceivedRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: action } : r));
    setGeneralNotifications(prev => prev.map(n => n.related_id === requestId ? { ...n, requestStatus: action } : n));

    try {
      // Identify self (the approver)
      let approverName = 'Bir Kullanıcı';

      // Determine correct name
      if (activeCompany?.name) {
        approverName = activeCompany.name;
      } else if (currentUserCV?.name) {
        approverName = currentUserCV.name;
      } else if (user?.user_metadata?.full_name) {
        approverName = user.user_metadata.full_name;
      } else if (user?.email) {
        approverName = user.email.split('@')[0];
      }

      // Try RPC first
      const { error: rpcError } = await supabase.rpc('respond_to_request_secure', {
        p_request_id: requestId,
        p_action: action,
        p_responder_name: approverName
      });

      if (rpcError) {
        console.warn('RPC failed, trying direct update...', rpcError);

        // Fallback: Direct Update (if RLS allows)
        // Fallback: Direct Update (if RLS allows)
        // Database Trigger 'on_contact_request_events' will handle the notification automatically.
        const { error: directError } = await supabase
          .from('contact_requests')
          .update({ status: action, updated_at: new Date().toISOString() })
          .eq('id', requestId);

        if (directError) throw directError;
      }

      showToast(`İstek ${action === 'approved' ? 'onaylandı' : 'reddedildi'}.`, 'success');

      // Refresh data to ensure sync
      fetchReceivedRequests();

    } catch (error: any) {
      console.error('Error updating status:', error);
      // Show specific error message for debugging
      const errorMessage = error?.message || 'Bir hata oluştu.';
      showToast(`Hata: ${errorMessage} `, 'error');
      // Revert optimism if failed
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
          district: item.district || '',
          experienceYears: item.experience_years || 0,
          experienceMonths: item.experience_months || 0,
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
          // Map new JSONB columns
          workExperience: item.work_experience || [],
          internshipDetails: item.internship_details || [],
          educationDetails: item.education_details || [],
          languageDetails: item.language_details || [],
          certificates: item.certificates || [],
          preferredCity: item.preferred_city,
          preferredRoles: item.preferred_roles || [],
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

  const handleCreateCV = async (cvData: Partial<CV>, consentGiven?: boolean) => {
    if (!user) {
      showToast('CV oluşturmak için giriş yapmalısınız.', 'error');
      return;
    }

    try {
      if (consentGiven) {
        // Update profile with KVKK consent
        const { error: consentError } = await supabase
          .from('profiles')
          .update({
            kvkk_consent: true,
            kvkk_consent_date: new Date().toISOString()
          })
          .eq('id', user.id);

        if (consentError) {
          console.error('Error saving KVKK consent:', consentError);
          // Optionally continue or throw? Continuing seems safer for UX, but logging is key.
        } else {
          console.log('KVKK consent saved successfully');
        }
      }

      const dbData = {
        user_id: user.id,
        name: cvData.name,
        profession: cvData.profession,
        city: cvData.city,
        district: cvData.district,
        experience_years: cvData.experienceYears,
        experience_months: cvData.experienceMonths,
        work_experience: cvData.workExperience,
        internship_details: cvData.internshipDetails,
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
        references: cvData.references,
        preferred_city: cvData.preferredCity,
        preferred_roles: cvData.preferredRoles
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

      const matchesProfession = !activeFilters.profession || cv.profession?.split(',').map(p => p.trim()).includes(activeFilters.profession);
      const matchesCity = !activeFilters.city || cv.city === activeFilters.city;

      // Experience Logic
      let matchesExperience = true;
      if (activeFilters.experience) {
        // Calculate total years with decimal (e.g., 2.5 years)
        const totalYears = (cv.experienceYears || 0) + ((cv.experienceMonths || 0) / 12);

        if (activeFilters.experience.includes('Stajyer')) matchesExperience = totalYears < 1;
        else if (activeFilters.experience.includes('Junior')) matchesExperience = totalYears >= 1 && totalYears < 3;
        else if (activeFilters.experience.includes('Orta')) matchesExperience = totalYears >= 3 && totalYears < 5;
        else if (activeFilters.experience.includes('Kıdemli')) matchesExperience = totalYears >= 5 && totalYears < 10;
        else if (activeFilters.experience.includes('Uzman')) matchesExperience = totalYears >= 10;
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
    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    } else if (sortBy === 'default') {
      // Default = Popularity (Most Views)
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
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
    const allProfessions = cvList.flatMap(cv =>
      cv.profession?.split(',').map(p => p.trim()).filter(Boolean) || []
    );
    const unique = new Set(allProfessions);
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
        // Split by comma and count each unique profession for that user
        const profs = cv.profession.split(',').map(p => p.trim()).filter(Boolean);
        profs.forEach(p => {
          counts[p] = (counts[p] || 0) + 1;
        });
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
        const profs = cv.profession.split(',').map(p => p.trim()).filter(Boolean);
        profs.forEach(p => {
          counts[p] = (counts[p] || 0) + 1;
        });
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
      { label: t('stats.total_cv'), value: totalCVs.toLocaleString('tr-TR') },
      { label: t('stats.active_seekers'), value: activeJobSeekers.toLocaleString('tr-TR') },
      { label: t('stats.new_this_week'), value: `+ ${newThisWeek} ` },
      { label: t('stats.total_views'), value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)} k` : totalViews.toString() },
      { label: t('stats.matches'), value: approvedRequestCount.toLocaleString('tr-TR') }
    ];
  }, [cvList, approvedRequestCount, t]);

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
    <div className="min-h-screen flex flex-col bg-white sm:bg-[#F0F2F5] dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">


      // ... inside render
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
        notificationCount={receivedRequests.filter(r => r.status === 'pending').length + generalNotifications.filter(n => !n.is_read && !receivedRequests.some(r => r.id === n.related_id)).length}
        notifications={[
          ...receivedRequests,
          ...generalNotifications.filter(n => !receivedRequests.some(r => r.id === n.related_id))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
        onNotificationAction={handleRequestAction}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}

        onOpenProfile={handleOpenProfile}
        onViewAll={() => setIsNotificationsModalOpen(true)}

        onOpenAuth={(mode, role) => handleAuthOpen(mode, role)}
        isAuthModalOpen={isAuthModalOpen}
        onCloseAuth={() => setIsAuthModalOpen(false)}
        authMode={authMode}
        authRole={authRole}
        onOpenSavedCVs={handleOpenSavedCVs}
      />

      {/* ... previous modals ... */}

      {isNotificationsModalOpen && (
        <NotificationsModal
          onClose={() => setIsNotificationsModalOpen(false)}
          notifications={[
            ...receivedRequests,
            ...generalNotifications.filter(n => !receivedRequests.some(r => r.id === n.related_id))
          ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
          onAction={handleRequestAction}
          onMarkRead={markNotificationRead}
          onMarkAllRead={markAllNotificationsRead}
          onOpenProfile={handleOpenProfile}
        />
      )}


      <div className="flex-1 flex justify-center pt-[72px] px-2 md:px-6">
        <div className="max-w-[1440px] w-full flex items-start gap-6 pb-12">
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[72px] h-fit pb-4">
            <SidebarLeft
              popularProfessions={professionStats}
              popularCities={cityStats}
              weeklyTrends={weeklyRisingStats}
              platformStats={platformStats}
              jobFinders={jobFinders}
              loading={loading}
            />
          </aside>





          <section className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Mobile Search Bar + Filter Toggle */}
            <div className="block sm:hidden w-full mb-0 -mt-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.search_placeholder')}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:border-[#1f6d78] dark:focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#1f6d78] dark:focus:ring-[#2dd4bf] transition-all shadow-sm"
                  />
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`flex items-center justify-center w-[46px] h-[46px] rounded-2xl border transition-all shadow-sm ${showMobileFilters ? 'bg-[#1f6d78] border-[#1f6d78] text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-[#1f6d78] hover:text-[#1f6d78]'}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Header (Kartvizidler + Sort) */}
            <div className="flex sm:hidden items-end justify-between px-2 mt-2 mb-0.5">
              <h2 className="text-[10px] font-black text-black uppercase tracking-widest">
                KARTVİZİD LİSTESİ
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">{t('feed.sort')}:</span>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Filters Section - Visible on Mobile if Toggled */}
            <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
              <Filters
                currentFilters={activeFilters}
                onChange={handleFilterUpdate}
                availableProfessions={availableProfessions}
                availableCities={availableCities}
                showOnMobile={showMobileFilters}
                mobileSort={
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">{t('feed.sort')}:</span>
                    <SortDropdown value={sortBy} onChange={setSortBy} />
                  </div>
                }
              />
            </div>

            <div className="hidden sm:flex bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-2 sm:px-6 sm:py-3 mb-2 flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 shadow-sm transition-colors duration-300">
              <h2 className="text-xs sm:text-sm font-bold text-[#1f6d78] dark:text-white">
                {t('feed.list_title')} <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({filteredCVs.length} sonuç)</span>
              </h2>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('feed.sort')}:</span>
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
              ) : loading ? (
                <>
                  <BusinessCardSkeleton />
                  <BusinessCardSkeleton />
                  <BusinessCardSkeleton />
                  <BusinessCardSkeleton />
                  <BusinessCardSkeleton />
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-16 text-center border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                  <p className="text-gray-800 dark:text-white font-bold">{t('feed.no_results')}</p>
                  <button onClick={() => {
                    setSortBy('default');
                    setActiveFilters({
                      profession: '', city: '', experience: '', language: '', languageLevel: '', salaryMin: '', salaryMax: '',
                      skills: [], workType: '', employmentType: '', educationLevel: '', graduationStatus: '',
                      militaryStatus: '', maritalStatus: '', disabilityStatus: '', noticePeriod: '', travelStatus: '', driverLicenses: []
                    });
                  }} className="mt-4 text-blue-500 font-bold hover:underline">{t('feed.reset_filters')}</button>
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
                    } `}
                >
                  ← {t('feed.prev')}
                </button>

                <span className="text-sm font-medium text-gray-500">
                  {t('feed.page')} {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-black border border-gray-200 hover:bg-[#1f6d78] hover:text-white hover:border-[#1f6d78] shadow-sm'
                    } `}
                >
                  {t('feed.next')} →
                </button>
              </div>
            )}
          </section>

          <aside className="hidden xl:block w-[304px] shrink-0 sticky top-[72px] self-start h-fit pb-4">
            <SidebarRight
              popularCVs={popularCVs}
              popularCompanies={popularCompanies}
              onCVClick={handleCVClick}
              onCompanyClick={(company) => setSelectedCompanyProfile(company)}
              loading={loading}
            />
          </aside>


        </div>
      </div>

      <Footer />



      {
        selectedCV && (
          <ProfileModal
            cv={selectedCV}
            onClose={() => setSelectedCV(null)}
            requestStatus={sentRequests.find(r => r.target_user_id === selectedCV.userId)?.status || 'none'}
            onRequestAccess={() => handleSendRequest(selectedCV.userId)}
            onCancelRequest={() => handleCancelRequest(selectedCV.userId)}
            onJobFound={handleJobFound}
          />
        )
      }
      {
        isCVFormOpen && (
          <CVFormModal
            onClose={() => setIsCVFormOpen(false)}
            onSubmit={handleCreateCV}
            initialData={currentUserCV || undefined}
            availableCities={availableCities}
          />
        )
      }
      {
        isCompanyFormOpen && (
          <CompanyFormModal
            onClose={() => setIsCompanyFormOpen(false)}
            onSubmit={handleCompanySubmit}
            initialData={activeCompany || undefined}
            availableCities={availableCities}
          />
        )
      }
      {
        selectedCompanyProfile && (
          <CompanyProfileModal
            company={selectedCompanyProfile}
            onClose={() => { setSelectedCompanyProfile(null); setActiveModalRequestId(null); }}
            requestStatus={activeModalRequest?.status}
            requestId={activeModalRequest?.id}
            onAction={async (id, action) => {
              await handleRequestAction(id, action);
              // Update local modal state immediately
              setActiveModalRequest(prev => prev ? { ...prev, status: action } : null);
            }}
            onRevoke={async (id) => {
              await handleRequestAction(id, 'rejected');
              // Update local modal state immediately
              setActiveModalRequest(prev => prev ? { ...prev, status: 'rejected' } : null);
            }}
          />
        )
      }
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}

      {/* Mobile Bottom Navigation - Only for logged in users */}
      {/* Mobile Bottom Navigation - Visible for all users */}
      <MobileBottomNav
        user={user}
        onSearch={(val) => {
          setSearchQuery(val);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCreateCV={() => {
          if (!user) {
            handleAuthOpen('signin');
            return;
          }
          setIsCVFormOpen(true);
        }}
        onOpenCompanyProfile={() => {
          if (!user) {
            handleAuthOpen('signin', 'employer');
            return;
          }
          setIsCompanyFormOpen(true);
        }}
        onOpenSettings={() => {
          if (!user) {
            handleAuthOpen('signin');
            return;
          }
          setIsSettingsOpen(true);
        }}
        hasCV={!!currentUserCV}
        userPhotoUrl={user?.user_metadata?.avatar_url || (currentUserCV?.photoUrl)}
        notificationCount={generalNotifications.filter(n => !n.is_read).length}
        notifications={generalNotifications}
        onNotificationAction={handleRequestAction}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}
        onOpenProfile={(uid, role) => {
          if (!user) {
            handleAuthOpen('signin');
            return;
          }
          handleOpenProfile(uid, role);
        }}
        onOpenAuth={(mode, role) => handleAuthOpen(mode, role)}
        signOut={async () => {
          await supabase.auth.signOut();
          // window.location.reload(); 
        }}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        popularProfessions={professionStats}
        popularCities={cityStats}
        weeklyTrends={weeklyRisingStats}
        jobFinders={jobFinders}
        platformStats={platformStats}
        popularCVs={popularCVs}
        popularCompanies={popularCompanies}
        onJobFinderClick={(cv) => {
          handleCVClick(cv);
          setIsMobileMenuOpen(false);
        }}
        onCVClick={(cv) => {
          handleCVClick(cv);
          setIsMobileMenuOpen(false);
        }}
        onCompanyClick={(company) => {
          // handle company click
          setIsMobileMenuOpen(false);
        }}
        onFilterApply={(type, value) => {
          handleFilterUpdate(type, value);
          setIsMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSavedCVs={() => {
          setIsMobileMenuOpen(false);
          setIsSavedCVsOpen(true);
        }}
        onLogout={async () => {
          await supabase.auth.signOut();
          setIsMobileMenuOpen(false);
          // window.location.reload(); 
        }}
      />
      {isJobSuccessOpen && (
        <JobSuccessModal
          onClose={() => setIsJobSuccessOpen(false)}
        />
      )}

      {isSavedCVsOpen && user && (
        <SavedCVsModal
          userId={user.id}
          onClose={() => setIsSavedCVsOpen(false)}
          onOpenCV={(cvId) => {
            setIsSavedCVsOpen(false); // Close list
            handleViewSavedCV(cvId);
          }}
        />
      )}
    </div >
  );
};

export default App;
