'use client';
/**
 * HomeWorks — 홈 페이지 SELECTED WORKS 섹션
 * 데이터(Sanity → works 배열) 준비만 담당, 렌더링은 WorksSlider에 위임.
 *
 * Thumbnail 선택 규칙 (cardSize 기반):
 *  - large / wide  → Landscape 썸네일 (가로형 카드 컨테이너)
 *  - tall / compact → Portrait  썸네일 (세로형 카드 컨테이너)
 *  각각 미등록 시 반대편 썸네일로 폴백
 */
import { useMemo } from 'react';
import { SELECTED_WORKS, type CardSize, type SelectedWork } from '@/data/works';
import { type SelectedWorkSanity, getThumbPortrait, getThumbLandscape } from '@/sanity/queries';
import WorksSlider from '@/components/common/WorksSlider';

// ── Sanity 데이터 → works 배열 변환 (없으면 SELECTED_WORKS 폴백) ──────────
function buildWorksList(serverWorks?: SelectedWorkSanity[]): SelectedWork[] {
  if (!serverWorks || serverWorks.length === 0) return SELECTED_WORKS;
  return serverWorks.map((sw, i) => {
    const fallback =
      SELECTED_WORKS.find((w) => w.slug === sw.slug.current) ??
      SELECTED_WORKS[i % SELECTED_WORKS.length];

    // cardSize에 따라 컨테이너 방향이 다르므로 어울리는 썸네일 선택
    // large/wide → 가로형 컨테이너 → Landscape 썸네일
    // tall/compact/미지정 → 세로형 컨테이너 → Portrait 썸네일
    const useLandscape = sw.cardSize === 'large' || sw.cardSize === 'wide';
    const sanityUrl = useLandscape
      ? (getThumbLandscape(sw.thumbnailLandscape) ?? getThumbPortrait(sw.thumbnailPortrait, undefined))
      : getThumbPortrait(sw.thumbnailPortrait, sw.thumbnailLandscape);
    const rawSrc = sanityUrl ?? fallback.src;

    // Proxy Sanity CDN through Next.js image optimization (avoids direct CDN CORS/503)
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

type Props = { serverWorks?: SelectedWorkSanity[] };

export default function HomeWorks({ serverWorks }: Props) {
  const works = useMemo(() => buildWorksList(serverWorks), [serverWorks]);
  return <WorksSlider works={works} />;
}
