import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        className={`
              pointer-events-auto cursor-pointer
              min-w-[300px] max-w-[400px] p-5 rounded-2xl shadow-2xl 
              flex items-center gap-4 text-sm font-bold animate-in slide-in-from-right-10 fade-in duration-300
              ${toast.type === 'error' ? 'bg-red-50 text-red-900 border border-red-100' :
                                toast.type === 'success' ? 'bg-black text-white border border-gray-800' :
                                    'bg-white text-black border border-gray-200'}
            `}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0 ${toast.type === 'error' ? 'bg-red-100' :
                                toast.type === 'success' ? 'bg-white/20' : 'bg-gray-100'
                            }`}>
                            {toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'i'}
                        </div>
                        <p>{toast.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
