'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll
 * ─────────────────────────────────────────────
 * Lenis 기반 smooth scroll provider.
 * - 트랙패드, 터치, 키보드 스크롤 모두 지원
 * - ResizeObserver로 브라우저 리사이즈 대응
 * - cleanup 시 인스턴스를 완전히 파괴하여 메모리 누수 방지
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,           // 관성 지속 시간 (초)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      touchMultiplier: 2,      // 터치 감도
      infinite: false,         // 무한 스크롤 비활성화
    })

    lenisRef.current = lenis

    // rAF 루프: Lenis가 매 프레임 스크롤 보간을 처리
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

  return <>{children}</>
}
