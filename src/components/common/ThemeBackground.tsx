'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './ThemeBackground.scss';

export default function ThemeBackground() {
  const pathname = usePathname();

  useEffect(() => {
    const darkBg  = document.getElementById('theme-bg-dark')!;
    const lightBg = document.getElementById('theme-bg-light')!;

    const setTheme = (theme: string) => {
      document.body.dataset.theme = theme;

      // iOS Safari 상태바 / 주소바 색상 동기화
      let metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!metaThemeColor) {
        // 없으면 직접 생성
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.content = theme === 'dark' ? '#000000' : '#ffffff';

      if (theme === 'dark') {
        darkBg.classList.add('is-visible');
        lightBg.classList.remove('is-visible');
      } else {
        lightBg.classList.add('is-visible');
        darkBg.classList.remove('is-visible');
      }
    };

    // 스타일 가이드 페이지에서는 IntersectionObserver 비활성화
    // — cm-root가 자체 테마를 관리하므로 ThemeBackground 스크롤 이펙트 불필요
    if (pathname.startsWith('/style-guide')) {
      setTheme('light');
      return;
    }

    // /work 리스트 페이지만 라이트 테마 고정
    // 싱글 페이지(/work/[slug])는 홈페이지처럼 섹션별 data-theme으로 전환
    if (pathname === '/work') {
      setTheme('light');
      return;
    }

    // 페이지 진입 시 첫 번째 섹션의 data-theme으로 초기화
    // (다른 페이지에서 다크테마로 끝났을 때 잔류하는 문제 방지)
    const firstSection = document.querySelector<HTMLElement>('[data-theme]');
    setTheme(firstSection?.dataset.theme ?? 'light');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const theme = (entry.target as HTMLElement).dataset.theme ?? 'dark';
            setTheme(theme);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '-50% 0px -50% 0px', // 뷰포트 중앙을 가로지를 때 감지
      }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    sections.forEach(s => observer.observe(s));

    // pathname이 바뀔 때마다 이전 observer를 끊고 새 섹션들을 다시 감지
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div id="theme-bg-dark"  className="theme-bg theme-bg--dark" aria-hidden="true" />
      <div id="theme-bg-light" className="theme-bg theme-bg--light is-visible"            aria-hidden="true" />
    </>
  );
}
