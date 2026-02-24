'use client';

import { createContext, useContext } from 'react';

/**
 * FontContext
 * ─────────────────────────────────────────────
 * 폰트 로딩 상태를 앱 전체에서 공유하는 Context.
 * FontLoader에서 provide, Hero 등 애니메이션 컴포넌트에서 consume.
 */
const FontContext = createContext(false);

export const FontProvider = FontContext.Provider;

export function useFontsLoaded() {
  return useContext(FontContext);
}
