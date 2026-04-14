'use client';
import { useRef } from 'react';
import './ArrowButton.scss';

const EASE = 'cubic-bezier(0.19, 1, 0.22, 1)';
const DUR  = '0.45s';

// plastic.design standard: line + chevron, same SVG flipped with rotate(180deg) for prev
const Arrow = () => (
  <svg width="38" height="18" viewBox="0 0 38 18" fill="none" aria-hidden="true">
    <line x1="0.75" y1="8.75" x2="36.5" y2="8.75" stroke="currentColor" strokeWidth="1.5" />
    <path d="M28.5 1L36.5 9L28.5 17" stroke="currentColor" strokeWidth="1.5" />
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
    // enter from bottom to top
    fill.style.transition = `transform ${DUR} ${EASE}`;
    fill.style.transform = 'translateY(0)';
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    const fill = fillRef.current;
    if (!fill) return;
    // exit upward
    fill.style.transition = `transform ${DUR} ${EASE}`;
    fill.style.transform = 'translateY(-100%)';
    // reset to original position after exit completes (without transition)
    fill.addEventListener('transitionend', () => {
      fill.style.transition = 'none';
      fill.style.transform = 'translateY(100%)';
    }, { once: true });
  };

  return (
    <button
      className={`arrow-btn arrow-btn--${direction} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={fillRef} className="arrow-btn__fill" aria-hidden="true" />
      <Arrow />
    </button>
  );
}
