'use client';

/**
 * PageTransition — scroll + fixed-clone 트랜지션
 * ──────────────────────────────────────────────────────────────────
 * EXIT (work list → single):
 *   1. 클릭 즉시   → 다른 아이템 + 카테고리 + 헤더 fadeout
 *   2. scrollTo    → 클릭한 카드 이미지를 브라우저 최상단으로
 *   3. 최상단 도달 → work-item__image 위치에 position:fixed 클론 생성
 *                    + 원본 이미지 숨김 (클론이 덮음)
 *                    + 클론에 clip-path 커튼 시작 (아래→위, CURTAIN_MS)
 *   4. 커튼 시작 후 NAV_DELAY ms → router.push()
 *                    (커튼이 화면에서 재생 중인 상태에서 싱글 페이지 로드)
 *   5. 싱글 페이지가 클론 뒤에서 렌더링됨 (__top: 100svh→75svh 동시 진행)
 *   6. CURTAIN_MS 후 클론 제거 → __hero 등장, 타이틀 reveal
 *
 * ⚠️  클론은 document.body 에 직접 추가되어 React 언마운트에 영향 받지 않음
 *     ENTER useEffect 에서 클론을 제거하면 커튼이 끊기므로 절대 하지 말 것
 *     클론 제거는 setTimeout(CURTAIN_MS) 로만 처리
 *
 * EXIT (그 외 페이지):
 *   - html.is-page-exiting → content fade-out → 360ms 후 navigate
 *
 * ENTER:
 *   - pathname 변경 → CSS 클래스 정리 (클론은 건드리지 않음)
 */

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import './PageTransition.scss';

const SCROLL_MS  = 420;   // 스크롤 애니메이션 (ms)
const CURTAIN_MS = 1000;  // 커튼 + __top 높이 애니메이션 동일하게 맞춤 (ms)
const NAV_DELAY  = 50;    // 커튼 시작 후 router.push() 호출까지 대기 (ms)
                           // 커튼이 화면에서 재생 중인 상태로 새 페이지가 뒤에서 로드됨

/** quadratic ease-in-out (스크롤용) */
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname      = usePathname();
  const router        = useRouter();
  const navigatingRef = useRef(false);

  // ── ENTER: exit 잔재 정리 ────────────────────────────────────────
  // ⚠️  클론(data-page-fixed-clone)은 여기서 제거하지 않음!
  //     클론은 applyCurtain 의 setTimeout(CURTAIN_MS) 이 책임짐.
  //     여기서 제거하면 새 페이지 마운트 시점에 커튼 애니메이션이 즉시 끊김.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.documentElement.classList.remove('is-page-exiting', 'is-work-exiting');
      document.querySelector('.work-list')?.classList.remove('is-exiting');
      document.querySelectorAll('[data-active]').forEach(
        (el) => el.removeAttribute('data-active')
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // ── EXIT: 내부 링크 클릭 인터셉트 ───────────────────────────────
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
      if (navigatingRef.current) return;

      e.preventDefault();
      navigatingRef.current = true;

      const workItem = (e.target as Element).closest('.work-item') as HTMLElement | null;
      const workList = document.querySelector<HTMLElement>('.work-list');

      if (workItem && workList) {
        // ── 워크 카드 클릭 ─────────────────────────────────────────
        const imgEl = workItem.querySelector<HTMLElement>('.work-item__image');

        // 1. 즉시: 다른 아이템 + 카테고리 + 헤더 fadeout
        workItem.setAttribute('data-active', '1');
        workList.classList.add('is-exiting');
        document.documentElement.classList.add('is-work-exiting');

        if (imgEl) {
          const startY    = window.scrollY;
          const rect0     = imgEl.getBoundingClientRect();
          const targetY   = startY + rect0.top;
          const startTime = performance.now();

          const applyCurtain = () => {
            // 스크롤 완료 후 실제 위치 재계산
            const rect = imgEl.getBoundingClientRect();

            // ── 3. fixed 클론 생성 ────────────────────────────────
            // 기존 클론 중복 방지 (안전망)
            document.querySelector('[data-page-fixed-clone]')?.remove();

            const clone = document.createElement('div');
            clone.setAttribute('data-page-fixed-clone', '1');
            clone.style.cssText = [
              'position:fixed',
              `top:${rect.top}px`,
              `left:${rect.left}px`,
              `width:${rect.width}px`,
              `height:${rect.height}px`,
              'z-index:1000',              // 헤더 등 모든 요소 위
              'overflow:hidden',
              'pointer-events:none',
              'will-change:clip-path',
              'background:#1a1a1a',
              'clip-path:inset(0 0 0% 0)', // ← 초기 상태 명시 (완전 노출)
                                            //   없으면 none→inset 이 즉시 점프함
            ].join(';');

            const heroSrc = workItem.getAttribute('data-hero-src');
            if (heroSrc) {
              const img = document.createElement('img');
              img.src = heroSrc;
              img.style.cssText =
                'width:100%;height:100%;object-fit:cover;display:block;';
              clone.appendChild(img);
            }

            document.body.appendChild(clone);

            // 원본 이미지 숨기기 (클론이 동일 위치를 덮음)
            imgEl.style.opacity = '0';

            // ── 4. 클론에 커튼 애니메이션 시작 ───────────────────
            // getBoundingClientRect() = force reflow
            // → initial clip-path(0 0 0% 0) 가 브라우저에 commit 된 후
            //   transition + final 값 적용 → 진짜 애니메이션으로 실행됨
            clone.getBoundingClientRect(); // force reflow
            clone.style.transition =
              `clip-path ${CURTAIN_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`;
            clone.style.clipPath = 'inset(0 0 100% 0)'; // 아래→위 커튼 시작

            // ── 4-2. 커튼 재생 중 navigate (NAV_DELAY 후) ────────
            // 커튼이 화면에서 보이는 상태로 싱글 페이지 백그라운드 로드
            // 싱글 페이지의 __top (100svh→75svh) 이 클론 뒤에서 동시 진행
            setTimeout(() => {
              router.push(href);
              navigatingRef.current = false;
            }, NAV_DELAY);

            // ── 6. 커튼 완료 후 클론 제거 ─────────────────────────
            // ENTER useEffect 에서는 클론을 건드리지 않음 — 여기서만 처리
            setTimeout(() => {
              clone.remove();
            }, CURTAIN_MS + 150);
          };

          if (rect0.top <= 2) {
            applyCurtain();
          } else {
            // 2. 스크롤 애니메이션
            const scroll = (now: number) => {
              const p = Math.min((now - startTime) / SCROLL_MS, 1);
              window.scrollTo(0, startY + (targetY - startY) * easeInOut(p));
              if (p < 1) requestAnimationFrame(scroll);
              else        applyCurtain();
            };
            requestAnimationFrame(scroll);
          }

        } else {
          // imgEl 없는 예외 케이스
          document.documentElement.classList.add('is-page-exiting');
          setTimeout(() => {
            router.push(href);
            navigatingRef.current = false;
          }, 360);
        }

      } else {
        // ── 일반 페이지 전환 ──────────────────────────────────────
        document.documentElement.classList.add('is-page-exiting');
        setTimeout(() => {
          router.push(href);
          navigatingRef.current = false;
        }, 360);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [router, pathname]);

  return <>{children}</>;
}
