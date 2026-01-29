
export interface EducationEntry {
  id: string;
  university: string;
  department: string;
  level: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

export interface WorkExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: string;
}

export interface CertificateEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CV {
  id: string;
  userId: string;
  name: string;
  profession: string;
  city: string;
  district?: string;
  experienceYears: number;
  language: string; // Legacy / Primary Display
  languageLevel?: string; // Legacy
  languageDetails?: LanguageEntry[];
  certificates?: CertificateEntry[];
  photoUrl: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency?: string;
  about: string;
  skills: string[];
  education: string; // Legacy / Primary Display
  educationLevel?: string; // Legacy
  graduationStatus?: string; // Legacy
  educationDetails?: EducationEntry[];
  workExperience?: WorkExperienceEntry[];
  workType?: string;
  employmentType?: string;
  militaryStatus?: string;
  maritalStatus?: string;
  disabilityStatus?: string;
  driverLicense?: string[];
  travelStatus?: string;
  noticePeriod?: string;
  isNew?: boolean;
  isActive?: boolean;
  views?: number;
  isPlaced?: boolean;
  email?: string;
  phone?: string;
  isEmailPublic?: boolean;
  isPhonePublic?: boolean;
  references?: Array<{
    id: string;
    name: string;
    company: string;
    role: string;
    phone?: string;
    email?: string;
  }>;
  workingStatus?: 'active' | 'passive' | 'open';
  preferredCity?: string;
  preferredRoles?: string[];
  created_at?: string;
}

export interface FilterState {
  profession: string;
  city: string;
  experience: string;
  language: string;
  languageLevel: string;
  salaryMin: number | '';
  salaryMax: number | '';
  salaryCurrency?: string;
  skills: string[];
  workType: string;
  employmentType: string;
  educationLevel: string;
  graduationStatus: string;
  militaryStatus: string;
  maritalStatus: string;
  disabilityStatus: string;
  noticePeriod: string;
  travelStatus: string;
  driverLicenses: string[];
}

export interface Notification {
  id: string;
  type: 'CONTACT_REQUEST' | 'APPROVED' | 'VIEW' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  companyName?: string;
  requestId?: string; // For handling actions
  requesterId?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'contact_request' | 'contact_request_received';
  is_read: boolean;
  created_at: string;
  sender_id?: string;
  sender?: {
    full_name: string;
    avatar_url?: string;
    role?: string;
    companies?: any[];
    cvs?: any[];
  };
  related_id?: string;
  requestStatus?: string;  // Pre-fetched status from App.tsx
}

export interface ContactRequest {
  id: string;
  requester_id: string;
  target_user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  requester?: {
    full_name: string;
    avatar_url?: string;
    role?: string;
  };
}

export interface Statistic {
  label: string;
  value: string;
  change?: string;
}

export interface PopularItem {
  label: string;
  count: number;
}

export interface TrendItem {
  label: string;
  growth: number;
}

export type UserRole = 'job_seeker' | 'employer';

export interface Company {
  id: string;
  userId: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  city?: string;
  district?: string;
  country?: string;
  address?: string;
  logoUrl?: string;
  createdAt?: string;
}

export interface PopularCompany extends Company {
  interaction_count: number;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
}
