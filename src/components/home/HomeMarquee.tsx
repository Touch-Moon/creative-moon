'use client';
import { useRef, useEffect, useState } from 'react';
import './HomeMarquee.scss';

// 4 rows — UX/UI design & development philosophy keywords
// Character-count ratios match plastic.design .clients to maintain grid:
// rows 1–2: 3 items  (6–7 chars each — space-between)
// row  3:   2 items  (11 + 7 chars  — space-between)
// row  4:   2 items  (12 + 7 chars  — flex-start + margin-left)
type ClientRow = string[];

const ROWS: ClientRow[] = [
  ['Design.', 'Build.', 'Refine.'],   // craft mindset  — 7·6·7
  ['Feel.', 'Flow.', 'Respond.'],     // UX/interaction — 5·5·8
  ['Typography.', 'Motion.'],         // craft areas    — 11·7
  ['Interaction.', 'Intent.'],        // last row       — 12·7
];

// Mobile: 2 items per row
const ROWS_MOBILE: ClientRow[] = [
  ['Design.', 'Build.'],
  ['Refine.', 'Feel.'],
  ['Flow.', 'Respond.'],
  ['Typography.', 'Motion.'],
  ['Interaction.', 'Intent.'],
];

export default function HomeMarquee() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver — same mechanism as plastic.design
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const renderRows = (rows: ClientRow[], modifier: string) => (
    <div className={`home-marquee__lists home-marquee__lists--${modifier}`}>
      {rows.map((row, rowIdx) => {
        const isLast = rowIdx === rows.length - 1;
        return (
          <div
            key={rowIdx}
            className={`home-marquee__list${isLast ? ' home-marquee__list--last' : ''}`}
          >
            {row.map((name, i) => (
              <div key={i}>{name}</div>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <section
      ref={ref}
      className={`home-marquee mix-blend${isVisible ? ' is-visible' : ''}`}
    >
      <div className="home-marquee__wrapper">
        <p className="home-marquee__label">Philosophy</p>
        {renderRows(ROWS, 'desktop')}
        {renderRows(ROWS_MOBILE, 'mobile')}
      </div>
    </section>
  );
}
