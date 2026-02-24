'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './Header.scss';

/* ── Nav link data ─────────────────────────────── */
const NAV_LINKS = [
  { label: 'Work',      href: '/work' },
  { label: 'Services',  href: '/services' },
  { label: 'About',     href: '/about' },
  { label: 'Manifesto', href: '/manifesto' },
  { label: 'Contact',   href: '/contact' },
];

const SOCIAL_LINKS = [
  { label: 'Behance',   href: 'https://behance.net/creativemoon' },
  { label: 'Instagram', href: 'https://instagram.com/creative_moon' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/creativemoon' },
  { label: 'GitHub',    href: 'https://github.com/creativemoon' },
];

/* ── Component ─────────────────────────────────── */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  /* ── Scroll: show/hide fixed header ──────────── */
  useEffect(() => {
    const threshold = 5;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const headerH = headerRef.current?.offsetHeight ?? 60;

        // Past the header → fixed mode
        if (y > headerH) {
          setIsFixed(true);
          // Scroll up → show, scroll down → hide
          if (y < lastScrollY.current - threshold) {
            setIsVisible(true);
          } else if (y > lastScrollY.current + threshold) {
            setIsVisible(false);
          }
        } else {
          setIsFixed(false);
          setIsVisible(false);
        }

        lastScrollY.current = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Toggle menu ─────────────────────────────── */
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      // Lock/unlock body scroll
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  /* ── Keyboard: Escape closes menu ────────────── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        document.body.style.overflow = '';
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  /* ── Focus first link when menu opens ────────── */
  useEffect(() => {
    if (menuOpen) {
      // Slight delay to wait for animation start
      const id = setTimeout(() => firstLinkRef.current?.focus(), 300);
      return () => clearTimeout(id);
    }
  }, [menuOpen]);

  /* ── Route change: header fade sync ─────────── */
  useEffect(() => {
    // 페이지 전환 시 헤더가 같이 페이드 아웃/인
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 380); // plastic.design과 동일한 타이밍

    return () => clearTimeout(timer);
  }, [pathname]);

  /* ── Close menu on link click ────────────────── */
  const handleNavClick = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  /* ── Header classes ──────────────────────────── */
  const headerCls = [
    'header',
    'mix-blend',
    isFixed ? 'is-fixed' : '',
    isVisible ? 'is-visible' : '',
    isTransitioning ? 'is-page-transitioning' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* ════════ HEADER BAR ════════ */}
      <header ref={headerRef} className={headerCls}>
        <div className="header__content">
          {/* Logo */}
          <Link href="/" className="header__logo" aria-label="Creative Moon">
            <svg width="96" height="31" viewBox="0 0 96 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="26" fontFamily="Figtree, sans-serif" fontSize="28" fontWeight="300" fill="currentColor">
                CM
              </text>
            </svg>
          </Link>

          {/* Center copyright */}
          <div className="header__copyright">CREATIVE MOON &copy; 2026</div>

          {/* Right side */}
          <div className="header__right">
            {/* CTA button */}
            <Link href="/contact" className="header__talk button">
              <div />
              <span>Let&apos;s talk</span>
            </Link>

            {/* Hamburger / X toggle */}
            <button
              ref={toggleRef}
              className={`toggle${menuOpen ? ' is-opened' : ''}`}
              onClick={toggleMenu}
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={menuOpen}
              aria-controls="nav-overlay"
              type="button"
            >
              <div />
              <div />
            </button>
          </div>
        </div>
      </header>

      {/* ════════ MENU OVERLAY ════════ */}
      <div
        ref={navRef}
        id="nav-overlay"
        className={`nav${menuOpen ? ' is-opened' : ''}`}
        role="navigation"
        aria-hidden={!menuOpen}
      >
        {/* Close toggle inside overlay (fixed position) */}
        <div className="nav__toggle">
          <button
            className={`toggle${menuOpen ? ' is-opened' : ''}`}
            onClick={toggleMenu}
            aria-label="메뉴 닫기"
            type="button"
          >
            <div />
            <div />
          </button>
        </div>

        {/* Two-column container */}
        <div className="nav__container">
          {/* Left: Logo symbol + Social links */}
          <div className="nav__left">
            <div className="nav__logo" aria-hidden="true">
              <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="130" fontFamily="Figtree, sans-serif" fontSize="160" fontWeight="100" fill="currentColor">
                  C
                </text>
              </svg>
            </div>

            <div className="nav__secondary">
              <ul>
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Primary nav links */}
          <div className="nav__right">
            <div className="nav__primary">
              <ul>
                {NAV_LINKS.map((link, i) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={handleNavClick}
                      ref={i === 0 ? firstLinkRef : undefined}
                      className="use-nav-transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: Policy links + Email */}
        <div className="nav__policy">
          <ul>
            <li><Link href="/privacy-policy" onClick={handleNavClick}>Privacy Policy</Link></li>
            <li><Link href="/cookies-policy" onClick={handleNavClick}>Cookies Policy</Link></li>
          </ul>
        </div>

        <div className="nav__email">
          <a href="mailto:hello@creativemoon.com">hello@creativemoon.com</a>
        </div>
      </div>
    </>
  );
}
