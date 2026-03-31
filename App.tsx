import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CV, FilterState, ContactRequest, Company, NotificationItem, Conversation, Message } from './types';
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
import Footer from './components/Footer';
import SortDropdown from './components/SortDropdown';
import MobileBottomNav from './components/MobileBottomNav';
import ImageWithFallback from './components/ImageWithFallback';
import MobileMenuDrawer from './components/MobileMenuDrawer';
import { BusinessCardSkeleton } from './components/Skeleton';

// Core components and modals (direct import for instant navigation)
import MessagesModal from './components/MessagesModal';
import ProfileModal from './components/ProfileModal';
import CompanyProfileModal from './components/CompanyProfileModal';
import CVFormModal from './components/CVFormModal';
import SettingsModal from './components/SettingsModal';
import CompanyFormModal from './components/CompanyFormModal';
import NotificationsModal from './components/NotificationsModal';
import CVProfileRoute from './components/CVProfileRoute';
import CompanyProfileRoute from './components/CompanyProfileRoute';
import ShopCard from './components/ShopCard';
import ShopProfileModal from './components/ShopProfileModal';
import CVCompletionPrompt from './components/CVCompletionPrompt';

// Lazy loaded auxiliary modals
const JobSuccessModal = React.lazy(() => import('./components/JobSuccessModal'));
const SavedCVsModal = React.lazy(() => import('./components/SavedCVsModal'));
const AdvancedFilterModal = React.lazy(() => import('./components/AdvancedFilterModal'));
const ResetPasswordModal = React.lazy(() => import('./components/ResetPasswordModal'));
const CVPromoModal = React.lazy(() => import('./components/CVPromoModal'));
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const LegalRoute = React.lazy(() => import('./components/LegalRoute'));

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

// Seeded random rank for daily shuffling
const getDailySeed = () => new Date().toDateString();

const getDailyRank = (id: string, seed: string) => {
  let hash = 0;
  const str = id + seed;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;
  const { user, signOut: authSignOut } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [generalNotifications, setGeneralNotifications] = useState<NotificationItem[]>([]);
  const [cvList, setCvList] = useState<CV[]>([]);
  const [popularCVs, setPopularCVs] = useState<CV[]>([]);
  const [jobFinders, setJobFinders] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  const [popularCompanies, setPopularCompanies] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'cvs' | 'employers' | 'shops'>('cvs');
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [shopList, setShopList] = useState<any[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    profession: '',
    city: '',
    experience: '',
    language: '',
    languageLevel: '',
    salaryMin: '',
    salaryMax: '',
    workType: '',
    employmentType: '',
    educationLevel: '',
    graduationStatus: '',
    militaryStatus: '',
    maritalStatus: '',
    disabilityStatus: '',
    noticePeriod: '',
    travelStatus: '',
    driverLicenses: [],
    preferredCities: [],
    preferredCountries: []
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authRole, setAuthRole] = useState<'job_seeker' | 'employer' | 'shop' | undefined>(undefined);
  const [activeShop, setActiveShop] = useState<any | null>(null);
  const [isShopProfileOpen, setIsShopProfileOpen] = useState(false);
  const [activeModalRequest, setActiveModalRequest] = useState<ContactRequest | null>(null);
  /* REMOVING DUPLICATE DECLARATION */
  const [activeModalRequestId, setActiveModalRequestId] = useState<string | null>(null);
  const [isJobSuccessOpen, setIsJobSuccessOpen] = useState(false);
  const [isSavedCVsOpen, setIsSavedCVsOpen] = useState(false);
  const [showAllEmployers, setShowAllEmployers] = useState(false);
  const [showAllShops, setShowAllShops] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilterModal, setActiveFilterModal] = useState<'professions' | 'cities' | 'experience' | 'advanced' | null>(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isCVPromoOpen, setIsCVPromoOpen] = useState(false);
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Listen for Supabase PASSWORD_RECOVERY event
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetPasswordOpen(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuthOpen = (mode: 'signin' | 'signup', role?: 'job_seeker' | 'employer' | 'shop') => {
    setAuthMode(mode);
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      setIsMobileMenuOpen(false);
      setIsAuthModalOpen(false);
      showToast('Başarıyla çıkış yapıldı', 'success');
    } catch (error) {
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };


  const handleOpenSavedCVs = () => {
    setIsSavedCVsOpen(true);
  };

  const handleViewSavedCV = async (cvId: string) => {
    // Try to find in current list first
    const existing = cvList.find(c => c.id === cvId);
    if (existing) {
      navigate(`/cv/${existing.slug || existing.id}`, { state: { cvData: existing, background: background || location } });
      return;
    }

    // Otherwise fetch
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cvs')
        .select(`
          *,
          languageDetails:language_details,
          educationDetails:education_details,
          workExperience:work_experience,
          internshipDetails:internship_details,
          certificates,
          references
        `)
        .eq('id', cvId)
        .single();

      if (error) throw error;
      if (data) navigate(`/cv/${data.slug || data.id}`, { state: { cvData: data, background: background || location } });
    } catch (e) {
      console.error('Error fetching CV:', e);
      showToast('CV detayları alınamadı.', 'error');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Fetch initial data based on viewMode
    if (viewMode === 'cvs') {
      fetchCVs();
    } else if (viewMode === 'employers') {
      fetchAllCompanies();
    } else if (viewMode === 'shops') {
      fetchShops();
    }
    setCurrentPage(1);
    setIsMobileMenuOpen(false);
    setShowAllEmployers(false);
    setShowAllShops(false);
    fetchPopularCompanies(); // This is common for all views, or could be moved to a separate useEffect if it's truly independent
    fetchPopularCVs(); // Also common
    fetchJobFinders(); // Also common

    if (user) {
      // Handle OAuth pending role
      const pendingRole = localStorage.getItem('pendingRole');
      if (pendingRole && !user.user_metadata?.role) {
        const updateRole = async () => {
          try {
            const { error } = await supabase.auth.updateUser({
              data: { role: pendingRole }
            });
            if (error) throw error;
            localStorage.removeItem('pendingRole');
            showToast('Hesabınız başarıyla oluşturuldu', 'success');
          } catch (err) {
            console.error('Error updating OAuth role:', err);
          }
        };
        updateRole();
      } else if (pendingRole) {
        localStorage.removeItem('pendingRole');
      }

      if (user.user_metadata?.role === 'employer') {
        fetchCompany();
      }
      if (user.user_metadata?.role === 'shop') {
        fetchShop();
      }
      fetchGeneralNotifications();
      fixOldNotifications(); // Auto-fix legacy notifications
      fetchConversations();

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
            fetchGeneralNotifications(); // Trigger this to update statuses in notifications list
          }
        )
        .subscribe();

      const chatChannel = supabase
        .channel('realtime-chat-global')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            // Ensure we aren't fetching for our own sent messages if we just sent them
            if (payload.new && payload.new.sender_id !== user.id) {
              fetchConversations();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsChannel);
        supabase.removeChannel(requestsChannel);
        supabase.removeChannel(chatChannel);
      };
    } else {
      setActiveCompany(null);
    }
  }, [user, viewMode]); // Added viewMode to dependencies

  // URL Sync for Dedicated Views
  useEffect(() => {
    if (location.pathname === '/hizmetler') {
      setViewMode('shops');
      // Ensure menu is closed when on a dedicated page
      setIsMobileMenuOpen(false);
    } else if (location.pathname === '/is-verenler') {
      setViewMode('employers');
    } else if (location.pathname === '/') {
      setViewMode('cvs');
    }
  }, [location.pathname]);

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

    const companyIdMatch = location.pathname.match(/^\/company\/(.+)$/);
    const companyId = companyIdMatch ? companyIdMatch[1] : null;

    if (companyId && user) {
      const checkRequest = async () => {
        // Fetch logic: Use explicit request ID if provided (from notification), otherwise fallback to User relationship
        let query = supabase.from('contact_requests').select('*');

        if (activeModalRequestId) {
          query = query.eq('id', activeModalRequestId);
        } else {
          // Fallback: Check if Company sent request to User
          // We need the company's user_id, but we only have its ID from the URL.
          // Fetch the company first to get its user_id.
          const { data: companyData } = await supabase.from('companies').select('user_id').eq('id', companyId).single();

          if (companyData) {
            query = query
              .eq('requester_id', companyData.user_id)
              .eq('target_user_id', user.id);
          } else {
            // Invalid company, skip
            if (isMounted) setActiveModalRequest(null);
            return;
          }
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
    } else {
      if (isMounted) setActiveModalRequest(null); // Clear if not on a company route
    }
    return () => { isMounted = false; };
  }, [location.pathname, user, activeModalRequestId]);

  // Handle Incremented View
  const handleCVClick = (cv: CV) => {
    navigate(`/cv/${cv.slug || cv.id}`, { state: { cvData: cv, background: background || location } });
    // Increment view ONLY if user is NOT the owner
    // If user is not logged in, we still count views (visitor views)
    if (!user || user.id !== cv.userId) {
      // Optimistic Update
      setCvList(prevList => prevList.map(item =>
        item.id === cv.id ? { ...item, views: (item.views || 0) + 1 } : item
      ));

      try {
        supabase.rpc('increment_cv_views', { target_cv_id: cv.id }); // Don't await, let it run in background
      } catch (err) {
        console.error('Failed to increment views:', err);
      }
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
        slug: item.slug,
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
        salaryCurrency: item.salary_currency,
        preferredCities: item.preferred_cities || (item.preferred_city ? [item.preferred_city] : []),
        preferredCountries: item.preferred_countries || [],
        preferredRoles: item.preferred_roles || [],
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
        slug: item.slug,
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
        salaryCurrency: item.salary_currency,
        preferredCities: item.preferred_cities || (item.preferred_city ? [item.preferred_city] : []),
        preferredCountries: item.preferred_countries || [],
        preferredRoles: item.preferred_roles || [],
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
      showToast('İş bulma durumunuz başarıyla güncellendi.', 'success');
      setIsJobSuccessOpen(true);
      fetchCVs(); // Refresh the list
      // Instead of forcing the active workingStatus in selectedCV or closing the profile,
      // navigate home to reset view, or we can just stay and let real-time/refetch update it.
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Bir hata oluştu.', 'error');
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
          navigate(`/company/${data.slug || data.id}`, {
            state: {
              companyData: {
                id: data.id,
                slug: data.slug,
                userId: data.user_id,
                name: data.company_name,
                industry: data.industry,
                city: data.city,
                district: data.district,
                country: data.country || 'Türkiye',
                address: data.address,
                website: data.website,
                description: data.description,
                logoUrl: data.logo_url
              },
              background: background || location
            }
          });
          if (requestId) setActiveModalRequestId(requestId);
          return true;
        }
        return false;
      };

      // Helper to open Shop
      const openShop = async () => {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
           setActiveShop(data);
           setIsShopProfileOpen(true);
           if (requestId) setActiveModalRequestId(requestId);
           return true;
        }
        return false;
      };

      // Helper to open CV
      const openCV = async (queryField: string, id: string) => {
        try {
          console.log(`Fetching CV with ${queryField}: ${id}`);
          const { data, error: fetchError } = await supabase
            .from('cvs')
            .select(`
              *,
              languageDetails:language_details,
              educationDetails:education_details,
              workExperience:work_experience,
              internshipDetails:internship_details,
              certificates,
              references
            `)
            .eq(queryField, id)
            .single();

          if (fetchError) {
            console.error('Supabase fetch error:', fetchError);
            throw fetchError;
          }

          if (data) {
            const mapped: CV = {
              ...data,
              userId: data.user_id,
              experienceYears: data.experience_years || 0,
              experienceMonths: data.experience_months || 0,
              salaryMin: data.salary_min || 0,
              salaryMax: data.salary_max || 0,
              salaryCurrency: data.salary_currency,
              educationLevel: data.education_level || '',
              graduationStatus: data.graduation_status || '',
              workType: data.work_type || '',
              employmentType: data.employment_type || '',
              militaryStatus: data.military_status || '',
              disabilityStatus: data.disability_status || '',
              noticePeriod: data.notice_period || '',
              travelStatus: data.travel_status || '',
              driverLicense: data.driver_license || [],
              isEmailPublic: data.is_email_public,
              isPhonePublic: data.is_phone_public,
              workingStatus: data.working_status,
              preferredCities: data.preferred_cities || (data.preferred_city ? [data.preferred_city] : []),
              preferredCountries: data.preferred_countries || [],
              preferredRoles: data.preferred_roles || [],
              languageDetails: data.languageDetails || [],
              educationDetails: data.educationDetails || [],
              workExperience: data.workExperience || [],
              internshipDetails: data.internshipDetails || []
            };
            navigate(`/cv/${data.slug || data.id}`, { state: { cvData: mapped, background: background || location } });
            return true;
          }
        } catch (e) {
          console.error('Error in openCV:', e);
          showToast(`CV yüklenirken bir hata oluştu [${queryField}]: ${(e as any)?.message || e}`, 'error');
        }
        return false;
      };

      // Smart Logic: Try based on role, then fallback
      if (role === 'employer') {
        found = await openCompany();
        if (!found) found = await openCV('user_id', userId);
      } else if (role === 'job_seeker') {
        found = await openCV('user_id', userId);
        if (!found) found = await openCompany();
      } else if (role === 'shop') {
        found = await openShop();
        if (!found) found = await openCV('user_id', userId);
      } else {
        // No role known, try all
        found = await openCV('user_id', userId);
        if (!found) found = await openCompany();
        if (!found) found = await openShop();
      }

      if (!found) {
        showToast('Kullanıcı profili bulunamadı.', 'error');
      }

    } catch (err) {
      console.error('Error opening profile:', err);
      showToast('Bir hata oluştu.', 'error');
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

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShopList(data || []);
    } catch (err) {
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShop = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setActiveCompany(data as any); // Reusing activeCompany state for now or we could add activeShop
    } catch (err) {
      console.error('Error fetching shop:', err);
    }
  };

  const fetchAllCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
      } else {
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
          website: c.website,
          slug: c.slug
        }));
        setCompanyList(mapped);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
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
          slug: item.slug,
          userId: item.user_id,
          name: item.name || '',
          profession: item.profession || '',
          city: item.city || '',
          district: item.district || '',
          experienceYears: item.experience_years || 0,
          experienceMonths: item.experience_months || 0,
          birthDate: item.birth_date,
          language: item.language || 'İngilizce',
          languageLevel: item.language_level || '',
          photoUrl: item.photo_url || '',
          salaryMin: item.salary_min || 0,
          salaryMax: item.salary_max || 0,
          about: item.about || '',
          education: item.education || '',
          educationLevel: item.education_level || '',
          graduationStatus: item.graduation_status || '',
          workType: item.work_type || '',
          employmentType: item.employment_type || '',
          militaryStatus: item.military_status || '',
          maritalStatus: item.maritalStatus || '',
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
          references: item.references,
          workExperience: item.work_experience || [],
          internshipDetails: item.internship_details || [],
          educationDetails: item.education_details || [],
          languageDetails: item.language_details || [],
          certificates: item.certificates || [],
          preferredCities: item.preferred_cities || (item.preferred_city ? [item.preferred_city] : []),
          preferredCountries: item.preferred_countries || [],
          preferredRoles: item.preferred_roles || [],
          salaryCurrency: item.salary_currency,
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

  // Prompt user to complete CV if photo or about is missing
  useEffect(() => {
    if (user && currentUserCV) {
      if (!currentUserCV.photoUrl || !currentUserCV.about) {
        const hasSeenToast = sessionStorage.getItem('cv_completion_toast_seen');
        if (!hasSeenToast) {
          setTimeout(() => {
            showToast('İş verenlerin sizi daha iyi tanıyabilmesi için lütfen Profilinizden CV\'nizi tamamen doldurun.', 'info');
          }, 2000);
          sessionStorage.setItem('cv_completion_toast_seen', 'true');
        }
      }
    }
  }, [user, currentUserCV, showToast]);

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
        const companyData = {
          id: company.id,
          slug: company.slug,
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
        };
        setActiveCompany(companyData);
        return companyData;
      } else {
        console.log('No company data found for user');
        setActiveCompany(null);
        return null;
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
        logo_url: companyData.logoUrl,
        founded_year: companyData.foundedYear,
        employee_count: companyData.employeeCount,
        instagram_url: companyData.instagramUrl
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
      navigate('/', { replace: true, state: {} });
      fetchCompany();

    } catch (error: any) {
      console.error('Error saving company:', error);
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };

  const handleDeleteCompany = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      showToast('İş veren profili başarıyla silindi!', 'success');
      navigate('/', { replace: true, state: {} });
      fetchCompany();
    } catch (error: any) {
      console.error('Error deleting company:', error);
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };

  const fetchConversations = async () => {
    if (!user) return;
    try {
      // 1. Fetch conversations (cannot join profiles directly as FK points to auth.users)
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Parallelize last_message backfill to avoid N+1 slow loading
      const conversationsData = data || [];
      await Promise.all(conversationsData.map(async (conv) => {
        if (!conv.last_message) {
          const { data: latestMsg } = await supabase
            .from('messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (latestMsg) {
            conv.last_message = latestMsg.content;
          }
        }
      }));

      // 2. Fetch profiles for all participants
      const participantIds = new Set<string>();
      conversationsData.forEach(c => {
        if (c.participant1_id) participantIds.add(c.participant1_id);
        if (c.participant2_id) participantIds.add(c.participant2_id);
      });

      let profilesMap = new Map();
      if (participantIds.size > 0) {
        // Fetch profiles (might be blocked by RLS)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .in('id', Array.from(participantIds));
          
        if (profilesData) {
          profilesData.forEach(p => profilesMap.set(p.id, p));
        }

        // Fetch fallback names from public cvs and companies tables (RLS is public here)
        const { data: cvsData } = await supabase.from('cvs').select('user_id, name, photoUrl, profession').in('user_id', Array.from(participantIds));
        const { data: companiesData } = await supabase.from('companies').select('user_id, company_name, logo_url').in('user_id', Array.from(participantIds));

        participantIds.forEach(id => {
          if (!profilesMap.has(id)) {
            const cvMatch = cvsData?.find(c => c.user_id === id);
            const compMatch = companiesData?.find(c => c.user_id === id);
            
            if (compMatch) {
              profilesMap.set(id, { id, full_name: compMatch.company_name, avatar_url: compMatch.logo_url, role: 'employer' });
            } else if (cvMatch) {
              profilesMap.set(id, { id, full_name: cvMatch.name, avatar_url: cvMatch.photoUrl, role: 'job_seeker', profession: cvMatch.profession });
            }
          } else {
             // If profile was found via RLS, still attach profession from CV if present
             const cvMatch = cvsData?.find(c => c.user_id === id);
             if (cvMatch && cvMatch.profession) {
               const p = profilesMap.get(id);
               p.profession = cvMatch.profession;
               profilesMap.set(id, p);
             }
          }
        });
      }

      // 3. Map conversations with their respective other participant profiles
      const mapped: Conversation[] = conversationsData.map((conv: any) => {
        const p1 = profilesMap.get(conv.participant1_id);
        const p2 = profilesMap.get(conv.participant2_id);
        const otherParticipant = conv.participant1_id === user.id ? p2 : p1;
        
        return {
          id: conv.id,
          participant1_id: conv.participant1_id,
          participant2_id: conv.participant2_id,
          last_message: conv.last_message,
          last_message_at: conv.last_message_at,
          created_at: conv.created_at,
          other_participant: otherParticipant ? {
            id: otherParticipant.id,
            full_name: otherParticipant.full_name,
            avatar_url: otherParticipant.avatar_url,
            role: otherParticipant.role
          } : { id: conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id }
        };
      });

      setConversations(mapped);
      
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id);
      
      setUnreadMessageCount(count || 0);

    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const handleOpenChat = async (targetUserId: string) => {
    if (!user) {
      handleAuthOpen('signin');
      return;
    }

    try {
      let conv = conversations.find(c => 
        (c.participant1_id === user.id && c.participant2_id === targetUserId) ||
        (c.participant1_id === targetUserId && c.participant2_id === user.id)
      );

      if (!conv) {
        const { data, error } = await supabase
          .from('conversations')
          .insert([
            { participant1_id: user.id, participant2_id: targetUserId }
          ])
          .select()
          .maybeSingle();

        if (error) {
          // If it's a unique constraint error (PGRST116 or 23505 duplicate key), the conversation already exists
          // but our local 'conversations' state hasn't updated yet. We must fetch it directly.
          if (error.code === '23505' || error.message.includes('unique constraint')) {
            const { data: existingData, error: fetchError } = await supabase
              .from('conversations')
              .select('*')
              .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${targetUserId}),and(participant1_id.eq.${targetUserId},participant2_id.eq.${user.id})`)
              .maybeSingle();
              
            if (fetchError) throw fetchError;
            if (existingData) {
              await fetchConversations();
              conv = { ...existingData, other_participant: { id: targetUserId } };
            }
          } else {
            throw error;
          }
        } else if (data) {
          await fetchConversations();
          conv = { ...data, other_participant: { id: targetUserId } };
        }
      }

      setActiveConversationId(conv.id);
      setIsMessagesOpen(true);
    } catch (err) {
      console.error('Error opening chat:', err);
      showToast('Sohbet başlatılamadı: ' + ((err as any)?.message || 'Bilinmeyen Hata'), 'error');
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
        birth_date: cvData.birthDate,
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

      navigate('/', { replace: true, state: {} });
      fetchCVs();
    } catch (error: any) {
      console.error('Error saving CV:', error);
      showToast(getFriendlyErrorMessage(error), 'error');
    }
  };

  const handleDeleteCV = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      showToast('CV başarıyla silindi!', 'success');
      navigate('/', { replace: true, state: {} });
      fetchCVs();
    } catch (error: any) {
      console.error('Error deleting CV:', error);
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
        cv.city.toLocaleLowerCase('tr').includes(searchLower);

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
      const matchesEmpType = !activeFilters.employmentType || cv.employmentType === activeFilters.employmentType;
      const matchesEduLevel = !activeFilters.educationLevel || cv.educationLevel === activeFilters.educationLevel;
      const matchesGradStatus = !activeFilters.graduationStatus || cv.graduationStatus === activeFilters.graduationStatus;
      const matchesMilitary = !activeFilters.militaryStatus || cv.militaryStatus === activeFilters.militaryStatus;
      const matchesMarital = !activeFilters.maritalStatus || cv.maritalStatus === activeFilters.maritalStatus;
      const matchesDisability = !activeFilters.disabilityStatus || cv.disabilityStatus === activeFilters.disabilityStatus;
      const matchesTravel = !activeFilters.travelStatus || cv.travelStatus === activeFilters.travelStatus;
      const matchesDriver = activeFilters.driverLicenses.length === 0 ||
        (cv.driverLicense && activeFilters.driverLicenses.some(l => cv.driverLicense?.includes(l)));

      const matchesWorkType = !activeFilters.workType || cv.workType === activeFilters.workType;

      return matchesSearch && matchesProfession && matchesCity && matchesExperience &&
        matchesLanguage && matchesLangLevel && matchesSalaryMin && matchesSalaryMax &&
        matchesWorkType && matchesEmpType && matchesEduLevel &&
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
      // Daily Random Shuffle (Changes every 24h)
      const seed = getDailySeed();
      result = [...result].sort((a, b) => getDailyRank(a.id, seed) - getDailyRank(b.id, seed));
    }

    return result;
  }, [cvList, searchQuery, activeFilters, sortBy]);

  const filteredShops = useMemo(() => {
    let result = shopList.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.profession && s.profession.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    } else if (sortBy === 'default') {
      const seed = getDailySeed();
      result = [...result].sort((a, b) => getDailyRank(a.id, seed) - getDailyRank(b.id, seed));
    }

    return result;
  }, [shopList, searchQuery, sortBy]);

  const filteredEmployers = useMemo(() => {
    let result = companyList.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.industry && c.industry.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    } else if (sortBy === 'default') {
      const seed = getDailySeed();
      result = [...result].sort((a, b) => getDailyRank(a.id || a.userId, seed) - getDailyRank(b.id || b.userId, seed));
    }

    return result;
  }, [companyList, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredCVs.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCVs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCVs, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setIsSimulatedLoading(false);
    setShowEndMessage(false);
  }, [searchQuery, activeFilters, sortBy]);

  // Simulate searching more when reaching the end of the feed
  useEffect(() => {
    if (currentPage === totalPages && filteredCVs.length > 0 && !loading && !showEndMessage && !isSimulatedLoading) {
      setIsSimulatedLoading(true);
    }
  }, [currentPage, totalPages, filteredCVs.length, loading, showEndMessage]);

  useEffect(() => {
    if (isSimulatedLoading) {
      const timer = setTimeout(() => {
        setIsSimulatedLoading(false);
        setShowEndMessage(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSimulatedLoading]);

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

  const closeAllModals = () => {
    setIsAuthModalOpen(false);
    setIsJobSuccessOpen(false);
    setIsSavedCVsOpen(false);
    setIsMobileMenuOpen(false);
    setActiveFilterModal(null);
    setIsResetPasswordOpen(false);
    setIsCVPromoOpen(false);
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

  const isMyProfileOpen = useMemo(() => {
    if (isCVPromoOpen) return true;

    // Check CV
    const cvMatch = location.pathname.match(/^\/cv\/(.+)$/);
    if (cvMatch && currentUserCV) {
      const slugOrId = cvMatch[1];
      return slugOrId === currentUserCV.id || slugOrId === currentUserCV.slug;
    }

    // Check Company
    const companyMatch = location.pathname.match(/^\/company\/(.+)$/);
    if (companyMatch && activeCompany) {
      const slugOrId = companyMatch[1];
      return slugOrId === activeCompany.id || slugOrId === activeCompany.slug;
    }
    return false;
  }, [location.pathname, currentUserCV, activeCompany, isCVPromoOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-white sm:bg-[#F0F2F5] dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

      <Navbar
          onSearch={setSearchQuery}
          onCreateCV={() => {
            navigate('/cv-olustur', { state: { background: background || location } });
          }}
          onOpenCompanyProfile={() => {
            if (user?.user_metadata?.role === 'employer') {
              fetchCompany().then(company => {
                if (company) {
                  const companyData = company as any;
                  navigate(`/company/${companyData.slug || companyData.id}`, { state: { companyData, background: background || location } });
                }
              });
            }
          }}
          onOpenSettings={() => {
            navigate('/ayarlar', { state: { background: background || location } });
          }}
          hasCV={!!currentUserCV}
          userPhotoUrl={currentUserCV?.photoUrl || activeCompany?.logoUrl}
          notificationCount={generalNotifications.filter(n => !n.is_read).length}
          notifications={[...generalNotifications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
          onMarkNotificationRead={markNotificationRead}
          onMarkAllRead={markAllNotificationsRead}
          onOpenProfile={(uid, role) => {
            handleOpenProfile(uid, role);
          }}
          onOpenAuth={(mode, role) => handleAuthOpen(mode, role)}
          isAuthModalOpen={isAuthModalOpen}
          onCloseAuth={() => setIsAuthModalOpen(false)}
          authMode={authMode}
          authRole={authRole}
          onOpenSavedCVs={() => {
            handleOpenSavedCVs();
          }}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          unreadMessageCount={unreadMessageCount}
          onOpenMessages={() => setIsMessagesOpen(true)}
        />

      {/* ... previous modals ... */}

      {/* Notifications Model moved to Routes below */}
      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onRefreshConversations={fetchConversations}
      />

      {isResetPasswordOpen && (
        <ResetPasswordModal onClose={() => setIsResetPasswordOpen(false)} />
      )}


      <div className="flex-1 flex justify-center pt-[68px] md:pt-[84px] px-2 md:px-6">
        <div className="max-w-[1440px] w-full flex items-start gap-6 pb-12">
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[84px] h-fit pb-4">
            <SidebarLeft
              popularProfessions={professionStats}
              popularCities={cityStats}
              weeklyTrends={weeklyRisingStats}
              platformStats={platformStats}
              jobFinders={jobFinders}
              onCVClick={handleCVClick}
              loading={loading}
            />
          </aside>





          <section className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-4">
            {/* Redundant Mobile Search Bar Hidden - Using Dedicated Search Overlay instead */}
            <div className="hidden w-full mb-0 mt-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isSearchFocused ? 'text-[#1f6d78] dark:text-[#2dd4bf]' : 'text-gray-500'
                    }`}>
                    <i className="fi fi-br-search text-sm"></i>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder={isSearchFocused ? 'Meslek, Şehir, İsim veya Unvan Ara' : t('nav.search_placeholder')}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full pl-11 pr-12 h-[42px] font-medium tracking-tight outline-none appearance-none focus:bg-white dark:focus:bg-gray-800 focus:border-[1.5px] focus:border-[#1f6d78] dark:focus:border-[#2dd4bf] focus:ring-0 transition-all placeholder:text-gray-400/90 text-[13px] sm:text-[16px] text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => setActiveFilterModal('advanced')}
                    className="absolute right-1 text-xs top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95 z-20"
                  >
                    <svg className="text-[#1f6d78] dark:text-[#2dd4bf]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="8" x2="20" y2="8" />
                      <circle cx="16" cy="8" r="2" fill="white" className="dark:fill-gray-900" />
                      <line x1="4" y1="16" x2="20" y2="16" />
                      <circle cx="8" cy="16" r="2" fill="white" className="dark:fill-gray-900" />
                    </svg>
                  </button>
                </div>


              </div>
            </div>

            {/* Mobile Header (View Mode Indicator) */}
            <div className="flex sm:hidden items-center justify-between px-4 mt-0.5 mb-0">
              <div className="flex items-center gap-4 pt-1.5 pb-0.5">
                <div className="flex flex-col gap-0 w-full">
                  {((viewMode === 'cvs') || 
                    (viewMode === 'shops' && (showAllShops || searchQuery.length > 0)) || 
                    (viewMode === 'employers' && (showAllEmployers || searchQuery.length > 0))) && (
                    <div className="animate-in fade-in duration-300 pb-2">
                      <div className="text-[20px] font-black tracking-tighter text-black dark:text-white transition-all leading-none mb-1">
                        {viewMode === 'cvs' ? 'İş Arayanlar' : viewMode === 'shops' ? 'Hizmetler' : 'İş Verenler'}
                      </div>
                      <div className="flex items-center w-full mt-1.5 px-0">
                        <div className="flex items-center text-gray-400 dark:text-gray-500 opacity-70 shrink-0 mt-0.5 pr-1.5">
                          <i className="fi fi-rr-ballot text-[13px]"></i>
                        </div>
                        <div className="flex-1">
                          <SortDropdown value={sortBy} onChange={setSortBy} minimal={true} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {viewMode === 'cvs' && (
              <div className="hidden sm:block">
                <Filters
                  currentFilters={activeFilters}
                  onChange={handleFilterUpdate}
                  availableProfessions={availableProfessions}
                  availableCities={availableCities}
                  activeModal={activeFilterModal}
                  onActiveModalChange={setActiveFilterModal}
                  mobileSort={
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">{t('feed.sort')}:</span>
                      <SortDropdown value={sortBy} onChange={setSortBy} />
                    </div>
                  }
                />
              </div>
            )}

            {/* Mobile Advanced Filter Modal */}
            {activeFilterModal === 'advanced' && (
              <div className="sm:hidden">
                <AdvancedFilterModal
                  initialFilters={activeFilters}
                  onApply={(newFilters) => {
                    Object.entries(newFilters).forEach(([key, val]) => {
                      handleFilterUpdate(key, val);
                    });
                    setActiveFilterModal(null);
                  }}
                  onClose={() => setActiveFilterModal(null)}
                  availableProfessions={availableProfessions}
                  availableCities={availableCities}
                />
              </div>
            )}

            <div className="hidden sm:flex bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 px-4 pt-4 pb-0 sm:px-8 sm:pt-6 mb-2 flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-0 shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-12 border-b border-gray-200 dark:border-white/20 w-full mb-[-1px]">
                <div className="flex items-center gap-1">
                  <div
                    className={`${(viewMode === 'employers' || viewMode === 'shops') ? 'text-[22px] font-black' : 'text-[17px] font-black border-b-2 border-[#1f6d78] dark:border-[#2dd4bf] pb-3 -mb-px'} transition-all text-[#1f6d78] dark:text-[#2dd4bf]`}
                  >
                    {viewMode === 'cvs' ? 'İş Arayanlar' : viewMode === 'shops' ? 'Hizmetler' : 'İş Verenler'}
                  </div>
                  {viewMode === 'cvs' && <div className="pb-3"><SortDropdown value={sortBy} onChange={setSortBy} minimal={true} /></div>}
                </div>
              </div>
            </div>

              <div className="flex flex-col sm:gap-5 -mt-2 sm:mt-0">
              
              {viewMode === 'cvs' ? (
                currentItems.length > 0 ? (
                  <>
                    {/* Top Divider for First Item - Mobile Only */}
                    <div className="ml-[74px] border-b border-gray-200/80 dark:border-white/15 mt-[-2px] mb-[-1px] sm:hidden" />
                    {currentItems.map(cv => {
                      return (
                        <BusinessCard
                          key={cv.id}
                          cv={cv}
                          onClick={() => handleCVClick(cv)}
                        />
                      );
                    })}

                    {currentPage === totalPages && !loading && (
                      <div className="mt-4 mb-12 flex flex-col items-center justify-center py-4 px-4">
                        {isSimulatedLoading ? (
                          <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
                             <div className="relative">
                               <div className="w-9 h-9 border-[3px] border-[#1f6d78]/10 border-t-[#1f6d78] rounded-full animate-spin"></div>
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-1.5 h-1.5 bg-[#1f6d78] rounded-full animate-ping"></div>
                               </div>
                             </div>
                             <p className="text-[10px] font-black text-[#1f6d78] dark:text-[#2dd4bf] animate-pulse uppercase tracking-widest text-center">
                               {t('feed.searching_more') || "Daha Fazla CV Aranıyor..."}
                             </p>
                          </div>
                        ) : showEndMessage ? (
                          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <h3 className="text-[13px] sm:text-[15px] font-black text-gray-900 dark:text-white mb-0.5 tracking-tight">
                              {t('feed.end_title')}
                            </h3>
                            <p className="text-[11px] sm:text-[12px] font-bold text-gray-500 dark:text-gray-400">
                              {t('feed.end_desc')}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </>
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
                    }} className="mt-4 text-[#1f6d78] dark:text-[#2dd4bf] font-black hover:underline uppercase tracking-widest text-sm">
                      Filtreleri Temizle
                    </button>
                  </div>
                )
              ) : viewMode === 'employers' ? (
                /* Employers View */
                <div className="flex flex-col gap-6">
                  {/* Employer List Content */}

                  {showAllEmployers || searchQuery.length > 0 ? (
                    filteredEmployers.length > 0 ? (
                      filteredEmployers.map(company => (
                        <div
                          key={company.id}
                          onClick={() => handleOpenProfile(company.userId, 'employer')}
                          className="flex items-center gap-4 sm:gap-10 pl-1.5 pr-4 py-4 sm:p-8 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-white/10 active:bg-gray-50 dark:active:bg-gray-750 transition-colors sm:border sm:rounded-[35px] sm:mb-4"
                        >
                          <div className="w-14 h-16 sm:w-24 sm:h-28 rounded-lg sm:rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-center">
                            <ImageWithFallback 
                              src={company.logoUrl} 
                              alt={company.name} 
                              className="w-full h-full object-cover"
                              initialsClassName="text-3xl sm:text-5xl font-black"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col gap-0.5 sm:gap-1.5">
                                <h3 className="text-[15px] sm:text-[22px] font-bold text-black dark:text-white tracking-tight leading-tight line-clamp-1">
                                  {company.name}
                                </h3>
                                <p className="text-[13px] sm:text-[18px] text-[#1f6d78] dark:text-[#2dd4bf] font-bold tracking-tight line-clamp-1">
                                  {company.industry || t('card.no_profession')}
                                </p>
                                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 text-[12px] sm:text-[15px] text-gray-500 dark:text-gray-400 font-bold whitespace-nowrap">
                                  <i className="fi fi-rr-marker"></i>
                                  <span className="">{company.city || t('card.no_city')}</span>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Action Button */}
                            <div className="hidden sm:block shrink-0">
                              <button className="bg-white dark:bg-gray-800 border-[0.5px] border-[#1f6d78] text-[#1f6d78] px-8 py-3 rounded-full font-black text-xs hover:bg-[#1f6d78] hover:text-white transition-all active:scale-95 shadow-sm uppercase tracking-widest whitespace-nowrap">
                                {t('card.view')}
                              </button>
                            </div>
                          </div>

                          {/* Mobile Right Arrow */}
                          <div className="shrink-0 self-center flex sm:hidden items-center text-gray-400 dark:text-gray-500">
                            <i className="fi fi-rr-angle-small-right text-2xl"></i>
                          </div>
                        </div>
                      ))
                    ) : loading ? (
                      <>
                        <BusinessCardSkeleton />
                        <BusinessCardSkeleton />
                      </>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-16 text-center border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
                        <p className="text-gray-800 dark:text-white font-bold">İş veren bulunamadı.</p>
                      </div>
                    )
                  ) : (
                      <div className="bg-white dark:bg-gray-900 py-6 sm:py-10 text-gray-900 dark:text-white overflow-hidden relative group transition-colors duration-300">
                        <div className="relative z-10 flex flex-col items-center px-4">
                          <div className="text-center">
                            <h2 className="text-3xl sm:text-[40px] font-black mb-6 leading-[1.1] tracking-tight text-gray-900 dark:text-white">
                              Geleceğin Yıldızlarını <br className="sm:hidden" /> Ekibinize Katın
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-[13px] sm:text-[15px] font-bold mb-12 max-w-lg leading-relaxed mx-auto px-6 sm:px-0">
                              Doğru yeteneği bulmak hiç bu kadar kolay olmamıştı. <br className="hidden sm:block" /> Kartvizid'de profilinizi oluşturun ve doğrudan profesyonellere ulaşın.
                            </p>
                            
                            <div className="flex flex-col items-center gap-8 w-full max-w-[380px] mx-auto">
                              <div className="flex flex-col items-center gap-3 w-full">
                                <button 
                                  onClick={() => {
                                    if (!user) {
                                      handleAuthOpen('signup', 'employer');
                                    } else {
                                      navigate('/sirket-olustur');
                                    }
                                  }}
                                  className="px-8 py-3 text-[15px] font-black bg-[#1f6d78] text-white rounded-full transition-all hover:bg-[#154e56] active:scale-95 shadow-lg shadow-[#1f6d78]/20 uppercase tracking-widest whitespace-nowrap"
                                >
                                  İş Veren Kaydı Oluştur
                                </button>
                                <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center mt-1">
                                  Şirketinizi kaydedin ve aradığınız yetenekleri bulun
                                </p>
                              </div>
    
                              <button 
                                onClick={() => setShowAllEmployers(true)}
                                className="text-[#1f6d78] dark:text-[#2dd4bf] font-black text-[12px] sm:text-[13px] hover:underline uppercase tracking-widest transition-all active:scale-95"
                              >
                                İş Verenleri Keşfet
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
                </div>
              ) : (
                /* Shops (Hizmetler) View */
                <div className="flex flex-col gap-6">
                  {/* Hizmetler List Content */}
                  {showAllShops || searchQuery.length > 0 ? (
                    filteredShops.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {filteredShops.map(shop => (
                          <ShopCard
                            key={shop.id}
                            shop={shop}
                            onClick={() => {
                              setActiveShop(shop);
                              setIsShopProfileOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    ) : loading ? (
                      <>
                        <BusinessCardSkeleton />
                        <BusinessCardSkeleton />
                      </>
                    ) : (
                      <div className="pt-32 sm:pt-48 pb-24 sm:pb-32 flex flex-col items-center justify-center text-center px-6">
                        <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white mb-3">Henüz Kayıtlı Hizmet Yok</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-sm leading-relaxed font-bold">
                          Kartvizid'de hizmetler sayfası çok yakında dolmaya başlayacak. <br className="hidden sm:block" />İlk hizmet kapısını siz açabilirsiniz!
                        </p>
                        <button 
                          onClick={() => handleAuthOpen('signup', 'shop')}
                          className="mt-8 text-[#1f6d78] dark:text-[#2dd4bf] font-black hover:underline text-sm sm:text-base uppercase tracking-widest"
                        >
                          HEMEN HİZMET VERMEYE BAŞLA
                        </button>
                      </div>
                    )
                  ) : (
                    /* Shops Landing / Explanation Section - Updated for Flat background */
                    <div className="bg-white dark:bg-gray-900 py-6 sm:py-10 text-gray-900 dark:text-white overflow-hidden relative group transition-colors duration-300">
                      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
                        <div className="flex-1 text-center">
                          <h2 className="text-3xl sm:text-[40px] font-black mb-6 leading-[1.1] tracking-tight text-gray-900 dark:text-white">
                            Yeteneğini Kazanca <br className="sm:hidden" /> Dönüştür
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 text-[13px] sm:text-[15px] font-bold mb-12 max-w-lg leading-relaxed mx-auto px-6 sm:px-0">
                            Kartvizid’de ustalığınızı kazanca, profilinizi birer iş fırsatına dönüştürün. <br className="hidden sm:block" /> Doğrudan müşterilere ulaşmanın en şeffaf yolu.
                          </p>
                          <div className="flex flex-col items-center gap-8 w-full max-w-[380px] mx-auto">
                            <div className="flex flex-col items-center gap-3 w-full">
                              <button 
                                onClick={() => handleAuthOpen('signup', 'shop')}
                                className="px-8 py-3 text-[15px] font-black bg-[#1f6d78] text-white rounded-full transition-all hover:bg-[#154e56] active:scale-95 shadow-lg shadow-[#1f6d78]/20 uppercase tracking-widest whitespace-nowrap"
                              >
                                Hemen Hizmet Vermeye Başla
                              </button>
                              <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center mt-1">
                                Yeteneklerinizi kazanca dönüştürün
                              </p>
                            </div>
  
                            <button 
                              onClick={() => setShowAllShops(true)}
                              className="text-[#1f6d78] dark:text-[#2dd4bf] font-black text-[12px] sm:text-[13px] hover:underline uppercase tracking-widest transition-all active:scale-95"
                            >
                              Hizmetleri Keşfet
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Subtle Decorative Elements for White Background */}
                      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#1f6d78]/5 rounded-full blur-[100px] opacity-50"></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {filteredCVs.length > ITEMS_PER_PAGE && (
              <div className="mt-8 flex justify-center items-center gap-4 pb-8 sm:pb-0">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px - 4 py - 2 rounded - full text - sm font - bold transition - all ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent'
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
                  className={`px - 4 py - 2 rounded - full text - sm font - bold transition - all ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent'
                    : 'bg-white text-[#1f6d78] border border-[#1f6d78] hover:bg-[#1f6d78] hover:text-white shadow-sm'
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
              onCompanyClick={(company) => navigate(`/company/${company.slug || company.id}`, { state: { companyData: company, background: background || location } })}
              loading={loading}
            />
          </aside>


        </div>
      </div>

      {/* Mobile Bottom Navigation - Visible for all users EXCEPT when auth is open */}
      {!isAuthModalOpen && (
        <MobileBottomNav
          user={user}
          cvList={cvList}
          onOpenFilter={() => setActiveFilterModal('advanced')}
          isProfileOpen={isMyProfileOpen}
          isCreateOpen={location.pathname === '/cv-olustur' || location.pathname === '/sirket-olustur'}
          isHomeView={!isMyProfileOpen && !location.pathname.startsWith('/cv/') && !location.pathname.startsWith('/company/') && !['/cv-olustur', '/ayarlar', '/sirket-olustur', '/bildirimler'].includes(location.pathname) && !isSavedCVsOpen}
          onGoHome={() => {
            navigate('/', { replace: true });
            setViewMode('cvs');
            closeAllModals(); // Ensure all modals are closed
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSearch={(val) => {
            setSearchQuery(val);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onCreateCV={() => {
            if (!user) {
              handleAuthOpen('signin');
              return;
            }
            if (location.pathname === '/cv-olustur') {
              navigate('/', { replace: true });
              closeAllModals();
              return;
            }
            navigate('/cv-olustur', { state: { background: background || location } });
          }}
          onOpenCompanyProfile={() => {
            if (!user) {
              handleAuthOpen('signin', 'employer');
              return;
            }
            if (location.pathname === '/sirket-olustur') {
              navigate('/', { replace: true });
              closeAllModals();
              return;
            }
            fetchCompany();
            navigate('/sirket-olustur', { state: { background: background || location } });
          }}
          onOpenSettings={() => {
            if (!user) {
              handleAuthOpen('signin');
              return;
            }
            if (location.pathname === '/ayarlar') {
              navigate('/', { replace: true });
              closeAllModals();
              return;
            }
            navigate('/ayarlar', { state: { background: background || location } });
          }}
          hasCV={!!currentUserCV}
          userPhotoUrl={user?.user_metadata?.avatar_url || (currentUserCV?.photoUrl)}
          notificationCount={generalNotifications.filter(n => !n.is_read).length}
          notifications={[...generalNotifications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
          onMarkNotificationRead={markNotificationRead}
          onOpenNotifications={() => {
            navigate('/bildirimler', { state: { background: background || location } });
          }}
          onOpenProfile={(uid, role) => {
            const userRole = user?.user_metadata?.role;
            // Only show CV promo if user is clicking their own profile AND doesn't have a CV AND isn't an employer/shop
            if (user && uid === user.id && !currentUserCV && userRole !== 'employer' && userRole !== 'shop') {
              if (isCVPromoOpen) {
                navigate('/', { replace: true });
                closeAllModals();
                return;
              }
              navigate('/', { replace: true });
              closeAllModals();
              setIsCVPromoOpen(true);
              return;
            }
            // Check if already on the profile page
            if (location.pathname === `/cv/${uid}` || location.pathname === `/company/${uid}`) {
              closeAllModals();
              return;
            }
            handleOpenProfile(uid, role || userRole);
          }}
          onOpenSavedCVs={() => {
            setIsSavedCVsOpen(true);
          }}
          onOpenAuth={handleAuthOpen}
          signOut={handleSignOut}
        />
      )}

      <Footer />
      {/* Local Modals have moved into <Routes> below */}


      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        popularProfessions={professionStats}
        popularCities={cityStats}
        weeklyTrends={weeklyRisingStats}
        jobFinders={jobFinders}
        platformStats={platformStats}
        popularCVs={popularCVs}
        popularCompanies={companyList}
        shops={shopList}
        onOpenAuth={handleAuthOpen}
        onJobFinderClick={(cv) => {
          handleOpenProfile(cv.userId, 'job_seeker');
          setIsMobileMenuOpen(false);
        }}
        onCVClick={(cv) => {
          handleOpenProfile(cv.userId || cv.id, 'job_seeker');
          setIsMobileMenuOpen(false);
        }}
        onCompanyClick={(company) => {
          navigate(`/company/${company.slug || company.id}`, { state: { companyData: company, background: background || location } });
          setIsMobileMenuOpen(false);
        }}
        onShopClick={(shop) => {
          setActiveShop(shop);
          setIsShopProfileOpen(true);
          setIsMobileMenuOpen(false);
        }}
        onShopsViewAll={() => {
          setViewMode('shops');
          navigate('/hizmetler');
          setIsMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEmployersViewAll={() => {
          setViewMode('employers');
          navigate('/is-verenler'); // Custom route for employers if needed, or just handle viewMode
          setIsMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onFilterApply={(type, value) => {
          handleFilterUpdate(type, value);
          setIsMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        isEmployer={!!activeCompany || user?.user_metadata?.role === 'employer'}
        onOpenSettings={() => {
          setIsMobileMenuOpen(false);
          navigate('/ayarlar', { state: { background: background || location } });
        }}
        onOpenSavedCVs={() => {
          setIsMobileMenuOpen(false);
          setIsSavedCVsOpen(true);
        }}
        onLogout={handleSignOut}
        onGoHome={() => {
          navigate('/', { replace: true });
          setViewMode('cvs');
          setIsMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      {isJobSuccessOpen && (
        <JobSuccessModal
          onClose={() => setIsJobSuccessOpen(false)}
        />
      )}

      {isShopProfileOpen && activeShop && (
        <ShopProfileModal
          shop={activeShop}
          isOpen={isShopProfileOpen}
          onClose={() => setIsShopProfileOpen(false)}
          onOpenChat={() => {
            if (activeShop.user_id) {
              handleOpenChat(activeShop.user_id);
              setIsShopProfileOpen(false);
            }
          }}
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
      {isCVPromoOpen && (
        <CVPromoModal
          onClose={() => setIsCVPromoOpen(false)}
          onCreateCV={() => {
            setIsCVPromoOpen(false);
            navigate('/cv-olustur', { state: { background: background || location } });
          }}
        />
      )}

      {isAuthModalOpen && (
        <React.Suspense fallback={null}>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authMode}
            initialRole={authRole as any}
          />
        </React.Suspense>
      )}

      <Routes>
        <Route path="/cv/:id" element={
          <CVProfileRoute
            onClose={() => navigate('/', { replace: true })}
            onOpenChat={handleOpenChat}
            handleJobFound={handleJobFound}
          />
        } />
        <Route path="/hizmetler" element={null} />
        <Route path="/is-verenler" element={null} />
        <Route path="/company/:id" element={
          <CompanyProfileRoute
            onClose={() => navigate('/', { replace: true })}
          />
        } />
        <Route path="/kullanim-kosullari" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="general" />
          </React.Suspense>
        } />
        <Route path="/guvenlik-ipuclari" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="security" />
          </React.Suspense>
        } />
        <Route path="/sikca-sorulan-sorular" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="faq" />
          </React.Suspense>
        } />
        <Route path="/yardim-merkezi" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="help" />
          </React.Suspense>
        } />
        <Route path="/hizmetlerimiz" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="services" />
          </React.Suspense>
        } />
        <Route path="/aydinlatma-metni" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="privacy" />
          </React.Suspense>
        } />
        <Route path="/cerez-politikasi" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="cookie" />
          </React.Suspense>
        } />
        <Route path="/kvkk-aydinlatma" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="kvkk" />
          </React.Suspense>
        } />
        <Route path="/uyelik-sozlesmesi" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="membership" />
          </React.Suspense>
        } />
        <Route path="/veri-sahibi-basvuru-formu" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="data_form" />
          </React.Suspense>
        } />
        <Route path="/iletisim" element={
          <React.Suspense fallback={null}>
            <LegalRoute section="iletisim" />
          </React.Suspense>
        } />
        <Route path="/cv-olustur" element={
          <CVFormModal
            onClose={() => navigate('/', { replace: true })}
            onSubmit={async (data) => {
              await handleCreateCV(data);
              navigate('/', { replace: true });
            }}
            onDelete={handleDeleteCV}
            initialData={currentUserCV || (user?.user_metadata ? {
              name: user.user_metadata.full_name || '',
              profession: user.user_metadata.profession || '',
              city: user.user_metadata.city || '',
              experienceYears: user.user_metadata.experience_years ? Number(user.user_metadata.experience_years) : 0,
              experienceMonths: user.user_metadata.experience_months ? Number(user.user_metadata.experience_months) : 0,
              email: user.email || ''
            } : undefined) as Partial<CV>}
            availableCities={availableCities}
          />
        } />
        <Route path="/sirket-olustur" element={
          <CompanyFormModal
            onClose={() => navigate('/', { replace: true })}
            onSubmit={async (data) => {
              await handleCompanySubmit(data);
              navigate('/', { replace: true });
            }}
            initialData={activeCompany || undefined}
            onDelete={handleDeleteCompany}
            availableCities={availableCities}
          />
        } />
        <Route path="/ayarlar" element={
          <SettingsModal onClose={() => navigate('/', { replace: true })} />
        } />
        <Route path="/bildirimler" element={
          <NotificationsModal
            onClose={() => navigate('/', { replace: true })}
            notifications={generalNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllNotificationsRead}
            onOpenProfile={handleOpenProfile}
          />
        } />
      </Routes>

      {user?.user_metadata?.role === 'job_seeker' && currentUserCV && (
        <CVCompletionPrompt 
          completionScore={Math.round(
            (() => {
              let score = 0;
              const cv = currentUserCV;
              if (cv.name) score += 5;
              if (cv.profession) score += 5;
              if (cv.city) score += 5;
              if (cv.birthDate) score += 5;
              if (cv.photoUrl) score += 5;
              if (cv.about && cv.about.length > 100) score += 20;
              else if (cv.about && cv.about.length > 20) score += 10;
              else if (cv.about) score += 5;
              if (cv.workExperience && cv.workExperience.length > 0) score += 15;
              if (cv.educationDetails && cv.educationDetails.length > 0) score += 10;
              else if (cv.education) score += 5;
              let otherCount = 0;
              if (cv.internshipDetails && cv.internshipDetails.length > 0) otherCount++;
              if (cv.languageDetails && cv.languageDetails.length > 0) otherCount++;
              if (cv.certificates && cv.certificates.length > 0) otherCount++;
              if (cv.references && cv.references.length > 0) otherCount++;
              score += Math.min(otherCount * 2.5, 10);
              return Math.min(score, 100);
            })()
          )}
          onEdit={() => navigate('/cv-olustur')}
        />
      )}
    </div>
  );
};
export default App;
