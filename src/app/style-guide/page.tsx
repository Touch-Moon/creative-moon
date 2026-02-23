'use client';

import { useEffect, useState } from 'react';
import './style-guide.css';

export default function StyleGuidePage() {
  type Theme = 'light' | 'dark';
  const [theme, setTheme] = useState<Theme>('light');
  const [vpWidth, setVpWidth] = useState(0);
  const [bps, setBps] = useState({ mobile: 575, tablet: 768, laptop: 1024, laptopL: 1280, desktop: 1440 });

  function getBreakpoint(w: number): { label: string; px: string } {
    if (w <= bps.mobile)  return { label: 'Mobile',    px: `${bps.mobile}px` };
    if (w <= bps.tablet)  return { label: 'Tablet',    px: `${bps.tablet}px` };
    if (w <= bps.laptop)  return { label: 'Laptop',    px: `${bps.laptop}px` };
    if (w <= bps.laptopL) return { label: 'Laptop L',  px: `${bps.laptopL}px` };
    if (w <= bps.desktop) return { label: 'Desktop',   px: `${bps.desktop}px` };
    return                       { label: 'Desktop XL', px: `${bps.desktop}px+` };
  }

  useEffect(() => {
    const saved = window.localStorage.getItem('sg-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.sg-root');
    if (!root) return;
    const cs = getComputedStyle(root);
    const n = (v: string) => Number(cs.getPropertyValue(v).trim()) || 0;
    setBps({
      mobile:  n('--sg-bp-mobile'),
      tablet:  n('--sg-bp-tablet'),
      laptop:  n('--sg-bp-laptop'),
      laptopL: n('--sg-bp-laptop-l'),
      desktop: n('--sg-bp-desktop'),
    });
  }, []);

  useEffect(() => {
    const update = () => setVpWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('sg-theme', theme);
  }, [theme]);

  useEffect(() => {
    type FormInput = HTMLInputElement | HTMLTextAreaElement;

    const inputs = Array.from(
      document.querySelectorAll<FormInput>('.form-group .form-input, .form-group .form-textarea')
    );

    const handlers: Array<{
      el: FormInput;
      onFocus: () => void;
      onBlur: () => void;
      onInput: () => void;
      onResize?: () => void;
    }> = [];

    inputs.forEach((el) => {
      const group = el.closest<HTMLElement>('.form-group');
      if (!group) return;

      // Initialise has-content for pre-filled inputs
      if (el.value?.trim()) group.classList.add('has-content');

      const onFocus = () => group.classList.add('is-focused');
      const onBlur  = () => {
        group.classList.remove('is-focused');
        group.classList.toggle('has-content', Boolean(el.value?.trim()));
      };
      const onInput = () => {
        group.classList.toggle('has-content', Boolean(el.value?.trim()));
      };

      el.addEventListener('focus', onFocus);
      el.addEventListener('blur',  onBlur);
      el.addEventListener('input', onInput);

      // Auto-grow textarea — expand height instead of scrolling
      let onResize: (() => void) | undefined;
      if (el.tagName.toLowerCase() === 'textarea') {
        const formControl = el.parentElement;
        onResize = () => {
          el.style.height = 'auto';
          const minH = formControl
            ? parseFloat(getComputedStyle(formControl).minHeight) || 0
            : 0;
          el.style.height = Math.max(el.scrollHeight, minH) + 'px';
        };
        el.addEventListener('input', onResize);
        onResize(); // set initial height
      }

      handlers.push({ el, onFocus, onBlur, onInput, onResize });
    });

    return () => {
      handlers.forEach(({ el, onFocus, onBlur, onInput, onResize }) => {
        el.removeEventListener('focus', onFocus);
        el.removeEventListener('blur',  onBlur);
        el.removeEventListener('input', onInput);
        if (onResize) el.removeEventListener('input', onResize);
      });
    };
  }, []);

  return (
    <div className="sg-root" data-theme={theme}>
      <button
        type="button"
        className="sg-theme-toggle"
        aria-pressed={theme === 'dark'}
        aria-label="Toggle theme"
        onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sg-theme-icon">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sg-theme-icon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* ==============================
          HEADER
          ============================== */}
      <header className="sg-header">
        <div className="sg-logo">M</div>
        <h1 className="sg-header__title">Style guide</h1>
        <div className="sg-header__body">
          <p className="sg-header__desc">
            This design system serves as the definitive source of truth for the digital experience.
            It defines the foundational elements—typography, spacing, and color—that ensure a cohesive
            and high-quality user interface. By adhering to these standardized principles, we maintain
            visual integrity and functional efficiency across all development stages, reflecting our
            commitment to professional and modern web design.
          </p>
          <a href="/style-guide" className="sg-header__link">styles.css</a>
        </div>
      </header>


      {/* ==============================
          01 — TYPE SCALE
          ============================== */}
      <section className="sg-section">
        <div className="sg-section__left">
          <div className="sg-section__meta">01 — Type Scale</div>
          <h2 className="sg-section__title">Typography</h2>
          <p className="sg-section__desc">
            Typography is built on a fluid vw-based scale ensuring maximum readability
            and a consistent hierarchy across all digital touch-points. From large body
            text to functional captions, each style is tuned with specific letter-spacing
            and line-heights to maintain a clean, modern aesthetic.
          </p>
        </div>
        <div className="sg-section__right">
          <div className="sg-badge">
            {vpWidth > 0 ? (({ label, px }) => `${label} · ${px}`)(getBreakpoint(vpWidth)) : ''}
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text body-text-1">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="sg-specimen__spec">
              body-text-1 · 2.20vw · 300 · 120%
            </div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text body-text-2">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="sg-specimen__spec">
              body-text-2 · 1.83vw · 300 · 140%
            </div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text body-text-3">
              The quick brown fox jumps over the lazy dog and keeps going to fill the line
            </div>
            <div className="sg-specimen__spec">
              body-text-3 · 1.47vw · 300 · 130% · ls 0.01em
            </div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text body-text-4">
              The quick brown fox jumps over the lazy dog and keeps going for a longer demonstration of this text size
            </div>
            <div className="sg-specimen__spec">
              body-text-4 · 1.19vw · 300 · 140% · ls 0.01em
            </div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text body-text-5">
              The quick brown fox jumps over the lazy dog and keeps going for a longer demonstration. This size is typically
              used for supporting text, captions, and supplementary information throughout the interface.
            </div>
            <div className="sg-specimen__spec">
              body-text-5 · 0.92vw · 400 · 150% · ls 0.01em
            </div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text body-text-caps">
              Inter Display · Body Text Caps · Uppercase tracking
            </div>
            <div className="sg-specimen__spec">
              body-text-caps · 0.82vw · 300 · 100% · ls 0.04em · uppercase
            </div>
          </div>
        </div>
      </section>


      {/* ==============================
          02 — HEADLINES
          ============================== */}
      <section className="sg-section">
        <div className="sg-section__left">
          <div className="sg-section__meta">02 — Headlines</div>
          <h2 className="sg-section__title">Display &amp; Title</h2>
          <p className="sg-section__desc">
            Seven fluid headline scales for display, title, and sub-title use.
            All weights are 400 and sizes are vw-based, scaling fluidly
            with the viewport. Letter-spacing tightens at larger sizes for
            optical balance.
          </p>
        </div>
        <div className="sg-section__right">

          <div className="sg-specimen">
            <div className="sg-specimen__text headline-1">Display</div>
            <div className="sg-specimen__spec">headline-1 · 9.71vw · 400 · 96% · ls −0.01em</div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text headline-2">The quick brown fox</div>
            <div className="sg-specimen__spec">headline-2 · 6.04vw · 400 · 98% · ls −0.01em</div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text headline-3">The quick brown fox jumps</div>
            <div className="sg-specimen__spec">headline-3 · 5.13vw · 400 · 98% · ls −0.01em</div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text headline-4">The quick brown fox jumps over the lazy dog</div>
            <div className="sg-specimen__spec">headline-4 · 2.93vw · 400 · 110% · ls −0.01em</div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text headline-4b">The quick brown fox jumps over the lazy dog</div>
            <div className="sg-specimen__spec">headline-4b · 2.29vw · 400 · 100% · ls −0.01em</div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text headline-5">The quick brown fox jumps over the lazy dog and keeps going</div>
            <div className="sg-specimen__spec">headline-5 · 1.83vw · 400 · 110%</div>
          </div>

          <div className="sg-specimen">
            <div className="sg-specimen__text headline-6">The quick brown fox jumps over the lazy dog and keeps going to fill</div>
            <div className="sg-specimen__spec">headline-6 · 1.47vw · 400 · 120% · ls 0.01em</div>
          </div>

        </div>
      </section>


      {/* ==============================
          03 — FONTS (Inter Display)
          ============================== */}
      <section className="sg-section">
        <div className="sg-section__left">
          <div className="sg-section__meta">03 — Fonts</div>
          <h2 className="sg-section__title">Inter Display</h2>
          <p className="sg-section__desc">
            Inter Display is the primary typeface — a variable font supporting weights
            100–900 with corresponding italic variants. Optimized for display sizes,
            it offers superior legibility at both large and small scales.
            The primary weights used across the system are Light (300) and Regular (400).
          </p>
        </div>
        <div className="sg-section__right">
          <div className="sg-weights">

            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 100 }}>Thin</div>
              <div className="sg-weight-item__spec">100 · Thin</div>
            </div>
            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 200 }}>ExtraLight</div>
              <div className="sg-weight-item__spec">200 · ExtraLight</div>
            </div>

            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 300 }}>Light</div>
              <div className="sg-weight-item__spec">300 · Light · Primary</div>
            </div>
            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 400 }}>Regular</div>
              <div className="sg-weight-item__spec">400 · Regular · Primary</div>
            </div>

            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 500 }}>Medium</div>
              <div className="sg-weight-item__spec">500 · Medium</div>
            </div>
            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 600 }}>SemiBold</div>
              <div className="sg-weight-item__spec">600 · SemiBold</div>
            </div>

            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 700 }}>Bold</div>
              <div className="sg-weight-item__spec">700 · Bold</div>
            </div>
            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 800 }}>ExtraBold</div>
              <div className="sg-weight-item__spec">800 · ExtraBold</div>
            </div>

            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 900 }}>Black</div>
              <div className="sg-weight-item__spec">900 · Black</div>
            </div>
            <div className="sg-weight-item">
              <div className="sg-weight-item__text" style={{ fontWeight: 900, fontStyle: 'italic' }}>Black Italic</div>
              <div className="sg-weight-item__spec">900 · Black · Italic</div>
            </div>

          </div>
        </div>
      </section>


      {/* ==============================
          03 — SPACING
          ============================== */}
      <section className="sg-section">
        <div className="sg-section__left">
          <div className="sg-section__meta">04 — Spacing</div>
          <h2 className="sg-section__title">Space scale</h2>
          <p className="sg-section__desc">
            Fluid spacing scale based on viewport width. Base unit is{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>1.1111vw ≈ 16px</code>
            {' '}at 1440px. All spacing tokens scale proportionally across breakpoints,
            maintaining consistent rhythm and visual balance.
          </p>
        </div>
        <div className="sg-section__right">
          <div className="sg-space-list">

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-1</span>
                <span className="sg-space-item__value">0.2778vw · 4px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-1)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-2</span>
                <span className="sg-space-item__value">0.5556vw · 8px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-2)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-3</span>
                <span className="sg-space-item__value">0.8333vw · 12px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-3)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-4</span>
                <span className="sg-space-item__value">1.1111vw · 16px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-4)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-6</span>
                <span className="sg-space-item__value">1.6667vw · 24px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-6)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-8</span>
                <span className="sg-space-item__value">2.2222vw · 32px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-8)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-10</span>
                <span className="sg-space-item__value">2.7778vw · 40px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-10)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-12</span>
                <span className="sg-space-item__value">3.3333vw · 48px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-12)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-16</span>
                <span className="sg-space-item__value">4.4444vw · 64px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-16)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-20</span>
                <span className="sg-space-item__value">5.5556vw · 80px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-20)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-24</span>
                <span className="sg-space-item__value">6.6667vw · 96px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-24)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-32</span>
                <span className="sg-space-item__value">8.8889vw · 128px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-32)' }}></div>
              </div>
            </div>

            <div className="sg-space-item">
              <div className="sg-space-item__meta">
                <span className="sg-space-item__name">--space-40</span>
                <span className="sg-space-item__value">11.1111vw · 160px</span>
              </div>
              <div className="sg-space-item__bar-wrap">
                <div className="sg-space-item__bar" style={{ width: 'var(--space-40)' }}></div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ==============================
          04 — BUTTONS
          ============================== */}
      <section className="sg-section">
        <div className="sg-section__left">
          <div className="sg-section__meta">05 — Buttons</div>
          <h2 className="sg-section__title">Components</h2>
          <p className="sg-section__desc">
            Pill-shaped buttons with an overflow fill animation on hover.
            Available in 4 sizes (S / M / L / XL) and 2 style variants.
            The fill animation uses{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>mix-blend-mode: difference</code>
            {' '}for automatic text contrast inversion.
          </p>
        </div>
        <div className="sg-section__right">

          <div className="sg-btn-group">
            <div className="sg-btn-label">Default — S / M / L / XL</div>
            <div className="sg-btn-dark">
              <div className="sg-btn-row">
                <button className="button button--s">
                  <div></div><span>Small</span>
                </button>
                <button className="button button--m">
                  <div></div><span>Medium</span>
                </button>
                <button className="button button--l">
                  <div></div><span>Large</span>
                </button>
                <button className="button button--xl">
                  <div></div><span>Extra Large</span>
                </button>
              </div>
            </div>
          </div>

          <div className="sg-btn-group">
            <div className="sg-btn-label">Secondary variant — S / M / L / XL</div>
            <div className="sg-btn-dark">
              <div className="sg-btn-row">
                <button className="button button--secondary button--s">
                  <div></div><span>Small</span>
                </button>
                <button className="button button--secondary button--m">
                  <div></div><span>Medium</span>
                </button>
                <button className="button button--secondary button--l">
                  <div></div><span>Large</span>
                </button>
                <button className="button button--secondary button--xl">
                  <div></div><span>Extra Large</span>
                </button>
              </div>
            </div>
          </div>

          <div className="sg-btn-group">
            <div className="sg-btn-label">Block modifier — Full width</div>
            <div className="sg-btn-dark">
              <button className="button button--block button--m">
                <div></div><span>Block Button · Full Width</span>
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* ==============================
          05 — FORMS
          ============================== */}
      <section className="sg-section">
        <div className="sg-section__left">
          <div className="sg-section__meta">06 — Forms</div>
          <h2 className="sg-section__title">Form Components</h2>
          <p className="sg-section__desc">
            Underline-only input system with a floating placeholder that animates
            upward on focus. States (<code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>.is-focused</code>,{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>.has-content</code>,{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>.is-error</code>)
            are applied via JavaScript to the parent{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>.form-group</code>.
            Error colour reuses the system red{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>#FB6262</code>.
          </p>
        </div>
        <div className="sg-section__right">

          {/* Input states 2×2 grid */}
          <div className="sg-form-states">

            {/* DEFAULT */}
            <div className="sg-form-state">
              <div className="sg-form-state__label">Default</div>
              <div className="form-group is-input">
                <div className="form-control">
                  <div className="form-placeholder">Full name</div>
                  <input className="form-input" type="text" />
                </div>
              </div>
            </div>

            {/* FOCUSED */}
            <div className="sg-form-state">
              <div className="sg-form-state__label">Focused</div>
              <div className="form-group is-input is-focused">
                <div className="form-control">
                  <div className="form-placeholder">Full name</div>
                  <input className="form-input" type="text" />
                </div>
              </div>
            </div>

            {/* HAS CONTENT */}
            <div className="sg-form-state">
              <div className="sg-form-state__label">Has Content</div>
              <div className="form-group is-input has-content">
                <div className="form-control">
                  <div className="form-placeholder">Full name</div>
                  <input className="form-input" type="text" defaultValue="Jin-Chul Moon" />
                </div>
              </div>
            </div>

            {/* ERROR */}
            <div className="sg-form-state">
              <div className="sg-form-state__label">Error</div>
              <div className="form-group is-input has-content is-error">
                <div className="form-control">
                  <div className="form-placeholder">Email address</div>
                  <input className="form-input" type="text" defaultValue="jin@" />
                </div>
                <div className="error-message">Invalid email address</div>
              </div>
            </div>

          </div>
          {/* /sg-form-states */}

          {/* Textarea */}
          <div className="sg-form-sub">
            <div className="sg-form-sub__label">Textarea — Default</div>
            <div className="form-group is-textarea">
              <div className="form-control">
                <div className="form-placeholder">Tell us about your project</div>
                <textarea className="form-textarea" rows={1} />
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div className="sg-form-sub">
            <div className="sg-form-sub__label">Checkbox</div>
            <div className="sg-form-checkboxes">

              {/* Unchecked */}
              <div className="form-group">
                <div className="form-checkbox">
                  <label>
                    <input type="checkbox" />
                    <span className="form-checkbox__check">
                      <svg viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L4.5 7.5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="form-checkbox__text">I agree to the terms and conditions</span>
                  </label>
                </div>
              </div>

              {/* Checked */}
              <div className="form-group">
                <div className="form-checkbox">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span className="form-checkbox__check">
                      <svg viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L4.5 7.5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="form-checkbox__text">I agree to the terms and conditions</span>
                  </label>
                </div>
              </div>

              {/* Error */}
              <div className="form-group is-error">
                <div className="form-checkbox">
                  <label>
                    <input type="checkbox" />
                    <span className="form-checkbox__check">
                      <svg viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L4.5 7.5L10 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="form-checkbox__text">I agree to the terms and conditions</span>
                  </label>
                </div>
              </div>

            </div>
          </div>
          {/* /Checkbox */}

        </div>
      </section>
    </div>
  );
}
