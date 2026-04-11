import type { Metadata } from 'next';
import WorkList, { type WorkItem } from '@/components/work/WorkList';
import { getWorksList, getThumbPortrait, getThumbLandscape } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected works — strategy, branding, digital products, and experiences.',
  alternates: { canonical: '/work' },
};

export const revalidate = 60; // ISR: 60초마다 재검증

export default async function WorkPage() {
  // Sanity에서 데이터 가져오기 (실패 시 빈 배열 → 클라이언트에서 더미 사용)
  let works: WorkItem[] = [];

  try {
    const raw = await getWorksList();
    works = raw.map((item) => ({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      // half 레이아웃 (1st, 2nd): Portrait 우선, 없으면 Wide에서 센터 크롭 폴백
      thumbnailPortraitUrl: getThumbPortrait(item.thumbnailPortrait, item.thumbnailLandscape) ?? undefined,
      // full 레이아웃 (3rd): Landscape 직접 사용
      thumbnailLandscapeUrl: getThumbLandscape(item.thumbnailLandscape) ?? undefined,
      // Portrait 이미지의 실제 가로÷세로 비율 → CSS padding-top 계산에 사용
      portraitAspectRatio: item.portraitAspectRatio,
      listDescription: item.listDescription,
      categories: item.categories,
      order: item.order,
    }));
  } catch {
    // Sanity 미연결 또는 비어있을 때 — WorkList 내 더미 데이터 사용
    works = [];
  }

  return (
    <main>
      <WorkList initialWorks={works} />
    </main>
  );
}
