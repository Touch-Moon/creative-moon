'use client'

import { useEffect, useState } from 'react'
import { FontProvider } from '@/context/FontContext'

/**
 * FontLoader
 * ─────────────────────────────────────────────
 * Hides page content until all fonts are fully loaded,
 * then reveals it smoothly with a fade-in.
 * Shares fontsLoaded state with child components via FontProvider.
 */
export default function FontLoader({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    // document.fonts.ready is a Promise that resolves when all fonts have finished loading
    document.fonts.ready.then(() => {
      setFontsLoaded(true)
    })

    // Fallback: show the page after 3 seconds regardless of font load status
    const timeout = setTimeout(() => {
      setFontsLoaded(true)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <FontProvider value={fontsLoaded}>
      <style>{`
        .font-loader-wrapper {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .font-loader-wrapper.loaded {
          opacity: 1;
        }
      `}</style>
      <div className={`font-loader-wrapper ${fontsLoaded ? 'loaded' : ''}`}>
        {children}
      </div>
    </FontProvider>
  )
}
