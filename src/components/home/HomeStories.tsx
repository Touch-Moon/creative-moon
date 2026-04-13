'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ArrowButton from '@/components/common/ArrowButton';
import type { StoryListItem } from '@/sanity/queries';
import './HomeStories.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const titleClipVariants: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
  visible: {
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      'polygon(0% 0%, 100% 0%, 100% 15%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ],
    transition: { duration: 2.1, ease: EASE_OUT, times: [0, 0.4, 1] },
  },
};

const titleSlideVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 1.4, ease: EASE_OUT },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE_OUT, delay: i * 0.1 },
  }),
};

const MotionLink = m.create(Link);

// 더미 데이터 (Sanity 미연결 시 사용)
const DUMMY_STORIES: StoryListItem[] = [
  { _id: '01', category: 'Insights', title: 'The digital challenge of the industrial sector.', slug: { current: 'the-digital-challenge-of-the-industrial-sector' }, order: 1 },
  { _id: '02', category: 'Process', title: 'Reflections on design, current context.', slug: { current: 'reflections-on-design-current-context' }, order: 2 },
  { _id: '03', category: 'Branding', title: 'Digital symphony: branding evolution.', slug: { current: 'digital-symphony-branding-evolution' }, order: 3 },
  { _id: '04', category: 'Insights', title: 'We review a decade of experience in retail.', slug: { current: 'a-decade-of-experience-in-retail' }, order: 4 },
];

export default function HomeStories({ initialStories }: { initialStories?: StoryListItem[] }) {
  const stories = (initialStories && initialStories.length > 0) ? initialStories : DUMMY_STORIES;
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' });

  useEffect(() => setMounted(true), []);

  // ── 드래그 상태 ──────────────────────────────────────
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, hasDragged: false, startIdx: 0 });
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── 바운스 상태 ──────────────────────────────────────
  const bounceRef = useRef({ overscroll: 0, animating: false });
  const bounceRafRef = useRef<number>(0);

  // ── 관성 스크롤 ──────────────────────────────────────
  const velBufferRef = useRef<{ scroll: number; t: number }[]>([]);
  const momentumRafRef = useRef<number>(0);
  const justDraggedRef = useRef(false);

  // ── rubber-band ──────────────────────────────────────
  const rubberBand = (overscroll: number, maxOverscroll = 140) => {
    const sign = overscroll < 0 ? -1 : 1;
    const abs = Math.abs(overscroll);
    return sign * maxOverscroll * (1 - Math.exp(-abs / maxOverscroll * 0.55));
  };

  // ── 바운스 spring 복귀 ───────────────────────────────
  const animateBounceBack = useCallback(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const bounce = bounceRef.current;
    cancelAnimationFrame(bounceRafRef.current);
    bounce.animating = true;
    const STIFFNESS = 0.18, DAMPING = 0.6;
    let velocity = 0;
    const tick = () => {
      const force = -bounce.overscroll * STIFFNESS;
      velocity = (velocity + force) * DAMPING;
      bounce.overscroll += velocity;
      if (Math.abs(bounce.overscroll) < 0.5 && Math.abs(velocity) < 0.5) {
        bounce.overscroll = 0;
        bounce.animating = false;
        track.style.transform = '';
        return;
      }
      track.style.transform = `translateX(${bounce.overscroll}px)`;
      bounceRafRef.current = requestAnimationFrame(tick);
    };
    bounceRafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── 드래그 의도 기반 카드 스냅 ──────────────────────
  // nearest card 기준 + 빠른 플릭이면 한 칸 추가 이동
  const doSnapByIntent = useCallback((scrollLeft: number, velocity: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const cards = Array.from(track.children) as HTMLElement[];
    const startIdx = dragRef.current.startIdx;
    // 드래그 시작 카드 기준 ±1 범위 내 카드만 탐색
    let nearestIdx = startIdx, minDist = Infinity;
    cards.forEach((card, i) => {
      if (Math.abs(i - startIdx) > 1) return;
      const dist = Math.abs(card.offsetLeft - scrollLeft);
      if (dist < minDist) { minDist = dist; nearestIdx = i; }
    });
    // 최종 이동 범위를 startIdx ±1로 고정
    let targetIdx = Math.max(startIdx - 1, Math.min(startIdx + 1, nearestIdx));
    targetIdx = Math.max(0, Math.min(stories.length - 1, targetIdx));
    const targetCard = cards[targetIdx] as HTMLElement;
    if (targetCard) {
      isScrollingRef.current = true;
      setCurrent(targetIdx);
      track.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' });
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.scrollSnapType = '';
          trackRef.current.style.scrollBehavior = '';
        }
        isScrollingRef.current = false;
      }, 500);
    }
  }, [stories.length]);

  // ── 버튼 네비 ────────────────────────────────────────
  const scroll = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    isScrollingRef.current = true;
    const nextIdx = dir === 'prev'
      ? Math.max(0, current - 1)
      : Math.min(stories.length - 1, current + 1);
    setCurrent(nextIdx);
    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    const targetCard = cards[nextIdx] as HTMLElement;
    if (targetCard) {
      trackRef.current.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' });
    }
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => { isScrollingRef.current = false; }, 1000);
  };

  // ── 스크롤 sync ──────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (isScrollingRef.current || !trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    let closestIdx = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - scrollLeft);
      if (dist < minDist) { minDist = dist; closestIdx = i; }
    });
    setCurrent(Math.max(0, Math.min(closestIdx, stories.length - 1)));
  }, []);

  // ── 마우스 드래그 ────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    cancelAnimationFrame(bounceRafRef.current);
    cancelAnimationFrame(momentumRafRef.current);
    bounceRef.current = { overscroll: 0, animating: false };
    trackRef.current.style.transform = '';
    dragRef.current = {
      active: true,
      startX: e.pageX - trackRef.current.offsetLeft,
      scrollLeft: trackRef.current.scrollLeft,
      hasDragged: false,
      startIdx: current,
    };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !trackRef.current) return;
    const track = trackRef.current;
    const x = e.pageX - track.offsetLeft;
    const moved = Math.abs(x - dragRef.current.startX);
    if (!dragRef.current.hasDragged && moved > 1) {
      dragRef.current.hasDragged = true;
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      track.style.cursor = 'grabbing';
      track.style.userSelect = 'none';
    }
    if (dragRef.current.hasDragged) {
      e.preventDefault();
      const walk = (x - dragRef.current.startX) * 1.0;
      const desiredScroll = dragRef.current.scrollLeft - walk;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (desiredScroll < 0) {
        track.scrollLeft = 0;
        bounceRef.current.overscroll = rubberBand(-desiredScroll);
        track.style.transform = `translateX(${bounceRef.current.overscroll}px)`;
      } else if (desiredScroll > maxScroll) {
        track.scrollLeft = maxScroll;
        bounceRef.current.overscroll = rubberBand(maxScroll - desiredScroll);
        track.style.transform = `translateX(${bounceRef.current.overscroll}px)`;
      } else {
        bounceRef.current.overscroll = 0;
        track.style.transform = '';
        track.scrollLeft = desiredScroll;
      }
      // 속도 버퍼 기록
      velBufferRef.current.push({ scroll: track.scrollLeft, t: performance.now() });
      if (velBufferRef.current.length > 6) velBufferRef.current.shift();
    }
  };

  const onDragEnd = useCallback(() => {
    if (!trackRef.current) { dragRef.current.active = false; return; }
    const track = trackRef.current;

    if (bounceRef.current.overscroll !== 0) animateBounceBack();

    if (dragRef.current.hasDragged) {
      justDraggedRef.current = true;
      // 속도 계산
      const buf = velBufferRef.current;
      let velocity = 0;
      if (buf.length >= 2) {
        const recent = buf[buf.length - 1];
        const old = buf[0];
        const dt = recent.t - old.t;
        if (dt > 0 && dt < 150) velocity = (recent.scroll - old.scroll) / dt * 16;
      }
      velBufferRef.current = [];

      // ── 관성 슬라이딩 후 snap (Flickity 스타일) ──
      const FRICTION = 0.92;
      const MAX_VEL = 30;
      let vel = Math.max(-MAX_VEL, Math.min(MAX_VEL, velocity));
      const momentumScroll = () => {
        if (!trackRef.current) return;
        if (Math.abs(vel) < 0.8) {
          doSnapByIntent(trackRef.current.scrollLeft, vel);
          return;
        }
        trackRef.current.scrollLeft += vel;
        vel *= FRICTION;
        momentumRafRef.current = requestAnimationFrame(momentumScroll);
      };
      momentumRafRef.current = requestAnimationFrame(momentumScroll);
    } else {
      track.style.scrollSnapType = '';
      track.style.scrollBehavior = '';
    }

    track.style.cursor = '';
    track.style.userSelect = '';
    dragRef.current.active = false;
  }, [animateBounceBack, doSnapByIntent]);

  // cleanup
  useEffect(() => () => {
    clearTimeout(scrollTimerRef.current);
    cancelAnimationFrame(bounceRafRef.current);
    cancelAnimationFrame(momentumRafRef.current);
  }, []);

  // ── window mouseup: 트랙 밖에서 버튼 떼어도 드래그 종료 ──
  useEffect(() => {
    const handler = () => { if (dragRef.current.active) onDragEnd(); };
    window.addEventListener('mouseup', handler);
    return () => window.removeEventListener('mouseup', handler);
  }, [onDragEnd]);

  // ── 드래그 직후 링크 클릭 방지 ──────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!justDraggedRef.current) return;
      justDraggedRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('click', handler, true);
    return () => window.removeEventListener('click', handler, true);
  }, []);

  // ── 커스텀 커서 lerp RAF ──────────────────────────────
  useEffect(() => {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let initialized = false;
    let rafId: number;
    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!initialized) { currentX = targetX; currentY = targetY; initialized = true; }
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafId); };
  }, []);

  // ── 커서 show/hide ───────────────────────────────────
  const handleTrackMouseEnter = () => { cursorRef.current?.classList.add('is-visible'); };
  const handleTrackMouseLeave = () => {
    onDragEnd();
    cursorRef.current?.classList.remove('is-visible');
  };

  return (
    <section ref={sectionRef} className="home-stories" data-theme="dark">
      <div className="wrap">
      <div className="home-stories__header">
        <m.div
          className="home-stories__title-wrap"
          variants={titleClipVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <m.h2
            className="home-stories__title"
            variants={titleSlideVariants}
          >
            INSIGHT.
          </m.h2>
        </m.div>
        <m.div
          className="home-stories__arrows"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
        >
          <ArrowButton direction="prev" onClick={() => scroll('prev')} disabled={current === 0} ariaLabel="Previous story" />
          <ArrowButton direction="next" onClick={() => scroll('next')} disabled={current === stories.length - 1} ariaLabel="Next story" />
        </m.div>
      </div>

      {/* 스크린 리더: 현재 슬라이드 위치 안내 */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {`Story ${current + 1} of ${stories.length}: ${stories[current]?.title}`}
      </div>

      <div
        className="home-stories__track"
        ref={trackRef}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onDragEnd}
        onMouseEnter={handleTrackMouseEnter}
        onMouseLeave={handleTrackMouseLeave}
        role="region"
        aria-label="Stories slider"
      >
        {stories.map((item, i) => {
          const heroSrc = item.thumbnailUrl
            ? item.thumbnailUrl.startsWith('https://cdn.sanity.io')
              ? `/_next/image?url=${encodeURIComponent(item.thumbnailUrl)}&w=960&q=80`
              : item.thumbnailUrl
            : '';
          return (
          <MotionLink
            key={item._id}
            href={`/stories/${item.slug.current}`}
            className="home-stories__card"
            data-hero-src={heroSrc}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            draggable={false}
          >
            <div className="home-stories__card-img">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  draggable={false}
                  style={{ objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
                  sizes="(max-width: 575px) 80vw, (max-width: 1023px) 65vw, 29vw"
                  quality={80}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
              )}
            </div>
            <span className="home-stories__card-category">{item.category}</span>
            <h3 className="home-stories__card-title">{item.title}</h3>
          </MotionLink>
          );
        })}
      </div>
      </div>

      {mounted && createPortal(
        <div ref={cursorRef} className="home-stories__cursor" aria-hidden="true">
          <div className="home-stories__cursor-bg" />
          <span ref={cursorLabelRef} className="home-stories__cursor-label">Drag</span>
        </div>,
        document.body
      )}
    </section>
  );
}
