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

      // Sync iOS Safari status bar / address bar color
      let metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!metaThemeColor) {
        // If not found, create one
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

    // Disable IntersectionObserver on the style guide page
    // — cm-root manages its own theme, so ThemeBackground scroll effect is not needed
    if (pathname.startsWith('/style-guide')) {
      setTheme('light');
      return;
    }

    // Lock light theme only on the /work list page
    // Single pages (/work/[slug]) switch per-section via data-theme, same as the homepage
    if (pathname === '/work') {
      setTheme('light');
      return;
    }

    // Initialize to the first section's data-theme on page entry
    // (prevents leftover dark theme when navigating from another page)
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
        rootMargin: '-50% 0px -50% 0px', // Trigger when crossing the viewport center
      }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    sections.forEach(s => observer.observe(s));

    // Disconnect the previous observer and re-observe new sections whenever pathname changes
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div id="theme-bg-dark"  className="theme-bg theme-bg--dark" aria-hidden="true" />
      <div id="theme-bg-light" className="theme-bg theme-bg--light is-visible"            aria-hidden="true" />
    </>
  );
}
