import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CVCompletionPromptProps {
  completionScore: number;
  onEdit: () => void;
}

const CVCompletionPrompt: React.FC<CVCompletionPromptProps> = ({ completionScore, onEdit }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show after a short delay
    const timer = setTimeout(() => {
      const lastShown = localStorage.getItem('cv_completion_prompt_last_shown');
      const now = Date.now();
      
      // Show if never shown OR shown more than 24 hours ago
      if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
        setIsVisible(true);
        localStorage.setItem('cv_completion_prompt_last_shown', now.toString());
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || isDismissed || completionScore >= 90) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-[2rem] p-5 sm:p-6 shadow-2xl shadow-black/20 w-full sm:max-w-[380px] relative overflow-hidden group">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1f6d78]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white text-xl font-bold"
        >
          ×
        </button>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#1f6d78]/10 flex items-center justify-center shrink-0">
             <div className="relative">
                <i className="fi fi-rr-rocket-lunch text-xl text-[#1f6d78]"></i>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></div>
             </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-[14px] font-black text-black dark:text-white uppercase tracking-tight mb-1">
              Profilini Güçlendir!
            </h4>
            <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 leading-tight mb-4">
              Profilini <span className="text-[#1f6d78]">%{completionScore}</span> oranında tamamladın. Daha fazla iş fırsatı için bilgilerini güncelleyebilirsin.
            </p>
            
            <button
              onClick={() => {
                onEdit();
                setIsDismissed(true);
              }}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
            >
              ŞİMDİ GÜNCELLE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVCompletionPrompt;
