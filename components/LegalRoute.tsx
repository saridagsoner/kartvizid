import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LegalModal, { LegalSection } from './LegalModal';

export const LEGAL_ROUTE_MAP: Record<LegalSection, string> = {
    general: '/kullanim-kosullari',
    security: '/guvenlik-ipuclari',
    faq: '/sikca-sorulan-sorular',
    help: '/yardim-merkezi',
    services: '/hizmetlerimiz',
    privacy: '/aydinlatma-metni',
    cookie: '/cerez-politikasi',
    kvkk: '/kvkk-aydinlatma',
    membership: '/uyelik-sozlesmesi',
    data_form: '/veri-sahibi-basvuru-formu'
};

interface LegalRouteProps {
    section: LegalSection;
}

const LegalRoute: React.FC<LegalRouteProps> = ({ section }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClose = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/', { replace: true });
        }
    };

    const handleNavigate = (newSection: LegalSection) => {
        const path = LEGAL_ROUTE_MAP[newSection];
        // replace: true smoothly updates URL without adding to browser back-history unnecessarily while in the modal
        navigate(path, { state: { background: location.state?.background }, replace: true });
    };

    return (
        <LegalModal
            initialSection={section}
            onClose={handleClose}
            onNavigate={handleNavigate}
        />
    );
};

export default LegalRoute;
