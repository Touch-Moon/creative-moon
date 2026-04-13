'use client';

/**
 * PageTransition — 썸네일 고정 + 파동 + 커튼 페이지 트랜지션
 * ──────────────────────────────────────────────────────────────────
 * EXIT: capture-phase click → fade + clone + scroll → safePush
 * ENTER: useLayoutEffect([pathname]) → DOM 의 클론 감지 → wave → curtain → reveal
 *
 * 견고성:
 * - EXIT / ENTER 모두 failsafe 타이머로 교착 방지
 * - wave 에 별도 타임아웃 (WAVE_TIMEOUT_MS) 적용
 * - isNavigating 은 EXIT failsafe 에서도 리셋
 */

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { initCanvas, runWave } from '@/lib/canvasWave';
import { useLenis } from './LenisContext';
import './PageTransition.scss';

/** Lenis 스크롤을 맨 위로 리셋하고 재시작 */
function resetLenisAndStart(lenisRef: React.RefObject<import('lenis').default | null>) {
  const lenis = lenisRef.current;
  if (lenis) {
    // Lenis 내부 스크롤 상태 강제 리셋
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const l = lenis as any;
    if (typeof l.targetScroll !== 'undefined') l.targetScroll = 0;
    if (typeof l.animatedScroll !== 'undefined') l.animatedScroll = 0;
  }
  window.scrollTo(0, 0);
  lenis?.start();
}

/** 안전한 네비게이션 — useRouter 클로저 무효화 방지 */
function safePush(href: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = (window as any).next?.router;
  if (r?.push) {
    r.push(href);
  } else {
    window.location.href = href;
  }
}

// ── 상수 ─────────────────────────────────────────────────────────
const SCROLL_MS        = 480;
const CURTAIN_MS       = 900;
const NAV_DELAY        = 20;
const FAILSAFE_MS      = 5000;   // ENTER 전체 failsafe
const EXIT_FAILSAFE_MS = 3000;   // EXIT failsafe (scroll+navigate)
const WAVE_TIMEOUT_MS  = 2000;   // wave 개별 타임아웃
const CLONE_ATTR       = 'data-pt-clone';
const CLONE_SEL        = `[${CLONE_ATTR}]`;

let isNavigating = false;

function getSpace16(): number {
  return Math.min(window.innerWidth * 0.044444, 85.33);
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/** 모든 트랜지션 잔재를 강제 정리 */
function forceCleanup() {
  document.querySelectorAll(CLONE_SEL).forEach((el) => el.remove());
  document.documentElement.classList.remove(
    'is-page-exiting', 'is-thumb-exiting', 'is-work-exiting',
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

  // ── ENTER: pathname 변경 시 클론이 DOM 에 남아있으면 트랜지션 실행 ──
  useLayoutEffect(() => {
    // ★ clone 존재 여부를 가장 먼저 확인 — prevPath 보다 우선
    const clone = document.querySelector(CLONE_SEL) as HTMLElement | null;

    if (!clone) {
      forceCleanup();
      lenisRef.current?.start();   // 클론 없음 → 스크롤 리셋 불필요
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

    // ── 캔버스 + 이미지 참조 꺼내기 ─────────────────────────────
    const canvas = clone.querySelector('canvas') as HTMLCanvasElement | null;
    const imgSrc = clone.getAttribute('data-pt-src') || '';

    if (!canvas) {
      forceCleanup();
      resetLenisAndStart(lenisRef);
      return;
    }

    // ── Failsafe (ENTER 전체) ────────────────────────────────────
    const failsafeTimer = setTimeout(() => {
      forceCleanup();
      resetLenisAndStart(lenisRef);
    }, FAILSAFE_MS);

    // ── startCurtain: 커튼을 아래→위로 올린 뒤 main reveal ──────
    let curtainStarted = false;
    const startCurtain = () => {
      if (curtainStarted) return;   // 중복 호출 방지
      curtainStarted = true;

      // 커튼: clip-path 아래→위
      clone.getBoundingClientRect();          // reflow
      clone.style.transition = `clip-path ${CURTAIN_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`;
      clone.style.clipPath   = 'inset(0 0 100% 0)';

      // 커튼 50% → main 슬라이드 업 + 페이드 인
      setTimeout(() => {
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

      // 커튼 완료 → 정리
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
        resetLenisAndStart(lenisRef);
      }, CURTAIN_MS + 120);
    };

    // ── 이미지 로드 → wave (+ 타임아웃) → curtain ────────────────
    if (imgSrc) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      // wave 타임아웃: WAVE_TIMEOUT_MS 안에 끝나지 않으면 강제 curtain
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

  // ── pathname 변경 시 work-list 잔재 정리 ─────────────────────────
  useEffect(() => {
    document.querySelector('.work-list')?.classList.remove('is-exiting');
    document.querySelectorAll('[data-active]').forEach(
      (el) => el.removeAttribute('data-active'),
    );
  }, [pathname]);

  // ── EXIT: 내부 링크 클릭 인터셉트 ─────────────────────────────────
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

        // Lenis 정지
        lenisRef.current?.stop();

        // ① fadeout
        document.documentElement.classList.add('is-thumb-exiting');

        // ② clone 생성 — data-pt-src 에 이미지 경로 저장
        const rect   = imgEl.getBoundingClientRect();
        const docTop = rect.top + window.scrollY;

        const clone    = document.createElement('div');
        const canvas   = document.createElement('canvas');
        const fallback = document.createElement('img');

        // fallback img: 브라우저 캐시에서 즉시 표시 (canvas 로드 전 공백 방지)
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

        clone.appendChild(fallback); // 아래: 즉시 보이는 이미지
        clone.appendChild(canvas);   // 위: wave 용 캔버스 (로드 전 투명)
        document.body.appendChild(clone);

        // ③ 이미지를 canvas 에 그리기 (wave ENTER 에서 사용)
        initCanvas(canvas, src, () => {});

        // ④ EXIT failsafe — scroll + navigate 가 끝나지 않으면 강제 navigate
        const exitFailsafe = setTimeout(() => {
          safePush(href);
          // isNavigating 은 ENTER 에서 리셋
        }, EXIT_FAILSAFE_MS);

        // ⑤ 스크롤 애니메이션
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
