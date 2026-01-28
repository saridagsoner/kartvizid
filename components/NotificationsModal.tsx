import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ContactRequest, NotificationItem } from '../types';
import NotificationDropdown from './NotificationDropdown';

interface NotificationsModalProps {
    onClose: () => void;
    notifications: (ContactRequest | NotificationItem)[];
    onAction: (requestId: string, action: 'approved' | 'rejected') => void;
    onMarkRead: (notificationId: string) => void;
    onMarkAllRead: () => void;
    onOpenProfile: (userId: string, role?: string) => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
    onClose,
    notifications,
    onAction,
    onMarkRead,
    onMarkAllRead,
    onOpenProfile
}) => {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-xl transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10">
                    <h2 className="text-xl font-black text-black dark:text-white tracking-tight">{t('notif.title')}</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMarkAllRead}
                            className="text-gray-500 text-[10px] font-bold hover:text-red-500 transition-colors uppercase tracking-wider"
                        >
                            {t('notif.clear_all')}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable List uses NotificationDropdown logic internally or we can reuse its item rendering? 
            Since NotificationDropdown is designed as a dropdown/sheet, let's just reuse the logic by copying or we can wrap NotificationDropdown?
            Actually, NotificationDropdown renders a container. Here we want just the list.
            Ideally refactor Item to a separate component, but for speed, I will render NotificationDropdown inside but with modifications?
            No, NotificationDropdown has fixed height and header.
            I should probably duplicate the list rendering logic here OR add a 'fullMode' prop to NotificationDropdown.
            Let's add 'fullMode' to NotificationDropdown in the next step, but for now I'll implement the list here to ensure custom styling for the modal.
        */}
                <div className="overflow-y-auto p-0 cuutom-scrollbar">
                    {/* We will reuse NotificationDropdown but pass a special prop 'embedded' to hide its header and outer shell? 
               Better: Pass the list to NotificationDropdown and have it render fully?
               Actually, modifying NotificationDropdown to accept `renderListOnly` prop is cleaner.
           */}
                    <NotificationDropdown
                        onClose={() => { }}
                        notifications={notifications}
                        onAction={onAction}
                        onMarkRead={onMarkRead}
                        onMarkAllRead={onMarkAllRead}
                        onOpenProfile={onOpenProfile}
                        embedded={true} // New prop to signal valid refactor
                    />
                </div>
            </div>
        </div>
    );
};

export default NotificationsModal;
