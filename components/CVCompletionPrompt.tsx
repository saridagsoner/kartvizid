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
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const lastShown = localStorage.getItem('cv_completion_prompt_last_shown');
      const now = Date.now();
      
      if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
        setIsVisible(true);
        localStorage.setItem('cv_completion_prompt_last_shown', now.toString());
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
    }, 500);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentY = e.targetTouches[0].clientY;
    const diff = currentY - touchStart;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const onTouchEnd = () => {
    if (translateY > 100) {
      handleDismiss();
    } else {
      setTranslateY(0);
    }
    setTouchStart(null);
  };

  if (!isVisible || completionScore >= 90) return null;

  return (
    <div 
      className={`fixed bottom-[60px] left-0 w-full z-[110] transition-all duration-500 ease-out ${
        isExiting ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ transform: translateY > 0 ? `translateY(${translateY}px)` : undefined }}
    >
      <div 
        className="w-full bg-white dark:bg-zinc-900 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.4)] border-t border-black/5 dark:border-white/5 relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Pull Handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-6 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors z-20"
        >
          <i className="fi fi-rr-cross-small text-2xl"></i>
        </button>

        <div className="p-6 pt-2 pb-10">
          <div className="text-center">
            <h4 className="text-lg font-black text-black dark:text-white uppercase tracking-tight mb-2">
              {t('cv_completion.title')}
            </h4>
            <p className="text-[14px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed mb-6 px-4">
              {t('cv_completion.desc').replace('%{completionScore}', completionScore.toString())}
            </p>
            
            <button
              onClick={() => {
                onEdit();
                handleDismiss();
              }}
              className="w-full bg-[#1f6d78] hover:bg-[#154d55] text-white py-4 rounded-3xl text-[13px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#1f6d78]/20"
            >
              {t('cv_completion.update_btn')}
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#1f6d78]/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CVCompletionPrompt;
