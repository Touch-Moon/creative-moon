'use client';
/**
 * WorkList — plastic.design /work 리스트
 * 애니메이션: CSS @keyframes (JS 상태 없음 → React Compiler 영향 없음)
 * 카테고리 필터만 useState 사용
 */
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WaveImage from '@/components/common/WaveImage';
import '@/components/common/WaveImage.scss';
import './WorkList.scss';

// ── 타입 ──────────────────────────────────────────────────────────
export type WorkItem = {
  _id: string;
  title: string;
  slug: { current: string };
  /** Portrait — 50% 세로형. 미등록 시 서버에서 Landscape를 센터 크롭한 URL */
  thumbnailPortraitUrl?: string;
  /** Landscape — 100% 가로형 */
  thumbnailLandscapeUrl?: string;
  /** Portrait 이미지의 실제 가로÷세로 비율 (width÷height). 없으면 기본값 사용 */
  portraitAspectRatio?: number;
  listDescription?: string;
  categories?: string[];
  order?: number;
};

// ── 더미 데이터 ───────────────────────────────────────────────────
// thumbnailPortraitUrl: 50% 세로형 (Portrait)
// thumbnailLandscapeUrl: 100% 가로형 (Landscape)
// portraitAspectRatio: width÷height (예: 0.8 = 세로형, 1.35 = 가로 세로 비슷)
const DUMMY_WORKS: WorkItem[] = [
  {
    _id: 'd1', title: 'Hyundai Annual Convention.', slug: { current: 'hyundai' },
    thumbnailPortraitUrl: 'https://placehold.co/864x1037/1a1a1a/555555?text=01',
    thumbnailLandscapeUrl: 'https://placehold.co/1792x1008/1a1a1a/555555?text=01',
    listDescription: 'Hyundai annual convention. Designing the visual concept for a large-scale brand experience.',
    categories: ['Strategic design', 'Experiences'], order: 1,
  },
  {
    _id: 'd2', title: 'Lobelia Brand Identity.', slug: { current: 'lobelia' },
    thumbnailPortraitUrl: 'https://placehold.co/864x1037/222222/555555?text=02',
    thumbnailLandscapeUrl: 'https://placehold.co/1792x1008/222222/555555?text=02',
    listDescription: 'Lobelia. A complete brand identity for a premium botanical skincare label.',
    categories: ['Branding', 'Digital products'], order: 2,
  },
  {
    _id: 'd3', title: 'Nu Era Seeds.', slug: { current: 'nu-era-seeds' },
    thumbnailPortraitUrl: 'https://placehold.co/864x1037/2b2b2b/555555?text=03',
    thumbnailLandscapeUrl: 'https://placehold.co/1792x1008/2b2b2b/555555?text=03',
    listDescription: 'Nu Era Seeds. Reimagining the digital presence of an agricultural innovator.',
    categories: ['Digital products', 'Technology'], order: 3,
  },
  {
    _id: 'd4', title: 'Cobre Creative Studio.', slug: { current: 'cobre' },
    thumbnailPortraitUrl: 'https://placehold.co/864x1037/333333/555555?text=04',
    thumbnailLandscapeUrl: 'https://placehold.co/1792x1008/333333/555555?text=04',
    listDescription: 'Cobre Creative Studio. Brand identity and website for a multidisciplinary studio.',
    categories: ['Branding', 'Consultancy'], order: 4,
  },
  {
    _id: 'd5', title: 'Planta Digital Platform.', slug: { current: 'planta' },
    thumbnailPortraitUrl: 'https://placehold.co/864x1037/3a3a3a/555555?text=05',
    thumbnailLandscapeUrl: 'https://placehold.co/1792x1008/3a3a3a/555555?text=05',
    listDescription: 'Planta. A digital product for plant parents to track, learn and connect.',
    categories: ['Digital products', 'Technology'], order: 5,
  },
  {
    _id: 'd6', title: 'Archetype Research.', slug: { current: 'archetype' },
    thumbnailPortraitUrl: 'https://placehold.co/864x1037/252525/555555?text=06',
    thumbnailLandscapeUrl: 'https://placehold.co/1792x1008/252525/555555?text=06',
    listDescription: 'Archetype Research. Crafting the brand for a strategic research consultancy.',
    categories: ['Consultancy', 'Strategic design'], order: 6,
  },
];

// ── 카테고리 유틸 ─────────────────────────────────────────────────
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
  // layout에 따라 thumbnail 선택
  // full (3rd)  → Wide (3584×2016, 16:9 가로형)
  // half (1,2nd) → Portrait (1762×1309, 세로형) — 폴백은 서버에서 Wide 센터 크롭으로 처리됨
  const rawSrc = layout === 'full'
    ? (work.thumbnailLandscapeUrl || `https://placehold.co/1792x1008/1a1a1a/555555?text=${encodeURIComponent(work.title)}`)
    : (work.thumbnailPortraitUrl || `https://placehold.co/864x1037/1a1a1a/555555?text=${encodeURIComponent(work.title)}`);
  // Canvas(WaveImage): same-origin /_next/image 프록시 → Sanity CDN 서버사이드 fetch (CORS 없음)
  // half(portrait) → w=960 / full(landscape) → w=1920
  const optimizedW = layout === 'full' ? 1920 : 960;
  const src = rawSrc.startsWith('https://cdn.sanity.io')
    ? `/_next/image?url=${encodeURIComponent(rawSrc)}&w=${optimizedW}&q=80`
    : rawSrc;

  // full: Landscape 16:9 고정 (56.25%)
  // half: Portrait 이미지의 실제 비율 사용. 없으면 1309/1762 기본값
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
  const works = initialWorks && initialWorks.length > 0 ? initialWorks : DUMMY_WORKS;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const allCategories = buildCategories(works);
  const cursorRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'all'
    ? works
    : works.filter((w) => (w.categories || []).includes(activeCategory));

  // 전역 마우스 추적 — lerp로 부드럽게 지연 추적
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

      {/* ── 전역 커서 배지 ── */}
      <div ref={cursorRef} className="work-cursor" aria-hidden="true">
        <div className="work-cursor__bg" />
        <span className="work-cursor__label">View work</span>
      </div>

      {/* ── 카테고리 필터 ── */}
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

      {/* ── 그리드 ── */}
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
