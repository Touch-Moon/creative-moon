'use client'

import PageTransition from '@/components/common/PageTransition'
import '@/components/common/PageTransition.scss'

/**
 * template.tsx
 * ─────────────────────────────────────────────
 * Next.js App Router의 template은 라우트가 변경될 때마다
 * 새 인스턴스를 생성 → AnimatePresence의 key 변경 트리거
 *
 * layout.tsx는 리렌더되지 않으므로,
 * 페이지 전환 애니메이션은 반드시 template에서 처리해야 함
 */
export default function Template({children}: {children: React.ReactNode}) {
  return <PageTransition>{children}</PageTransition>
}
