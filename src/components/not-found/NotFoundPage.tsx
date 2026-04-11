'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './NotFoundPage.scss';

const ORBITAL_PATH =
  'M239.593 36.2019C239.593 36.2019 55.3702 108.19 14.3204 250.389C-166.663 877.325 1557.46 937.857 1497.78 512.469C1468.75 305.49 940.396 437.475 802.939 502.791C621.902 588.816 375.877 755.292 436.044 965.727C449.839 1013.98 473.152 1041.9 514.806 1074.55C563.565 1112.76 609.96 1133.15 669.771 1155.72C747.397 1185.01 927.439 1233.13 1166.87 1262.22';

// ── 타이밍 설정 ─────────────────────────────────────
const MOVE_DURATION     = 9000;  // 비행기가 경로를 완주하는 시간 (ms)
const FADE_OUT_DURATION = 500;   // 완주 후 페이드아웃 시간 (ms)
const FADE_IN_DURATION  = 500;   // 재시작 전 페이드인 시간 (ms)
const TOTAL_DURATION    = MOVE_DURATION + FADE_OUT_DURATION + FADE_IN_DURATION;

/**
 * CSS cubic-bezier(p1x, p1y, p2x, p2y) easing solver.
 * Newton's method으로 bezier parameter t를 구하고 Y(t) 반환.
 */
function cubicBezierEase(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x,  bx = 3 * (p2x - p1x) - cx,  ax = 1 - cx - bx;
  const cy = 3 * p1y,  by = 3 * (p2y - p1y) - cy,  ay = 1 - cy - by;

  return function ease(x: number): number {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xv  = ax * t * t * t + bx * t * t + cx * t - x;
      const dxv = 3 * ax * t * t + 2 * bx * t + cx;
      if (Math.abs(dxv) < 1e-6) break;
      t -= xv / dxv;
    }
    t = Math.max(0, Math.min(1, t));
    return ay * t * t * t + by * t * t + cy * t;
  };
}

const ease = cubicBezierEase(0.42, 0, 0.58, 1);

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);

  const pathRef  = useRef<SVGPathElement>(null); // 측정용 (invisible)
  const trailRef = useRef<SVGPathElement>(null); // 트레일 선
  const planeRef = useRef<SVGGElement>(null);    // 비행기 그룹

  const rafRef   = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.dataset.page = 'not-found';
    return () => { delete document.body.dataset.page; };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const pathEl  = pathRef.current;
    const trailEl = trailRef.current;
    const planeEl = planeRef.current;
    if (!pathEl || !trailEl || !planeEl) return;

    const total = pathEl.getTotalLength();
    trailEl.style.strokeDasharray  = `${total}`;
    trailEl.style.strokeDashoffset = `${total}`; // 처음엔 아무것도 안 보임

    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % TOTAL_DURATION;

      let len: number;
      let opacity: number;

      if (elapsed < MOVE_DURATION) {
        // ── Phase 1: 비행기 이동 ─────────────────
        const t   = elapsed / MOVE_DURATION;
        len       = ease(t) * total;
        opacity   = 1;

      } else if (elapsed < MOVE_DURATION + FADE_OUT_DURATION) {
        // ── Phase 2: 완주 후 페이드아웃 ──────────
        // 비행기는 끝점에 고정, 트레일도 전체 유지
        len     = total;
        const t = (elapsed - MOVE_DURATION) / FADE_OUT_DURATION;
        opacity = 1 - t; // 1 → 0

      } else {
        // ── Phase 3: 시작점에서 페이드인 ─────────
        // 비행기는 시작점, 트레일 0부터
        len     = 0;
        const t = (elapsed - MOVE_DURATION - FADE_OUT_DURATION) / FADE_IN_DURATION;
        opacity = t; // 0 → 1
      }

      // 트레일: 시작부터 len까지만 표시
      trailEl.style.strokeDashoffset = `${total - len}`;
      trailEl.style.opacity          = `${opacity}`;

      // 비행기: len 위치에 배치 + 경로 방향으로 회전
      const safeLen = Math.max(0, Math.min(len, total));
      const pt      = pathEl.getPointAtLength(safeLen);
      const ahead   = Math.min(safeLen + 10, total);
      const ptFwd   = pathEl.getPointAtLength(ahead);
      const angle   = Math.atan2(ptFwd.y - pt.y, ptFwd.x - pt.x) * (180 / Math.PI);

      planeEl.setAttribute(
        'transform',
        `translate(${pt.x}, ${pt.y}) rotate(${angle}) translate(-290, -16)`,
      );
      planeEl.style.opacity = `${opacity}`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mounted]);

  return (
    <div className={`error404__wrapper${mounted ? ' is-mounted' : ''}`}>

      {/* ── Orbital SVG ───────────────────────── */}
      <div className="error404__orbital" aria-hidden="true">
        <svg
          viewBox="0 0 1500 1263"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 길이 측정용 — 화면에 보이지 않음 */}
          <path ref={pathRef} d={ORBITAL_PATH} stroke="none" fill="none" />

          {/* 트레일 선 */}
          <path
            ref={trailRef}
            d={ORBITAL_PATH}
            stroke="white"
            strokeOpacity="0.55"
            strokeLinecap="round"
            fill="none"
            vectorEffect="nonScalingStroke"
          />

          {/* 종이비행기 */}
          <g ref={planeRef} className="plane-group">
            <path
              d="M312.316 9.95847L267.797 1L277.357 15.5993L287.85 32.3412L312.316 9.95847Z"
              stroke="white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="nonScalingStroke"
            />
            <path
              d="M312.316 9.95832L277.347 15.5973L275.656 24.0035L281.3 22.4495"
              stroke="white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="nonScalingStroke"
            />
          </g>
        </svg>
      </div>

      {/* ── Center content ────────────────────── */}
      <div className="error404__content">

        <h2 className="error404__subtitle body-text-2">404</h2>

        <h1 className="error404__title">
          <span className="error404__title-line">
            <span className="headline-1 headline--uppercase">LOST IN</span>
          </span>
          <span className="error404__title-line">
            <span className="headline-1 headline--uppercase">SPACE</span>
          </span>
        </h1>

        <div className="error404__button">
          <Link href="/" className="button button--m">
            <div />
            <span>Take me home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
