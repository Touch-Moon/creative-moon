import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WorkSingle from '@/components/work/WorkSingle';
import JsonLd from '@/components/common/JsonLd';
import { getWorkBySlug, getWorksList, getSelectedWorks, urlFor } from '@/sanity/queries';
import type { WorkSingleData } from '@/sanity/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://creative-moon.com';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  try {
    const work = await getWorkBySlug(decodedSlug);
    if (!work) return { title: 'Work' };
    const desc = work.subtitle || work.overview?.slice(0, 160) || '';
    const ogImg = work.heroMedia?.image
      ? urlFor(work.heroMedia?.image).width(1200).height(630).fit('crop').crop('center').url()
      : undefined;
    return {
      title: work.title,
      description: desc,
      openGraph: {
        title: `${work.title} | Creative Moon`,
        description: desc,
        ...(ogImg && { images: [{ url: ogImg, width: 1200, height: 630, alt: work.title }] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${work.title} | Creative Moon`,
        description: desc,
        ...(ogImg && { images: [ogImg] }),
      },
      alternates: {
        canonical: `/work/${decodedSlug}`,
      },
    };
  } catch {
    return { title: 'Work' };
  }
}

export async function generateStaticParams() {
  try {
    const works = await getWorksList();
    return works.map((w) => ({ slug: w.slug.current }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let work: WorkSingleData | null = null;
  let selectedWorks;

  try {
    [work, selectedWorks] = await Promise.all([
      getWorkBySlug(decodedSlug),
      getSelectedWorks(),
    ]);
  } catch {
    // Sanity 미연결 → 더미 데이터 사용 (WorkSingle 내부에서 처리)
    work = null;
    selectedWorks = undefined;
  }

  // Sanity에 데이터가 있지만 해당 slug가 없는 경우 → 404
  // Sanity 자체가 비어있을 때는 더미로 폴백
  if (work === undefined) {
    notFound();
  }

  const ogImg = work?.heroMedia?.image
    ? urlFor(work.heroMedia?.image).width(1200).height(630).fit('crop').crop('center').url()
    : undefined;

  const workSchema = work ? {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.title,
    description: work.subtitle || work.overview?.slice(0, 200) || '',
    url: `${SITE_URL}/work/${decodedSlug}`,
    creator: { '@type': 'Organization', name: 'Creative Moon', url: SITE_URL },
    ...(ogImg && { image: ogImg }),
  } : null;

  return (
    <main>
      {workSchema && <JsonLd data={workSchema} />}
      <WorkSingle data={work} selectedWorks={selectedWorks} />
    </main>
  );
}
