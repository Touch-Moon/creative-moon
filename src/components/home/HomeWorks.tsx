'use client';
/**
 * HomeWorks — SELECTED WORKS section on the home page.
 * Responsible only for preparing data (Sanity → works array); rendering is delegated to WorksSlider.
 *
 * Thumbnail selection rules (based on cardSize):
 *  - large / wide   → Landscape thumbnail (horizontal card container)
 *  - tall / compact → Portrait  thumbnail (vertical card container)
 *  Falls back to the opposite thumbnail when one is not registered
 */
import { useMemo } from 'react';
import { SELECTED_WORKS, type CardSize, type SelectedWork } from '@/data/works';
import { type SelectedWorkSanity, getThumbPortrait, getThumbLandscape } from '@/sanity/queries';
import WorksSlider from '@/components/common/WorksSlider';

// ── Convert Sanity data → works array ───────────────────────────────────────────────────
function buildWorksList(serverWorks?: SelectedWorkSanity[]): SelectedWork[] {
  if (!serverWorks || serverWorks.length === 0) return [];
  return serverWorks.map((sw, i) => {
    // Container orientation differs by cardSize, so pick the matching thumbnail
    // large/wide → horizontal container → Landscape thumbnail
    // tall/compact/unset → vertical container → Portrait thumbnail
    const useLandscape = sw.cardSize === 'large' || sw.cardSize === 'wide';
    const sanityUrl = useLandscape
      ? (getThumbLandscape(sw.thumbnailLandscape) ?? getThumbPortrait(sw.thumbnailPortrait, undefined))
      : getThumbPortrait(sw.thumbnailPortrait, sw.thumbnailLandscape);
    const rawSrc = sanityUrl ?? '';

    // Canvas (WaveImage): same-origin /_next/image proxy → server-side fetch from Sanity CDN
    // w must be a value defined in next.config.ts deviceSizes (other values return 400)
    // large/wide (horizontal) → w=1920, tall/compact (vertical) → w=960
    const optimizedW = useLandscape ? 1920 : 960;
    const src = rawSrc.startsWith('https://cdn.sanity.io')
      ? `/_next/image?url=${encodeURIComponent(rawSrc)}&w=${optimizedW}&q=80`
      : rawSrc;
    return {
      id: String(i + 1).padStart(2, '0'),
      title: sw.title,
      slug: sw.slug.current,
      src,
      size: (sw.cardSize ?? 'compact') as CardSize,
    };
  });
}

type Props = { serverWorks?: SelectedWorkSanity[] };

export default function HomeWorks({ serverWorks }: Props) {
  const works = useMemo(() => buildWorksList(serverWorks), [serverWorks]);
  return <WorksSlider works={works} />;
}
