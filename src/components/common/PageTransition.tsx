'use client';

/**
 * PageTransition — thumbnail freeze + wave + curtain page transition
 * ──────────────────────────────────────────────────────────────────
 * EXIT: capture-phase click → fade + clone + scroll → safePush
 * ENTER: useLayoutEffect([pathname]) → detect clone in DOM → wave → curtain → reveal
 *
 * Robustness:
 * - both EXIT / ENTER use failsafe timers to prevent deadlocks
 * - wave has a separate timeout (WAVE_TIMEOUT_MS)
 * - isNavigating is also reset in EXIT failsafe
 */

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { initCanvas, runWave, drawStill } from '@/lib/canvasWave';
import { useLenis } from './LenisContext';
import './PageTransition.scss';

/** Reset Lenis scroll to top and restart */
function resetLenisAndStart(lenisRef: React.RefObject<import('lenis').default | null>) {
  const lenis = lenisRef.current;
  if (lenis) {
    // Force-reset Lenis internal scroll state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const l = lenis as any;
    if (typeof l.targetScroll !== 'undefined') l.targetScroll = 0;
    if (typeof l.animatedScroll !== 'undefined') l.animatedScroll = 0;
  }
  window.scrollTo(0, 0);
  lenis?.start();
}

/** Safe navigation — prevents useRouter closure invalidation */
function safePush(href: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = (window as any).next?.router;
  if (r?.push) {
    r.push(href);
  } else {
    window.location.href = href;
  }
}

// ── Constants ────────────────────────────────────────────────────
const SCROLL_MS        = 480;
const CURTAIN_MS       = 900;
const NAV_DELAY        = 20;
const FAILSAFE_MS      = 5000;   // overall ENTER failsafe
const EXIT_FAILSAFE_MS = 3000;   // EXIT failsafe (scroll+navigate)
const WAVE_TIMEOUT_MS  = 2000;   // individual wave timeout
const CLONE_ATTR       = 'data-pt-clone';
const CLONE_SEL        = `[${CLONE_ATTR}]`;

let isNavigating = false;

function getSpace16(): number {
  return Math.min(window.innerWidth * 0.044444, 85.33);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/** Force-clean all transition remnants */
function forceCleanup() {
  document.querySelectorAll(CLONE_SEL).forEach((el) => el.remove());
  document.documentElement.classList.remove(
    'is-page-exiting', 'is-thumb-exiting', 'is-work-exiting', 'is-page-entering',
  );
  const main = document.getElementById('main-content');
  if (main) {
    main.style.transform  = '';
    main.style.transition = '';
    main.style.opacity    = '';
  }
  isNavigating = false;
}

// ────────────────────────────────────────────────────────────────────
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useLenis();
  const prevPath = useRef(pathname);

  // ── ENTER: run transition if clone is still in DOM after pathname change ──
  useLayoutEffect(() => {
    // ★ check for clone first — takes priority over prevPath
    const clone = document.querySelector(CLONE_SEL) as HTMLElement | null;

    if (!clone) {
      forceCleanup();
      lenisRef.current?.start();   // no clone → scroll reset not needed
      prevPath.current = pathname;
      return;
    }
    prevPath.current = pathname;
    const main = document.getElementById('main-content');
    if (main) {
      main.style.transition = 'none';
      main.style.transform  = 'translateY(100svh)';
      main.style.opacity    = '0';
    }

    // ── Extract canvas + image reference ────────────────────────
    const canvas = clone.querySelector('canvas') as HTMLCanvasElement | null;
    const imgSrc = clone.getAttribute('data-pt-src') || '';

    if (!canvas) {
      forceCleanup();
      resetLenisAndStart(lenisRef);
      return;
    }

    // ── Failsafe (full ENTER sequence) ──────────────────────────
    const failsafeTimer = setTimeout(() => {
      forceCleanup();
      resetLenisAndStart(lenisRef);
    }, FAILSAFE_MS);

    // ── startCurtain: raise curtain bottom→top then reveal main ─
    let curtainStarted = false;
    const startCurtain = () => {
      if (curtainStarted) return;   // prevent duplicate calls
      curtainStarted = true;

      // curtain: clip-path bottom→top
      clone.getBoundingClientRect();          // reflow
      clone.style.transition = `clip-path ${CURTAIN_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`;
      clone.style.clipPath   = 'inset(0 0 100% 0)';

      // curtain 50% → main slide up + fade in
      // Hand off from exit classes to `is-page-entering` so the overflow
      // lock stays in place until the slide-up + curtain finish.
      setTimeout(() => {
        document.documentElement.classList.add('is-page-entering');
        document.documentElement.classList.remove(
          'is-page-exiting', 'is-thumb-exiting', 'is-work-exiting',
        );
        const m = document.getElementById('main-content');
        if (m) {
          const dur = Math.round(CURTAIN_MS * 0.65);
          m.style.transition = `transform ${dur}ms cubic-bezier(0.19, 1, 0.22, 1), opacity ${dur}ms ease`;
          m.style.transform  = 'translateY(0)';
          m.style.opacity    = '1';
        }
      }, Math.round(CURTAIN_MS * 0.5));

      // curtain complete → cleanup
      setTimeout(() => {
        clearTimeout(failsafeTimer);
        clone.remove();
        isNavigating = false;
        const m = document.getElementById('main-content');
        if (m) {
          m.style.transform  = '';
          m.style.transition = '';
          m.style.opacity    = '';
        }
        document.documentElement.classList.remove('is-page-entering');
        resetLenisAndStart(lenisRef);
      }, CURTAIN_MS + 120);
    };

    // ── Frozen video frame → wave → curtain (Dept-style, no image swap) ──
    const ptVideo = (clone as unknown as { __ptVideo?: HTMLVideoElement }).__ptVideo;
    if (ptVideo && ptVideo.videoWidth > 0) {
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight;
      if (cw > 0 && ch > 0) {
        canvas.width  = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
      }
      let waveTimerId: ReturnType<typeof setTimeout> | null = setTimeout(() => startCurtain(), WAVE_TIMEOUT_MS);
      try {
        runWave(canvas, ptVideo, () => {
          if (waveTimerId) clearTimeout(waveTimerId);
          startCurtain();
        });
      } catch {
        if (waveTimerId) clearTimeout(waveTimerId);
        startCurtain();
      }
    }
    // ── Image load → wave (+ timeout) → curtain ─────────────────
    else if (imgSrc) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      // wave timeout: force curtain if not done within WAVE_TIMEOUT_MS
      let waveTimerId: ReturnType<typeof setTimeout> | null = null;

      const onLoaded = () => {
        const dpr = window.devicePixelRatio || 1;
        const cw  = canvas.offsetWidth;
        const ch  = canvas.offsetHeight;
        if (cw > 0 && ch > 0) {
          canvas.width  = Math.round(cw * dpr);
          canvas.height = Math.round(ch * dpr);
        }
        try {
          waveTimerId = setTimeout(() => startCurtain(), WAVE_TIMEOUT_MS);
          runWave(canvas, img, () => {
            if (waveTimerId) clearTimeout(waveTimerId);
            startCurtain();
          });
        } catch {
          if (waveTimerId) clearTimeout(waveTimerId);
          startCurtain();
        }
      };

      img.onload  = onLoaded;
      img.onerror = () => startCurtain();
      img.src     = imgSrc;
    } else {
      startCurtain();
    }
  }, [pathname, lenisRef]);

  // ── Clean up work-list remnants on pathname change ────────────
  useEffect(() => {
    document.querySelector('.work-list')?.classList.remove('is-exiting');
    document.querySelectorAll('[data-active]').forEach(
      (el) => el.removeAttribute('data-active'),
    );
  }, [pathname]);

  // ── EXIT: intercept internal link clicks ──────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      if (
        href.startsWith('http') || href.startsWith('#') ||
        href.startsWith('mailto:') || href.startsWith('tel:')
      ) return;
      if (href === pathname) return;
      if (isNavigating) return;

      const wsCard         = (e.target as Element).closest('.ws__card')            as HTMLElement | null;
      const workItem       = (e.target as Element).closest('.work-item')           as HTMLElement | null;
      const storyCard      = (e.target as Element).closest('.story-card')          as HTMLElement | null;
      const homeStoryCard  = (e.target as Element).closest('.home-stories__card') as HTMLElement | null;
      const thumbCard = wsCard || workItem || storyCard || homeStoryCard;

      if (thumbCard) {
        e.preventDefault();
        isNavigating = true;

        let imgEl: HTMLElement | null = null;
        let src = '';

        if (wsCard) {
          imgEl = wsCard.querySelector<HTMLElement>('.ws__card-img');
          src   = wsCard.dataset.heroSrc || '';
        } else if (workItem) {
          imgEl = workItem.querySelector<HTMLElement>('.work-item__image');
          src   = workItem.dataset.heroSrc || '';
        } else if (storyCard) {
          imgEl = storyCard.querySelector<HTMLElement>('.story-card__image');
          src   = storyCard.dataset.heroSrc || '';
        } else if (homeStoryCard) {
          imgEl = homeStoryCard.querySelector<HTMLElement>('.home-stories__card-img');
          src   = homeStoryCard.dataset.heroSrc || '';
        }

        if (!imgEl || !src) {
          document.documentElement.classList.add('is-page-exiting');
          setTimeout(() => { safePush(href); isNavigating = false; }, 360);
          return;
        }

        // Stop Lenis
        lenisRef.current?.stop();

        // ① fade out
        document.documentElement.classList.add('is-thumb-exiting');

        // ② create clone — store image path in data-pt-src
        const rect   = imgEl.getBoundingClientRect();
        const docTop = rect.top + window.scrollY;

        const clone    = document.createElement('div');
        const canvas   = document.createElement('canvas');
        const fallback = document.createElement('img');

        // fallback img: show immediately from browser cache (prevents blank before canvas loads)
        fallback.src = src;
        fallback.setAttribute('aria-hidden', 'true');
        fallback.style.cssText =
          'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;';

        canvas.style.cssText =
          'position:absolute;inset:0;width:100%;height:100%;display:block;';

        clone.setAttribute(CLONE_ATTR, '1');
        clone.setAttribute('data-pt-src', src);
        clone.style.cssText = [
          'position:fixed',
          `top:${rect.top}px`,
          `left:${rect.left}px`,
          `width:${rect.width}px`,
          `height:${rect.height}px`,
          'z-index:1000',
          'overflow:hidden',
          'pointer-events:none',
          'will-change:top,clip-path',
          'background:#1a1a1a',
          'clip-path:inset(0 0 0% 0)',
        ].join(';');

        clone.appendChild(fallback); // below: immediately visible image
        clone.appendChild(canvas);   // above: canvas for wave (transparent before load)
        document.body.appendChild(clone);

        // ③ draw onto canvas (used during wave ENTER)
        //    If the card thumbnail is a playing <video>, freeze it on the current
        //    frame and use that frame for the wave — no jarring video→poster swap.
        const thumbVideo = imgEl.querySelector('video') as HTMLVideoElement | null;
        const hasFrame = !!thumbVideo && thumbVideo.readyState >= 2 && thumbVideo.videoWidth > 0;
        if (hasFrame && thumbVideo) {
          thumbVideo.pause();
          const dpr = window.devicePixelRatio || 1;
          canvas.width  = Math.round(rect.width * dpr);
          canvas.height = Math.round(rect.height * dpr);
          try { drawStill(canvas, thumbVideo); } catch { /* canvas may taint — still fine */ }
          (clone as unknown as { __ptVideo?: HTMLVideoElement }).__ptVideo = thumbVideo;
        } else {
          initCanvas(canvas, src, () => {});
        }

        // ④ EXIT failsafe — force navigate if scroll + navigate don't complete
        const exitFailsafe = setTimeout(() => {
          safePush(href);
          // isNavigating is reset in ENTER
        }, EXIT_FAILSAFE_MS);

        // ⑤ scroll animation
        const space16       = getSpace16();
        const targetScrollY = Math.max(0, docTop - space16);
        const startScrollY  = window.scrollY;
        const startTime     = performance.now();

        const scrollLoop = (now: number) => {
          const p       = Math.min((now - startTime) / SCROLL_MS, 1);
          const ease    = easeInOut(p);
          const scrollY = startScrollY + (targetScrollY - startScrollY) * ease;
          window.scrollTo(0, scrollY);
          clone.style.top = `${docTop - scrollY}px`;

          if (p < 1) {
            requestAnimationFrame(scrollLoop);
          } else {
            // ⑥ navigate
            clearTimeout(exitFailsafe);
            setTimeout(() => {
              safePush(href);
            }, NAV_DELAY);
          }
        };

        requestAnimationFrame(scrollLoop);

      } else {
        e.preventDefault();
        isNavigating = true;
        document.documentElement.classList.add('is-page-exiting');
        setTimeout(() => {
          safePush(href);
          isNavigating = false;
        }, 360);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, lenisRef]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
