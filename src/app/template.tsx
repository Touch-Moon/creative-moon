'use client'

import PageTransition from '@/components/common/PageTransition'
import '@/components/common/PageTransition.scss'

/**
 * template.tsx
 * ─────────────────────────────────────────────
 * Next.js App Router's template creates a new instance on every route change
 * → triggers AnimatePresence key update
 *
 * Since layout.tsx does not re-render,
 * page transition animations must be handled in template
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
