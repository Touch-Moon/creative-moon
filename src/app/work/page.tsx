import type { Metadata } from 'next';
import WorkList, { type WorkItem } from '@/components/work/WorkList';
import { getWorksList, getThumbPortrait, getThumbLandscape } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected works — strategy, branding, digital products, and experiences.',
  alternates: { canonical: '/work' },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function WorkPage() {
  // Fetch data from Sanity (on failure, returns empty array — client uses dummy data)
  let works: WorkItem[] = [];

  try {
    const raw = await getWorksList();
    works = raw.map((item) => ({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      // half layout (1st, 2nd): Portrait preferred; falls back to center-cropped Wide image
      thumbnailPortraitUrl: getThumbPortrait(item.thumbnailPortrait, item.thumbnailLandscape) ?? undefined,
      // full layout (3rd): Landscape used directly
      thumbnailLandscapeUrl: getThumbLandscape(item.thumbnailLandscape) ?? undefined,
      // Actual width÷height ratio of Portrait image → used to calculate CSS padding-top
      portraitAspectRatio: item.portraitAspectRatio,
      listDescription: item.listDescription,
      categories: Array.isArray(item.categories)
        ? item.categories.map((c) => (typeof c === 'string' ? c : c.title)).filter(Boolean)
        : [],
      order: item.order,
    }));
  } catch {
    // Sanity not connected or empty — use dummy data inside WorkList
    works = [];
  }

  return (
    <main>
      <WorkList initialWorks={works} />
    </main>
  );
}
