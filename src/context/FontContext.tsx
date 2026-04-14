'use client';

import { createContext, useContext } from 'react';

/**
 * FontContext
 * ─────────────────────────────────────────────
 * Context that shares font loading state across the entire app.
 * Provided by FontLoader; consumed by Hero and other animation components.
 */
const FontContext = createContext(false);

export const FontProvider = FontContext.Provider;

export function useFontsLoaded() {
  return useContext(FontContext);
}
