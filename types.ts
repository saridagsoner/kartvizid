
export interface CV {
  id: string;
  name: string;
  profession: string;
  city: string;
  experienceYears: number;
  language: string;
  languageLevel?: string;
  photoUrl: string;
  salaryMin: number;
  salaryMax: number;
  about: string;
  skills: string[];
  education: string;
  educationLevel?: string;
  graduationStatus?: string;
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
  workingStatus?: 'active' | 'passive' | 'open'; // active: Çalışıyor, passive: Çalışmıyor, open: İş Arıyor
}

export interface FilterState {
  profession: string;
  city: string;
  experience: string;
  language: string;
  languageLevel: string;
  salaryMin: number | '';
  salaryMax: number | '';
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

export interface ContactRequest {
  id: string;
  requester_id: string;
  target_user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  requester_profile?: {
    full_name: string;
    avatar_url: string;
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
