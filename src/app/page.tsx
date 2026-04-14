import type { Metadata } from 'next';
import JsonLd from '@/components/common/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://creative-moon.com';

export const metadata: Metadata = {
  title: { absolute: 'Creative Moon | Design-Driven Digital Studio' },
  alternates: { canonical: SITE_URL },
};

import Hero from '@/components/home/Hero';
import HomeIntro from '@/components/home/HomeIntro';
import HomeSkills from '@/components/home/HomeSkills';
import HomeMarquee from '@/components/home/HomeMarquee';
import HomeWorks from '@/components/home/HomeWorks';
import HomeStories from '@/components/home/HomeStories';
import { getSelectedWorks, getStoriesCarousel } from '@/sanity/queries';
import type { StoryListItem } from '@/sanity/queries';

export const revalidate = 60;

export default async function Home() {
  let selectedWorks;
  let storiesData: StoryListItem[] = [];

  try {
    [selectedWorks, storiesData] = await Promise.all([
      getSelectedWorks(),
      getStoriesCarousel(),
    ]);
  } catch {
    // Sanity not connected — each component uses its internal fallback
    selectedWorks = undefined;
    storiesData = [];
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Creative Moon',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
        email: 'hello@creativemoon.com',
        description: 'Design-driven studio crafting interactive digital experiences — strategy, branding, and digital products.',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Creative Moon',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'ko-KR',
      },
    ],
  };

  return (
    <main>
      <JsonLd data={orgSchema} />
      {/* 1. Hero */}
      <Hero />

      {/* 2. Intro — two images + intro text */}
      <HomeIntro />

      {/* 3. Skills — sticky label + numbered list */}
      <HomeSkills />

      {/* 4. Marquee — scrolling text (client-side) */}
      <HomeMarquee />

      {/* 5. Selected Works — carousel */}
      <HomeWorks serverWorks={selectedWorks} />

      {/* 6. Insight — blog card carousel */}
      <HomeStories initialStories={storiesData} />
    </main>
  );
}
