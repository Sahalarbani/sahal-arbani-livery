/**
 * @version 2.0.0
 * @changelog
 * - [15-04-2026] Upgrade SEO engine dengan Dynamic Open Graph dan Twitter Cards.
 * - [15-04-2026] Injeksi JSON-LD Schema Markup untuk optimalisasi AI (Google SGE & LLM Crawlers).
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'SoftwareApplication';
  author?: string;
  schemaMarkup?: any;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "Platform kurasi dan berbagi livery game kualitas tinggi dengan estetika modern.",
  // Ganti URL gambar di bawah ini dengan link logo/banner default web lu nanti
  image = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", 
  url = "https://sahal-arbani-livery.vercel.app", // Update pas udah hosting
  type = "website",
  author = "Sahal Arbani",
  schemaMarkup
}) => {
  // Format title dinamis
  const siteTitle = title.includes('Sahal Arbani Livery') ? title : `${title} | Sahal Arbani Livery`;

  // Default Schema Markup untuk halaman Home/Biasa
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sahal Arbani Livery",
    "url": url,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    }
  };

  const finalSchema = schemaMarkup || defaultSchema;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook / WA */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema Markup (The AI & SEO Secret Weapon) */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};
