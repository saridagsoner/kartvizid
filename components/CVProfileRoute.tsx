import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CV, ContactRequest } from '../types';

// We lazy load the modal so it stays optimized
const ProfileModal = React.lazy(() => import('./ProfileModal'));

interface CVProfileRouteProps {
    sentRequests: ContactRequest[];
    handleSendRequest: (userId: string) => void;
    handleCancelRequest: (userId: string) => void;
    handleJobFound?: () => void;
}

const CVProfileRoute: React.FC<CVProfileRouteProps> = ({
    sentRequests,
    handleSendRequest,
    handleCancelRequest,
    handleJobFound
}) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [cv, setCv] = useState<CV | null>(location.state?.cvData || null);
    const [loading, setLoading] = useState(!location.state?.cvData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If the modal was accessed directly via URL, we need to fetch the CV
        if (!cv && id) {
            const fetchCV = async () => {
                setLoading(true);
                try {
                    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                    const queryField = isUuid ? 'id' : 'slug';

                    const { data, error: fetchError } = await supabase
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
                        .eq(queryField, id)
                        .single();

                    if (fetchError) throw fetchError;
                    if (data) {
                        setCv(data as CV);
                    } else {
                        setError('CV bulunamadı.');
                    }
                } catch (e) {
                    console.error('Error fetching CV for route:', e);
                    setError('CV yüklenirken bir hata oluştu.');
                } finally {
                    setLoading(false);
                }
            };

            fetchCV();
        }
    }, [id, cv]);

    const handleClose = () => {
        // If there's background state, we can go back safely
        // Otherwise we redirect to home so we don't exit the app
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/', { replace: true });
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60 sm:backdrop-blur-xl animate-in fade-in duration-300">
                <div className="w-16 h-16 border-4 border-[#1f6d78]/20 border-t-[#1f6d78] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !cv) {
        return (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60 sm:backdrop-blur-xl animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
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
        <React.Suspense fallback={<div className="fixed inset-0 z-[130] bg-black/10 backdrop-blur-sm"></div>}>
            <ProfileModal
                cv={cv}
                onClose={handleClose}
                requestStatus={sentRequests.find(r => r.target_user_id === cv.userId)?.status || 'none'}
                onRequestAccess={() => handleSendRequest(cv.userId)}
                onCancelRequest={() => handleCancelRequest(cv.userId)}
                onJobFound={handleJobFound}
            />
        </React.Suspense>
    );
};

export default CVProfileRoute;
