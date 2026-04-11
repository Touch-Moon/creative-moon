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

    // font-size: 현재 viewport 기준 px (breakpoint 진입 시 고정값 반영)
    const pxSize = parseFloat(cs.fontSize);
    const px = Math.round(pxSize);

    // letter-spacing: px → em
    const lsPx = parseFloat(cs.letterSpacing);
    const lsEm = isNaN(lsPx) ? '0em' : (lsPx / pxSize).toFixed(2) + 'em';

    // line-height: px → %
    const lhPx = parseFloat(cs.lineHeight);
    const lhStr = isNaN(lhPx) ? '' : Math.round((lhPx / pxSize) * 100) + '%';

    // 활성 breakpoint 기준 viewport 결정 (375 mobile / 768 tablet / 1440 desktop)
    const isDesktopXL = vpWidth > 1920;
    const refVp = vpWidth <= 575 ? 375 : vpWidth <= 1023 ? 768 : REF_VP;
    // 현재 렌더링된 px를 레퍼런스 뷰포트 기준으로 역산
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
