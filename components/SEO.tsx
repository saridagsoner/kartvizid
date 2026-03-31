import React from 'react';
import { Helmet } from 'react-helmet-async';

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
    const siteTitle = 'Kartvizid | Dijital CV ve İletişim Platformu';
    const fullTitle = title ? `${title} | Kartvizid` : siteTitle;

    const siteDescription = 'Kartvizid, iş arayanlar ve işverenleri doğrudan buluşturan yeni nesil dijital özgeçmiş platformudur.';
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
        </Helmet>
    );
};

export default SEO;
