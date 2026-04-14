'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import LenisContext from './LenisContext'

/**
 * SmoothScroll
 * ─────────────────────────────────────────────
 * Lenis-based smooth scroll provider.
 * - Supports trackpad, touch, and keyboard scroll
 * - Handles browser resize via ResizeObserver
 * - Fully destroys instance on cleanup to prevent memory leaks
 * - Shares instance with child components via LenisContext
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,           // inertia duration (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      touchMultiplier: 2,      // touch sensitivity
      infinite: false,         // disable infinite scroll
    })

    lenisRef.current = lenis

    // rAF loop: Lenis handles scroll interpolation every frame
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  )
}
