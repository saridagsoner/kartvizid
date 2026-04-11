import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CV, FilterState, ContactRequest, Company, NotificationItem, Conversation, Message } from './types';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { useToast } from './context/ToastContext';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import BusinessCard from './components/BusinessCard';
import CompanyCard from './components/CompanyCard';
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
import CVFormContent from './components/CVFormContent';
import SettingsModal from './components/SettingsModal';
import CompanyFormModal from './components/CompanyFormModal';
import CompanyFormContent from './components/CompanyFormContent';
import SettingsDetailView from './components/SettingsDetailView';
import NotificationsModal from './components/NotificationsModal';
import CVProfileRoute from './components/CVProfileRoute';
import CompanyProfileRoute from './components/CompanyProfileRoute';
import ShopCard from './components/ShopCard';
import ShopProfileModal from './components/ShopProfileModal';
import CVCompletionPrompt from './components/CVCompletionPrompt';
import CookieConsent from './components/CookieConsent';
import DesktopNav from './components/DesktopNav';

import SelectionModal from './components/SelectionModal';
import KartvizidList from './components/KartvizidList';
import BlogRoute from './components/BlogRoute';
import LegalList from './components/LegalList';
import LegalRoute from './components/LegalRoute';
import ConversationsList from './components/ConversationsList';
import ChatDetailView from './components/ChatDetailView';
import HomeDiscoveryContent from './components/HomeDiscoveryContent';

// Lazy loaded auxiliary modals
const JobSuccessModal = React.lazy(() => import('./components/JobSuccessModal'));
const SavedCVsModal = React.lazy(() => import('./components/SavedCVsModal'));
const AdvancedFilterModal = React.lazy(() => import('./components/AdvancedFilterModal'));
const ResetPasswordModal = React.lazy(() => import('./components/ResetPasswordModal'));
const CVPromoModal = React.lazy(() => import('./components/CVPromoModal'));
const AuthModal = React.lazy(() => import('./components/AuthModal'));

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

  // 3-Column Layout Logic
  const isDiscoveryView = useMemo(() => {
    const path = location.pathname;
    const legalPaths = [
      '/kullanim-kosullari', '/guvenlik-ipuclari', '/sikca-sorulan-sorular',
      '/yardim-merkezi', '/hizmetlerimiz', '/aydinlatma-metni',
      '/cerez-politikasi', '/kvkk-aydinlatma', '/uyelik-sozlesmesi',
      '/veri-sahibi-basvuru-formu', '/iletisim', '/hakkimizda'
    ];
    
     return path === '/' || 
            path === '' ||
            path.startsWith('/cv/') || 
            path.startsWith('/company/') || 
            path === '/is-verenler' || 
            path === '/hizmetler' ||
            path.startsWith('/rehber') ||
            path.startsWith('/kartvizid/') ||
            path.startsWith('/mesajlar') ||
            path === '/premium' ||
            path.startsWith('/ayarlar') ||
            path === '/cv-olustur' ||
            path === '/cv-guncelle' ||
            path === '/sirket-olustur' ||
            path === '/sirket-guncelle' ||
            path === '/bildirimler' ||
            legalPaths.includes(path);
  }, [location.pathname]);

  const isHomeView = useMemo(() => location.pathname === '/', [location.pathname]);

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
    skills: [],
    preferredCities: [],
    preferredCountries: []
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authRole, setAuthRole] = useState<'job_seeker' | 'employer' | 'shop' | undefined>(undefined);
  const [activeShop, setActiveShop] = useState<any | null>(null);
  const [isShopProfileOpen, setIsShopProfileOpen] = useState(false);
  const [activeModalRequest, setActiveModalRequest] = useState<ContactRequest | null>(null);
  const [activeModalRequestId, setActiveModalRequestId] = useState<string | null>(null);
  const [isJobSuccessOpen, setIsJobSuccessOpen] = useState(false);
  const [isSavedCVsOpen, setIsSavedCVsOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilterModal, setActiveFilterModal] = useState<'professions' | 'cities' | 'experience' | 'advanced' | null>(null);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
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


  // Handle Company Click
  const handleCompanyClick = (company: Company) => {
    navigate(`/company/${company.slug || company.id}`, { 
      state: { 
        companyData: company, 
        background: background || location 
      } 
    });
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

  const markAllRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_visible: false })
        .eq('user_id', user.id);

      if (error) throw error;
      setGeneralNotifications([]);
      showToast('Bildirimler temizlendi.', 'success');
    } catch (error: any) {
      console.error('Error clearing notifications:', error);
      showToast('Bildirimler silinemedi: ' + error.message, 'error');
    }
  };

  const handleNotificationAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;
      showToast(action === 'approved' ? 'İstek onaylandı.' : 'İstek reddedildi.', 'success');
      fetchGeneralNotifications();
    } catch (error: any) {
      console.error('Error handling notification action:', error);
      showToast('İşlem başarısız: ' + error.message, 'error');
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
        isPlaced: item.is_placed,
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
        .or('is_placed.eq.true,working_status.eq.active')
        .order('updated_at', { ascending: false })
        .limit(10);

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
        isPlaced: item.is_placed,
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
          isPlaced: item.is_placed,
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
      
      const isDesktop = window.innerWidth >= 1024; // Simple check or use useMediaQuery hook logic
      if (isDesktop) {
        navigate(`/mesajlar/${conv.id}`);
      } else {
        setIsMessagesOpen(true);
      }
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
    const allProfessions = cvList.reduce((acc, cv) => {
      const profs = cv.profession?.split(',').map(p => p.trim()).filter(Boolean) || [];
      return acc.concat(profs);
    }, [] as string[]);
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

  // Mobile Swipe Gestures Implementation
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Detect horizontal swipe (horizontal movement > vertical movement)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        // SWIPE RIGHT (Left to Right)
        if (deltaX > 0) {
          // Edge Swipe logic (Starts from the first 70px of the screen)
          if (touchStartX < 70) {
            const path = location.pathname;
            const isDetailView = path !== '/' && 
                              (path.startsWith('/cv/') || 
                               (path.startsWith('/rehber/') && path !== '/rehber') || 
                               path.startsWith('/company/'));
            
            if (isDetailView && window.innerWidth < 1024) {
              // On mobile detail views, swiping from left edge goes BACK
              navigate(-1);
            } else if (window.innerWidth < 1024) {
              // On main pages/lists, swiping from left edge opens the MENU
              setIsMobileMenuOpen(true);
            }
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [location.pathname, navigate]);

  // All local render functions for HomeDiscoveryContent have been moved to components/HomeDiscoveryContent.tsx

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <SEO />
      <Navbar
        onSearch={setSearchQuery}
        onCreateCV={() => navigate('/cv-olustur')}
        onOpenSettings={() => navigate('/ayarlar')}
        hasCV={!!currentUserCV}
        userPhotoUrl={currentUserCV?.photoUrl || activeCompany?.logoUrl}
        notificationCount={generalNotifications.filter(n => !n.is_read).length}
        notifications={[...generalNotifications].sort((a,b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })}
        onMarkNotificationRead={markNotificationRead}
        onOpenProfile={handleOpenProfile}
        onOpenAuth={handleAuthOpen}
        onOpenSavedCVs={() => setIsSavedCVsOpen(true)}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        unreadMessageCount={unreadMessageCount}
        onOpenMessages={() => {
          if (window.innerWidth >= 1024) {
            navigate('/mesajlar');
          } else {
            setIsMessagesOpen(true);
          }
        }}
        onOpenCompanyProfile={() => navigate(activeCompany ? '/sirket-guncelle' : '/sirket-olustur')}
        onToggleFilter={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
        isFilterOpen={isDesktopFilterOpen}
      />

      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onRefreshConversations={fetchConversations}
      />

      <div className="flex-1 flex justify-center pt-[68px] md:pt-[64px] px-0 sm:px-2 md:px-0">
        <div className="max-w-[1600px] w-full flex items-start pb-12 lg:pl-[58px] lg:pr-6 xl:pl-[84px] xl:pr-12 gap-0">
          
          {/* COLUMN 1: LEFT NAVIGATION (Desktop Only) */}
          <aside className="hidden lg:block lg:w-[220px] xl:w-[255px] shrink sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto pb-4 border-r border-gray-200/70 dark:border-white/10 pr-2 transition-all duration-300 no-scrollbar">
            <DesktopNav 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              user={user}
              isEmployer={!!activeCompany || user?.user_metadata?.role === 'employer'}
              onOpenAuth={handleAuthOpen}
              onSignOut={handleSignOut}
              onOpenSavedCVs={() => setIsSavedCVsOpen(true)}
              popularProfessions={professionStats}
              popularCities={cityStats}
              platformStats={platformStats}
              jobFinders={jobFinders}
              onCVClick={handleCVClick}
              loading={loading}
              unreadMessageCount={unreadMessageCount}
              notificationCount={generalNotifications.filter(n => !n.is_read).length}
            />
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 flex items-start min-w-0 h-full">
            
            {/* COLUMN 2: MIDDLE CONTENT (Feed or Full Page) */}
            <section className={`flex-1 min-w-0 flex flex-col transition-all duration-500 overflow-hidden h-[calc(100vh-64px)] ${
              isDiscoveryView ? 'lg:max-w-[520px] xl:max-w-[525px] border-r border-gray-200/70 dark:border-white/10' : 'w-full'
            }`}>
              <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth lg:pl-2">
                <Routes key={location.pathname.split('/')[1] || 'home'}>
                  {/* Discovery Routes (List View) */}
                  <Route path="/" element={<HomeDiscoveryContent viewMode={viewMode} sortBy={sortBy} setSortBy={setSortBy} isDesktopFilterOpen={isDesktopFilterOpen} activeFilters={activeFilters} handleFilterUpdate={handleFilterUpdate} availableProfessions={availableProfessions} availableCities={availableCities} activeFilterModal={activeFilterModal} setActiveFilterModal={setActiveFilterModal} loading={loading} currentItems={currentItems} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleCVClick={handleCVClick} handleCompanyClick={handleCompanyClick} filteredEmployers={filteredEmployers} filteredShops={filteredShops} filteredCVs={filteredCVs} ITEMS_PER_PAGE={ITEMS_PER_PAGE} showEndMessage={showEndMessage} activeShop={activeShop} setActiveShop={setActiveShop} isShopProfileOpen={isShopProfileOpen} setIsShopProfileOpen={setIsShopProfileOpen} t={t} />} />
                  <Route path="/cv/:id" element={<HomeDiscoveryContent viewMode={viewMode} sortBy={sortBy} setSortBy={setSortBy} isDesktopFilterOpen={isDesktopFilterOpen} activeFilters={activeFilters} handleFilterUpdate={handleFilterUpdate} availableProfessions={availableProfessions} availableCities={availableCities} activeFilterModal={activeFilterModal} setActiveFilterModal={setActiveFilterModal} loading={loading} currentItems={currentItems} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleCVClick={handleCVClick} handleCompanyClick={handleCompanyClick} filteredEmployers={filteredEmployers} filteredShops={filteredShops} filteredCVs={filteredCVs} ITEMS_PER_PAGE={ITEMS_PER_PAGE} showEndMessage={showEndMessage} activeShop={activeShop} setActiveShop={setActiveShop} isShopProfileOpen={isShopProfileOpen} setIsShopProfileOpen={setIsShopProfileOpen} t={t} />} />
                  <Route path="/company/:id" element={<HomeDiscoveryContent viewMode={viewMode} sortBy={sortBy} setSortBy={setSortBy} isDesktopFilterOpen={isDesktopFilterOpen} activeFilters={activeFilters} handleFilterUpdate={handleFilterUpdate} availableProfessions={availableProfessions} availableCities={availableCities} activeFilterModal={activeFilterModal} setActiveFilterModal={setActiveFilterModal} loading={loading} currentItems={currentItems} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleCVClick={handleCVClick} handleCompanyClick={handleCompanyClick} filteredEmployers={filteredEmployers} filteredShops={filteredShops} filteredCVs={filteredCVs} ITEMS_PER_PAGE={ITEMS_PER_PAGE} showEndMessage={showEndMessage} activeShop={activeShop} setActiveShop={setActiveShop} isShopProfileOpen={isShopProfileOpen} setIsShopProfileOpen={setIsShopProfileOpen} t={t} />} />
                  <Route path="/hizmetler" element={<HomeDiscoveryContent viewMode={viewMode} sortBy={sortBy} setSortBy={setSortBy} isDesktopFilterOpen={isDesktopFilterOpen} activeFilters={activeFilters} handleFilterUpdate={handleFilterUpdate} availableProfessions={availableProfessions} availableCities={availableCities} activeFilterModal={activeFilterModal} setActiveFilterModal={setActiveFilterModal} loading={loading} currentItems={currentItems} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleCVClick={handleCVClick} handleCompanyClick={handleCompanyClick} filteredEmployers={filteredEmployers} filteredShops={filteredShops} filteredCVs={filteredCVs} ITEMS_PER_PAGE={ITEMS_PER_PAGE} showEndMessage={showEndMessage} activeShop={activeShop} setActiveShop={setActiveShop} isShopProfileOpen={isShopProfileOpen} setIsShopProfileOpen={setIsShopProfileOpen} t={t} />} />
                  <Route path="/is-verenler" element={<HomeDiscoveryContent viewMode={viewMode} sortBy={sortBy} setSortBy={setSortBy} isDesktopFilterOpen={isDesktopFilterOpen} activeFilters={activeFilters} handleFilterUpdate={handleFilterUpdate} availableProfessions={availableProfessions} availableCities={availableCities} activeFilterModal={activeFilterModal} setActiveFilterModal={setActiveFilterModal} loading={loading} currentItems={currentItems} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleCVClick={handleCVClick} handleCompanyClick={handleCompanyClick} filteredEmployers={filteredEmployers} filteredShops={filteredShops} filteredCVs={filteredCVs} ITEMS_PER_PAGE={ITEMS_PER_PAGE} showEndMessage={showEndMessage} activeShop={activeShop} setActiveShop={setActiveShop} isShopProfileOpen={isShopProfileOpen} setIsShopProfileOpen={setIsShopProfileOpen} t={t} />} />
                  
                  {/* Unified Content Lists (Middle Column) */}
                  <Route path="/rehber/*" element={<BlogRoute isInline={true} viewType="list" />} />
                  <Route path="/kullanim-kosullari" element={<LegalList />} />
                  <Route path="/guvenlik-ipuclari" element={<LegalList />} />
                  <Route path="/sikca-sorulan-sorular" element={<LegalList />} />
                  <Route path="/yardim-merkezi" element={<LegalList />} />
                  <Route path="/hizmetlerimiz" element={<LegalList />} />
                  <Route path="/aydinlatma-metni" element={<LegalList />} />
                  <Route path="/cerez-politikasi" element={<LegalList />} />
                  <Route path="/kvkk-aydinlatma" element={<LegalList />} />
                  <Route path="/uyelik-sozlesmesi" element={<LegalList />} />
                  <Route path="/veri-sahibi-basvuru-formu" element={<LegalList />} />
                  <Route path="/iletisim" element={<LegalList />} />
                  <Route path="/hakkimizda" element={<LegalList />} />

                  {/* Kartvizid Discovery Routes */}
                  <Route path="/kartvizid/is-bulanlar" element={<KartvizidList type="job-finders" jobFinders={jobFinders} popularProfessions={professionStats} popularCities={cityStats} popularCVs={popularCVs} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/kartvizid/is-bulanlar/:id" element={<KartvizidList type="job-finders" jobFinders={jobFinders} popularProfessions={professionStats} popularCities={cityStats} popularCVs={popularCVs} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/kartvizid/populer-meslekler" element={<KartvizidList type="professions" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[...cvList].sort((a,b) => (b.views || 0) - (a.views || 0))} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/kartvizid/one-cikan-sehirler" element={<KartvizidList type="cities" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[...cvList].sort((a,b) => (b.views || 0) - (a.views || 0))} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/kartvizid/en-cok-gorununtulenenler" element={<KartvizidList type="most-viewed" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[...cvList].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 10)} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/kartvizid/en-cok-gorununtulenenler/:id" element={<KartvizidList type="most-viewed" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[...cvList].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 10)} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/kartvizid/istatistikler" element={<KartvizidList type="stats" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[...cvList].sort((a,b) => (b.views || 0) - (a.views || 0))} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/premium" element={<KartvizidList type="premium" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[...cvList].sort((a,b) => (b.views || 0) - (a.views || 0))} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />

                  {/* Messaging Discovery Routes */}
                  <Route path="/mesajlar" element={<ConversationsList conversations={conversations} activeConversationId={activeConversationId} onRefreshConversations={fetchConversations} user={user} />} />
                  <Route path="/mesajlar/:id" element={<ConversationsList conversations={conversations} activeConversationId={activeConversationId} onRefreshConversations={fetchConversations} user={user} />} />

                  {/* Page Routes (Full Width on Desktop or Modal) */}
                  <Route path="/ayarlar" element={
                    window.innerWidth >= 1024 ? <KartvizidList type="settings" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[]} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} /> : <SettingsModal onClose={() => navigate('/', { replace: true })} />
                  } />
                  <Route path="/ayarlar/:tab" element={<KartvizidList type="settings" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[]} platformStats={platformStats} onFilterApply={handleFilterUpdate} user={user} />} />
                  <Route path="/cv-olustur" element={
                    window.innerWidth >= 1024 ? <KartvizidList type="cv-tips" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[]} platformStats={platformStats} onFilterApply={handleFilterUpdate} /> : <CVFormModal onClose={() => navigate('/', { replace: true })} onSubmit={handleCreateCV} initialData={currentUserCV || {}} availableCities={availableCities} />
                   } />
                   <Route path="/cv-guncelle" element={
                    window.innerWidth >= 1024 ? <KartvizidList type="cv-tips" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[]} platformStats={platformStats} onFilterApply={handleFilterUpdate} /> : <CVFormModal onClose={() => navigate('/', { replace: true })} onSubmit={handleCreateCV} initialData={currentUserCV || {}} availableCities={availableCities} />
                   } />
                   <Route path="/sirket-olustur" element={
                     window.innerWidth >= 1024 ? <KartvizidList type="employer-tips" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[]} platformStats={platformStats} onFilterApply={handleFilterUpdate} /> : <CompanyFormModal onClose={() => navigate('/', { replace: true })} onSubmit={handleCompanySubmit} initialData={activeCompany || {}} availableCities={availableCities} />
                    } />
                    <Route path="/sirket-guncelle" element={
                     window.innerWidth >= 1024 ? <KartvizidList type="employer-tips" jobFinders={cvList} popularProfessions={professionStats} popularCities={cityStats} popularCVs={[]} platformStats={platformStats} onFilterApply={handleFilterUpdate} /> : <CompanyFormModal onClose={() => navigate('/', { replace: true })} onSubmit={handleCompanySubmit} initialData={activeCompany || {}} availableCities={availableCities} />
                    } />
                    <Route path="/bildirimler" element={
                      window.innerWidth >= 1024 ? (
                        <KartvizidList 
                          type="notifications" 
                          jobFinders={cvList} 
                          popularProfessions={professionStats} 
                          popularCities={cityStats} 
                          popularCVs={[]} 
                          platformStats={platformStats} 
                          onFilterApply={handleFilterUpdate} 
                          notifications={[...generalNotifications].sort((a, b) => {
                            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                            return dateB - dateA;
                          })} 
                          onMarkRead={markNotificationRead} 
                          onMarkAllRead={markAllRead} 
                          onNotificationAction={handleNotificationAction} 
                          user={user}
                        />
                      ) : (
                        <NotificationsModal 
                          onClose={() => navigate('/', { replace: true })} 
                          notifications={generalNotifications} 
                          onMarkRead={markNotificationRead} 
                          onMarkAllRead={markAllRead} 
                          onAction={handleNotificationAction} 
                          onOpenProfile={handleOpenProfile} 
                        />
                      )
                    } />
                  <Route path="*" element={<LegalRoute section="general" />} />
                </Routes>
              </div>
            </section>

            {/* COLUMN 3: RIGHT DETAIL PANEL (Desktop Only) */}
             <aside className={`hidden lg:block flex-1 max-w-[585px] min-w-[320px] h-[calc(100vh-64px)] sticky top-[64px] overflow-hidden bg-white dark:bg-[#0f172a] transition-all duration-500 border-r border-gray-200/70 dark:border-white/10 ${
              isDiscoveryView || location.pathname.startsWith('/rehber/') || location.pathname === '/cv-olustur' || location.pathname === '/cv-guncelle' || location.pathname === '/sirket-olustur' || location.pathname === '/sirket-guncelle' || location.pathname === '/bildirimler' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none w-0 flex-none'
            }`}>
              <div className="h-full">
                <Routes>
                  <Route path="/cv/:id" element={<CVProfileRoute isInline={true} onOpenChat={handleOpenChat} handleJobFound={handleJobFound} />} />
                  <Route path="/company/:id" element={<CompanyProfileRoute isInline={true} />} />
                  
                  {/* Unified Content Details (Right Column) */}
                  <Route path="/rehber/:slug" element={<BlogRoute isInline={true} viewType="detail" />} />
                  <Route path="/kullanim-kosullari" element={<LegalRoute section="general" isInline={true} />} />
                  <Route path="/guvenlik-ipuclari" element={<LegalRoute section="security" isInline={true} />} />
                  <Route path="/sikca-sorulan-sorular" element={<LegalRoute section="faq" isInline={true} />} />
                  <Route path="/yardim-merkezi" element={<LegalRoute section="help" isInline={true} />} />
                  <Route path="/hizmetlerimiz" element={<LegalRoute section="services" isInline={true} />} />
                  <Route path="/aydinlatma-metni" element={<LegalRoute section="privacy" isInline={true} />} />
                  <Route path="/cerez-politikasi" element={<LegalRoute section="cookie" isInline={true} />} />
                  <Route path="/kvkk-aydinlatma" element={<LegalRoute section="kvkk" isInline={true} />} />
                  <Route path="/uyelik-sozlesmesi" element={<LegalRoute section="membership" isInline={true} />} />
                  <Route path="/veri-sahibi-basvuru-formu" element={<LegalRoute section="data_form" isInline={true} />} />
                  <Route path="/iletisim" element={<LegalRoute section="iletisim" isInline={true} />} />
                  <Route path="/hakkimizda" element={<LegalRoute section="about" isInline={true} />} />
                  
                  {/* Messaging Detail Routes */}
                  <Route path="/mesajlar" element={<ChatDetailView conversations={conversations} onRefreshConversations={fetchConversations} />} />
                  <Route path="/mesajlar/:id" element={<ChatDetailView conversations={conversations} onRefreshConversations={fetchConversations} />} />
                  
                  {/* Settings Detail Routes */}
                  <Route path="/ayarlar" element={<SettingsDetailView activeTab={user ? "account" : "general"} />} />
                  <Route path="/ayarlar/hesap" element={<SettingsDetailView activeTab="account" />} />
                  <Route path="/ayarlar/genel" element={<SettingsDetailView activeTab="general" />} />
                  <Route path="/ayarlar/guvenlik" element={<SettingsDetailView activeTab="security" />} />
                  <Route path="/ayarlar/bildirimler" element={<SettingsDetailView activeTab="notifications" />} />
                  
                  {/* CV Form Detail Routes (Right Column) */}
                  <Route path="/cv-olustur" element={<CVFormContent isInline={true} onSubmit={handleCreateCV} initialData={currentUserCV || {}} availableCities={availableCities} />} />
                  <Route path="/cv-guncelle" element={<CVFormContent isInline={true} onSubmit={handleCreateCV} onDelete={handleDeleteCV} initialData={currentUserCV || {}} availableCities={availableCities} />} />
                  
                  {/* Company Form Detail Routes (Right Column) */}
                  <Route path="/sirket-olustur" element={<CompanyFormContent isInline={true} onSubmit={handleCompanySubmit} initialData={activeCompany || {}} />} />
                  <Route path="/sirket-guncelle" element={<CompanyFormContent isInline={true} onSubmit={handleCompanySubmit} onDelete={handleDeleteCompany} initialData={activeCompany || {}} />} />
                  
                  {/* Kartvizid detail routes can reuse CV detail for job finders/most viewed */}
                  <Route path="/kartvizid/is-bulanlar" element={
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-[2.5rem] flex items-center justify-center mb-8">
                            <i className="fi fi-rr-medal text-4xl text-green-600 dark:text-green-400"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Kartvizid Başarıları</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            Bu alanda, Kartvizid platformu aracılığıyla hayalindeki işe kavuşan ve kariyer yolculuğunda yeni bir sayfa açan kullanıcılarımızı görüyorsunuz.
                            <br /><br />
                            Siz de dijital kartvizitinizi güncel tutarak işverenlerin dikkatini çekebilir ve bu başarı listesinde yerinizi alabilirsiniz.
                        </p>
                    </div>
                  } />
                  <Route path="/kartvizid/is-bulanlar/:id" element={<CVProfileRoute isInline={true} onOpenChat={handleOpenChat} handleJobFound={handleJobFound} />} />
                  <Route path="/kartvizid/en-cok-gorununtulenenler/:id" element={<CVProfileRoute isInline={true} onOpenChat={handleOpenChat} handleJobFound={handleJobFound} />} />
                  
                  <Route path="/kartvizid/en-cok-gorununtulenenler" element={
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-[2.5rem] flex items-center justify-center mb-8">
                            <i className="fi fi-rr-fire text-4xl text-orange-500 dark:text-orange-400"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">En Popüler Kartvizitler</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            Platformun en çok ilgi gören ve en çok tıklanan profilleri burada listelenmektedir. 
                            <br /><br />
                            Profilinizi optimize ederek ve sosyal medyanızda paylaşarak siz de görünürlüğünüzü artırabilirsiniz.
                        </p>
                    </div>
                  } />
                  
                  {/* Informational Detail for Popular Professions */}
                  <Route path="/kartvizid/populer-meslekler" element={
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 rounded-[2.5rem] flex items-center justify-center mb-8">
                            <i className="fi fi-rr-chart-user text-4xl text-[#1f6d78] dark:text-[#2dd4bf]"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Meslek Trendleri</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            Bu listede yer alan meslekler, Kartvizid platformu üzerindeki CV görüntülenme sayıları ve işverenlerin arama trendlerine göre anlık olarak güncellenmektedir. 
                            <br /><br />
                            Hangi alanlarda yoğunluk olduğunu analiz ederek kariyer yolculuğunuzu daha bilinçli şekillendirebilirsiniz.
                        </p>
                    </div>
                  } />

                   <Route path="/kartvizid/one-cikan-sehirler" element={
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 rounded-[2.5rem] flex items-center justify-center mb-8">
                            <i className="fi fi-rr-world text-4xl text-[#1f6d78] dark:text-[#2dd4bf]"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Şehir İstatistikleri</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            Platformdaki dijital kartvizitlerin coğrafi dağılımını buradan takip edebilirsiniz. Yeni yeteneklerin hangi şehirlerde yoğunlaştığını ve bölgesel iş gücü potansiyelini analiz edebilmeniz için hazırlanmıştır.
                        </p>
                    </div>
                  } />

                  <Route path="/kartvizid/istatistikler" element={
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 dark:text-gray-600">
                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] flex items-center justify-center mb-8">
                            <i className="fi fi-rr-stats text-4xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Platform Verileri</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            Kartvizid platformunun büyüme ve etkileşim verilerini buradan şeffaf bir şekilde takip edebilirsiniz.
                            <br /><br />
                            Kayıtlı kullanıcı sayısından haftalık yeni katılım oranlarına kadar tüm veriler, platformun gerçek zamanlı performansını yansıtmaktadır.
                        </p>
                    </div>
                  } />

                  <Route path="/premium" element={
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 rounded-[2.5rem] flex items-center justify-center mb-8 group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1f6d78]/20 to-transparent scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                            <i className="fi fi-rr-membership-vip text-4xl text-[#1f6d78] dark:text-[#2dd4bf] relative z-10 transition-transform duration-500 group-hover:scale-110"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Geleceğin Kariyer Deneyimi</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            Kartvizid Premium, hem adaylar hem de işverenler için sınırları ortadan kaldıran bir ekosistem olarak tasarlanıyor. 
                            <br /><br />
                            Adayların daha görünür olduğu, işverenlerin ise doğru yeteneğe anında ulaştığı bu yeni deneyimle yakında tanışacaksınız. Kariyer yolculuğunuzu bir üst seviyeye taşımak için heyecan verici özellikler hazırlıyoruz.
                        </p>
                        <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#1f6d78] dark:bg-[#2dd4bf] animate-pulse"></span>
                           <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Çok Yakında</span>
                        </div>
                    </div>
                  } />

                  <Route path="*" element={
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 dark:text-gray-600">
                       <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                          <i className={`fi ${
                            location.pathname.startsWith('/rehber') ? 'fi-rr-book-alt' :
                            location.pathname === '/' ? 'fi-rr-cursor-finger' : 'fi-rr-document-signed'
                          } text-3xl`}></i>
                       </div>
                       <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                        {location.pathname.startsWith('/rehber') ? 'Makale Seçin' : 'Detayları Gör'}
                       </h3>
                       <p className="text-sm font-medium">
                        {location.pathname.startsWith('/rehber') 
                          ? 'Okumak istediğiniz makaleyi soldaki listeden seçebilirsiniz.' 
                          : 'Soldaki listeden bir seçim yaparak detaylarını burada inceleyebilirsiniz.'
                        }
                       </p>
                    </div>
                  } />
                </Routes>
              </div>
            </aside>
          </main>
        </div>
      </div>

      <MobileBottomNav
        user={user}
        cvList={cvList}
        onOpenFilter={() => setActiveFilterModal('advanced')}
        isProfileOpen={isMyProfileOpen}
        isCreateOpen={location.pathname === '/cv-olustur' || location.pathname === '/sirket-olustur'}
        isHomeView={isHomeView}
        onGoHome={() => { navigate('/', { replace: true }); setViewMode('cvs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onSearch={setSearchQuery}
        onCreateCV={() => user ? navigate('/cv-olustur') : handleAuthOpen('signin')}
        onOpenCompanyProfile={() => user ? navigate('/sirket-olustur') : handleAuthOpen('signin', 'employer')}
        onOpenSettings={() => navigate('/ayarlar')}
        currentFilters={activeFilters}
        onFilterApply={handleFilterUpdate}
        availableProfessions={availableProfessions}
        availableCities={availableCities}
        hasCV={!!currentUserCV}
        userPhotoUrl={user?.user_metadata?.avatar_url || currentUserCV?.photoUrl}
        notificationCount={generalNotifications.filter(n => !n.is_read).length}
        notifications={[...generalNotifications].sort((a,b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })}
        onMarkNotificationRead={markNotificationRead}
        onOpenNotifications={() => navigate('/bildirimler')}
        onOpenProfile={handleOpenProfile}
        onOpenSavedCVs={() => setIsSavedCVsOpen(true)}
        onOpenAuth={handleAuthOpen}
        signOut={handleSignOut}
      />

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAuth={handleAuthOpen}
        onLogout={handleSignOut}
        onGoHome={() => { navigate('/'); setIsMobileMenuOpen(false); }}
        onEmployersViewAll={() => { navigate('/is-verenler'); setIsMobileMenuOpen(false); }}
        onShopsViewAll={() => { navigate('/hizmetler'); setIsMobileMenuOpen(false); }}
        popularProfessions={professionStats}
        popularCities={cityStats}
        weeklyTrends={[]}
        platformStats={platformStats}
        jobFinders={jobFinders}
        popularCVs={popularCVs}
        popularCompanies={companyList}
        shops={shopList}
        onJobFinderClick={handleCVClick}
        onCVClick={handleCVClick}
        onCompanyClick={handleCompanyClick}
        onShopClick={(shop) => { setActiveShop(shop); setIsShopProfileOpen(true); }}
        onFilterApply={(type, val) => handleFilterUpdate(type, val)}
        unreadMessageCount={conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
        onOpenSettings={() => { navigate('/ayarlar'); setIsMobileMenuOpen(false); }}
        notificationCount={generalNotifications.filter(n => !n.is_read).length}
      />

      <React.Suspense fallback={null}>
        {isSavedCVsOpen && user && <SavedCVsModal userId={user.id} onClose={() => setIsSavedCVsOpen(false)} onOpenCV={(id) => { setIsSavedCVsOpen(false); handleOpenProfile(id, 'job_seeker'); }} />}
        {isCVPromoOpen && <CVPromoModal onClose={() => setIsCVPromoOpen(false)} onCreateCV={() => { setIsCVPromoOpen(false); navigate('/cv-olustur'); }} />}
        {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} initialRole={authRole as any} />}
        {isShopProfileOpen && activeShop && <ShopProfileModal shop={activeShop} isOpen={isShopProfileOpen} onClose={() => setIsShopProfileOpen(false)} onOpenChat={handleOpenChat} />}
        
        {/* Mobile Detail Modals (Triggered when on mobile and route matches) */}
        {window.innerWidth < 1024 && location.pathname.includes('/cv/') && (() => {
          const id = location.pathname.split('/cv/')[1];
          const cv = cvList.find(c => c.slug === id || c.id === id);
          return cv ? (
            <ProfileModal 
              cv={cv} 
              onClose={() => navigate('/')} 
              onOpenChat={handleOpenChat} 
              onJobFound={handleJobFound} 
            />
          ) : null;
        })()}

        {window.innerWidth < 1024 && location.pathname.includes('/company/') && (() => {
          const id = location.pathname.split('/company/')[1];
          const company = companyList.find(c => c.slug === id || c.id === id);
          return company ? (
            <CompanyProfileModal 
              company={company} 
              onClose={() => navigate('/')} 
            />
          ) : null;
        })()}

        {/* Mobile Blog/Article Detail */}
        {window.innerWidth < 1024 && location.pathname.startsWith('/rehber/') && location.pathname !== '/rehber' && (
          <BlogRoute isInline={false} viewType="detail" />
        )}
        
        {isJobSuccessOpen && <JobSuccessModal onClose={() => setIsJobSuccessOpen(false)} />}
        {isMessagesOpen && window.innerWidth < 1024 && (
          <MessagesModal 
            isOpen={isMessagesOpen} 
            onClose={() => setIsMessagesOpen(false)}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            onRefreshConversations={fetchConversations}
          />
        )}
      </React.Suspense>



      <Footer />
      <CookieConsent />

      {user?.user_metadata?.role === 'job_seeker' && currentUserCV && (
        <CVCompletionPrompt completionScore={75} onEdit={() => navigate('/cv-olustur')} />
      )}
    </div>
  );
};

export default App;
