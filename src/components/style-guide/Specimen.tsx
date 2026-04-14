'use client';
import { useRef, useState, useEffect } from 'react';

const REF_VP = 1440; // $_fp in _fonts.scss

type Props = {
  className: string;
  vpWidth: number;
  children: React.ReactNode;
};

export default function Specimen({ className, vpWidth, children }: Props) {
  const textRef = useRef<HTMLDivElement>(null);
  const [spec, setSpec] = useState(className);

  useEffect(() => {
    if (!textRef.current || vpWidth <= 0) return;
    const cs = getComputedStyle(textRef.current);

    // font-size: current px at the active viewport (reflects fixed values at breakpoint entry)
    const pxSize = parseFloat(cs.fontSize);
    const px = Math.round(pxSize);

    // letter-spacing: convert px → em
    const lsPx = parseFloat(cs.letterSpacing);
    const lsEm = isNaN(lsPx) ? '0em' : (lsPx / pxSize).toFixed(2) + 'em';

    // line-height: convert px → %
    const lhPx = parseFloat(cs.lineHeight);
    const lhStr = isNaN(lhPx) ? '' : Math.round((lhPx / pxSize) * 100) + '%';

    // Determine reference viewport for the active breakpoint (375 mobile / 768 tablet / 1440 desktop)
    const isDesktopXL = vpWidth > 1920;
    const refVp = vpWidth <= 575 ? 375 : vpWidth <= 1023 ? 768 : REF_VP;
    // Back-calculate the currently rendered px relative to the reference viewport
    const refPx = Math.round(pxSize * refVp / vpWidth);
    const calcStr = isDesktopXL
      ? `${px}px · fixed (1920px cap)`
      : `calc(${refPx} / ${refVp} * 100vw)`;
    setSpec(`${className} / ${px}px · ${calcStr} / ls ${lsEm} / ${lhStr}`);
  }, [className, vpWidth]);

  return (
    <div className="cm-specimen">
      <div ref={textRef} className={`cm-specimen__text ${className}`}>
        {children}
      </div>
      <div className="cm-specimen__spec">{spec}</div>
    </div>
  );
}
