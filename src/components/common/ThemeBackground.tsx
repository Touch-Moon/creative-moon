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
      if (theme === 'dark') {
        darkBg.classList.add('is-visible');
        lightBg.classList.remove('is-visible');
      } else {
        lightBg.classList.add('is-visible');
        darkBg.classList.remove('is-visible');
      }
    };

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
