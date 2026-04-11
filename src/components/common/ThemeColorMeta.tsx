'use client';
// =============================================
// ThemeColorMeta
// body[data-theme] 변화를 감지해서
// <meta id="theme-color-meta" name="theme-color"> 를 실시간 업데이트
// → iOS Safari 상단 상태바 / 하단 주소바 색상 일치
//
// ※ 주의: layout.tsx <head>에 단일 태그를 직접 선언하고
//         이 컴포넌트가 content만 교체하는 방식으로 동작
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

    // 초기값 즉시 적용
    applyColor();

    // body[data-theme] 변경 감지 → 실시간 업데이트
    const observer = new MutationObserver(applyColor);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
