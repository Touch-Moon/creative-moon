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
    // Sanity 미연결 → 각 컴포넌트 내부 fallback 사용
    selectedWorks = undefined;
    storiesData = [];
  }

  return (
    <main>
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
