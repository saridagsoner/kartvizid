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
    data_form: '/veri-sahibi-basvuru-formu',
    iletisim: '/iletisim',
    about: '/hakkimizda'
};

interface LegalRouteProps {
    section: LegalSection;
    isInline?: boolean; // Prop to support 3-column architecture
}

const LegalRoute: React.FC<LegalRouteProps> = ({ section, isInline = false }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClose = () => {
        navigate('/', { replace: true });
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
            isInline={isInline}
        />
    );
};

export default LegalRoute;
