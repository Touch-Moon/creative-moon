'use client';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Footer.scss';

export default function Footer() {
  const pathname = usePathname();
  // light footer only on /work list page — single pages stay dark
  const theme = pathname === '/work' ? 'light' : 'dark';
  const isContact = pathname === '/contact';
  const showCTA = !isContact;
  const showLinks = !isContact;

  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // mouse lerp tracking (same pattern as WorksSlider)
  useEffect(() => {
    let tx = 0, ty = 0, cx = 0, cy = 0, init = false, raf: number;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!init) { cx = tx; cy = ty; init = true; }
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      cx = lerp(cx, tx, 0.1); cy = lerp(cy, ty, 0.1);
      if (cursorRef.current)
        // same as WorksSlider — top-left origin, circle displayed bottom-right of cursor
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const handleCTAEnter = () => cursorRef.current?.classList.add('is-visible');
  const handleCTALeave = () => cursorRef.current?.classList.remove('is-visible');

  return (
    <footer className={`footer${isContact ? ' footer--contact' : ''}`} data-theme={theme}>
      {/* ── CTA area ──────────────────────────────── */}
      {showCTA && (
        <div
          className="footer__cta-area"
          onMouseEnter={handleCTAEnter}
          onMouseLeave={handleCTALeave}
        >
          <div className="wrapper">
            <Link href="/contact" className="footer__cta">
              <span className="footer__cta-text">Let&apos;s talk.</span>
              <span className="footer__cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M65.4893 58.418V20.4893H75.4893V75.4893H20.4893V65.4893H58.418L0 7.07129L7.07129 0L65.4893 58.418Z" fill="currentColor"/>
                </svg>
              </span>
            </Link>
            <div className="footer__cta-ball" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* ── Links area ───────────────────────────── */}
      <div className="footer__links">
        <div className="wrapper">
          {showLinks && (
            <div className="footer__links-inner">
              <div className="footer__social">
                <a href="https://www.behance.net/crtvmoon" target="_blank" rel="noopener noreferrer">Behance</a>
                <a href="https://www.instagram.com/creative_____moon/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.linkedin.com/in/creative-moon/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/Touch-Moon" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
              <div className="footer__legal">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/cookies-policy">Cookies Policy</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Copyright ────────────────────────────── */}
      <div className="footer__meta">
        <div className="wrapper">
          <span className="footer__copy">©2026 Creative Moon. All rights reserved.</span>
        </div>
      </div>

      {/* ── Mix-blend cursor circle (body portal) ──── */}
      {mounted && createPortal(
        <div ref={cursorRef} className="footer__cursor" aria-hidden="true">
          <div className="footer__cursor-bg" />
        </div>,
        document.body
      )}
    </footer>
  );
}
