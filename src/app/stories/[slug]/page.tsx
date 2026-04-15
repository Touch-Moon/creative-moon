import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StorySingle from '@/components/stories/StorySingle';
import HomeStories from '@/components/home/HomeStories';
import WorkRelated from '@/components/work/WorkRelated';
import { getStoryBySlug, getStoriesList, getStoriesCarousel, getSelectedWorks } from '@/sanity/queries';
import type { StorySingleData, StoryListItem, SelectedWorkSanity } from '@/sanity/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const story = await getStoryBySlug(slug);
    if (!story) return { title: 'Insights' };
    const desc = story.excerpt?.slice(0, 160) || '';
    const ogImg = story.thumbnailUrl || undefined;
    return {
      title: story.title,
      description: desc,
      openGraph: {
        title: `${story.title} | Creative Moon`,
        description: desc,
        ...(ogImg && { images: [{ url: ogImg, width: 1200, height: 630, alt: story.title }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${story.title} | Creative Moon`,
        description: desc,
        ...(ogImg && { images: [ogImg] }),
      },
      alternates: {
        canonical: `/stories/${slug}`,
      },
    };
  } catch {
    return { title: 'Insights' };
  }
}

export async function generateStaticParams() {
  try {
    const stories = await getStoriesList();
    return stories.map((s) => ({ slug: s.slug.current }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function StorySlugPage({ params }: Props) {
  const { slug } = await params;

  let story: StorySingleData | null = null;
  let relatedStories: StoryListItem[] = [];
  let selectedWorks: SelectedWorkSanity[] | undefined;

  try {
    [story, relatedStories, selectedWorks] = await Promise.all([
      getStoryBySlug(slug),
      getStoriesCarousel(),
      getSelectedWorks(),
    ]);
  } catch {
    // Sanity not connected — use dummy data (handled inside StorySingle)
    story = null;
    relatedStories = [];
    selectedWorks = undefined;
  }

  // Data exists in Sanity but the given slug was not found → 404
  if (story === undefined) {
    notFound();
  }

  const filtered = relatedStories.filter((s) => s.slug.current !== slug);

  return (
    <main>
      <StorySingle data={story} />
      <WorkRelated currentSlug="" serverWorks={selectedWorks} />
      <HomeStories initialStories={filtered} />
    </main>
  );
}
