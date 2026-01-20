
import { CV, Notification, Statistic, PopularItem, TrendItem } from './types';

export const MOCK_CVS: CV[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    profession: 'Frontend Developer',
    city: 'İstanbul',
    experienceYears: 5,
    language: 'İngilizce',
    languageLevel: 'İleri',
    photoUrl: 'https://picsum.photos/seed/ahmet/200/200',
    salaryMin: 45000,
    salaryMax: 60000,
    about: 'Deneyimli frontend developer, React ve Vue konusunda uzman. Modern web teknolojileri ve responsive tasarım konularında bilgili.',
    skills: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Next.js'],
    education: 'İstanbul Teknik Üniversitesi - Bilgisayar Mühendisliği',
    educationLevel: 'Lisans',
    graduationStatus: 'Mezun',
    workType: 'Remote',
    employmentType: 'Tam Zamanlı',
    militaryStatus: 'Yapıldı',
    maritalStatus: 'Evli',
    disabilityStatus: 'Yok',
    noticePeriod: '2 Hafta',
    travelStatus: 'Seyahat Engeli Yok',
    driverLicense: ['B'],
    isActive: true,
    views: 1250,
    isPlaced: false,
  },
  {
    id: '2',
    name: 'Selin Aras',
    profession: 'UI/UX Designer',
    city: 'Ankara',
    experienceYears: 3,
    language: 'Almanca',
    languageLevel: 'Orta',
    photoUrl: 'https://picsum.photos/seed/selin/200/200',
    salaryMin: 40000,
    salaryMax: 50000,
    about: 'Kullanıcı odaklı tasarımlar yapmayı seven, Figma ve Adobe XD araçlarına hakim tasarımcı.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    education: 'ODTÜ - Endüstriyel Tasarım',
    educationLevel: 'Yüksek Lisans',
    graduationStatus: 'Mezun',
    workType: 'Hibrit',
    employmentType: 'Tam Zamanlı',
    militaryStatus: 'Muaf',
    maritalStatus: 'Bekar',
    disabilityStatus: 'Yok',
    isNew: true,
    views: 840,
    isPlaced: false,
  },
  {
    id: '3',
    name: 'Can Demir',
    profession: 'Backend Developer',
    city: 'İzmir',
    experienceYears: 8,
    language: 'İngilizce',
    languageLevel: 'İleri',
    photoUrl: 'https://picsum.photos/seed/can/200/200',
    salaryMin: 55000,
    salaryMax: 75000,
    about: 'Node.js ve Microservices mimarileri konusunda uzman backend mühendisi.',
    skills: ['Node.js', 'Go', 'Docker', 'Kubernetes', 'PostgreSQL'],
    education: 'Ege Üniversitesi - Yazılım Mühendisliği',
    views: 2100,
    isPlaced: true,
  },
];

export const WORK_TYPES = ['Remote', 'Hibrit', 'Ofis'];
export const EMPLOYMENT_TYPES = ['Tam Zamanlı', 'Yarı Zamanlı', 'Proje Bazlı', 'Freelance', 'Stajyer'];
export const EDUCATION_LEVELS = ['Lise', 'Önlisans', 'Lisans', 'Yüksek Lisans', 'Doktora'];
export const GRADUATION_STATUSES = ['Mezun', 'Öğrenci', 'Terk'];
export const MILITARY_STATUSES = ['Yapıldı', 'Muaf', 'Tecilli'];
export const MARITAL_STATUSES = ['Evli', 'Bekar'];
export const DISABILITY_STATUSES = ['Var', 'Yok'];
export const NOTICE_PERIODS = ['Hemen', '2 Hafta', '1 Ay', '2 Ay+'];
export const LANGUAGES = ['İngilizce', 'Almanca', 'Fransızca', 'Rusça', 'Arapça', 'İspanyolca'];
export const LANGUAGE_LEVELS = ['Başlangıç', 'Orta', 'İleri', 'Anadil'];
export const DRIVER_LICENSES = ['A1', 'A2', 'B', 'C', 'D', 'E'];
export const TRAVEL_STATUSES = ['Seyahat Engeli Yok', 'Seyahat Edemem'];

export const ALL_SKILLS = [
  'React', 'Vue', 'Angular', 'TypeScript', 'Node.js', 'Go', 'Python', 'Docker', 'Figma', 'Sketch',
  'UI/UX', 'SEO', 'Pazarlama', 'Satış', 'Finans', 'İnsan Karşılamaları', 'Proje Yönetimi', 'AWS', 'SQL'
];





export const EXPERIENCE_LEVELS: PopularItem[] = [
  { label: 'Stajyer / Yeni Mezun', count: 120 },
  { label: 'Junior (1-3 Yıl)', count: 340 },
  { label: 'Mid-Level (3-5 Yıl)', count: 210 },
  { label: 'Senior (5-10 Yıl)', count: 150 },
  { label: 'Expert (10+ Yıl)', count: 72 },
];



export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'CONTACT_REQUEST',
    title: 'İletişim İsteği',
    message: 'ABC Teknoloji sizinle iletişime geçmek istiyor.',
    time: '2 saat önce',
    isRead: false,
    companyName: 'ABC Teknoloji',
  },
];
