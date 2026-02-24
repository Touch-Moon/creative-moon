'use client';
import { useRef, useState, useCallback, useId, useEffect } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ArrowButton from '@/components/common/ArrowButton';
import './HomeWorks.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const titleLineVariants: Variants = {
  hidden: { y: '115%' },
  visible: (i: number) => ({
    y: 0,
    transition: { duration: 1.4, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

// 상단 고정, height:0 → full 마스크 reveal
// border 이벤트 완료(2.01s) + 1s 후 첫 카드, 이후 순차 0.18s 간격
const cardVariants: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: (i: number) => ({
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 1.1, ease: EASE_OUT, delay: 2.01 + i * 0.18 },
  }),
};

const MotionLink = motion(Link);

// 임시 데이터 — 나중에 Sanity로 교체
const works = [
  { id: '01', title: 'Hyundai Annual Convention.', slug: 'hyundai', src: '/images/work-01.jpg' },
  { id: '02', title: 'Brand Identity System.', slug: 'brand-identity', src: '/images/work-02.jpg' },
  { id: '03', title: 'Digital Experience Platform.', slug: 'digital-platform', src: '/images/work-03.jpg' },
  { id: '04', title: 'E-Commerce Redesign.', slug: 'ecommerce', src: '/images/work-04.jpg' },
  { id: '05', title: 'Mobile App Interface.', slug: 'mobile-app', src: '/images/work-05.jpg' },
];

// ── Wave Image — plastic.design 수치 기반 (cX:1.8 / cY:0.2 / amplitude:0.32) ──
// idle: 항상 잔잔하게 살아있음 / hover: amplitude 증폭
function WaveImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const rawId = useId();
  const filterId = 'wf' + rawId.replace(/:/g, '');
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const rafRef = useRef<number>(0);
  const isHoveringRef = useRef(false);
  const tRef = useRef(0); // 전역 타임 (idle 연속성 유지)

  // fractalNoise = 부드러운 사인파형 (turbulence는 너무 거친 노이즈)
  // plastic.design cX:cY = 1.8:0.2 비율 유지
  // idle: 거의 안 보임 / hover: 명확한 물결 효과
  const IDLE_FREQ_X  = 0.004;
  const IDLE_FREQ_Y  = 0.0005;
  const HOVER_FREQ_X = 0.022;
  const HOVER_FREQ_Y = 0.0025;
  const IDLE_SCALE   = 1;
  const HOVER_SCALE  = 24;

  useEffect(() => {
    const loop = () => {
      tRef.current++;
      const t = tRef.current;
      const hovering = isHoveringRef.current;
      const targetFreqX = hovering ? HOVER_FREQ_X : IDLE_FREQ_X;
      const targetFreqY = hovering ? HOVER_FREQ_Y : IDLE_FREQ_Y;
      const targetScale = hovering ? HOVER_SCALE  : IDLE_SCALE;

      const curStr = turbRef.current?.getAttribute('baseFrequency') || '0 0';
      const [cx, cy] = curStr.split(' ').map(Number);
      const curScale = parseFloat(dispRef.current?.getAttribute('scale') || '1');

      // hover 진입 시 빠르게, 퇴장 시 느리게 복귀
      const lerpF = hovering ? 0.07 : 0.025;
      const nx = cx + (targetFreqX + Math.sin(t * 0.02) * targetFreqX * 0.35 - cx) * lerpF;
      const ny = cy + (targetFreqY + Math.sin(t * 0.013) * targetFreqY * 0.25 - cy) * lerpF;
      const ns = curScale + (targetScale - curScale) * (hovering ? 0.07 : 0.03);

      turbRef.current?.setAttribute('baseFrequency', `${nx.toFixed(5)} ${ny.toFixed(5)}`);
      dispRef.current?.setAttribute('scale', ns.toFixed(2));

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── DRAG 커스텀 커서 ────────────────────────────
  const dragCursorRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    dragCursorRef.current?.classList.add('is-visible');
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    dragCursorRef.current?.classList.remove('is-visible');
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragCursorRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragCursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  return (
    <div
      className="home-works__card-img"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* 필터 정의 — 0×0 SVG로 DOM에만 존재 */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0 0"
              numOctaves="3"
              result="noise"
              seed="2"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 필터 적용 래퍼 */}
      <div className="home-works__card-img-inner" style={{ filter: `url(#${filterId})` }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: 'cover' }}
          sizes={sizes}
          draggable={false}
        />
      </div>

      {/* DRAG 커스텀 커서 배지 — 마우스 따라다님 */}
      <div ref={dragCursorRef} className="home-works__drag-cursor" aria-hidden="true">
        <span className="home-works__drag-cursor-inner">
          {/* 좌우 화살표 아이콘 */}
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 5H17M1 5L4.5 1.5M1 5L4.5 8.5M17 5L13.5 1.5M17 5L13.5 8.5"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          DRAG
        </span>
      </div>
    </div>
  );
}

// ── HomeWorks ─────────────────────────────────────────────────────────────────
export default function HomeWorks() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // 버튼 네비 중 handleScroll이 current를 덮어쓰는 것 방지
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 드래그 상태 — hasDragged: 3px 이상 움직임 발생 시 true → 클릭 방지
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, hasDragged: false });

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' });

  // ── 버튼으로 카드 이동 ───────────────────────────────
  const scrollTo = (idx: number) => {
    if (!trackRef.current) return;
    isScrollingRef.current = true;
    setCurrent(idx);

    const card = trackRef.current.children[idx] as HTMLElement;
    if (card) {
      const paddingLeft = parseFloat(getComputedStyle(trackRef.current).paddingLeft) || 0;
      trackRef.current.scrollTo({ left: card.offsetLeft - paddingLeft, behavior: 'smooth' });
    }

    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  // ── 드래그 후 스크롤 위치 동기화 (버튼 네비 중 무시) ──
  const handleScroll = useCallback(() => {
    if (isScrollingRef.current || !trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    const paddingLeft = parseFloat(getComputedStyle(trackRef.current).paddingLeft) || 0;
    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    let closestIdx = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      // paddingLeft를 빼서 track 기준 snap 위치와 비교
      const snapPos = card.offsetLeft - paddingLeft;
      const dist = Math.abs(snapPos - scrollLeft);
      if (dist < minDist) { minDist = dist; closestIdx = i; }
    });
    setCurrent(Math.max(0, Math.min(closestIdx, works.length - 1)));
  }, []);

  // ── 마우스 드래그 ────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    dragRef.current = {
      active: true,
      startX: e.pageX - trackRef.current.offsetLeft,
      scrollLeft: trackRef.current.scrollLeft,
      hasDragged: false, // 매번 리셋
    };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const moved = Math.abs(x - dragRef.current.startX);

    // 3px 이상 이동 시 드래그 의도 확정
    if (!dragRef.current.hasDragged && moved > 3) {
      dragRef.current.hasDragged = true;
      trackRef.current.style.cursor = 'grabbing';
      trackRef.current.style.userSelect = 'none';
    }

    if (dragRef.current.hasDragged) {
      e.preventDefault();
      const walk = (x - dragRef.current.startX) * 1.5;
      trackRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
    }
  };

  const onDragEnd = () => {
    dragRef.current.active = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = '';
      trackRef.current.style.userSelect = '';
    }
  };

  // cleanup timer
  useEffect(() => () => clearTimeout(scrollTimerRef.current), []);

  return (
    <section ref={sectionRef} className="home-works" data-theme="dark">

      {/* ① 수평 TOP */}
      <motion.span
        className="home-works__line-h home-works__line-h--top"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.67, ease: EASE_OUT, delay: 0 }}
      />

      {/* ② 수직 */}
      <motion.span
        className="home-works__line-v"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.67, ease: EASE_OUT, delay: 0.67 }}
      />

      <div className="home-works__inner">

        {/* ── 사이드바 ── */}
        <div className="home-works__sidebar">
          <h2 className="home-works__title">
            {['SELECTED', 'WORKS'].map((line, i) => (
              <div key={i} className="home-works__title-line">
                <motion.span
                  custom={i}
                  variants={titleLineVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h2>

          <motion.div
            className="home-works__nav"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.4 }}
          >
            {/* Counter — plastic.design 방식: overflow:hidden + translateY */}
            <div className="home-works__counter" aria-live="polite" aria-atomic="true">
              <div className="home-works__counter-current">
                <div
                  className="home-works__counter-list"
                  style={{ transform: `translateY(-${current}em)` }}
                >
                  {works.map((_, i) => (
                    <span key={i} aria-hidden={i !== current}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
              <span className="home-works__counter-sep">/</span>
              <span className="home-works__counter-total">
                {String(works.length).padStart(2, '0')}
              </span>
            </div>

            <div className="home-works__arrows">
              <ArrowButton
                direction="prev"
                onClick={() => scrollTo(current - 1)}
                disabled={current === 0}
                ariaLabel="Previous work"
              />
              <ArrowButton
                direction="next"
                onClick={() => scrollTo(current + 1)}
                disabled={current === works.length - 1}
                ariaLabel="Next work"
              />
            </div>
          </motion.div>
        </div>

        {/* ── 카드 트랙 ── */}
        <div
          className="home-works__track"
          ref={trackRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
        >
          {works.map((work, i) => (
            <MotionLink
              key={work.id}
              href={`/work/${work.slug}`}
              className="home-works__card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              draggable={false}
              onClick={(e) => {
                if (dragRef.current.hasDragged) e.preventDefault();
              }}
            >
              <WaveImage
                src={work.src}
                alt={work.title}
                sizes="(max-width: 575px) 80vw, (max-width: 1023px) 65vw, 46vw"
              />
              <p className="home-works__card-title">{work.title}</p>
            </MotionLink>
          ))}
        </div>

      </div>

      {/* ③ 수평 BOTTOM */}
      <motion.span
        className="home-works__line-h home-works__line-h--bottom"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.67, ease: EASE_OUT, delay: 1.34 }}
      />

    </section>
  );
}
