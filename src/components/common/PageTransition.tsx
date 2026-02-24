'use client'

import {usePathname} from 'next/navigation'
import {motion, AnimatePresence} from 'framer-motion'
import {type ReactNode} from 'react'

/**
 * PageTransition
 * ─────────────────────────────────────────────
 * plastic.design 스타일 페이지 전환 애니메이션
 *
 * 패턴: fade-out(380ms) → wait(120ms) → fade-in(380ms)
 * 총 약 880ms, ease-in-out 커브
 */

const DURATION = 0.38 // 380ms — plastic.design과 동일
const EASE = [0.45, 0, 0.55, 1] // cubic-bezier ease-in-out

const variants = {
  hidden: {opacity: 0},
  enter: {
    opacity: 1,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATION,
      ease: EASE,
    },
  },
}

export default function PageTransition({children}: {children: ReactNode}) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="page-transition-container"
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
