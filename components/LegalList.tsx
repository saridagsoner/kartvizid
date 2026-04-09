import React from 'react';
import { NavLink } from 'react-router-dom';
import { LEGAL_ROUTE_MAP } from './LegalRoute';
import { LEGAL_CONTENT, LegalSection } from './LegalModal';

const LegalList: React.FC = () => {
  // Sort sections for a logical display order
  const sectionOrder: LegalSection[] = [
    'about', 'general', 'services', 'membership', 'privacy', 'kvkk', 'cookie', 
    'security', 'faq', 'help', 'iletisim', 'data_form'
  ];

  return (
    <div className="bg-white dark:bg-black">
      <div className="hidden sm:block mt-8 mb-4 lg:pl-1.5 px-6">
        <h1 className="text-[24px] font-black tracking-tighter text-black dark:text-white leading-none">
            Kurumsal
        </h1>
      </div>

      <div className="flex flex-col">
        {sectionOrder.map((section) => {
          const content = LEGAL_CONTENT[section];
          const path = LEGAL_ROUTE_MAP[section];
          
          if (!content || !path) return null;

          return (
            <NavLink
              key={section}
              to={path}
              className={({ isActive }) => 
                `pl-0 pr-4 py-6 sm:py-5 cursor-pointer relative transition-all duration-500 group ${
                  isActive 
                    ? 'bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10 text-gray-900 dark:text-white' 
                    : 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-white/[0.02] text-gray-700 dark:text-gray-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Selection Styling (Bridge Background) */}
                  <div className={`absolute inset-y-0 left-[-8px] w-[8px] transition-opacity duration-500 pointer-events-none ${
                    isActive ? 'opacity-100 bg-[#1f6d78]/5 dark:bg-[#1f6d78]/10' : 'opacity-0'
                  }`} />

                  {/* Active Indicator Line */}
                  <div className={`absolute left-[-8px] top-0 bottom-0 w-1.5 bg-[#1f6d78] dark:bg-[#2dd4bf] z-10 transform transition-all duration-500 ease-in-out origin-center ${
                    isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                  }`} />

                  {/* Divider Line */}
                  <div className="absolute bottom-0 right-4 sm:right-10 left-[58px] sm:left-[62px] border-b border-gray-200 dark:border-white/10" />

                  <div className="flex items-start gap-3 sm:gap-4 w-full">
                    <div className="w-12 h-12 flex items-center justify-center text-[#1f6d78] dark:text-[#2dd4bf] shrink-0 group-hover:scale-110 transition-transform">
                      <i className={`fi ${
                        section === 'about' ? 'fi-rr-info' :
                        section === 'faq' ? 'fi-rr-interrogation' :
                        section === 'help' ? 'fi-rr-headset' :
                        section === 'security' ? 'fi-rr-shield-check' :
                        section === 'iletisim' ? 'fi-rr-envelope' :
                        'fi-rr-document-signed'
                      } text-2xl`}></i>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                      <h3 className={`text-[15px] sm:text-[16px] font-semibold truncate tracking-tight leading-tight ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {content.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 font-black uppercase tracking-wider mt-0.5">
                        {section === 'about' ? 'Platform' : section === 'faq' ? 'Yardım' : 'Yasal'}
                      </p>
                    </div>

                    <div className="shrink-0 self-center flex items-center text-gray-400 dark:text-gray-500 ml-2">
                      <i className="fi fi-rr-angle-small-right text-xl"></i>
                    </div>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default LegalList;
