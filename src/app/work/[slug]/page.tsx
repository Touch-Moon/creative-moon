import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WorkSingle from '@/components/work/WorkSingle';
import { getWorkBySlug, getWorksList, getSelectedWorks } from '@/sanity/queries';
import type { WorkSingleData } from '@/sanity/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  try {
    const work = await getWorkBySlug(decodedSlug);
    if (!work) return { title: 'Work | Creative Moon' };
    return {
      title: `${work.title} | Creative Moon`,
      description: work.subtitle || work.overview?.slice(0, 160),
    };
  } catch {
    return { title: 'Work | Creative Moon' };
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

  return (
    <main>
      <WorkSingle data={work} selectedWorks={selectedWorks} />
    </main>
  );
}
