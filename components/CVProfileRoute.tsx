import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CV, ContactRequest } from '../types';

import ProfileModal from './ProfileModal';

interface CVProfileRouteProps {
    onOpenChat: (userId: string) => void;
    handleJobFound?: () => void;
    onClose?: () => void;
    isInline?: boolean;
}

const CVProfileRoute: React.FC<CVProfileRouteProps> = ({
    onOpenChat,
    handleJobFound,
    onClose,
    isInline = false
}) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [cv, setCv] = useState<CV | null>(location.state?.cvData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Synchronize state with location state or reset when ID changes
    useEffect(() => {
        if (location.state?.cvData) {
            setCv(location.state.cvData);
            setLoading(false);
            setError(null);
        } else if (id) {
            // Only clear and fetch if we don't have the data in state
            // and we are navigating to a NEW id or direct match
            setCv(null);
            setError(null);
        }
    }, [id, location.state?.cvData]);

    useEffect(() => {
        // If the modal was accessed directly via URL, we need to fetch the CV
        if (!cv && id) {
            const fetchCV = async () => {
                setLoading(true);
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                const queryField = isUuid ? 'id' : 'slug';
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
                            id: data.id,
                            slug: data.slug,
                            userId: data.user_id,
                            name: data.name || '',
                            profession: data.profession || '',
                            city: data.city || '',
                            experienceYears: data.experience_years || 0,
                            language: data.language || '',
                            languageLevel: data.language_level || '',
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
                            views: data.views || 0,
                            email: data.email,
                            phone: data.phone,
                            isEmailPublic: data.is_email_public,
                            isPhonePublic: data.is_phone_public,
                            workingStatus: data.working_status,
                            salaryCurrency: data.salary_currency,
                            preferredCities: data.preferred_cities || (data.preferred_city ? [data.preferred_city] : []),
                            preferredCountries: data.preferred_countries || [],
                            preferredRoles: data.preferred_roles || [],
                            references: data.references || [],
                            educationDetails: data.educationDetails || [],
                            workExperience: data.workExperience || [],
                            internshipDetails: data.internshipDetails || [],
                            languageDetails: data.languageDetails || [],
                            certificates: data.certificates || []
                        };
                        setCv(mapped);
                    } else {
                        setError('CV bulunamadı.');
                    }
                } catch (e) {
                    console.error('Error fetching CV for route:', e);
                    setError(`CV yüklenirken bir hata oluştu [${queryField}]: ${(e as any)?.message || e}`);
                } finally {
                    setLoading(false);
                }
            };

            fetchCV();
        }
    }, [id, cv]);

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }
        // Use a standard push instead of replace to ensure browser simulators
        // properly detect the URL change and update their simulated address bars.
        navigate('/', { replace: true });
    };

    if (loading) {
        return (
            <div className={isInline ? "w-full h-full flex items-center justify-center p-12" : "fixed inset-0 z-[250] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60"}>
                <div className="w-16 h-16 border-4 border-[#1f6d78]/20 border-t-[#1f6d78] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !cv) {
        return (
            <div className={isInline ? "w-full h-full flex items-center justify-center p-6 sm:p-12" : "fixed inset-0 z-[250] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60"}>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-gray-100 dark:border-white/10">
                    <div className="text-4xl mb-4">😢</div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Hata</h2>
                    <p className="text-gray-500 mb-6 font-medium text-sm">{error || 'Bu CV yayından kaldırılmış veya bulunamadı.'}</p>
                    <button onClick={handleClose} className="w-full bg-[#1f6d78] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full">
            {/* SEO Booster: Hidden from users but visible to crawlers in raw HTML */}
            <div className="sr-only opacity-0 h-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <h1>{cv.name} - {cv.profession} Dijital CV</h1>
                <p>{cv.city} bölgesinde {cv.profession} olarak faaliyet gösteren {cv.name} isimli profesyonelin güncel iş deneyimleri, yetenekleri ve kariyer hedefleri.</p>
                <p>Kartvizid.com üzerinden {cv.name} ile doğrudan iletişim kurabilir, tersine işe alım modelimiz ile kariyer yolculuğunuza yön verebilirsiniz. {cv.about?.substring(0, 150)}...</p>
                <nav>
                    <a href="/rehber">Kariyer Rehberimizi İnceleyin</a> | 
                    <a href="/hakkimizda">Kartvizid Hakkında Bilgi Alın</a>
                </nav>
            </div>

            <ProfileModal
                cv={cv}
                onClose={handleClose}
                onOpenChat={() => onOpenChat(cv.userId)}
                onJobFound={handleJobFound}
                isInline={isInline}
            />
        </div>
    );
};

export default CVProfileRoute;
