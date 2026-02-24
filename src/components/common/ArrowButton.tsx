'use client';
import { useRef } from 'react';
import './ArrowButton.scss';

const EASE = 'cubic-bezier(0.19, 1, 0.22, 1)';
const DUR  = '0.45s';

const ArrowLeft = () => (
  <svg width="38" height="18" viewBox="0 0 38 18" fill="none" aria-hidden="true">
    <path d="M36 9H2M2 9L8 3M2 9L8 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="38" height="18" viewBox="0 0 38 18" fill="none" aria-hidden="true">
    <path d="M2 9H36M36 9L30 3M36 9L30 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface ArrowButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export default function ArrowButton({
  direction,
  onClick,
  disabled = false,
  ariaLabel,
  className = '',
}: ArrowButtonProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const label = ariaLabel ?? (direction === 'prev' ? 'Previous' : 'Next');

  const handleMouseEnter = () => {
    if (disabled) return;
    const fill = fillRef.current;
    if (!fill) return;
    // 아래서 위로 진입
    fill.style.transition = `transform ${DUR} ${EASE}`;
    fill.style.transform = 'translateY(0)';
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    const fill = fillRef.current;
    if (!fill) return;
    // 위로 빠져나감
    fill.style.transition = `transform ${DUR} ${EASE}`;
    fill.style.transform = 'translateY(-100%)';
    // 퇴장 완료 후 원위치 (transition 없이)
    fill.addEventListener('transitionend', () => {
      fill.style.transition = 'none';
      fill.style.transform = 'translateY(100%)';
    }, { once: true });
  };

  return (
    <button
      className={`arrow-btn ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={fillRef} className="arrow-btn__fill" aria-hidden="true" />
      {direction === 'prev' ? <ArrowLeft /> : <ArrowRight />}
    </button>
  );
}
