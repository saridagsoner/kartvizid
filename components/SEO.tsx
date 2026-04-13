import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image = 'https://kartvizid.com/og-image.jpg',
    url = 'https://kartvizid.com',
    type = 'website'
}) => {
    const { t } = useLanguage();
    const siteTitle = t('seo.default_title');
    const fullTitle = title ? `${title} | Kartvizid` : siteTitle;

    const siteDescription = t('seo.default_description');
    const fullDescription = description || siteDescription;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />

            {/* Open Graph (Facebook etc.) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}

            {/* Twitter Settings */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
            {image && <meta name="twitter:image" content={image} />}

            {/* Structured Data (JSON-LD) for AdSense & SEO Authority */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "Kartvizid",
                    "operatingSystem": "Web",
                    "applicationCategory": "BusinessApplication",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "TRY"
                    },
                    "description": fullDescription,
                    "publisher": {
                        "@type": "Organization",
                        "name": "Kartvizid",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://kartvizid.com/logo.png"
                        }
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
