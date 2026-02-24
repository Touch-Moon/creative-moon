'use client'

import { useEffect, useState } from 'react'
import { FontProvider } from '@/context/FontContext'

/**
 * FontLoader
 * ─────────────────────────────────────────────
 * 폰트가 완전히 로드될 때까지 페이지 콘텐츠를 숨기고,
 * 로드 완료 후 fade-in으로 부드럽게 보여줌.
 * FontProvider로 fontsLoaded 상태를 하위 컴포넌트에 공유.
 */
export default function FontLoader({ children }: { children: React.ReactNode }) {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    // document.fonts.ready는 모든 폰트 로딩이 완료되면 resolve되는 Promise
    document.fonts.ready.then(() => {
      setFontsLoaded(true)
    })

    // 안전장치: 3초 후에는 폰트 로딩 여부와 관계없이 페이지를 보여줌
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
