import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Company } from '../types';
import { useLanguage } from '../context/LanguageContext';

import CompanyProfileModal from './CompanyProfileModal';

interface CompanyProfileRouteProps {
    onClose?: () => void;
    isInline?: boolean;
}

const CompanyProfileRoute: React.FC<CompanyProfileRouteProps> = ({
    onClose,
    isInline = false
}) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [company, setCompany] = useState<Company | null>(location.state?.companyData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Synchronize state with location state or reset when ID changes
    useEffect(() => {
        if (location.state?.companyData) {
            setCompany(location.state.companyData);
            setLoading(false);
            setError(null);
        } else if (id) {
            // Only clear if we don't have synchronized state to trigger a fetch
            setCompany(null);
            setError(null);
        }
    }, [id, location.state?.companyData]);

    useEffect(() => {
        // If the modal was accessed directly via URL, we fetch the Company
        if (!company && id) {
            const fetchCompany = async () => {
                setLoading(true);
                try {
                    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');
                    const queryField = isUuid ? 'id' : 'slug';

                    const { data, error: fetchError } = await supabase
                        .from('companies')
                        .select('*')
                        .eq(queryField, id)
                        .single();

                    if (fetchError) throw fetchError;

                    if (data) {
                        setCompany({
                            id: data.id,
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
                        });
                    } else {
                        setError(t('error.company_not_found'));
                    }
                } catch (e) {
                    console.error('Error fetching company for route:', e);
                    setError(t('error.company_fetch_failed'));
                } finally {
                    setLoading(false);
                }
            };

            fetchCompany();
        }
    }, [id, company]);

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }
        navigate('/', { replace: true });
    };

    if (loading) {
        return (
            <div className={isInline ? "w-full h-full flex items-center justify-center p-12" : "fixed inset-0 z-[250] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60"}>
                <div className="w-16 h-16 border-4 border-[#1f6d78]/20 border-t-[#1f6d78] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className={isInline ? "w-full h-full flex items-center justify-center p-6 sm:p-12" : "fixed inset-0 z-[250] flex items-center justify-center p-4 bg-white dark:bg-gray-900 sm:bg-black/30 sm:dark:bg-black/60"}>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-gray-100 dark:border-white/20">
                    <div className="text-4xl mb-4">😢</div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">{t('common.error')}</h2>
                    <p className="text-gray-500 mb-6 font-medium text-sm">{error || t('error.company_not_found_desc')}</p>
                    <button onClick={handleClose} className="w-full bg-[#1f6d78] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                        {t('common.back_to_home')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <CompanyProfileModal
            company={company}
            onClose={handleClose}
            isInline={isInline}
        />
    );
};

export default CompanyProfileRoute;
