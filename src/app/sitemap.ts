import type { MetadataRoute } from 'next';
import { getWorksList, getStoriesList } from '@/sanity/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://creative-moon.com';

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL,                        priority: 1.0,  changeFrequency: 'weekly'  },
  { url: `${SITE_URL}/work`,              priority: 0.9,  changeFrequency: 'weekly'  },
  { url: `${SITE_URL}/stories`,           priority: 0.8,  changeFrequency: 'weekly'  },
  { url: `${SITE_URL}/about`,             priority: 0.7,  changeFrequency: 'monthly' },
  { url: `${SITE_URL}/contact`,           priority: 0.6,  changeFrequency: 'monthly' },
  { url: `${SITE_URL}/manifesto`,         priority: 0.4,  changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let workPages: MetadataRoute.Sitemap = [];
  try {
    const works = await getWorksList();
    workPages = works.map((w) => ({
      url: `${SITE_URL}/work/${w.slug.current}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch { /* Sanity 미연결 시 skip */ }

  let storyPages: MetadataRoute.Sitemap = [];
  try {
    const stories = await getStoriesList();
    storyPages = stories.map((s) => ({
      url: `${SITE_URL}/stories/${s.slug.current}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch { /* Sanity 미연결 시 skip */ }

  return [
    ...STATIC_PAGES.map((p) => ({ ...p, lastModified: now })),
    ...workPages,
    ...storyPages,
  ];
}
