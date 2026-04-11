'use client';
/**
 * MotionProvider — LazyMotion 래퍼
 * framer-motion의 domAnimation 기능 셋만 로드해 번들 크기 최적화.
 * motion.* 대신 m.* 컴포넌트를 사용하는 모든 컴포넌트가 이 컨텍스트 필요.
 */
import { LazyMotion, domAnimation } from 'framer-motion';

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
