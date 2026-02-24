'use client';

/* ================================================
   CSS Style Manual — Text Reference
   Source: styles.scss design system
   ================================================ */

import React, { useState, useEffect } from 'react';
import '@/styles/pages/_css-doc.scss';

/* ── Types ─────────────────────────────────────── */

export type BreakpointValues = {
  desktop: string;
  tablet: string;
  mobile: string;
};

export type ManualItem = {
  class?: string;
  token?: string;
  spec: string | BreakpointValues;
  note?: string;
};

export type ManualGroup = {
  label: string;
  items: ManualItem[];
};

export type ManualSection = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  groups: ManualGroup[];
};

type Breakpoint = 'desktop' | 'tablet' | 'mobile';
type Theme = 'light' | 'dark';

function getSpec(spec: string | BreakpointValues, bp: Breakpoint): string {
  if (typeof spec === 'string') return spec;
  return spec[bp];
}

function renderSpec(text: string): React.ReactNode {
  const match = text.match(/calc\((\d+) \//);
  if (!match || match.index === undefined) return text;
  const prefix = text.slice(0, match.index + 5); // 'calc(' 포함
  const num    = match[1];
  const suffix = text.slice(match.index + 5 + num.length);
  return (
    <>{prefix}<span className="cd-spec__val">{num}</span>{suffix}</>
  );
}

/* ── Data ──────────────────────────────────────── */

export const styleManual: ManualSection[] = [

  /* ── 01 HEADLINES ─────────────────────────────── */
  {
    number: '01',
    title: 'Display & Title',
    subtitle: 'Headlines',
    description:
      'Seven fluid headline scales using calc(px / 1440 * 100vw) on desktop. ' +
      'Fixed px overrides apply at tablet (≤1024px) and mobile (≤576px). ' +
      'All weights are 400.',
    groups: [
      {
        label: 'Classes',
        items: [
          { class: '.headline-1',  spec: { desktop: 'calc(140 / 1440 * 100vw) · 400 · lh 96%  · ls −0.01em', tablet: 'calc(64 / 1024 * 100vw) · 400 · lh 96%  · ls −0.01em',  mobile: 'calc(40 / 576 * 100vw) · 400 · lh 96%  · ls −0.01em' } },
          { class: '.headline-2',  spec: { desktop: 'calc(88 / 1440 * 100vw) · 400 · lh 98%  · ls −0.01em',  tablet: 'calc(32 / 1024 * 100vw) · 400 · lh 98%  · ls −0.01em',  mobile: 'calc(32 / 576 * 100vw) · 400 · lh 98%  · ls −0.01em' } },
          { class: '.headline-3',  spec: { desktop: 'calc(74 / 1440 * 100vw) · 400 · lh 98%  · ls −0.01em',  tablet: 'calc(28 / 1024 * 100vw) · 400 · lh 98%  · ls −0.01em',  mobile: 'calc(26 / 576 * 100vw) · 400 · lh 98%  · ls −0.01em' } },
          { class: '.headline-4',  spec: { desktop: 'calc(42 / 1440 * 100vw) · 400 · lh 110% · ls −0.01em',  tablet: 'calc(24 / 1024 * 100vw) · 400 · lh 110% · ls −0.01em',  mobile: 'calc(22 / 576 * 100vw) · 400 · lh 110% · ls −0.01em' } },
          { class: '.headline-4b', spec: { desktop: 'calc(32 / 1440 * 100vw) · 400 · lh 100% · ls −0.01em',  tablet: 'calc(22 / 1024 * 100vw) · 400 · lh 100% · ls −0.01em',  mobile: 'calc(20 / 576 * 100vw) · 400 · lh 100% · ls −0.01em' } },
          { class: '.headline-5',  spec: { desktop: 'calc(26 / 1440 * 100vw) · 400 · lh 110%',               tablet: 'calc(20 / 1024 * 100vw) · 400 · lh 110%',               mobile: 'calc(18 / 576 * 100vw) · 400 · lh 110%' } },
          { class: '.headline-6',  spec: { desktop: 'calc(22 / 1440 * 100vw) · 400 · lh 120% · ls 0.01em',   tablet: 'calc(16 / 1024 * 100vw) · 400 · lh 120% · ls 0.01em',   mobile: 'calc(14 / 576 * 100vw) · 400 · lh 120% · ls 0.01em' } },
        ],
      },
      {
        label: 'Tokens',
        items: [
          { token: '--fs-h1',  spec: { desktop: 'calc(140 / 1440 * 100vw)', tablet: 'calc(64 / 1024 * 100vw)', mobile: 'calc(40 / 576 * 100vw)' } },
          { token: '--fs-h2',  spec: { desktop: 'calc(88 / 1440 * 100vw)',  tablet: 'calc(32 / 1024 * 100vw)', mobile: 'calc(32 / 576 * 100vw)' } },
          { token: '--fs-h3',  spec: { desktop: 'calc(74 / 1440 * 100vw)',  tablet: 'calc(28 / 1024 * 100vw)', mobile: 'calc(26 / 576 * 100vw)' } },
          { token: '--fs-h4',  spec: { desktop: 'calc(42 / 1440 * 100vw)',  tablet: 'calc(24 / 1024 * 100vw)', mobile: 'calc(22 / 576 * 100vw)' } },
          { token: '--fs-h4b', spec: { desktop: 'calc(32 / 1440 * 100vw)',  tablet: 'calc(22 / 1024 * 100vw)', mobile: 'calc(20 / 576 * 100vw)' } },
          { token: '--fs-h5',  spec: { desktop: 'calc(26 / 1440 * 100vw)',  tablet: 'calc(20 / 1024 * 100vw)', mobile: 'calc(18 / 576 * 100vw)' } },
          { token: '--fs-h6',  spec: { desktop: 'calc(22 / 1440 * 100vw)',  tablet: 'calc(16 / 1024 * 100vw)', mobile: 'calc(14 / 576 * 100vw)' } },
        ],
      },
    ],
  },

  /* ── 02 TYPE SCALE ────────────────────────────── */
  {
    number: '02',
    title: 'Typography',
    subtitle: 'Type Scale',
    description:
      'Fluid vw-based body text scale using calc(px / 1440 * 100vw) on desktop. ' +
      'Six levels from large editorial text to functional captions. ' +
      'Fixed px overrides at tablet and mobile breakpoints.',
    groups: [
      {
        label: 'Classes',
        items: [
          { class: '.body-text-1',    spec: { desktop: 'calc(32 / 1440 * 100vw) · 300 · lh 120%',                                  tablet: 'calc(32 / 1024 * 100vw) · 300 · lh 120%',                                  mobile: 'calc(32 / 576 * 100vw) · 300 · lh 120%' } },
          { class: '.body-text-2',    spec: { desktop: 'calc(26 / 1440 * 100vw) · 300 · lh 140%',                                  tablet: 'calc(26 / 1024 * 100vw) · 300 · lh 140%',                                  mobile: 'calc(26 / 576 * 100vw) · 300 · lh 140%' } },
          { class: '.body-text-3',    spec: { desktop: 'calc(22 / 1440 * 100vw) · 300 · lh 130% · ls 0.01em',                      tablet: 'calc(24 / 1024 * 100vw) · 300 · lh 130% · ls 0.01em',                      mobile: 'calc(24 / 576 * 100vw) · 300 · lh 130% · ls 0.01em' } },
          { class: '.body-text-4',    spec: { desktop: 'calc(18 / 1440 * 100vw) · 300 · lh 140% · ls 0.01em',                      tablet: 'calc(16 / 1024 * 100vw) · 300 · lh 140% · ls 0.01em',                      mobile: 'calc(16 / 576 * 100vw) · 300 · lh 140% · ls 0.01em' } },
          { class: '.body-text-5',    spec: { desktop: 'calc(14 / 1440 * 100vw) · 400 · lh 150% · ls 0.01em',                      tablet: 'calc(14 / 1024 * 100vw) · 400 · lh 150% · ls 0.01em',                      mobile: 'calc(14 / 576 * 100vw) · 400 · lh 150% · ls 0.01em' } },
          { class: '.body-text-caps', spec: { desktop: 'calc(12 / 1440 * 100vw) · 300 · lh 100% · ls 0.04em · uppercase',          tablet: 'calc(12 / 1024 * 100vw) · 300 · lh 100% · ls 0.04em · uppercase',          mobile: 'calc(12 / 576 * 100vw) · 300 · lh 100% · ls 0.04em · uppercase' } },
        ],
      },
      {
        label: 'Tokens',
        items: [
          { token: '--fs-body-1',    spec: { desktop: 'calc(32 / 1440 * 100vw)', tablet: 'calc(32 / 1024 * 100vw)', mobile: 'calc(32 / 576 * 100vw)' } },
          { token: '--fs-body-2',    spec: { desktop: 'calc(26 / 1440 * 100vw)', tablet: 'calc(26 / 1024 * 100vw)', mobile: 'calc(26 / 576 * 100vw)' } },
          { token: '--fs-body-3',    spec: { desktop: 'calc(22 / 1440 * 100vw)', tablet: 'calc(24 / 1024 * 100vw)', mobile: 'calc(24 / 576 * 100vw)' } },
          { token: '--fs-body-4',    spec: { desktop: 'calc(18 / 1440 * 100vw)', tablet: 'calc(16 / 1024 * 100vw)', mobile: 'calc(16 / 576 * 100vw)' } },
          { token: '--fs-body-5',    spec: { desktop: 'calc(14 / 1440 * 100vw)', tablet: 'calc(14 / 1024 * 100vw)', mobile: 'calc(14 / 576 * 100vw)' } },
          { token: '--fs-body-caps', spec: { desktop: 'calc(12 / 1440 * 100vw)', tablet: 'calc(12 / 1024 * 100vw)', mobile: 'calc(12 / 576 * 100vw)' } },
        ],
      },
    ],
  },

  /* ── 03 FONTS ─────────────────────────────────── */
  {
    number: '03',
    title: 'Figtree',
    subtitle: 'Fonts',
    description:
      'Primary typeface — variable font supporting weights 300–900 with italic variants. ' +
      'A geometric sans-serif optimized for UI and display sizes. Primary weights: Light (300) and Regular (400).',
    groups: [
      {
        label: 'Weights',
        items: [
          { spec: '300 · Light',     note: 'Primary' },
          { spec: '400 · Regular',   note: 'Primary' },
          { spec: '500 · Medium' },
          { spec: '600 · SemiBold' },
          { spec: '700 · Bold' },
          { spec: '800 · ExtraBold' },
          { spec: '900 · Black' },
          { spec: '900 · Black · Italic' },
        ],
      },
      {
        label: 'Family',
        items: [
          { token: '--font-inter-display', spec: "'Figtree', sans-serif" },
        ],
      },
    ],
  },

  /* ── 04 FONT TOKENS ───────────────────────────── */
  {
    number: '04',
    title: 'Type Variables',
    subtitle: 'Font Tokens',
    description:
      'All typography values registered as CSS custom properties. ' +
      'Use var() to maintain consistent type across the system.',
    groups: [
      {
        label: 'Font Weight',
        items: [
          { token: '--fw-light',   spec: '300' },
          { token: '--fw-regular', spec: '400' },
        ],
      },
      {
        label: 'Line Height — Body',
        items: [
          { token: '--lh-body-1',    spec: '120%' },
          { token: '--lh-body-2',    spec: '140%' },
          { token: '--lh-body-3',    spec: '130%' },
          { token: '--lh-body-4',    spec: '140%' },
          { token: '--lh-body-5',    spec: '150%' },
          { token: '--lh-body-caps', spec: '100%' },
        ],
      },
      {
        label: 'Line Height — Headlines',
        items: [
          { token: '--lh-h1',  spec: '96%' },
          { token: '--lh-h2',  spec: '98%' },
          { token: '--lh-h3',  spec: '98%' },
          { token: '--lh-h4',  spec: '110%' },
          { token: '--lh-h4b', spec: '100%' },
          { token: '--lh-h5',  spec: '110%' },
          { token: '--lh-h6',  spec: '120%' },
        ],
      },
      {
        label: 'Letter Spacing',
        items: [
          { token: '--ls-tight', spec: '−0.01em', note: 'Headlines h1–h4' },
          { token: '--ls-base',  spec: '0.01em',  note: 'body-text-3 ~ h6' },
          { token: '--ls-wide',  spec: '0.04em',  note: 'body-text-caps' },
        ],
      },
    ],
  },

  /* ── 05 SPACING ───────────────────────────────── */
  {
    number: '05',
    title: 'Space Scale',
    subtitle: 'Spacing',
    description:
      'Fluid spacing — no media query overrides, scales proportionally with viewport. ' +
      'Desktop shows calc formula · Tablet computed at 1024px · Mobile computed at 576px.',
    groups: [
      {
        label: 'Tokens',
        items: [
          { token: '--space-1',  spec: { desktop: 'calc(4 / 1440 * 100vw) · 4px',    tablet: 'calc(4 / 1440 * 100vw) · ≈ 2.84px',    mobile: 'calc(4 / 1440 * 100vw) · 1.60px'   } },
          { token: '--space-2',  spec: { desktop: 'calc(8 / 1440 * 100vw) · 8px',    tablet: 'calc(8 / 1440 * 100vw) · ≈ 5.69px',    mobile: 'calc(8 / 1440 * 100vw) · 3.20px'   } },
          { token: '--space-3',  spec: { desktop: 'calc(12 / 1440 * 100vw) · 12px',  tablet: 'calc(12 / 1440 * 100vw) · ≈ 8.53px',   mobile: 'calc(12 / 1440 * 100vw) · 4.80px'  } },
          { token: '--space-4',  spec: { desktop: 'calc(16 / 1440 * 100vw) · 16px',  tablet: 'calc(16 / 1440 * 100vw) · ≈ 11.38px',  mobile: 'calc(16 / 1440 * 100vw) · 6.40px'  }, note: 'Base unit' },
          { token: '--space-6',  spec: { desktop: 'calc(24 / 1440 * 100vw) · 24px',  tablet: 'calc(24 / 1440 * 100vw) · ≈ 17.07px',  mobile: 'calc(24 / 1440 * 100vw) · 9.60px'  } },
          { token: '--space-8',  spec: { desktop: 'calc(32 / 1440 * 100vw) · 32px',  tablet: 'calc(32 / 1440 * 100vw) · ≈ 22.76px',  mobile: 'calc(32 / 1440 * 100vw) · 12.80px' } },
          { token: '--space-10', spec: { desktop: 'calc(40 / 1440 * 100vw) · 40px',  tablet: 'calc(40 / 1440 * 100vw) · ≈ 28.44px',  mobile: 'calc(40 / 1440 * 100vw) · 16.00px' } },
          { token: '--space-12', spec: { desktop: 'calc(48 / 1440 * 100vw) · 48px',  tablet: 'calc(48 / 1440 * 100vw) · ≈ 34.13px',  mobile: 'calc(48 / 1440 * 100vw) · 19.20px' } },
          { token: '--space-16', spec: { desktop: 'calc(64 / 1440 * 100vw) · 64px',  tablet: 'calc(64 / 1440 * 100vw) · ≈ 45.51px',  mobile: 'calc(64 / 1440 * 100vw) · 25.60px' } },
          { token: '--space-20', spec: { desktop: 'calc(80 / 1440 * 100vw) · 80px',  tablet: 'calc(80 / 1440 * 100vw) · ≈ 56.89px',  mobile: 'calc(80 / 1440 * 100vw) · 32.00px' } },
          { token: '--space-24', spec: { desktop: 'calc(96 / 1440 * 100vw) · 96px',  tablet: 'calc(96 / 1440 * 100vw) · ≈ 68.27px',  mobile: 'calc(96 / 1440 * 100vw) · 38.40px' } },
          { token: '--space-32', spec: { desktop: 'calc(128 / 1440 * 100vw) · 128px', tablet: 'calc(128 / 1440 * 100vw) · ≈ 91.02px', mobile: 'calc(128 / 1440 * 100vw) · 51.20px' } },
          { token: '--space-40', spec: { desktop: 'calc(160 / 1440 * 100vw) · 160px', tablet: 'calc(160 / 1440 * 100vw) · ≈ 113.78px', mobile: 'calc(160 / 1440 * 100vw) · 64.00px' } },
        ],
      },
    ],
  },

  /* ── 06 BUTTONS ───────────────────────────────── */
  {
    number: '06',
    title: 'Components',
    subtitle: 'Buttons',
    description:
      'Pill-shaped buttons with overflow fill animation on hover. ' +
      '4 sizes (S / M / L / XL) · 2 variants (Default / Secondary). ' +
      'Uses mix-blend-mode: difference for automatic text contrast inversion.',
    groups: [
      {
        label: 'Base',
        items: [
          { class: '.button',      spec: 'border-radius: 9999em · overflow: hidden · box-shadow: inset 0 0 0 1.5px #fff' },
          { class: '.button div',  spec: 'fill layer · background: #fff · transform: scaleY(0) → scaleY(1) on hover' },
          { class: '.button span', spec: 'mix-blend-mode: difference · text inversion layer' },
        ],
      },
      {
        label: 'Sizes',
        items: [
          { class: '.button--s',  spec: '0.73vw · h 2.20vw · px 1.92vw' },
          { class: '.button--m',  spec: '1.01vw · h 2.66vw · px 1.92vw' },
          { class: '.button--l',  spec: '1.19vw · h 3.94vw · px 5.49vw' },
          { class: '.button--xl', spec: '1.47vw · h 4.67vw · px 1.37vw' },
        ],
      },
      {
        label: 'Variants',
        items: [
          { class: '.button--secondary', spec: 'background: #fff · mix-blend-mode: difference · fill: #000' },
          { class: '.button--block',     spec: 'width: 100%' },
        ],
      },
    ],
  },

  /* ── 07 FORMS ─────────────────────────────────── */
  {
    number: '07',
    title: 'Form Components',
    subtitle: 'Forms',
    description:
      'Underline-only input system with floating placeholder that animates upward on focus. ' +
      'States (.is-focused, .has-content, .is-error) are applied via JS to the parent .form-group. ' +
      'Error colour: #FB6262.',
    groups: [
      {
        label: 'Structure',
        items: [
          { class: '.form-group',             spec: 'Wrapper · position: relative · margin-bottom: 1px' },
          { class: '.form-group.is-input',    spec: 'Type modifier for <input>' },
          { class: '.form-group.is-textarea', spec: 'Type modifier for <textarea>' },
          { class: '.form-control',           spec: 'Inner wrapper · holds underline pseudo-elements' },
          { class: '.form-placeholder',       spec: 'Floating label · position: absolute · animated via CSS transition' },
          { class: '.form-input',             spec: 'Text input · background: transparent · border: none' },
          { class: '.form-textarea',          spec: 'Textarea · overflow: hidden · height grows via JS' },
        ],
      },
      {
        label: 'States (JS-applied to .form-group)',
        items: [
          { class: '.is-focused',  spec: 'Underline animates scaleX(0→1) · placeholder floats up & fades (opacity 0.45)' },
          { class: '.has-content', spec: 'Underline retracts · placeholder stays floated up' },
          { class: '.is-error',    spec: 'Underline color: #FB6262 · .form-checkbox__check border: #FB6262' },
        ],
      },
      {
        label: 'Checkbox',
        items: [
          { class: '.form-checkbox',            spec: 'Container for custom checkbox' },
          { class: '.form-checkbox__check',     spec: 'Visual box · border: 1px solid #000 · 1.14vw × 1.14vw (min 16px)' },
          { class: '.form-checkbox__check svg', spec: 'Checkmark icon · opacity: 0 → 1 on :checked' },
          { class: '.form-checkbox__text',      spec: 'Label text · clamp(11px, 0.88vw, 13px) · lh 1.6' },
        ],
      },
      {
        label: 'Error',
        items: [
          { class: '.error-message', spec: 'color: #FB6262 · clamp(9px, 0.73vw, 11px) · position: absolute · right: 0' },
        ],
      },
    ],
  },
];


/* ================================================
   StyleGuideMenu — renderable text reference
   ================================================ */

export default function StyleGuideMenu() {
  const [theme, setTheme] = useState<Theme>('light');
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const saved = window.localStorage.getItem('cm-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cm-theme', theme);
  }, [theme]);

  return (
    <div className="cm-root" data-theme={theme}>

      {/* Theme toggle — position: fixed, bottom-right */}
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

      <article className="cd-doc">

        {/* Document head */}
        <header className="cd-doc__head">
          <h1 className="cd-doc__title">CSS Style Manual</h1>
          <p className="cd-doc__meta">Creative Moon Design System · v1.0</p>

          {/* Breakpoint selector */}
          <div className="cd-bp-selector" role="group" aria-label="Breakpoint">
            {(['desktop', 'tablet', 'mobile'] as const).map((bp) => (
              <button
                key={bp}
                type="button"
                className={`cd-bp-btn${breakpoint === bp ? ' is-active' : ''}`}
                onClick={() => setBreakpoint(bp)}
              >
                {bp}
              </button>
            ))}
          </div>
        </header>

        {/* Document body */}
        <div className="cd-doc__body">
          {styleManual.map((section) => (
            <section key={section.number} className="cd-section">

              {/* Section head */}
              <header className="cd-section__head">
                <div className="cd-section__eyebrow">
                  <span className="cd-section__number">{section.number}</span>
                  <span className="cd-section__subtitle">{section.subtitle}</span>
                </div>
                <h2 className="cd-section__title">{section.title}</h2>
                <p className="cd-section__desc">{section.description}</p>
              </header>

              {/* Section body */}
              <div className="cd-section__body">
                {section.groups.map((group) => (
                  <div key={group.label} className="cd-group">
                    <h3 className="cd-group__title">{group.label}</h3>
                    <ul className="cd-group__list">
                      {group.items.map((item, i) => (
                        <li key={i} className="cd-item">
                          <span className="cd-item__name">
                            {item.class ?? item.token ?? '—'}
                            {item.note && (
                              <span className="cd-item__note">({item.note})</span>
                            )}
                          </span>
                          <span className="cd-item__spec">{renderSpec(getSpec(item.spec, breakpoint))}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </section>
          ))}
        </div>

      </article>
    </div>
  );
}
