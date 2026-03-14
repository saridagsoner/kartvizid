import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CV, ContactRequest } from '../types';

import ProfileModal from './ProfileModal';

interface CVProfileRouteProps {
    sentRequests: ContactRequest[];
    handleSendRequest: (userId: string) => void;
    handleCancelRequest: (userId: string) => void;
    handleJobFound?: () => void;
    onClose?: () => void;
}

const CVProfileRoute: React.FC<CVProfileRouteProps> = ({
    sentRequests,
    handleSendRequest,
    handleCancelRequest,
    handleJobFound,
    onClose
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
                        setCv(data as CV);
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
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60 ">
                <div className="w-16 h-16 border-4 border-[#1f6d78]/20 border-t-[#1f6d78] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !cv) {
        return (
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60 ">
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
        <ProfileModal
            cv={cv}
            onClose={handleClose}
            requestStatus={sentRequests.find(r => r.target_user_id === cv.userId)?.status || 'none'}
            onRequestAccess={() => handleSendRequest(cv.userId)}
            onCancelRequest={() => handleCancelRequest(cv.userId)}
            onJobFound={handleJobFound}
        />
    );
};

export default CVProfileRoute;
