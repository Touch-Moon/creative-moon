'use client';
import { useEffect } from 'react';
import './ThemeBackground.scss';

export default function ThemeBackground() {
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

    // 초기 테마 설정
    setTheme('light'); // 초기: Hero = light

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

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div id="theme-bg-dark"  className="theme-bg theme-bg--dark" aria-hidden="true" />
      <div id="theme-bg-light" className="theme-bg theme-bg--light is-visible"            aria-hidden="true" />
    </>
  );
}
