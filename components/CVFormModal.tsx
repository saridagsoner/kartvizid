import React from 'react';
import { CV } from '../types';
import CVFormContent from './CVFormContent';

interface CVFormModalProps {
  onClose: () => void;
  onSubmit: (cv: Partial<CV>, consentGiven?: boolean) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  initialData?: Partial<CV>;
  availableCities?: Array<{ label: string }>;
}

const CVFormModal: React.FC<CVFormModalProps> = (props) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center sm:p-4 bg-white dark:bg-black sm:bg-black/60 sm:backdrop-blur-xl">
      <div className="bg-white dark:bg-black w-full h-full sm:w-full sm:max-w-[800px] sm:h-[90vh] rounded-none sm:rounded-[3rem] shadow-none sm:shadow-2xl relative flex flex-col overflow-hidden">
        <CVFormContent {...props} />
      </div>
    </div>
  );
};

export default CVFormModal;
