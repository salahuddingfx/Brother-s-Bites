import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bbites.salahuddin.codes';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    { url: BASE_URL, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/menu`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/location`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/connect`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/offers`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/reviews`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/track-order`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.5 },
    { url: `${BASE_URL}/developer`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
