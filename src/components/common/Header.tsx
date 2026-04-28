'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { m, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useLenis } from './LenisContext';
import './Header.scss';

/* ── Nav link data ─────────────────────────────── */
const NAV_LINKS = [
  { label: 'Work',      href: '/work' },
  { label: 'About',     href: '/about' },
  { label: 'Manifesto', href: '/manifesto' },
  { label: 'Contact',   href: '/contact' },
];

const SOCIAL_LINKS = [
  { label: 'Behance',   href: 'https://www.behance.net/crtvmoon' },
  { label: 'Instagram', href: 'https://www.instagram.com/creative_____moon/' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/creative-moon/' },
  { label: 'GitHub',    href: 'https://github.com/Touch-Moon' },
];

/* ── Nav reveal variants (same as Hero animation) ── */
const EASE_OUT = [0.19, 1, 0.22, 1] as const;

const navClipVariants: Variants = {
  hidden: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  visible: (i: number) => ({
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      'polygon(0% 0%, 100% 0%, 100% 15%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ],
    transition: { duration: 1.5, ease: EASE_OUT, times: [0, 0.4, 1], delay: 0.1 + i * 0.18 },
  }),
};

const navSlideVariants: Variants = {
  hidden: {
    y: '110%',
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.0, ease: EASE_OUT, delay: 0.1 + i * 0.18 },
  }),
};

const navLeftItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE_OUT, delay: 0.3 + i * 0.15 },
  }),
};

/* ── Component ─────────────────────────────────── */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosingMenu, setIsClosingMenu] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lenisRef = useLenis();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const navToggleRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Scroll: show/hide fixed header ──────────── */
  const isPastHeroRef = useRef(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thresholdRef = useRef<number | null>(null);
  useEffect(() => {
    let ticking = false;

    // Per-page threshold calculation:
    // Use offsetTop of .work-list__grid if present (work page)
    // Otherwise fallback: innerHeight * 0.8 (home and other hero pages)
    const getThreshold = () => {
      const grid = document.querySelector<HTMLElement>('.work-list__grid');
      if (grid) return grid.offsetTop;
      return window.innerHeight * 0.8;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        // threshold is calculated on first scroll then cached (prevents layout shift)
        if (thresholdRef.current === null) {
          thresholdRef.current = getThreshold();
        }
        const heroThreshold = thresholdRef.current;

        if (y > heroThreshold) {
          // Below Hero: cancel leave timer if active on entry
          if (leaveTimerRef.current) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
            setIsLeaving(false);
          }
          if (!isPastHeroRef.current) {
            isPastHeroRef.current = true;
            setIsFixed(true);
            setIsVisible(true);
          }
        } else {
          // Above Hero: slide up then release fixed on first return
          if (isPastHeroRef.current) {
            isPastHeroRef.current = false;
            setIsLeaving(true);
            leaveTimerRef.current = setTimeout(() => {
              setIsFixed(false);
              setIsVisible(false);
              setIsLeaving(false);
              leaveTimerRef.current = null;
            }, 450); // nav-slide-up 0.4s + buffer
          }
        }

        lastScrollY.current = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  /* ── Scroll lock (useEffect) ─────────────────────
     Stop the scroll engine itself via Lenis.stop().
     Lenis accumulating delta internally was the root cause of scroll debt.
     Keyboard scroll is not handled by Lenis so block it separately.
  ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!menuOpen) return;

    const lenis = lenisRef.current;

    // Stop Lenis scroll engine → block delta accumulation at the source
    lenis?.stop();

    // Block keyboard scroll (area not handled by Lenis)
    const onKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      const tag = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(tag)) return;
      if (scrollKeys.includes(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      // Resume Lenis scroll engine
      lenis?.start();
    };
  }, [menuOpen, lenisRef]);

  /* ── Cleanup: close timer on unmount ─────────── */
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  /* ── Settled: activate hover branch after X animation completes ── */
  const settledTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (menuOpen) {
      // activate settled after transform 0.2s completes + hold
      settledTimerRef.current = setTimeout(() => setIsSettled(true), 625);
    } else {
      if (settledTimerRef.current) clearTimeout(settledTimerRef.current);
      setIsSettled(false);
    }
    return () => {
      if (settledTimerRef.current) clearTimeout(settledTimerRef.current);
    };
  }, [menuOpen]);

  /* ── Sync toggle positions (header toggle ↔ nav overlay toggle) ──── */
  const syncTogglePosition = useCallback(() => {
    if (toggleRef.current && navToggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      navToggleRef.current.style.top = `${rect.top}px`;
      // use clientWidth: right for position:fixed is relative to viewport excluding scrollbar
      navToggleRef.current.style.right = `${document.documentElement.clientWidth - rect.right}px`;
    }
  }, []);

  /* ── Toggle menu ─────────────────────────────── */
  const toggleMenu = useCallback(() => {
    if (menuOpen && !isClosingMenu) {
      // Closing menu: wait for hidden variants to complete
      // Max close timing: last nav item = 3 * 0.05 + 0.5 = 0.65s
      // Add small buffer: 700ms
      setIsClosingMenu(true);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      closeTimerRef.current = setTimeout(() => {
        setMenuOpen(false);
        setIsClosingMenu(false);
        closeTimerRef.current = null;
      }, 400);
    } else if (!menuOpen) {
      // Opening menu: toggle immediately and sync position
      syncTogglePosition();
      setMenuOpen(true);
    }
  }, [menuOpen, isClosingMenu, syncTogglePosition]);

  /* ── Keyboard: Escape closes menu ────────────── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (menuOpen || isClosingMenu)) {
        // Use toggleMenu logic to close with animation delay
        toggleMenu();
        // Focus will happen after animation, so defer it
        setTimeout(() => {
          toggleRef.current?.focus();
        }, 400);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, isClosingMenu, toggleMenu]);

  /* ── Sync toggle positions when menu opens/closes, on resize, or header position changes ── */
  useEffect(() => {
    if (menuOpen) {
      // Sync position immediately and on resize
      syncTogglePosition();
      const handleResize = () => syncTogglePosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [menuOpen, syncTogglePosition, isFixed]);

  /* ── Focus first link when menu opens ────────── */
  useEffect(() => {
    if (menuOpen) {
      // Slight delay to wait for animation start
      const id = setTimeout(() => firstLinkRef.current?.focus(), 300);
      return () => clearTimeout(id);
    }
  }, [menuOpen]);

  /* ── Route change: header fade sync ─────────── */
  const isFirstMount = useRef(true);
  // track whether a nav link was clicked — used to decide whether to close menu on pathname change
  const navClickedRef = useRef(false);
  // track previous pathname — determines whether to restore scroll on child → parent navigation
  const prevPathnameRef = useRef('');
  useEffect(() => {
    // Skip on first mount (page refresh) → prevents Nav flicker
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Reset threshold cache on page transition (recalculate for new page layout)
    thresholdRef.current = null;

    // When navigated via nav link click:
    // pathname change = moment new page render starts → overlay should close here
    // so "menu disappears after content loads" plays out naturally.
    // (closing immediately on click exposes a blank page and looks jarring)
    if (navClickedRef.current) {
      navClickedRef.current = false;
      setMenuOpen(false);
    }

    // Determine if navigating from a child page to a parent list page
    // e.g. /stories/some-slug → /stories
    //      /work/some-slug   → /work
    // In this case skip scroll-to-top — preserve the user's list scroll position
    const isReturningToParent = prevPath.startsWith(pathname + '/');

    // Header fades out/in together during page transition
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      if (!isReturningToParent) {
        window.scrollTo(0, 0);
      }
    }, 380);

    return () => clearTimeout(timer);
  }, [pathname]);

  /* ── Close menu on link click ────────────────── */
  // Close immediately if href matches current page; otherwise close when pathname changes.
  const handleNavClick = (href: string) => {
    if (href === pathname) {
      setMenuOpen(false);
    } else {
      navClickedRef.current = true;
    }
  };

  /* ── Header classes ──────────────────────────── */
  const headerCls = [
    'header',
    'mix-blend',
    isFixed ? 'is-fixed' : '',
    isVisible ? 'is-visible' : '',
    isLeaving ? 'is-leaving' : '',
    isTransitioning ? 'is-page-transitioning' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* ════════ HEADER BAR ════════ */}
      <header ref={headerRef} className={headerCls}>
        <div className="header__content">
          {/* Logo */}
          <Link href="/" className="header__logo" aria-label="Creative Moon">
            <svg viewBox="0 0 512 288" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M450.722 186.841C454.233 180.823 462.929 180.823 466.44 186.841L509.494 260.636C516.57 272.766 507.82 288 493.775 288H423.388C409.343 288 400.592 272.766 407.669 260.636L450.722 186.841Z" fill="currentColor"/>
              <path d="M343.793 5.52236C348.005 -1.7774 358.53 -1.77743 362.742 5.52236L447.663 152.692C435.097 137.448 410.353 138.818 399.976 156.801L334.782 269.785C328.282 281.049 316.264 287.989 303.257 287.989H199.759C191.335 287.989 186.071 278.857 190.285 271.554L343.793 5.52236Z" fill="currentColor"/>
              <path d="M154.992 5.47483C159.204 -1.82493 169.729 -1.82496 173.941 5.47483L258.862 152.644C246.296 137.4 221.552 138.77 211.175 156.754L145.981 269.737C139.481 281.002 127.463 287.942 114.456 287.942H10.958C2.5336 287.942 -2.73038 278.81 1.48379 271.506L154.992 5.47483Z" fill="currentColor"/>
              <path d="M258.862 0.0477592C278.711 0.0478042 294.802 16.1368 294.802 35.9836C294.802 55.8303 278.711 71.9194 258.862 71.9194C239.013 71.9194 222.922 55.8303 222.922 35.9836C222.922 16.1368 239.013 0.0477592 258.862 0.0477592Z" fill="currentColor"/>
            </svg>
          </Link>

          {/* Center copyright */}
          <div className="header__copyright">CREATIVE MOON &copy; 2026</div>

          {/* Right side */}
          <div className="header__right">
            {/* CTA button */}
            <Link href="/contact" className="header__talk button button--xs">
              <div />
              <span>Let&apos;s talk</span>
            </Link>

            {/* Hamburger / X toggle */}
            <button
              ref={toggleRef}
              className={`toggle${menuOpen ? ' is-opened' : ''}${isSettled ? ' is-settled' : ''}`}
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
        <div className="nav__toggle" ref={navToggleRef}>
          <button
            className={`toggle${menuOpen ? ' is-opened' : ''}${isSettled ? ' is-settled' : ''}`}
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
            <m.div
              className="nav__logo"
              aria-hidden="true"
              custom={0}
              variants={navLeftItemVariants}
              initial="hidden"
              animate={!isClosingMenu && menuOpen ? 'visible' : 'hidden'}
            >
              <svg viewBox="0 0 512 288" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M450.722 186.841C454.233 180.823 462.929 180.823 466.44 186.841L509.494 260.636C516.57 272.766 507.82 288 493.775 288H423.388C409.343 288 400.592 272.766 407.669 260.636L450.722 186.841Z" fill="currentColor"/>
                <path d="M343.793 5.52236C348.005 -1.7774 358.53 -1.77743 362.742 5.52236L447.663 152.692C435.097 137.448 410.353 138.818 399.976 156.801L334.782 269.785C328.282 281.049 316.264 287.989 303.257 287.989H199.759C191.335 287.989 186.071 278.857 190.285 271.554L343.793 5.52236Z" fill="currentColor"/>
                <path d="M154.992 5.47483C159.204 -1.82493 169.729 -1.82496 173.941 5.47483L258.862 152.644C246.296 137.4 221.552 138.77 211.175 156.754L145.981 269.737C139.481 281.002 127.463 287.942 114.456 287.942H10.958C2.5336 287.942 -2.73038 278.81 1.48379 271.506L154.992 5.47483Z" fill="currentColor"/>
                <path d="M258.862 0.0477592C278.711 0.0478042 294.802 16.1368 294.802 35.9836C294.802 55.8303 278.711 71.9194 258.862 71.9194C239.013 71.9194 222.922 55.8303 222.922 35.9836C222.922 16.1368 239.013 0.0477592 258.862 0.0477592Z" fill="currentColor"/>
              </svg>
            </m.div>

            <m.div
              className="nav__secondary"
              custom={1}
              variants={navLeftItemVariants}
              initial="hidden"
              animate={!isClosingMenu && menuOpen ? 'visible' : 'hidden'}
            >
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
            </m.div>
          </div>

          {/* Right: Primary nav links */}
          <div className="nav__right">
            <div className="nav__primary">
              <ul>
                {NAV_LINKS.map((link, i) => (
                  <li key={link.label}>
                    <m.span
                      key={`clip-${link.label}-${menuOpen}`}
                      className="nav__item-clip"
                      custom={i}
                      variants={navClipVariants}
                      initial="hidden"
                      animate={!isClosingMenu && menuOpen ? 'visible' : 'hidden'}
                    >
                      <m.span
                        key={`slide-${link.label}-${menuOpen}`}
                        custom={i}
                        variants={navSlideVariants}
                        initial="hidden"
                        animate={!isClosingMenu && menuOpen ? 'visible' : 'hidden'}
                      >
                        <Link
                          href={link.href}
                          onClick={() => handleNavClick(link.href)}
                          ref={i === 0 ? firstLinkRef : undefined}
                          className="use-nav-transition"
                        >
                          {link.label}
                        </Link>
                      </m.span>
                    </m.span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom: Policy links + Email */}
        <div className="nav__policy">
          <ul>
            <li><Link href="/privacy-policy" onClick={() => handleNavClick('/privacy-policy')}>Privacy Policy</Link></li>
            <li><Link href="/cookies-policy" onClick={() => handleNavClick('/cookies-policy')}>Cookies Policy</Link></li>
          </ul>
        </div>

        <div className="nav__email">
          <a href="mailto:touch@creative-moon.com">touch@creative-moon.com</a>
        </div>
      </div>
    </>
  );
}
