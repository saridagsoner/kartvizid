import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface BreadcrumbsProps {
    items: Array<{
        label: string;
        path?: string;
    }>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    const { t } = useLanguage();
    
    return (
        <nav className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 px-1">
            <Link to="/" className="hover:text-[#1f6d78] dark:hover:text-[#2dd4bf] transition-colors flex items-center gap-1.5 group">
                <i className="fi fi-rr-home leading-none translate-y-[-1px]"></i>
                <span className="hidden sm:inline">{t('nav.home')}</span>
            </Link>
            
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <span className="text-gray-300 dark:text-gray-700 select-none mx-0.5">/</span>
                    {item.path ? (
                        <Link 
                            to={item.path} 
                            className="hover:text-[#1f6d78] dark:hover:text-[#2dd4bf] transition-colors max-w-[150px] sm:max-w-none truncate"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-300 max-w-[100px] sm:max-w-[200px] truncate">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
