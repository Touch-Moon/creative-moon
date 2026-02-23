'use client';

import { useEffect, useState } from 'react';

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
    const saved = window.localStorage.getItem('cm-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.cm-root');
    if (!root) return;
    const cs = getComputedStyle(root);
    const n = (v: string) => Number(cs.getPropertyValue(v).trim()) || 0;
    setBps({
      mobile:  n('--cm-bp-mobile'),
      tablet:  n('--cm-bp-tablet'),
      laptop:  n('--cm-bp-laptop'),
      laptopL: n('--cm-bp-laptop-l'),
      desktop: n('--cm-bp-desktop'),
    });
  }, []);

  useEffect(() => {
    const update = () => setVpWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cm-theme', theme);
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
    <div className="cm-root" data-theme={theme}>
      <button
        type="button"
        className="cm-theme-toggle"
        aria-pressed={theme === 'dark'}
        aria-label="Toggle theme"
        onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="cm-theme-icon">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="cm-theme-icon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* ==============================
          HEADER
          ============================== */}
      <header className="cm-header">
        <div className="cm-logo">M</div>
        <h1 className="cm-header__title">Style guide</h1>
        <div className="cm-header__body">
          <p className="cm-header__desc">
            This design system serves as the definitive source of truth for the digital experience.
            It defines the foundational elements—typography, spacing, and color—that ensure a cohesive
            and high-quality user interface. By adhering to these standardized principles, we maintain
            visual integrity and functional efficiency across all development stages, reflecting our
            commitment to professional and modern web design.
          </p>
          <button className="button button--s" onClick={() => window.open('/style-guide/guide', '_blank')}>
            <div></div>
            <span>CSS Code Guide Menual</span>
          </button>
        </div>
      </header>

      {/* ==============================
          01 — HEADLINES
          ============================== */}
      <section className="cm-section">
        <div className="cm-section__left">
          <div className="cm-section__meta">01 — Headlines</div>
          <h2 className="cm-section__title">Display &amp; Title</h2>
          <p className="cm-section__desc">
            Seven fluid headline scales for display, title, and sub-title use.
            All weights are 400 and sizes are vw-based, scaling fluidly
            with the viewport. Letter-spacing tightens at larger sizes for
            optical balance.
          </p>
        </div>
        <div className="cm-section__right">

          <div className="cm-specimen">
            <div className="cm-specimen__text headline-1">Display</div>
            <span className="cm-specimen__spec">headline-1 · 9.71vw · 400 · 96% · ls −0.01em</span>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text headline-2">The quick brown fox</div>
            <div className="cm-specimen__spec">headline-2 · 6.04vw · 400 · 98% · ls −0.01em</div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text headline-3">The quick brown fox jumps</div>
            <div className="cm-specimen__spec">headline-3 · 5.13vw · 400 · 98% · ls −0.01em</div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text headline-4">The quick brown fox jumps over the lazy dog</div>
            <div className="cm-specimen__spec">headline-4 · 2.93vw · 400 · 110% · ls −0.01em</div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text headline-4b">The quick brown fox jumps over the lazy dog</div>
            <div className="cm-specimen__spec">headline-4b · 2.29vw · 400 · 100% · ls −0.01em</div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text headline-5">The quick brown fox jumps over the lazy dog and keeps going</div>
            <div className="cm-specimen__spec">headline-5 · 1.83vw · 400 · 110%</div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text headline-6">The quick brown fox jumps over the lazy dog and keeps going to fill</div>
            <div className="cm-specimen__spec">headline-6 · 1.47vw · 400 · 120% · ls 0.01em</div>
          </div>

        </div>
      </section>


      {/* ==============================
          02 — TYPE SCALE
          ============================== */}
      <section className="cm-section">
        <div className="cm-section__left">
          <div className="cm-section__meta">02 — Type Scale</div>
          <h2 className="cm-section__title">Typography</h2>
          <p className="cm-section__desc">
            Typography is built on a fluid vw-based scale ensuring maximum readability
            and a consistent hierarchy across all digital touch-points. From large body
            text to functional captions, each style is tuned with specific letter-spacing
            and line-heights to maintain a clean, modern aesthetic.
          </p>
        </div>
        <div className="cm-section__right">
          <div className="cm-badge">
            {vpWidth > 0 ? (({ label, px }) => `${label} · ${px}`)(getBreakpoint(vpWidth)) : ''}
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text body-text-1">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="cm-specimen__spec">
              body-text-1 · 2.20vw · 300 · 120%
            </div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text body-text-2">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="cm-specimen__spec">
              body-text-2 · 1.83vw · 300 · 140%
            </div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text body-text-3">
              The quick brown fox jumps over the lazy dog and keeps going to fill the line
            </div>
            <div className="cm-specimen__spec">
              body-text-3 · 1.47vw · 300 · 130% · ls 0.01em
            </div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text body-text-4">
              The quick brown fox jumps over the lazy dog and keeps going for a longer demonstration of this text size
            </div>
            <div className="cm-specimen__spec">
              body-text-4 · 1.19vw · 300 · 140% · ls 0.01em
            </div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text body-text-5">
              The quick brown fox jumps over the lazy dog and keeps going for a longer demonstration. This size is typically
              used for supporting text, captions, and supplementary information throughout the interface.
            </div>
            <div className="cm-specimen__spec">
              body-text-5 · 0.92vw · 400 · 150% · ls 0.01em
            </div>
          </div>

          <div className="cm-specimen">
            <div className="cm-specimen__text body-text-caps">
              Inter Display · Body Text Caps · Uppercase tracking
            </div>
            <div className="cm-specimen__spec">
              body-text-caps · 0.82vw · 300 · 100% · ls 0.04em · uppercase
            </div>
          </div>
        </div>
      </section>


      {/* ==============================
          03 — FONTS (Inter Display)
          ============================== */}
      <section className="cm-section">
        <div className="cm-section__left">
          <div className="cm-section__meta">03 — Fonts</div>
          <h2 className="cm-section__title">Inter Display</h2>
          <p className="cm-section__desc">
            Inter Display is the primary typeface — a variable font supporting weights
            100–900 with corresponding italic variants. Optimized for display sizes,
            it offers superior legibility at both large and small scales.
            The primary weights used across the system are Light (300) and Regular (400).
          </p>
        </div>
        <div className="cm-section__right">
          <div className="cm-weights">

            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 100 }}>Thin</div>
              <div className="cm-weight-item__spec">100 · Thin</div>
            </div>
            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 200 }}>ExtraLight</div>
              <div className="cm-weight-item__spec">200 · ExtraLight</div>
            </div>

            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 300 }}>Light</div>
              <div className="cm-weight-item__spec">300 · Light · Primary</div>
            </div>
            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 400 }}>Regular</div>
              <div className="cm-weight-item__spec">400 · Regular · Primary</div>
            </div>

            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 500 }}>Medium</div>
              <div className="cm-weight-item__spec">500 · Medium</div>
            </div>
            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 600 }}>SemiBold</div>
              <div className="cm-weight-item__spec">600 · SemiBold</div>
            </div>

            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 700 }}>Bold</div>
              <div className="cm-weight-item__spec">700 · Bold</div>
            </div>
            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 800 }}>ExtraBold</div>
              <div className="cm-weight-item__spec">800 · ExtraBold</div>
            </div>

            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 900 }}>Black</div>
              <div className="cm-weight-item__spec">900 · Black</div>
            </div>
            <div className="cm-weight-item">
              <div className="cm-weight-item__text" style={{ fontWeight: 900, fontStyle: 'italic' }}>Black Italic</div>
              <div className="cm-weight-item__spec">900 · Black · Italic</div>
            </div>

          </div>
        </div>
      </section>


      {/* ==============================
          04 — FONT TOKENS
          ============================== */}
      <section className="cm-section" style={{ display: 'none' }}>
        <div className="cm-section__left">
          <div className="cm-section__meta">04 — Font Tokens</div>
          <h2 className="cm-section__title">Type variables</h2>
          <p className="cm-section__desc">
            All typography values are registered as CSS custom properties.
            Use these tokens with{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>var()</code>
            {' '}to maintain consistent type across the system.
          </p>
        </div>
        <div className="cm-section__right">

          {/* Font Size */}
          <div className="cm-font-token-group">
            <div className="cm-font-token-group__label">Font Size</div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-body-1</span>
              <span className="cm-font-token-item__value">2.1978vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-body-2</span>
              <span className="cm-font-token-item__value">1.8315vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-body-3</span>
              <span className="cm-font-token-item__value">1.4652vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-body-4</span>
              <span className="cm-font-token-item__value">1.1905vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-body-5</span>
              <span className="cm-font-token-item__value">0.9158vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-body-caps</span>
              <span className="cm-font-token-item__value">0.8242vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-h1</span>
              <span className="cm-font-token-item__value">9.7070vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-h2</span>
              <span className="cm-font-token-item__value">6.0440vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-h3</span>
              <span className="cm-font-token-item__value">5.1282vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-h4</span>
              <span className="cm-font-token-item__value">2.9304vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-h4b</span>
              <span className="cm-font-token-item__value">2.2894vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-h5</span>
              <span className="cm-font-token-item__value">1.8315vw</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fs-h6</span>
              <span className="cm-font-token-item__value">1.4652vw</span>
            </div>
          </div>

          {/* Font Weight */}
          <div className="cm-font-token-group">
            <div className="cm-font-token-group__label">Font Weight</div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fw-light</span>
              <span className="cm-font-token-item__value">300</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--fw-regular</span>
              <span className="cm-font-token-item__value">400</span>
            </div>
          </div>

          {/* Line Height */}
          <div className="cm-font-token-group">
            <div className="cm-font-token-group__label">Line Height</div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-body-1</span>
              <span className="cm-font-token-item__value">120%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-body-2</span>
              <span className="cm-font-token-item__value">140%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-body-3</span>
              <span className="cm-font-token-item__value">130%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-body-4</span>
              <span className="cm-font-token-item__value">140%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-body-5</span>
              <span className="cm-font-token-item__value">150%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-body-caps</span>
              <span className="cm-font-token-item__value">100%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-h1</span>
              <span className="cm-font-token-item__value">96%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-h2</span>
              <span className="cm-font-token-item__value">98%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-h3</span>
              <span className="cm-font-token-item__value">98%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-h4</span>
              <span className="cm-font-token-item__value">110%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-h4b</span>
              <span className="cm-font-token-item__value">100%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-h5</span>
              <span className="cm-font-token-item__value">110%</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--lh-h6</span>
              <span className="cm-font-token-item__value">120%</span>
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="cm-font-token-group">
            <div className="cm-font-token-group__label">Letter Spacing</div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--ls-tight</span>
              <span className="cm-font-token-item__value">−0.01em</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--ls-base</span>
              <span className="cm-font-token-item__value">0.01em</span>
            </div>
            <div className="cm-font-token-item">
              <span className="cm-font-token-item__name">--ls-wide</span>
              <span className="cm-font-token-item__value">0.04em</span>
            </div>
          </div>

        </div>
      </section>


      {/* ==============================
          05 — SPACING
          ============================== */}
      <section className="cm-section">
        <div className="cm-section__left">
          <div className="cm-section__meta">05 — Spacing</div>
          <h2 className="cm-section__title">Space scale</h2>
          <p className="cm-section__desc">
            Fluid spacing scale based on viewport width. Base unit is{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>1.1111vw ≈ 16px</code>
            {' '}at 1440px. All spacing tokens scale proportionally across breakpoints,
            maintaining consistent rhythm and visual balance.
          </p>
        </div>
        <div className="cm-section__right">
          <div className="cm-space-list">

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-1</span>
                <span className="cm-space-item__value">0.2778vw · 4px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-1)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-2</span>
                <span className="cm-space-item__value">0.5556vw · 8px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-2)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-3</span>
                <span className="cm-space-item__value">0.8333vw · 12px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-3)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-4</span>
                <span className="cm-space-item__value">1.1111vw · 16px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-4)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-6</span>
                <span className="cm-space-item__value">1.6667vw · 24px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-6)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-8</span>
                <span className="cm-space-item__value">2.2222vw · 32px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-8)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-10</span>
                <span className="cm-space-item__value">2.7778vw · 40px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-10)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-12</span>
                <span className="cm-space-item__value">3.3333vw · 48px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-12)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-16</span>
                <span className="cm-space-item__value">4.4444vw · 64px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-16)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-20</span>
                <span className="cm-space-item__value">5.5556vw · 80px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-20)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-24</span>
                <span className="cm-space-item__value">6.6667vw · 96px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-24)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-32</span>
                <span className="cm-space-item__value">8.8889vw · 128px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-32)' }}></div>
              </div>
            </div>

            <div className="cm-space-item">
              <div className="cm-space-item__meta">
                <span className="cm-space-item__name">--space-40</span>
                <span className="cm-space-item__value">11.1111vw · 160px</span>
              </div>
              <div className="cm-space-item__bar-wrap">
                <div className="cm-space-item__bar" style={{ width: 'var(--space-40)' }}></div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ==============================
          06 — BUTTONS
          ============================== */}
      <section className="cm-section">
        <div className="cm-section__left">
          <div className="cm-section__meta">06 — Buttons</div>
          <h2 className="cm-section__title">Components</h2>
          <p className="cm-section__desc">
            Pill-shaped buttons with an overflow fill animation on hover.
            Available in 4 sizes (S / M / L / XL) and 2 style variants.
            The fill animation uses{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>mix-blend-mode: difference</code>
            {' '}for automatic text contrast inversion.
          </p>
        </div>
        <div className="cm-section__right">

          <div className="cm-btn-group">
            <div className="cm-btn-label">Default — S / M / L / XL</div>
            <div className="cm-btn-dark">
              <div className="cm-btn-row">
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

          <div className="cm-btn-group">
            <div className="cm-btn-label">Secondary variant — S / M / L / XL</div>
            <div className="cm-btn-dark">
              <div className="cm-btn-row">
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

          <div className="cm-btn-group">
            <div className="cm-btn-label">Block modifier — Full width</div>
            <div className="cm-btn-dark">
              <button className="button button--block button--m">
                <div></div><span>Block Button · Full Width</span>
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* ==============================
          07 — FORMS
          ============================== */}
      <section className="cm-section">
        <div className="cm-section__left">
          <div className="cm-section__meta">07 — Forms</div>
          <h2 className="cm-section__title">Form Components</h2>
          <p className="cm-section__desc">
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
        <div className="cm-section__right">

          {/* Input states 2×2 grid */}
          <div className="cm-form-states">

            {/* DEFAULT */}
            <div className="cm-form-state">
              <div className="cm-form-state__label">Default</div>
              <div className="form-group is-input">
                <div className="form-control">
                  <div className="form-placeholder">Full name</div>
                  <input className="form-input" type="text" />
                </div>
              </div>
            </div>

            {/* FOCUSED */}
            <div className="cm-form-state">
              <div className="cm-form-state__label">Focused</div>
              <div className="form-group is-input is-focused">
                <div className="form-control">
                  <div className="form-placeholder">Full name</div>
                  <input className="form-input" type="text" />
                </div>
              </div>
            </div>

            {/* HAS CONTENT */}
            <div className="cm-form-state">
              <div className="cm-form-state__label">Has Content</div>
              <div className="form-group is-input has-content">
                <div className="form-control">
                  <div className="form-placeholder">Full name</div>
                  <input className="form-input" type="text" defaultValue="Jin-Chul Moon" />
                </div>
              </div>
            </div>

            {/* ERROR */}
            <div className="cm-form-state">
              <div className="cm-form-state__label">Error</div>
              <div className="form-group is-input has-content is-error">
                <div className="form-control">
                  <div className="form-placeholder">Email address</div>
                  <input className="form-input" type="text" defaultValue="jin@" />
                </div>
                <div className="error-message">Invalid email address</div>
              </div>
            </div>

          </div>
          {/* /cm-form-states */}

          {/* Textarea */}
          <div className="cm-form-sub">
            <div className="cm-form-sub__label">Textarea — Default</div>
            <div className="form-group is-textarea">
              <div className="form-control">
                <div className="form-placeholder">Tell us about your project</div>
                <textarea className="form-textarea" rows={1} />
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div className="cm-form-sub">
            <div className="cm-form-sub__label">Checkbox</div>
            <div className="cm-form-checkboxes">

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
