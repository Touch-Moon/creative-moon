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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE_OUT, delay: 0.3 + i * 0.12 },
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

  // plastic.design 수치: cX=1.8, cY=0.2 → X freq이 Y의 9배
  // idle amplitude ≈ 0.006 (feTurbulence baseFreq), hover ≈ 0.014
  // scale: idle 3 / hover 7 (subtle)
  const IDLE_FREQ_X  = 0.006;
  const IDLE_FREQ_Y  = 0.0007; // cX:cY = 1.8:0.2 비율
  const HOVER_FREQ_X = 0.014;
  const HOVER_FREQ_Y = 0.0016;
  const IDLE_SCALE   = 3;
  const HOVER_SCALE  = 7;

  useEffect(() => {
    // 컴포넌트 마운트 시 idle 웨이브 시작
    const loop = () => {
      tRef.current++;
      const t = tRef.current;
      const targetFreqX = isHoveringRef.current ? HOVER_FREQ_X : IDLE_FREQ_X;
      const targetFreqY = isHoveringRef.current ? HOVER_FREQ_Y : IDLE_FREQ_Y;
      const targetScale = isHoveringRef.current ? HOVER_SCALE  : IDLE_SCALE;

      // 현재 값 부드럽게 lerp
      const curStr = turbRef.current?.getAttribute('baseFrequency') || '0 0';
      const [cx, cy] = curStr.split(' ').map(Number);
      const curScale = parseFloat(dispRef.current?.getAttribute('scale') || '3');

      const lerpFactor = 0.035;
      const nx = cx + (targetFreqX + Math.sin(t * 0.018) * targetFreqX * 0.4 - cx) * lerpFactor;
      const ny = cy + (targetFreqY + Math.sin(t * 0.012) * targetFreqY * 0.3 - cy) * lerpFactor;
      const ns = curScale + (targetScale - curScale) * 0.04;

      turbRef.current?.setAttribute('baseFrequency', `${nx.toFixed(5)} ${ny.toFixed(5)}`);
      dispRef.current?.setAttribute('scale', ns.toFixed(2));

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => { isHoveringRef.current = true; };
  const handleMouseLeave = () => { isHoveringRef.current = false; };

  return (
    <div
      className="home-works__card-img"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
              type="turbulence"
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

  // 드래그 상태
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });

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
    };
    trackRef.current.style.cursor = 'grabbing';
    trackRef.current.style.userSelect = 'none';
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragRef.current.startX) * 1.5;
    trackRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
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
                // 드래그 후 클릭 방지
                if (Math.abs(dragRef.current.scrollLeft - (trackRef.current?.scrollLeft ?? 0)) > 5) {
                  e.preventDefault();
                }
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
