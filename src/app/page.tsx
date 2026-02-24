import Hero from '@/components/home/Hero';
import HomeIntro from '@/components/home/HomeIntro';
import HomeSkills from '@/components/home/HomeSkills';
import HomeMarquee from '@/components/home/HomeMarquee';
import HomeWorks from '@/components/home/HomeWorks';
import HomeStories from '@/components/home/HomeStories';

export default function Home() {
  return (
    <main>
      {/* 1. Hero — 완성 */}
      <Hero />

      {/* 2. Intro — 이미지 2개 + 소개 텍스트 */}
      <HomeIntro />

      {/* 3. Skills — sticky 라벨 + 번호 목록 */}
      <HomeSkills />

      {/* 4. Marquee — 클라이언트 흐르는 텍스트 */}
      <HomeMarquee />

      {/* 5. Selected Works — 캐러셀 */}
      <HomeWorks />

      {/* 6. Insight — 블로그 카드 캐러셀 */}
      <HomeStories />
    </main>
  );
}
