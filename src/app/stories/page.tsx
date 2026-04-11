import type { Metadata } from 'next';
import StoriesList from '@/components/stories/StoriesList';
import { getStoriesList } from '@/sanity/queries';
import type { StoryListItem } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Thoughts, reflections, and ideas on design, technology, and the digital landscape.',
  alternates: { canonical: '/stories' },
};

export const revalidate = 60;

export default async function StoriesPage() {
  let stories: StoryListItem[] = [];
  try {
    stories = await getStoriesList();
  } catch {
    stories = [];
  }
  return (
    <main>
      <StoriesList stories={stories} />
    </main>
  );
}
