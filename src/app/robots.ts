import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creative-moon.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/style-guide/', '/projects/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
