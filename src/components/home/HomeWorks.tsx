'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
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

// ── Canvas 기반 수건-탁 파동 ──────────────────────────────────────────────────
// Canvas drawImage 2px 단위 → 픽셀 레벨 부드러움 (div 스트립의 경계선 문제 해결)
const WAVE_AMP = 20;   // Y 최대 변위 (디스플레이 px)
const WAVE_SIGMA_PCT = 0.5; // Gaussian 폭 (캔버스 폭 대비 비율)
const WAVE_CYCLES = 0.5;  // Gaussian 범위 내 사인 사이클 수
const PULSE_SPEED = 0.032;

function WaveImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const pulseRef = useRef({ progress: 0, active: false });
  const hoverDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 캔버스 사이즈 설정 ────────────────────────────
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }, []);

  // ── 프레임 드로우 ─────────────────────────────────
  const drawFrame = useCallback((p: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || canvas.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // object-fit: cover 계산
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = W / H;
    let sx, sy, sw, sh: number;
    if (ir > cr) { sh = img.naturalHeight; sw = sh * cr; sx = (img.naturalWidth - sw) / 2; sy = 0; }
    else { sw = img.naturalWidth; sh = sw / cr; sx = 0; sy = (img.naturalHeight - sh) / 2; }

    // p=0 이면 왜곡 없이 원본 드로우
    if (p === 0) { ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H); return; }

    const sigma = W * WAVE_SIGMA_PCT;
    const sigmaSq = sigma * sigma;
    const waveCenter = W + sigma * 1.5 - p * (W + sigma * 3); // 오른쪽 밖 → 왼쪽 밖
    const freq = (Math.PI * 2 * WAVE_CYCLES) / (sigma * 2);
    const dpr = window.devicePixelRatio || 1;
    const ampPx = WAVE_AMP * dpr;
    const colW = Math.max(1, Math.round(dpr)); // 레티나: 2px, 일반: 1px

    for (let x = 0; x < W; x += colW) {
      const d = x - waveCenter;
      const gauss = Math.exp(-(d * d) / sigmaSq);
      const dy = ampPx * Math.sin(d * freq) * gauss;
      const srcX = sx + (x / W) * sw;
      const srcW = Math.max((colW / W) * sw, 0.5);
      ctx.drawImage(img, srcX, sy, srcW, sh, x, dy, colW, H);
    }
  }, []);

  // ── 이미지 로드 ───────────────────────────────────
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imgRef.current = img; sizeCanvas(); drawFrame(0); };
    img.src = src;
  }, [src, sizeCanvas, drawFrame]);

  // ── rAF (애니메이션 중에만 실행) ──────────────────
  const stopRaf = useCallback(() => {
    cancelAnimationFrame(rafRef.current); rafRef.current = 0;
  }, []);

  const startRaf = useCallback(() => {
    if (rafRef.current) return;
    const loop = () => {
      const pulse = pulseRef.current;
      if (pulse.active) {
        pulse.progress += PULSE_SPEED;
        if (pulse.progress >= 1) {
          pulse.progress = 0; pulse.active = false;
          drawFrame(0); stopRaf(); return;
        }
      }
      drawFrame(pulse.progress);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [drawFrame, stopRaf]);

  // ── DRAG 커스텀 커서 ──────────────────────────────
  const dragCursorRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    dragCursorRef.current?.classList.add('is-visible');
    sizeCanvas();
    drawFrame(0); // sizeCanvas()가 캔버스를 지우므로 즉시 재드로우
    if (wrapRef.current) wrapRef.current.style.transform = 'scale(1.1)';
    hoverDelayRef.current = setTimeout(() => {
      pulseRef.current = { progress: 0, active: true };
      startRaf();
    }, 400);
  };

  const handleMouseLeave = () => {
    pulseRef.current = { progress: 0, active: false };
    if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    stopRaf(); drawFrame(0);
    if (wrapRef.current) wrapRef.current.style.transform = 'scale(1)';
    dragCursorRef.current?.classList.remove('is-visible');
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragCursorRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragCursorRef.current.style.transform =
      `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
  }, []);

  return (
    <div
      className="home-works__card-img"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div ref={wrapRef} className="home-works__card-img-inner">
        <canvas ref={canvasRef} className="home-works__card-img-canvas" />
      </div>

      <div ref={dragCursorRef} className="home-works__drag-cursor" aria-hidden="true">
        <span className="home-works__drag-cursor-inner">
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
            <path d="M1 5H17M1 5L4.5 1.5M1 5L4.5 8.5M17 5L13.5 1.5M17 5L13.5 8.5"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  // ── 섹션 뷰포트 진입 감지 (라인 애니메이션 트리거) ──
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

    // 1px 이상 이동 시 드래그 의도 확정
    if (!dragRef.current.hasDragged && moved > 1) {
      dragRef.current.hasDragged = true;
      // 드래그 중 scroll-snap과 smooth 비활성화 (snap이 드래그를 방해하지 않도록)
      trackRef.current.style.scrollSnapType = 'none';
      trackRef.current.style.scrollBehavior = 'auto';
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
    if (!trackRef.current) { dragRef.current.active = false; return; }

    const track = trackRef.current;

    if (dragRef.current.hasDragged) {
      // 드래그 거리 계산 (양수 = 왼쪽으로 드래그 = 다음 카드)
      const dragDelta = dragRef.current.scrollLeft - track.scrollLeft;
      const paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const cards = Array.from(track.children) as HTMLElement[];

      // 드래그 방향에 따라 다음/이전 카드 결정
      // 작은 움직임(50px 이상)으로도 카드 전환
      let targetIdx = current;
      if (dragDelta < -50) {
        // 오른쪽으로 드래그 → 다음 카드
        targetIdx = Math.min(current + 1, works.length - 1);
      } else if (dragDelta > 50) {
        // 왼쪽으로 드래그 → 이전 카드
        targetIdx = Math.max(current - 1, 0);
      } else {
        // 50px 미만이면 가장 가까운 카드로 스냅
        let closestIdx = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
          const snapPos = card.offsetLeft - paddingLeft;
          const dist = Math.abs(snapPos - track.scrollLeft);
          if (dist < minDist) { minDist = dist; closestIdx = i; }
        });
        targetIdx = closestIdx;
      }

      // snap 없이 직접 smooth scroll
      const targetCard = cards[targetIdx] as HTMLElement;
      if (targetCard) {
        track.style.scrollBehavior = 'smooth';
        track.scrollTo({ left: targetCard.offsetLeft - paddingLeft, behavior: 'smooth' });
      }

      // smooth scroll 완료 후 snap 복원
      isScrollingRef.current = true;
      setCurrent(targetIdx);
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.scrollSnapType = '';
          trackRef.current.style.scrollBehavior = '';
        }
        isScrollingRef.current = false;
      }, 500);
    } else {
      // 드래그 안 했으면 바로 복원
      track.style.scrollSnapType = '';
      track.style.scrollBehavior = '';
    }

    track.style.cursor = '';
    track.style.userSelect = '';
    dragRef.current.active = false;
  };

  // cleanup timer
  useEffect(() => () => clearTimeout(scrollTimerRef.current), []);

  return (
    <section ref={sectionRef} className="home-works" data-theme="dark">

      {/* ① 수평 TOP */}
      <span className={`home-works__line-h home-works__line-h--top${revealed ? ' is-revealed' : ''}`} />

      {/* ② 수직 */}
      <span className={`home-works__line-v${revealed ? ' is-revealed' : ''}`} />

      <div className="wrap">
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
                  animate={revealed ? 'visible' : 'hidden'}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h2>

          <motion.div
            className="home-works__nav"
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : { opacity: 0 }}
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
              animate={revealed ? 'visible' : 'hidden'}
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
      </div>

      {/* ③ 수평 BOTTOM */}
      <span className={`home-works__line-h home-works__line-h--bottom${revealed ? ' is-revealed' : ''}`} />

    </section>
  );
}
