'use client';
/**
 * WorksSlider — SELECTED WORKS 공통 슬라이더
 * HomeWorks 와 WorkRelated 가 공유하는 레이아웃 + 기능 컴포넌트.
 * 데이터(works 배열)만 props로 받고, 나머지는 모두 여기서 관리.
 */
import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Link from 'next/link';
import ArrowButton from '@/components/common/ArrowButton';
import WaveImage from '@/components/common/WaveImage';
import './WaveImage.scss';
import type { SelectedWork, CardSize } from '@/data/works';
import './WorksSlider.scss';

// ── 애니메이션 ─────────────────────────────────────────────────────────────────

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const titleClipVariants: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
  visible: (i: number) => ({
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      'polygon(0% 0%, 100% 0%, 100% 15%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ],
    transition: { duration: 2.1, ease: EASE_OUT, times: [0, 0.4, 1], delay: i * 0.12 },
  }),
};

const titleSlideVariants: Variants = {
  hidden: { y: '115%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.4, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

const cardVariants: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: (i: number) => ({
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 1.1, ease: EASE_OUT, delay: 1.01 + i * 0.18 },
  }),
};

const MotionLink = m.create(Link);

// ── Parallax 속도 ──────────────────────────────────────────────────────────────

const PARALLAX_SPEED: Record<CardSize, number> = {
  large: 1.0,
  wide: 0.92,
  tall: 1.1,
  compact: 1.18,
};

// ── Props ──────────────────────────────────────────────────────────────────────

interface WorksSliderProps {
  works: SelectedWork[];
  dataTheme?: 'dark' | 'light';
}

// ── 컴포넌트 ───────────────────────────────────────────────────────────────────

export default function WorksSlider({ works, dataTheme = 'dark' }: WorksSliderProps) {
  const [current, setCurrent]   = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mounted, setMounted]   = useState(false);
  useEffect(() => setMounted(true), []);

  // refs
  const sectionRef     = useRef<HTMLElement>(null);
  const trackRef       = useRef<HTMLDivElement>(null);
  const cursorRef      = useRef<HTMLDivElement>(null);
  const imgInnerRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const isScrollingRef  = useRef(false);
  const scrollTimerRef  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dragRef         = useRef({ active: false, startX: 0, scrollLeft: 0, hasDragged: false });
  const bounceRef       = useRef({ overscroll: 0, animating: false });
  const bounceRafRef    = useRef<number>(0);
  const velBufferRef    = useRef<{ scroll: number; t: number }[]>([]);
  const justDraggedRef  = useRef(false);
  const onDragEndRef    = useRef<() => void>(() => {});

  // ── 섹션 진입 감지 (라인 + 타이틀 reveal) ───────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── 버튼으로 카드 이동 ────────────────────────────────────────────────────────
  const scrollTo = (idx: number) => {
    if (!trackRef.current) return;
    isScrollingRef.current = true;
    setCurrent(idx);
    const card = trackRef.current.children[idx] as HTMLElement;
    if (card) {
      const pl = parseFloat(getComputedStyle(trackRef.current).paddingLeft) || 0;
      trackRef.current.scrollTo({ left: card.offsetLeft - pl, behavior: 'smooth' });
    }
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      if (trackRef.current) {
        trackRef.current.style.scrollSnapType = '';
        trackRef.current.style.scrollBehavior = '';
      }
      isScrollingRef.current = false;
    }, 1000);
  };

  // ── Parallax ──────────────────────────────────────────────────────────────────
  const applyParallax = useCallback(() => {
    if (!trackRef.current) return;
    // 터치 기기(iPhone 등): native scroll + CSS transition 간섭 → jitter 발생하므로 생략
    if (window.matchMedia('(hover: none)').matches) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const trackWidth = trackRef.current.clientWidth;
    imgInnerRefs.current.forEach((inner, i) => {
      if (!inner || !works[i]) return;
      const speed = PARALLAX_SPEED[works[i].size];
      const card = inner.closest('.ws__card') as HTMLElement;
      if (!card) return;

      // 카드 가시성 비율 계산 (0 = 완전 off-screen, 1 = 완전 in-view)
      // off-screen 카드에 큰 translateX가 적용되면 wave-image__inner의
      // 여백(3%)을 초과해 회색 배경이 노출되는 문제를 방지
      const cardLeft  = card.offsetLeft;
      const cardRight = card.offsetLeft + card.offsetWidth;
      const viewLeft  = scrollLeft;
      const viewRight = scrollLeft + trackWidth;
      const visiblePx = Math.max(0, Math.min(cardRight, viewRight) - Math.max(cardLeft, viewLeft));
      const visibilityRatio = visiblePx / card.offsetWidth; // 0~1

      const rawOffset = (card.offsetLeft + card.offsetWidth / 2 - scrollLeft - trackWidth / 2)
        * (speed - 1) * 0.4;
      // 가시성에 비례해 오프셋 감쇠: off-screen → 0, fully visible → 원래 값
      const offset = rawOffset * visibilityRatio;

      const scale = inner.dataset.hoverScale || '1';
      // transition: none — 스크롤 tick마다 0.7s transition이 재시작되는 jitter 방지
      inner.style.transition = 'none';
      inner.style.transform = `translateX(${offset}px) scale(${scale})`;
    });
  }, [works]);

  // ── 스크롤 → current 동기화 ───────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    applyParallax();
    if (isScrollingRef.current || !trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    const pl = parseFloat(getComputedStyle(trackRef.current).paddingLeft) || 0;
    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - pl - scrollLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setCurrent(Math.max(0, Math.min(closest, works.length - 1)));
  }, [applyParallax, works.length]);

  // ── Rubber-band ───────────────────────────────────────────────────────────────
  const rubberBand = (o: number, max = 140) => {
    const s = o < 0 ? -1 : 1;
    return s * max * (1 - Math.exp(-Math.abs(o) / max * 0.55));
  };

  // ── Bounce spring 복귀 ────────────────────────────────────────────────────────
  const animateBounceBack = useCallback(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const bounce = bounceRef.current;
    cancelAnimationFrame(bounceRafRef.current);
    bounce.animating = true;
    let velocity = 0;
    const tick = () => {
      velocity = (velocity + -bounce.overscroll * 0.18) * 0.6;
      bounce.overscroll += velocity;
      if (Math.abs(bounce.overscroll) < 0.5 && Math.abs(velocity) < 0.5) {
        bounce.overscroll = 0; bounce.animating = false; track.style.transform = ''; return;
      }
      track.style.transform = `translateX(${bounce.overscroll}px)`;
      bounceRafRef.current = requestAnimationFrame(tick);
    };
    bounceRafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── 속도 기반 카드 snap ───────────────────────────────────────────────────────
  const doSnapByIntent = useCallback((scrollLeft: number, velocity: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const pl = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const cards = Array.from(track.children) as HTMLElement[];
    let nearest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - pl - scrollLeft);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    let target = nearest;
    if (velocity > 8 && target < cards.length - 1) target++;
    else if (velocity < -8 && target > 0) target--;
    const targetCard = cards[target] as HTMLElement;
    if (targetCard) {
      isScrollingRef.current = true;
      setCurrent(target);
      track.scrollTo({ left: targetCard.offsetLeft - pl, behavior: 'smooth' });
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.scrollSnapType = '';
          trackRef.current.style.scrollBehavior = '';
        }
        isScrollingRef.current = false;
      }, 500);
    }
  }, []);

  // ── 마우스 드래그 ─────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    cancelAnimationFrame(bounceRafRef.current);
    bounceRef.current = { overscroll: 0, animating: false };
    trackRef.current.style.transform = '';
    dragRef.current = {
      active: true,
      startX: e.pageX - trackRef.current.offsetLeft,
      scrollLeft: trackRef.current.scrollLeft,
      hasDragged: false,
    };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !trackRef.current) return;
    const track = trackRef.current;
    const x = e.pageX - track.offsetLeft;
    if (!dragRef.current.hasDragged && Math.abs(x - dragRef.current.startX) > 1) {
      dragRef.current.hasDragged = true;
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      track.style.cursor = 'grabbing';
      track.style.userSelect = 'none';
    }
    if (dragRef.current.hasDragged) {
      e.preventDefault();
      const desired = dragRef.current.scrollLeft - (x - dragRef.current.startX) * 1.05;
      const max = track.scrollWidth - track.clientWidth;
      if (desired < 0) {
        track.scrollLeft = 0;
        bounceRef.current.overscroll = rubberBand(-desired);
        track.style.transform = `translateX(${bounceRef.current.overscroll}px)`;
      } else if (desired > max) {
        track.scrollLeft = max;
        bounceRef.current.overscroll = rubberBand(max - desired);
        track.style.transform = `translateX(${bounceRef.current.overscroll}px)`;
      } else {
        bounceRef.current.overscroll = 0;
        track.style.transform = '';
        track.scrollLeft = desired;
      }
      applyParallax();
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
      const buf = velBufferRef.current;
      let velocity = 0;
      if (buf.length >= 2) {
        const dt = buf[buf.length - 1].t - buf[0].t;
        if (dt > 0 && dt < 150)
          velocity = (buf[buf.length - 1].scroll - buf[0].scroll) / dt * 16;
      }
      velBufferRef.current = [];
      doSnapByIntent(track.scrollLeft, velocity);
    } else {
      track.style.scrollSnapType = '';
      track.style.scrollBehavior = '';
    }
    track.style.cursor = '';
    track.style.userSelect = '';
    dragRef.current.active = false;
  }, [animateBounceBack, doSnapByIntent]);

  // 최신 onDragEnd를 ref에 유지 (window handler에서 stale closure 방지)
  onDragEndRef.current = onDragEnd;

  // ── 커스텀 DRAG 커서 ──────────────────────────────────────────────────────────
  const handleTrackEnter = () => cursorRef.current?.classList.add('is-visible');
  const handleTrackLeave = () => {
    onDragEnd();
    cursorRef.current?.classList.remove('is-visible');
  };

  useEffect(() => {
    let tx = 0, ty = 0, cx = 0, cy = 0, init = false, raf: number;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!init) { cx = tx; cy = ty; init = true; }
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      cx = lerp(cx, tx, 0.1); cy = lerp(cy, ty, 0.1);
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // ── window mouseup — 트랙 밖 마우스 업도 드래그 종료 ─────────────────────────
  useEffect(() => {
    const h = () => { if (dragRef.current.active) onDragEndRef.current(); };
    window.addEventListener('mouseup', h);
    return () => window.removeEventListener('mouseup', h);
  }, []);

  // ── window click capture — 드래그 직후 링크 클릭 차단 ───────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!justDraggedRef.current) return;
      justDraggedRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('click', h, true);
    return () => window.removeEventListener('click', h, true);
  }, []);

  // cleanup
  useEffect(() => () => {
    clearTimeout(scrollTimerRef.current);
    cancelAnimationFrame(bounceRafRef.current);
  }, []);

  if (works.length === 0) return null;

  return (
    <section ref={sectionRef} className="works-slider" data-theme={dataTheme}>

      {/* 수평 TOP 라인 */}
      <span className={`works-slider__line-h works-slider__line-h--top${revealed ? ' is-revealed' : ''}`} />
      {/* 수직 라인 */}
      <span className={`works-slider__line-v${revealed ? ' is-revealed' : ''}`} />

      <div className="works-slider__inner">

        {/* ── 사이드바 ── */}
        <div className="works-slider__sidebar">
          <h2 className="works-slider__title">
            {['SELECTED', 'WORKS'].map((line, i) => (
              <div key={i} className="works-slider__title-line">
                <m.span
                  style={{ display: 'block' }}
                  custom={i}
                  variants={titleClipVariants}
                  initial="hidden"
                  animate={revealed ? 'visible' : 'hidden'}
                >
                  <m.span
                    custom={i}
                    variants={titleSlideVariants}
                    initial="hidden"
                    animate={revealed ? 'visible' : 'hidden'}
                  >
                    {line}
                  </m.span>
                </m.span>
              </div>
            ))}
          </h2>

          <m.div
            className="works-slider__nav"
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.4 }}
          >
            {/* Counter */}
            <div className="works-slider__counter" aria-live="polite" aria-atomic="true">
              <div className="works-slider__counter-current">
                <div
                  className="works-slider__counter-list"
                  style={{ transform: `translateY(-${current}em)` }}
                >
                  {works.map((_, i) => (
                    <span key={i} aria-hidden={i !== current}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
              <span className="works-slider__counter-sep">/</span>
              <span className="works-slider__counter-total">
                {String(works.length).padStart(2, '0')}
              </span>
            </div>

            {/* Arrows */}
            <div className="works-slider__arrows">
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
          </m.div>
        </div>

        {/* ── 카드 트랙 ── */}
        <div
          className="works-slider__track"
          ref={trackRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onDragEnd}
          onMouseEnter={handleTrackEnter}
          onMouseLeave={handleTrackLeave}
        >
          {works.map((work, i) => (
            <MotionLink
              key={work.id}
              href={`/work/${work.slug}`}
              className={`ws__card ws__card--${work.size}`}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={revealed ? 'visible' : 'hidden'}
              draggable={false}
              data-hero-src={work.src}
              onClick={(e) => { if (dragRef.current.hasDragged) e.preventDefault(); }}
            >
              <div className="ws__card-img">
                <WaveImage
                  src={work.src}
                  alt={work.title}
                  parallaxRef={(el: HTMLDivElement | null) => { imgInnerRefs.current[i] = el; }}
                />
              </div>
              <p className="ws__card-title">{work.title}</p>
            </MotionLink>
          ))}
        </div>

      </div>

      {/* 수평 BOTTOM 라인 */}
      <span className={`works-slider__line-h works-slider__line-h--bottom${revealed ? ' is-revealed' : ''}`} />

      {/* DRAG 커서 (body portal) */}
      {mounted && createPortal(
        <div ref={cursorRef} className="works-slider__cursor" aria-hidden="true">
          <div className="works-slider__cursor-bg" />
          <span className="works-slider__cursor-label">Drag</span>
        </div>,
        document.body
      )}

    </section>
  );
}
