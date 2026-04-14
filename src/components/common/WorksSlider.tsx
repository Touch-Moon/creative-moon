'use client';
/**
 * WorksSlider — SELECTED WORKS shared slider
 * Shared layout + logic component used by HomeWorks and WorkRelated.
 * Receives only the data (works array) as props; everything else is managed here.
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

// ── Animation ─────────────────────────────────────────────────────────────────

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

// ── Parallax speed ────────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

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
  const dragRef         = useRef({ active: false, startX: 0, scrollLeft: 0, hasDragged: false, startIdx: 0 });
  const bounceRef       = useRef({ overscroll: 0, animating: false });
  const bounceRafRef    = useRef<number>(0);
  const velBufferRef    = useRef<{ scroll: number; t: number }[]>([]);
  const justDraggedRef  = useRef(false);
  const onDragEndRef    = useRef<() => void>(() => {});

  // ── Section entry detection (line + title reveal) ───────────────────────────
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

  // ── Navigate cards via buttons ───────────────────────────────────────────────
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
    // Touch devices (iPhone etc.): skip to avoid jitter caused by native scroll + CSS transition interference
    if (window.matchMedia('(hover: none)').matches) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const trackWidth = trackRef.current.clientWidth;
    imgInnerRefs.current.forEach((inner, i) => {
      if (!inner || !works[i]) return;
      const speed = PARALLAX_SPEED[works[i].size];
      const card = inner.closest('.ws__card') as HTMLElement;
      if (!card) return;

      // Calculate card visibility ratio (0 = fully off-screen, 1 = fully in-view)
      // Prevents large translateX on off-screen cards from exceeding the
      // wave-image__inner margin (3%) and exposing the grey background
      const cardLeft  = card.offsetLeft;
      const cardRight = card.offsetLeft + card.offsetWidth;
      const viewLeft  = scrollLeft;
      const viewRight = scrollLeft + trackWidth;
      const visiblePx = Math.max(0, Math.min(cardRight, viewRight) - Math.max(cardLeft, viewLeft));
      const visibilityRatio = visiblePx / card.offsetWidth; // 0~1

      const rawOffset = (card.offsetLeft + card.offsetWidth / 2 - scrollLeft - trackWidth / 2)
        * (speed - 1) * 0.4;
      // Attenuate offset proportional to visibility: off-screen → 0, fully visible → original value
      const offset = rawOffset * visibilityRatio;

      const scale = inner.dataset.hoverScale || '1';
      // transition: none — prevents jitter caused by 0.7s transition restarting on every scroll tick
      inner.style.transition = 'none';
      inner.style.transform = `translateX(${offset}px) scale(${scale})`;
    });
  }, [works]);

  // ── Sync scroll position → current index ─────────────────────────────────────
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

  // ── Bounce spring return ──────────────────────────────────────────────────────
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

  // ── Velocity-based card snap (max ±1 from drag start) ───────────────────────
  const doSnapByIntent = useCallback((scrollLeft: number, velocity: number) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const pl = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const cards = Array.from(track.children) as HTMLElement[];
    const startIdx = dragRef.current.startIdx;
    // Only consider cards within ±1 of the drag-start card
    let nearest = startIdx, minDist = Infinity;
    cards.forEach((card, i) => {
      if (Math.abs(i - startIdx) > 1) return;
      const dist = Math.abs(card.offsetLeft - pl - scrollLeft);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    // Clamp to startIdx ±1
    let target = Math.max(startIdx - 1, Math.min(startIdx + 1, nearest));
    target = Math.max(0, Math.min(cards.length - 1, target));
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

  // ── Mouse drag ───────────────────────────────────────────────────────────────
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
      startIdx: current,
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

  // Keep the latest onDragEnd in a ref (prevents stale closure in window handler)
  onDragEndRef.current = onDragEnd;

  // ── Custom DRAG cursor ────────────────────────────────────────────────────────
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

  // ── window mouseup — end drag even when mouse is released outside the track ───
  useEffect(() => {
    const h = () => { if (dragRef.current.active) onDragEndRef.current(); };
    window.addEventListener('mouseup', h);
    return () => window.removeEventListener('mouseup', h);
  }, []);

  // ── window click capture — block link click immediately after drag ───────────
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

      {/* Horizontal TOP line */}
      <span className={`works-slider__line-h works-slider__line-h--top${revealed ? ' is-revealed' : ''}`} />
      {/* Vertical line */}
      <span className={`works-slider__line-v${revealed ? ' is-revealed' : ''}`} />

      <div className="works-slider__inner">

        {/* ── Sidebar ── */}
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

        {/* ── Card track ── */}
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

      {/* Horizontal BOTTOM line */}
      <span className={`works-slider__line-h works-slider__line-h--bottom${revealed ? ' is-revealed' : ''}`} />

      {/* DRAG cursor (body portal) */}
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
