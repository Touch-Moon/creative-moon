'use client';
// =============================================
// ThemeColorMeta
// Detects changes to body[data-theme] and updates
// <meta id="theme-color-meta" name="theme-color"> in real time
// → Keeps iOS Safari top status bar / bottom address bar color in sync
//
// Note: A single tag is declared directly in layout.tsx <head>,
//       and this component only swaps the content attribute
// =============================================

import { useEffect } from 'react';

const THEME_COLORS: Record<string, string> = {
  dark:  '#000000',
  light: '#ffffff',
};

export default function ThemeColorMeta() {
  useEffect(() => {
    const meta = document.getElementById('theme-color-meta') as HTMLMetaElement | null;
    if (!meta) return;

    const applyColor = () => {
      const theme = document.body.dataset.theme ?? 'light';
      meta.content = THEME_COLORS[theme] ?? '#ffffff';
    };

    // Apply initial value immediately
    applyColor();

    // Detect body[data-theme] changes → update in real time
    const observer = new MutationObserver(applyColor);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
