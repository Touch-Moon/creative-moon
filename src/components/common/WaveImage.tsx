'use client';
/**
 * WaveImage — Canvas 기반 마우스오버 파동 효과
 * HomeWorks.tsx 에서 추출한 공통 컴포넌트.
 * 마우스 진입 시 수건-탁 파동이 왼→오 방향으로 한 번 흐름.
 */
import { useRef, useCallback, useEffect } from 'react';

const WAVE_AMP = 20;
const WAVE_SIGMA_PCT = 0.5;
const WAVE_CYCLES = 0.5;
const PULSE_SPEED = 0.032;

type Props = {
  /** img src (public 경로 또는 절대 URL) */
  src: string;
  alt: string;
  /** 래퍼 div 추가 className (선택) */
  className?: string;
  /** 커서 배지 라벨 (기본: undefined → 배지 없음) */
  cursorLabel?: string;
  /** parallaxRef — 외부에서 inner div ref를 가져갈 때 사용 */
  parallaxRef?: React.Ref<HTMLDivElement>;
};

export default function WaveImage({ src, alt, className = '', cursorLabel, parallaxRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);
  const pulseRef = useRef({ progress: 0, active: false });
  const hoverDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragCursorRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }, []);

  const drawFrame = useCallback((p: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || canvas.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = W / H;
    let sx: number, sy: number, sw: number, sh: number;
    if (ir > cr) { sh = img.naturalHeight; sw = sh * cr; sx = (img.naturalWidth - sw) / 2; sy = 0; }
    else { sw = img.naturalWidth; sh = sw / cr; sx = 0; sy = (img.naturalHeight - sh) / 2; }

    if (p === 0) { ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H); return; }

    const sigma = W * WAVE_SIGMA_PCT;
    const sigmaSq = sigma * sigma;
    const waveCenter = W + sigma * 1.5 - p * (W + sigma * 3);
    const freq = (Math.PI * 2 * WAVE_CYCLES) / (sigma * 2);
    const dpr = window.devicePixelRatio || 1;
    const ampPx = WAVE_AMP * dpr;
    const colW = Math.max(1, Math.round(dpr));

    for (let x = 0; x < W; x += colW) {
      const d = x - waveCenter;
      const gauss = Math.exp(-(d * d) / sigmaSq);
      const dy = ampPx * Math.sin(d * freq) * gauss;
      const srcX = sx + (x / W) * sw;
      const srcW = Math.max((colW / W) * sw, 0.5);
      ctx.drawImage(img, srcX, sy, srcW, sh, x, dy, colW, H);
    }
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imgRef.current = img; sizeCanvas(); drawFrame(0); };
    img.src = src;
  }, [src, sizeCanvas, drawFrame]);

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

  const handleMouseEnter = () => {
    if (cursorLabel) dragCursorRef.current?.classList.add('is-visible');
    sizeCanvas();
    drawFrame(0);
    if (wrapRef.current) {
      // applyParallax 가 transition:'none' 을 인라인으로 세팅할 수 있으므로
      // hover 애니메이션은 여기서 inline transition 을 직접 복원
      wrapRef.current.style.transition = 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)';
      wrapRef.current.style.transform = `scale(1.06)`;
    }
    hoverDelayRef.current = setTimeout(() => {
      pulseRef.current = { progress: 0, active: true };
      startRaf();
    }, 300);
  };

  const handleMouseLeave = () => {
    pulseRef.current = { progress: 0, active: false };
    if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    stopRaf(); drawFrame(0);
    if (wrapRef.current) {
      wrapRef.current.style.transition = 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)';
      wrapRef.current.style.transform = `scale(1)`;
    }
    if (cursorLabel) dragCursorRef.current?.classList.remove('is-visible');
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cursorLabel || !dragCursorRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragCursorRef.current.style.transform =
      `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
  }, [cursorLabel]);

  // cleanup
  useEffect(() => () => {
    if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className={`wave-image${className ? ` ${className}` : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={(el) => {
          (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof parallaxRef === 'function') parallaxRef(el);
          else if (parallaxRef && 'current' in parallaxRef)
            (parallaxRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className="wave-image__inner"
        aria-label={alt}
        role="img"
      >
        <canvas ref={canvasRef} className="wave-image__canvas" />
      </div>

      {cursorLabel && (
        <div ref={dragCursorRef} className="wave-image__cursor" aria-hidden="true">
          <span className="wave-image__cursor-inner">{cursorLabel}</span>
        </div>
      )}
    </div>
  );
}
