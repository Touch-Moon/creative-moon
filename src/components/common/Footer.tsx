import Link from 'next/link';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer" data-theme="dark">
      {/* ── CTA 영역 ─────────────────────────────── */}
      <div className="footer__cta-area">
        <div className="wrapper">
          <Link href="/contact" className="footer__cta">
            <span className="footer__cta-text">Let&apos;s talk.</span>
            <span className="footer__cta-arrow">↘</span>
          </Link>
          <div className="footer__cta-ball" aria-hidden="true" />
        </div>
      </div>

      {/* ── 링크 영역 ────────────────────────────── */}
      <div className="footer__links">
        <div className="wrapper">
          <div className="footer__links-inner">
            <div className="footer__social">
              <a href="https://behance.net/creativemoon" target="_blank" rel="noopener noreferrer">Behance</a>
              <a href="https://instagram.com/creative_moon" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com/in/creativemoon" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/creativemoon" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <div className="footer__legal">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/cookies-policy">Cookies Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 카피라이트 ───────────────────────────── */}
      <div className="footer__meta">
        <div className="wrapper">
          <span className="footer__copy">©2026 Creative Moon. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
