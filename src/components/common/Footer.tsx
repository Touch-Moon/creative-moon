import Link from 'next/link';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer" data-theme="dark">
      <div className="wrap">
        {/* 대형 CTA */}
        <Link href="/contact" className="footer__cta">
          Let's work together.↘
        </Link>

        {/* 하단 링크 */}
        <div className="footer__bottom">
          <div className="footer__social">
            <a href="https://behance.net/creativemoon" target="_blank" rel="noopener noreferrer">Behance</a>
            <a href="https://instagram.com/creative_moon" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com/in/creativemoon" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/creativemoon" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <div className="footer__legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/cookies-policy">Cookies Policy</Link>
            <span className="footer__copy">©2026 Creative Moon. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
