'use client';
/**
 * MotionProvider — LazyMotion wrapper
 * Loads only the domAnimation feature set of framer-motion to reduce bundle size.
 * All components using m.* instead of motion.* require this context.
 */
import { LazyMotion, domAnimation } from 'framer-motion';

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
