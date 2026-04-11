'use client';
/**
 * WorkRelated — 싱글 페이지 하단 SELECTED WORKS 섹션
 * 현재 slug를 제외한 works 배열 준비만 담당, 렌더링은 WorksSlider에 위임.
 *
 * Thumbnail 선택 규칙 (cardSize 기반):
 *  - large / wide   → Landscape 썸네일
 *  - tall / compact → Portrait  썸네일
 */
import { useMemo } from 'react';
import { SELECTED_WORKS, type CardSize, type SelectedWork } from '@/data/works';
import { type SelectedWorkSanity, getThumbPortrait, getThumbLandscape } from '@/sanity/queries';
import WorksSlider from '@/components/common/WorksSlider';

const MAX_WORKS = 10;

// ── Sanity 데이터 → works 배열 변환 (없으면 SELECTED_WORKS 폴백) ──────────
function buildWorksList(serverWorks?: SelectedWorkSanity[]): SelectedWork[] {
  if (!serverWorks || serverWorks.length === 0) return SELECTED_WORKS;
  return serverWorks.map((sw, i) => {
    const fallback =
      SELECTED_WORKS.find((w) => w.slug === sw.slug.current) ??
      SELECTED_WORKS[i % SELECTED_WORKS.length];
    const useLandscape = sw.cardSize === 'large' || sw.cardSize === 'wide';
    const sanityUrl = useLandscape
      ? (getThumbLandscape(sw.thumbnailLandscape) ?? getThumbPortrait(sw.thumbnailPortrait, undefined))
      : getThumbPortrait(sw.thumbnailPortrait, sw.thumbnailLandscape);
    const rawSrc = sanityUrl ?? fallback.src;
    const src = rawSrc.startsWith('https://cdn.sanity.io')
      ? `/_next/image?url=${encodeURIComponent(rawSrc)}&w=1920&q=75`
      : rawSrc;
    return {
      id: String(i + 1).padStart(2, '0'),
      title: sw.title,
      slug: sw.slug.current,
      src,
      size: (sw.cardSize ?? fallback.size) as CardSize,
    };
  });
}

type Props = { currentSlug: string; serverWorks?: SelectedWorkSanity[] };

export default function WorkRelated({ currentSlug, serverWorks }: Props) {
  const works = useMemo(
    () =>
      buildWorksList(serverWorks)
        .filter((w) => w.slug !== currentSlug)
        .slice(0, MAX_WORKS),
    [serverWorks, currentSlug]
  );
  return <WorksSlider works={works} />;
}
