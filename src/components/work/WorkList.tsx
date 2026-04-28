'use client';
/**
 * WorkList — /work list page
 * Animation: CSS @keyframes (no JS state → unaffected by React Compiler)
 * Only category filter uses useState
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WaveImage from '@/components/common/WaveImage';
import '@/components/common/WaveImage.scss';
import './WorkList.scss';

// ── Types ─────────────────────────────────────────────────────────
export type WorkItem = {
  _id: string;
  title: string;
  slug: { current: string };
  /** Portrait — 50% vertical. If not set, the server provides a center-cropped Landscape URL */
  thumbnailPortraitUrl?: string;
  /** Landscape — 100% horizontal */
  thumbnailLandscapeUrl?: string;
  /** Actual width÷height aspect ratio of the Portrait image. Falls back to a default if absent */
  portraitAspectRatio?: number;
  listDescription?: string;
  /** Category titles (string[]) for filtering. Sanity returns objects — the server flattens to titles. */
  categories?: string[];
  tags?: string[];
  order?: number;
};


// ── Category utility ──────────────────────────────────────────────
function buildCategories(works: WorkItem[]) {
  const counts: Record<string, number> = {};
  works.forEach((w) => (w.categories || []).forEach((c) => { counts[c] = (counts[c] || 0) + 1; }));
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

// ── WorkCard ──────────────────────────────────────────────────────
function WorkCard({ work, layout, animDelay, onImageEnter, onImageLeave }: {
  work: WorkItem;
  layout: 'half' | 'full';
  animDelay: number;
  onImageEnter: () => void;
  onImageLeave: () => void;
}) {
  // Select thumbnail based on layout
  // full (3rd)   → Wide (3584×2016, 16:9 landscape)
  // half (1,2nd) → Portrait (1762×1309, vertical) — fallback is handled server-side as a Wide center crop
  const rawSrc = layout === 'full'
    ? (work.thumbnailLandscapeUrl || `https://placehold.co/1792x1008/1a1a1a/555555?text=${encodeURIComponent(work.title)}`)
    : (work.thumbnailPortraitUrl || `https://placehold.co/864x1037/1a1a1a/555555?text=${encodeURIComponent(work.title)}`);
  // Canvas (WaveImage): same-origin /_next/image proxy → server-side fetch from Sanity CDN (no CORS)
  // half (portrait) → w=960 / full (landscape) → w=1920
  const optimizedW = layout === 'full' ? 1920 : 960;
  const src = rawSrc.startsWith('https://cdn.sanity.io')
    ? `/_next/image?url=${encodeURIComponent(rawSrc)}&w=${optimizedW}&q=80`
    : rawSrc;

  // full: fixed Landscape 16:9 (56.25%)
  // half: use the actual Portrait image ratio; fall back to 1309/1762 if absent
  const ratio = layout === 'full'
    ? 0.5625
    : (work.portraitAspectRatio ? 1 / work.portraitAspectRatio : 1309 / 1762);
  const paddingTop = `${(ratio * 100).toFixed(2)}%`;

  return (
    <div
      className={`work-item work-item--${layout} work-item--animate`}
      data-hero-src={src}
      style={{ '--anim-delay': `${animDelay}ms`, '--aspect-ratio': paddingTop } as React.CSSProperties}
    >
      <Link href={`/work/${work.slug.current}`} className="work-item__link">
        <div
          className="work-item__image"
          onMouseEnter={onImageEnter}
          onMouseLeave={onImageLeave}
        >
          <WaveImage src={src} alt={work.title} />
        </div>
        {work.listDescription && (
          <p className="work-item__text">{work.listDescription}</p>
        )}
      </Link>
    </div>
  );
}

// ── WorkList ──────────────────────────────────────────────────────
type Props = { initialWorks?: WorkItem[] };

export default function WorkList({ initialWorks }: Props) {
  const works = initialWorks ?? [];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const allCategories = buildCategories(works);
  const cursorRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'all'
    ? works
    : works.filter((w) => (w.categories || []).includes(activeCategory));

  // Global mouse tracking — smoothly lagged via lerp
  useEffect(() => {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const showCursor = useCallback(() => {
    cursorRef.current?.classList.add('is-visible');
  }, []);

  const hideCursor = useCallback(() => {
    cursorRef.current?.classList.remove('is-visible');
  }, []);

  return (
    <section className="work-list" data-theme="light">

      {/* ── Global cursor badge ── */}
      <div ref={cursorRef} className="work-cursor" aria-hidden="true">
        <div className="work-cursor__bg" />
        <span className="work-cursor__label">View work</span>
      </div>

      {/* ── Category filter ── */}
      <nav className="work-list__filter work-list__filter--animate" aria-label="Work category filter">
        <ul className="work-list__filter-list">
          <li className="work-list__filter-item">
            <button
              className={`work-list__filter-btn${activeCategory === 'all' ? ' is-active' : ''}`}
              onClick={() => setActiveCategory('all')}
              aria-current={activeCategory === 'all' ? 'true' : undefined}
            >
              All.<span className="work-list__filter-count">({works.length})</span>
            </button>
          </li>
          {allCategories.map(([cat, count]) => (
            <li key={cat} className="work-list__filter-item">
              <button
                className={`work-list__filter-btn${activeCategory === cat ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-current={activeCategory === cat ? 'true' : undefined}
              >
                {cat}.<span className="work-list__filter-count">({count})</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Grid ── */}
      <div className="work-list__grid">
        {filtered.map((work, i) => {
          const originalIndex = works.indexOf(work);
          const posInGroup = originalIndex % 3;
          const layout: 'half' | 'full' = posInGroup === 2 ? 'full' : 'half';
          const delay = i * 80 + (posInGroup === 1 ? 60 : 0);
          return (
            <WorkCard
              key={work._id}
              work={work}
              layout={layout}
              animDelay={delay}
              onImageEnter={showCursor}
              onImageLeave={hideCursor}
            />
          );
        })}
      </div>

    </section>
  );
}
