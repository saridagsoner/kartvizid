
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-md transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10">
                    <h2 className="text-xl font-black text-black dark:text-white tracking-tight">Kaydettiklerim</h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400 text-sm">Yükleniyor...</div>
                    ) : savedCVs.length === 0 ? (
                        <div className="p-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <p className="text-gray-500 font-medium">Henüz kaydedilmiş CV yok.</p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {savedCVs.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => item.cv && onOpenCV(item.cv.id)}
                                    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all border border-transparent hover:border-gray-200 group"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-100">
                                        {item.cv?.photo_url ? (
                                            <img src={item.cv.photo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg">
                                                {item.cv?.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.cv?.name || 'İsimsiz Aday'}</h3>
                                            <p className="text-[10px] text-gray-500 font-medium truncate">{item.cv?.profession}</p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[10px] bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 text-gray-400 font-bold">
                                                {item.cv?.city}
                                            </span>
                                            <span className="text-[10px] bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 text-[#1f6d78] font-bold">
                                                {item.cv?.experience_years} Yıl {item.cv?.experience_months ? item.cv?.experience_months + ' Ay' : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <button
                                        onClick={(e) => handleRemove(e, item.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shrink-0"
                                        title="Listeden Çıkar"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
