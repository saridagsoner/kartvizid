import React from 'react';
import CompanyFormContent from './CompanyFormContent';
import { Company } from '../types';

interface CompanyFormModalProps {
    onClose: () => void;
    onSubmit: (company: Partial<Company>) => void;
    onDelete?: () => void;
    initialData?: Partial<Company>;
    availableCities?: Array<{ label: string }>;
}

const CompanyFormModal: React.FC<CompanyFormModalProps> = (props) => {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/60 sm:backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white dark:bg-black w-full h-full sm:max-w-2xl sm:h-fit sm:max-h-[90vh] sm:rounded-[3rem] shadow-none sm:shadow-2xl relative overflow-hidden">
                <CompanyFormContent {...props} />
            </div>
        </div>
    );
};

export default CompanyFormModal;
