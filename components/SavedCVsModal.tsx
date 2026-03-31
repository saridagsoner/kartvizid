
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { SavedCV } from '../types';

interface SavedCVsModalProps {
    onClose: () => void;
    onOpenCV: (cvId: string) => void;
    userId: string; // Current employer ID
}

const SavedCVsModal: React.FC<SavedCVsModalProps> = ({ onClose, onOpenCV, userId }) => {
    const { t } = useLanguage();
    const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedCVs();
    }, []);

    const fetchSavedCVs = async () => {
        try {
            const { data, error } = await supabase
                .from('saved_cvs')
                .select(`
          *,
          cv:cvs(
            id,
            name,
            photo_url,
            profession,
            city,
            experience_years,
            experience_months
          )
        `)
                .eq('employer_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSavedCVs(data || []);
        } catch (error) {
            console.error('Error fetching saved CVs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            const { error } = await supabase
                .from('saved_cvs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSavedCVs(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing saved CV:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex sm:items-center sm:justify-center sm:p-4 bg-white sm:bg-transparent">
            {/* Blurred Backdrop */}
            <div
                className="hidden sm:block absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-md transition-all "
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full h-full sm:h-auto sm:max-h-[85vh] max-w-2xl bg-white dark:bg-gray-800 sm:rounded-[2rem] sm:shadow-2xl border-none sm:border sm:border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col zoom-in-95">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                    <h2 className="text-xl font-black text-black tracking-tight">Kaydettiklerim</h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fi fi-rr-cross text-xs"></i>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-white">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</div>
                    ) : savedCVs.length === 0 ? (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <i className="fi fi-rr-bookmark text-2xl"></i>
                            </div>
                            <p className="text-gray-500 font-medium">Henüz kaydedilmiş aday yok.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {savedCVs.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => item.cv && onOpenCV(item.cv.id)}
                                    className="flex items-center gap-4 py-4 px-2 sm:px-4 border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-all group last:border-0"
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-50 flex items-center justify-center text-[#1f6d78] font-bold text-lg">
                                        {item.cv?.photo_url ? (
                                            <img src={item.cv.photo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            item.cv?.name?.charAt(0) || '?'
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-black text-[15px] text-gray-900 truncate">{item.cv?.name || 'İsimsiz Aday'}</h3>
                                            <p className="text-[11px] text-gray-500 font-bold truncate tracking-wide uppercase mt-0.5">{item.cv?.profession || 'İş Arayan'}</p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0 mt-1 sm:mt-0">
                                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                <i className="fi fi-rr-marker text-[#1f6d78]"></i> {item.cv?.city || 'Belirtilmemiş'}
                                            </span>
                                            <span className="text-[10px] text-[#1f6d78] font-bold bg-[#1f6d78]/5 px-2 py-0.5 rounded-md">
                                                {item.cv?.experience_years} Yıl {item.cv?.experience_months ? item.cv?.experience_months + ' Ay' : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <button
                                        onClick={(e) => handleRemove(e, item.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors ml-1 shrink-0"
                                        title="Kaldır"
                                    >
                                        <i className="fi fi-rr-trash text-xs"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SavedCVsModal;
