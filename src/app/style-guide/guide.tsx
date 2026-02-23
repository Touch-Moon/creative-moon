/* ================================================
   CSS Style Manual — Text Reference
   Source: styles.scss design system
   ================================================ */

export type ManualItem = {
  class?: string;
  token?: string;
  spec: string;
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

export const styleManual: ManualSection[] = [

  /* ── 01 HEADLINES ─────────────────────────────── */
  {
    number: '01',
    title: 'Display & Title',
    subtitle: 'Headlines',
    description:
      'Seven fluid headline scales for display, title, and sub-title use. ' +
      'All weights are 400 and sizes are vw-based. ' +
      'Letter-spacing tightens at larger sizes for optical balance.',
    groups: [
      {
        label: 'Classes',
        items: [
          { class: '.headline-1',  spec: '9.71vw · 400 · lh 96%  · ls −0.01em' },
          { class: '.headline-2',  spec: '6.04vw · 400 · lh 98%  · ls −0.01em' },
          { class: '.headline-3',  spec: '5.13vw · 400 · lh 98%  · ls −0.01em' },
          { class: '.headline-4',  spec: '2.93vw · 400 · lh 110% · ls −0.01em' },
          { class: '.headline-4b', spec: '2.29vw · 400 · lh 100% · ls −0.01em' },
          { class: '.headline-5',  spec: '1.83vw · 400 · lh 110%' },
          { class: '.headline-6',  spec: '1.47vw · 400 · lh 120% · ls 0.01em' },
        ],
      },
      {
        label: 'Tokens',
        items: [
          { token: '--fs-h1',  spec: '9.7070vw' },
          { token: '--fs-h2',  spec: '6.0440vw' },
          { token: '--fs-h3',  spec: '5.1282vw' },
          { token: '--fs-h4',  spec: '2.9304vw' },
          { token: '--fs-h4b', spec: '2.2894vw' },
          { token: '--fs-h5',  spec: '1.8315vw' },
          { token: '--fs-h6',  spec: '1.4652vw' },
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
      'Fluid vw-based body text scale. Six levels from large editorial text ' +
      'to functional captions. Light (300) for most sizes, Regular (400) for body-5.',
    groups: [
      {
        label: 'Classes',
        items: [
          { class: '.body-text-1',    spec: '2.20vw · 300 · lh 120%' },
          { class: '.body-text-2',    spec: '1.83vw · 300 · lh 140%' },
          { class: '.body-text-3',    spec: '1.47vw · 300 · lh 130% · ls 0.01em' },
          { class: '.body-text-4',    spec: '1.19vw · 300 · lh 140% · ls 0.01em' },
          { class: '.body-text-5',    spec: '0.92vw · 400 · lh 150% · ls 0.01em' },
          { class: '.body-text-caps', spec: '0.82vw · 300 · lh 100% · ls 0.04em · text-transform: uppercase' },
        ],
      },
      {
        label: 'Tokens',
        items: [
          { token: '--fs-body-1',    spec: '2.1978vw' },
          { token: '--fs-body-2',    spec: '1.8315vw' },
          { token: '--fs-body-3',    spec: '1.4652vw' },
          { token: '--fs-body-4',    spec: '1.1905vw' },
          { token: '--fs-body-5',    spec: '0.9158vw' },
          { token: '--fs-body-caps', spec: '0.8242vw' },
        ],
      },
    ],
  },

  /* ── 03 FONTS ─────────────────────────────────── */
  {
    number: '03',
    title: 'Inter Display',
    subtitle: 'Fonts',
    description:
      'Primary typeface — variable font supporting weights 100–900 with italic variants. ' +
      'Optimized for display sizes. Primary weights: Light (300) and Regular (400).',
    groups: [
      {
        label: 'Weights',
        items: [
          { spec: '100 · Thin' },
          { spec: '200 · ExtraLight' },
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
          { token: '--font-inter-display', spec: "'Inter Display', 'Inter', sans-serif" },
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
      'Fluid spacing scale based on viewport width. ' +
      'Base unit: 1.1111vw ≈ 16px at 1440px. ' +
      'All tokens scale proportionally across breakpoints.',
    groups: [
      {
        label: 'Tokens',
        items: [
          { token: '--space-1',  spec: '0.2778vw · 4px' },
          { token: '--space-2',  spec: '0.5556vw · 8px' },
          { token: '--space-3',  spec: '0.8333vw · 12px' },
          { token: '--space-4',  spec: '1.1111vw · 16px', note: 'Base unit' },
          { token: '--space-6',  spec: '1.6667vw · 24px' },
          { token: '--space-8',  spec: '2.2222vw · 32px' },
          { token: '--space-10', spec: '2.7778vw · 40px' },
          { token: '--space-12', spec: '3.3333vw · 48px' },
          { token: '--space-16', spec: '4.4444vw · 64px' },
          { token: '--space-20', spec: '5.5556vw · 80px' },
          { token: '--space-24', spec: '6.6667vw · 96px' },
          { token: '--space-32', spec: '8.8889vw · 128px' },
          { token: '--space-40', spec: '11.1111vw · 160px' },
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
          { class: '.button',            spec: 'border-radius: 9999em · overflow: hidden · box-shadow: inset 0 0 0 1.5px #fff' },
          { class: '.button div',        spec: 'fill layer · background: #fff · transform: scaleY(0) → scaleY(1) on hover' },
          { class: '.button span',       spec: 'mix-blend-mode: difference · text inversion layer' },
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
          { class: '.form-group',        spec: 'Wrapper · position: relative · margin-bottom: 1px' },
          { class: '.form-group.is-input',    spec: 'Type modifier for <input>' },
          { class: '.form-group.is-textarea', spec: 'Type modifier for <textarea>' },
          { class: '.form-control',      spec: 'Inner wrapper · holds underline pseudo-elements' },
          { class: '.form-placeholder',  spec: 'Floating label · position: absolute · animated via CSS transition' },
          { class: '.form-input',        spec: 'Text input · background: transparent · border: none' },
          { class: '.form-textarea',     spec: 'Textarea · overflow: hidden · height grows via JS' },
        ],
      },
      {
        label: 'States (JS-applied to .form-group)',
        items: [
          { class: '.is-focused',   spec: 'Underline animates scaleX(0→1) · placeholder floats up & fades (opacity 0.45)' },
          { class: '.has-content',  spec: 'Underline retracts · placeholder stays floated up' },
          { class: '.is-error',     spec: 'Underline color: #FB6262 · .form-checkbox__check border: #FB6262' },
        ],
      },
      {
        label: 'Checkbox',
        items: [
          { class: '.form-checkbox',           spec: 'Container for custom checkbox' },
          { class: '.form-checkbox__check',    spec: 'Visual box · border: 1px solid #000 · 1.14vw × 1.14vw (min 16px)' },
          { class: '.form-checkbox__check svg',spec: 'Checkmark icon · opacity: 0 → 1 on :checked' },
          { class: '.form-checkbox__text',     spec: 'Label text · clamp(11px, 0.88vw, 13px) · lh 1.6' },
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
  return (
    <nav aria-label="Style guide menu">
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {styleManual.map((section) => (
          <li key={section.number} style={{ marginBottom: '2rem' }}>
            {/* Section header */}
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.45, marginBottom: '0.25rem' }}>
              {section.number} — {section.subtitle}
            </p>
            <strong style={{ fontSize: '0.9rem' }}>{section.title}</strong>

            {/* Groups */}
            {section.groups.map((group) => (
              <div key={group.label} style={{ marginTop: '0.75rem' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  {group.label}
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {group.items.map((item, i) => (
                    <li key={i} style={{ fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: '1.8', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <span style={{ opacity: 0.8 }}>
                        {item.class ?? item.token ?? '—'}
                        {item.note && (
                          <span style={{ opacity: 0.45, marginLeft: '0.5rem' }}>({item.note})</span>
                        )}
                      </span>
                      <span style={{ opacity: 0.5, textAlign: 'right' }}>{item.spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </nav>
  );
}
