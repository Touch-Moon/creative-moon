import type { Metadata } from 'next';
import StoriesList from '@/components/stories/StoriesList';
import { getStoriesList } from '@/sanity/queries';
import type { StoryListItem } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Insights | Creative Moon',
  description: 'Thoughts, reflections, and ideas on design, technology, and the world we work in.',
};

export const revalidate = 60;

export default async function StoriesPage() {
  let stories: StoryListItem[] = [];

  try {
    stories = await getStoriesList();
  } catch {
    // Sanity 미연결 시 더미 데이터 사용 (StoriesList 내부에서 처리)
    stories = [];
  }

  return (
    <main>
      <StoriesList stories={stories} />
    </main>
  );
}
