'use client';
/**
 * WorkRelated — SELECTED WORKS section at the bottom of the single page
 * Responsible only for preparing the works array with the current slug excluded;
 * rendering is delegated to WorksSlider.
 *
 * Thumbnail selection rules (based on cardSize):
 *  - large / wide   → Landscape thumbnail
 *  - tall / compact → Portrait  thumbnail
 */
import { useMemo } from 'react';
import { SELECTED_WORKS, type CardSize, type SelectedWork } from '@/data/works';
import { type SelectedWorkSanity, getThumbPortrait, getThumbLandscape } from '@/sanity/queries';
import WorksSlider from '@/components/common/WorksSlider';

const MAX_WORKS = 10;

// ── Convert Sanity data → works array (falls back to SELECTED_WORKS if absent) ──
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
    // Canvas (WaveImage): same-origin /_next/image proxy
    // w must be a value from next.config.ts deviceSizes (other values return a 400 error)
    // large/wide → w=1920 / tall/compact → w=960
    const optimizedW = useLandscape ? 1920 : 960;
    const src = rawSrc.startsWith('https://cdn.sanity.io')
      ? `/_next/image?url=${encodeURIComponent(rawSrc)}&w=${optimizedW}&q=80`
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
