'use client';

/* ================================================
   CSS Style Manual — Text Reference
   Source: styles.scss design system
   ================================================ */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '@/styles/pages/_css-doc.scss';

/* ── Types ─────────────────────────────────────── */

export type BreakpointValues = {
  desktop: string;
  tablet: string;
  mobile: string;
  desktopXl?: string;
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

type Breakpoint = 'desktopXl' | 'desktop' | 'tablet' | 'mobile';
type Theme = 'light' | 'dark';

const BP_LABEL: Record<Breakpoint, string> = {
  desktopXl: 'Desktop XL',
  desktop:   'Desktop',
  tablet:    'Tablet',
  mobile:    'Mobile',
};

function getSpec(spec: string | BreakpointValues, bp: Breakpoint): string {
  if (typeof spec === 'string') return spec;
  if (bp === 'desktopXl') return spec.desktopXl ?? spec.desktop;
  return spec[bp];
}

function renderSpec(text: string): React.ReactNode {
  const match = text.match(/calc\((\d+) \//);
  if (!match || match.index === undefined) return text;
  const prefix = text.slice(0, match.index + 5); // includes 'calc('
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
      'Seven fluid headline scales using calc(px / 1440 * 100vw) on desktop, capped at 1920px on Desktop XL. ' +
      'Tablet uses plastic.design 768px base · Mobile uses plastic.design 375px base. ' +
      'All weights are 400.',
    groups: [
      {
        label: 'Classes',
        items: [
          { class: '.headline-1',  spec: { desktopXl: '128px · fixed · 400 · lh 96%  · ls −0.01em',     desktop: 'calc(96 / 1440 * 100vw) · 400 · lh 96%  · ls −0.01em',  tablet: 'calc(75 / 768 * 100vw) · 400 · lh 96%  · ls −0.01em',  mobile: 'calc(54 / 375 * 100vw) · 400 · lh 96%  · ls −0.01em' } },
          { class: '.headline-2',  spec: { desktopXl: '117.33px · fixed · 400 · lh 98%  · ls −0.01em', desktop: 'calc(88 / 1440 * 100vw) · 400 · lh 98%  · ls −0.01em',  tablet: 'calc(46 / 768 * 100vw) · 400 · lh 98%  · ls −0.01em',  mobile: 'calc(46 / 375 * 100vw) · 400 · lh 98%  · ls −0.01em' } },
          { class: '.headline-3',  spec: { desktopXl: '98.67px · fixed · 400 · lh 98%  · ls −0.01em',  desktop: 'calc(74 / 1440 * 100vw) · 400 · lh 98%  · ls −0.01em',  tablet: 'calc(39 / 768 * 100vw) · 400 · lh 98%  · ls −0.01em',  mobile: 'calc(34 / 375 * 100vw) · 400 · lh 98%  · ls −0.01em' } },
          { class: '.headline-4',  spec: { desktopXl: '56px · fixed · 400 · lh 110% · ls −0.01em',     desktop: 'calc(42 / 1440 * 100vw) · 400 · lh 110% · ls −0.01em',  tablet: 'calc(23 / 768 * 100vw) · 400 · lh 110% · ls −0.01em',  mobile: 'calc(30 / 375 * 100vw) · 400 · lh 110% · ls −0.01em' } },
          { class: '.headline-4b', spec: { desktopXl: '42.67px · fixed · 400 · lh 100% · ls −0.01em',  desktop: 'calc(32 / 1440 * 100vw) · 400 · lh 100% · ls −0.01em',  tablet: 'calc(18 / 768 * 100vw) · 400 · lh 100% · ls −0.01em',  mobile: 'calc(30 / 375 * 100vw) · 400 · lh 100% · ls −0.01em' } },
          { class: '.headline-5',  spec: { desktopXl: '34.67px · fixed · 400 · lh 110%',               desktop: 'calc(26 / 1440 * 100vw) · 400 · lh 110%',               tablet: 'calc(22 / 768 * 100vw) · 400 · lh 110%',               mobile: 'calc(24 / 375 * 100vw) · 400 · lh 110%' } },
          { class: '.headline-6',  spec: { desktopXl: '29.33px · fixed · 400 · lh 120% · ls 0.01em',   desktop: 'calc(22 / 1440 * 100vw) · 400 · lh 120% · ls 0.01em',   tablet: 'calc(16 / 768 * 100vw) · 400 · lh 120% · ls 0.01em',   mobile: 'calc(18 / 375 * 100vw) · 400 · lh 120% · ls 0.01em' } },
        ],
      },
      {
        label: 'Tokens',
        items: [
          { token: '--fs-h1',  spec: { desktopXl: '128px · fixed',    desktop: 'calc(96 / 1440 * 100vw)',  tablet: 'calc(75 / 768 * 100vw)', mobile: 'calc(54 / 375 * 100vw)' } },
          { token: '--fs-h2',  spec: { desktopXl: '117.33px · fixed', desktop: 'calc(88 / 1440 * 100vw)',  tablet: 'calc(46 / 768 * 100vw)', mobile: 'calc(46 / 375 * 100vw)' } },
          { token: '--fs-h3',  spec: { desktopXl: '98.67px · fixed',  desktop: 'calc(74 / 1440 * 100vw)',  tablet: 'calc(39 / 768 * 100vw)', mobile: 'calc(34 / 375 * 100vw)' } },
          { token: '--fs-h4',  spec: { desktopXl: '56px · fixed',     desktop: 'calc(42 / 1440 * 100vw)',  tablet: 'calc(23 / 768 * 100vw)', mobile: 'calc(30 / 375 * 100vw)' } },
          { token: '--fs-h4b', spec: { desktopXl: '42.67px · fixed',  desktop: 'calc(32 / 1440 * 100vw)',  tablet: 'calc(18 / 768 * 100vw)', mobile: 'calc(30 / 375 * 100vw)' } },
          { token: '--fs-h5',  spec: { desktopXl: '34.67px · fixed',  desktop: 'calc(26 / 1440 * 100vw)',  tablet: 'calc(22 / 768 * 100vw)', mobile: 'calc(24 / 375 * 100vw)' } },
          { token: '--fs-h6',  spec: { desktopXl: '29.33px · fixed',  desktop: 'calc(22 / 1440 * 100vw)',  tablet: 'calc(16 / 768 * 100vw)', mobile: 'calc(18 / 375 * 100vw)' } },
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
      'Fluid vw-based body text scale using calc(px / 1440 * 100vw) on desktop, capped at 1920px on Desktop XL. ' +
      'Six levels from large editorial text to functional captions. ' +
      'Tablet uses 768px base · Mobile uses 375px base (matching plastic.design).',
    groups: [
      {
        label: 'Classes',
        items: [
          { class: '.body-text-1',    spec: { desktopXl: '42.67px · fixed · 300 · lh 120%',                             desktop: 'calc(32 / 1440 * 100vw) · 300 · lh 120%',                                  tablet: 'calc(20 / 768 * 100vw) · 300 · lh 120%',                                   mobile: 'calc(24 / 375 * 100vw) · 300 · lh 120%' } },
          { class: '.body-text-2',    spec: { desktopXl: '34.67px · fixed · 300 · lh 140%',                             desktop: 'calc(26 / 1440 * 100vw) · 300 · lh 140%',                                  tablet: 'calc(20 / 768 * 100vw) · 300 · lh 140%',                                   mobile: 'calc(22 / 375 * 100vw) · 300 · lh 140%' } },
          { class: '.body-text-3',    spec: { desktopXl: '29.33px · fixed · 300 · lh 130% · ls 0.01em',                 desktop: 'calc(22 / 1440 * 100vw) · 300 · lh 130% · ls 0.01em',                      tablet: 'calc(16 / 768 * 100vw) · 300 · lh 130% · ls 0.01em',                       mobile: 'calc(20 / 375 * 100vw) · 300 · lh 130% · ls 0.01em' } },
          { class: '.body-text-4',    spec: { desktopXl: '24px · fixed · 300 · lh 140% · ls 0.01em',                    desktop: 'calc(18 / 1440 * 100vw) · 300 · lh 140% · ls 0.01em',                      tablet: 'calc(14 / 768 * 100vw) · 300 · lh 140% · ls 0.01em',                       mobile: 'calc(16 / 375 * 100vw) · 300 · lh 140% · ls 0.01em' } },
          { class: '.body-text-5',    spec: { desktopXl: '18.67px · fixed · 400 · lh 150% · ls 0.01em',                 desktop: 'calc(14 / 1440 * 100vw) · 400 · lh 150% · ls 0.01em',                      tablet: 'calc(14 / 768 * 100vw) · 400 · lh 150% · ls 0.01em',                       mobile: 'calc(14 / 375 * 100vw) · 400 · lh 150% · ls 0.01em' } },
          { class: '.body-text-caps', spec: { desktopXl: '16px · fixed · 300 · lh 100% · ls 0.04em · uppercase',        desktop: 'calc(12 / 1440 * 100vw) · 300 · lh 100% · ls 0.04em · uppercase',          tablet: 'calc(11 / 768 * 100vw) · 300 · lh 100% · ls 0.04em · uppercase',           mobile: 'calc(13 / 375 * 100vw) · 300 · lh 100% · ls 0.04em · uppercase' } },
        ],
      },
      {
        label: 'Tokens',
        items: [
          { token: '--fs-body-1',    spec: { desktopXl: '42.67px · fixed', desktop: 'calc(32 / 1440 * 100vw)', tablet: 'calc(20 / 768 * 100vw)', mobile: 'calc(24 / 375 * 100vw)' } },
          { token: '--fs-body-2',    spec: { desktopXl: '34.67px · fixed', desktop: 'calc(26 / 1440 * 100vw)', tablet: 'calc(20 / 768 * 100vw)', mobile: 'calc(22 / 375 * 100vw)' } },
          { token: '--fs-body-3',    spec: { desktopXl: '29.33px · fixed', desktop: 'calc(22 / 1440 * 100vw)', tablet: 'calc(16 / 768 * 100vw)', mobile: 'calc(20 / 375 * 100vw)' } },
          { token: '--fs-body-4',    spec: { desktopXl: '24px · fixed',    desktop: 'calc(18 / 1440 * 100vw)', tablet: 'calc(14 / 768 * 100vw)', mobile: 'calc(16 / 375 * 100vw)' } },
          { token: '--fs-body-5',    spec: { desktopXl: '18.67px · fixed', desktop: 'calc(14 / 1440 * 100vw)', tablet: 'calc(14 / 768 * 100vw)', mobile: 'calc(14 / 375 * 100vw)' } },
          { token: '--fs-body-caps', spec: { desktopXl: '16px · fixed',    desktop: 'calc(12 / 1440 * 100vw)', tablet: 'calc(11 / 768 * 100vw)', mobile: 'calc(13 / 375 * 100vw)' } },
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
      'A geometric sans-serif optimized for UI and display sizes. ' +
      'Primary weights: Light (300) and Regular (400). Use CSS tokens to reference font family and weight.',
    groups: [
      {
        label: 'Weights',
        items: [
          { token: '--fw-light',     spec: '300 · Light',           note: 'Primary' },
          {                          spec: '300 · Light · Italic',  note: 'Primary' },
          { token: '--fw-regular',   spec: '400 · Regular',         note: 'Primary' },
          {                          spec: '400 · Regular · Italic' },
          { token: '--fw-medium',    spec: '500 · Medium' },
          { token: '--fw-semibold',  spec: '600 · SemiBold' },
          { token: '--fw-bold',      spec: '700 · Bold' },
          { token: '--fw-extrabold', spec: '800 · ExtraBold' },
          { token: '--fw-black',     spec: '900 · Black' },
          {                          spec: '900 · Black · Italic' },
        ],
      },
      {
        label: 'Tokens',
        items: [
          { token: '--font-inter-display', spec: "'Figtree', sans-serif",  note: 'Font family' },
          { token: '--fw-light',           spec: '300', note: 'Primary' },
          { token: '--fw-regular',         spec: '400', note: 'Primary' },
          { token: '--fw-medium',          spec: '500' },
          { token: '--fw-semibold',        spec: '600' },
          { token: '--fw-bold',            spec: '700' },
          { token: '--fw-extrabold',       spec: '800' },
          { token: '--fw-black',           spec: '900' },
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
          { token: '--fw-light',     spec: '300', note: 'Primary' },
          { token: '--fw-regular',   spec: '400', note: 'Primary' },
          { token: '--fw-medium',    spec: '500' },
          { token: '--fw-semibold',  spec: '600' },
          { token: '--fw-bold',      spec: '700' },
          { token: '--fw-extrabold', spec: '800' },
          { token: '--fw-black',     spec: '900' },
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
          { token: '--space-1',  spec: { desktopXl: '5.33px · fixed',    desktop: 'calc(4 / 1440 * 100vw) · 4px',    tablet: 'calc(4 / 1440 * 100vw) · ≈ 2.84px',    mobile: 'calc(4 / 1440 * 100vw) · 1.60px'   } },
          { token: '--space-2',  spec: { desktopXl: '10.67px · fixed',   desktop: 'calc(8 / 1440 * 100vw) · 8px',    tablet: 'calc(8 / 1440 * 100vw) · ≈ 5.69px',    mobile: 'calc(8 / 1440 * 100vw) · 3.20px'   } },
          { token: '--space-3',  spec: { desktopXl: '16px · fixed',      desktop: 'calc(12 / 1440 * 100vw) · 12px',  tablet: 'calc(12 / 1440 * 100vw) · ≈ 8.53px',   mobile: 'calc(12 / 1440 * 100vw) · 4.80px'  } },
          { token: '--space-4',  spec: { desktopXl: '21.33px · fixed',   desktop: 'calc(16 / 1440 * 100vw) · 16px',  tablet: 'calc(16 / 1440 * 100vw) · ≈ 11.38px',  mobile: 'calc(16 / 1440 * 100vw) · 6.40px'  }, note: 'Base unit' },
          { token: '--space-5',  spec: { desktopXl: '26.67px · fixed',   desktop: 'calc(20 / 1440 * 100vw) · 20px',  tablet: 'calc(20 / 1440 * 100vw) · ≈ 14.22px',  mobile: 'calc(20 / 1440 * 100vw) · 8.00px'  } },
          { token: '--space-6',  spec: { desktopXl: '32px · fixed',      desktop: 'calc(24 / 1440 * 100vw) · 24px',  tablet: 'calc(24 / 1440 * 100vw) · ≈ 17.07px',  mobile: 'calc(24 / 1440 * 100vw) · 9.60px'  } },
          { token: '--space-8',  spec: { desktopXl: '42.67px · fixed',   desktop: 'calc(32 / 1440 * 100vw) · 32px',  tablet: 'calc(32 / 1440 * 100vw) · ≈ 22.76px',  mobile: 'calc(32 / 1440 * 100vw) · 12.80px' } },
          { token: '--space-10', spec: { desktopXl: '53.33px · fixed',   desktop: 'calc(40 / 1440 * 100vw) · 40px',  tablet: 'calc(40 / 1440 * 100vw) · ≈ 28.44px',  mobile: 'calc(40 / 1440 * 100vw) · 16.00px' } },
          { token: '--space-12', spec: { desktopXl: '64px · fixed',      desktop: 'calc(48 / 1440 * 100vw) · 48px',  tablet: 'calc(48 / 1440 * 100vw) · ≈ 34.13px',  mobile: 'calc(48 / 1440 * 100vw) · 19.20px' } },
          { token: '--space-16', spec: { desktopXl: '85.33px · fixed',   desktop: 'calc(64 / 1440 * 100vw) · 64px',  tablet: 'calc(64 / 1440 * 100vw) · ≈ 45.51px',  mobile: 'calc(64 / 1440 * 100vw) · 25.60px' } },
          { token: '--space-20', spec: { desktopXl: '106.67px · fixed',  desktop: 'calc(80 / 1440 * 100vw) · 80px',  tablet: 'calc(80 / 1440 * 100vw) · ≈ 56.89px',  mobile: 'calc(80 / 1440 * 100vw) · 32.00px' } },
          { token: '--space-24', spec: { desktopXl: '128px · fixed',     desktop: 'calc(96 / 1440 * 100vw) · 96px',  tablet: 'calc(96 / 1440 * 100vw) · ≈ 68.27px',  mobile: 'calc(96 / 1440 * 100vw) · 38.40px' } },
          { token: '--space-32', spec: { desktopXl: '170.67px · fixed',  desktop: 'calc(128 / 1440 * 100vw) · 128px', tablet: 'calc(128 / 1440 * 100vw) · ≈ 91.02px', mobile: 'calc(128 / 1440 * 100vw) · 51.20px' } },
          { token: '--space-40', spec: { desktopXl: '213.33px · fixed',  desktop: 'calc(160 / 1440 * 100vw) · 160px', tablet: 'calc(160 / 1440 * 100vw) · ≈ 113.78px', mobile: 'calc(160 / 1440 * 100vw) · 64.00px' } },
        ],
      },
    ],
  },

  /* ── 05-B COMPONENT MOBILE OVERRIDES ──────────── */
  {
    number: '05-B',
    title: 'Mobile Overrides',
    subtitle: 'Component Typography',
    description:
      'Component-level font-size overrides at mobile (≤ 575.98px) to match plastic.design proportions. ' +
      'These override the global token values for specific elements that need tighter sizing on small screens.',
    groups: [
      {
        label: 'Home',
        items: [
          { class: '.home-hero__title',          spec: { desktop: 'var(--fs-h1)', tablet: 'var(--fs-h1)', mobile: 'var(--fs-h3) · ~34px @ 375' }, note: 'Hero title' },
          { class: '.home-skills__title',        spec: { desktop: 'var(--fs-body-1)', tablet: 'var(--fs-body-3)', mobile: 'var(--fs-body-3)' }, note: 'Skills section' },
          { class: '.home-marquee__text',        spec: { desktop: 'var(--fs-h2)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h4)' }, note: 'Marquee' },
          { class: '.works-slider__title',       spec: { desktop: 'var(--fs-h2)', tablet: 'var(--fs-h4)', mobile: 'var(--fs-body-4)' }, note: 'SELECTED WORKS' },
        ],
      },
      {
        label: 'About',
        items: [
          { class: '.about-title__content',       spec: { desktop: 'var(--fs-h2)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h3)' }, note: 'Page title' },
          { class: '.about-image-text__heading',   spec: { desktop: 'var(--fs-h3)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h4)' }, note: 'Section heading' },
          { class: '.about-text-left__heading',    spec: { desktop: 'var(--fs-h2)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h3)' }, note: 'Center heading' },
          { class: '.about-text-right__heading',   spec: { desktop: 'var(--fs-h3)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h4)' }, note: 'Right heading' },
          { class: '.about-awards__heading',       spec: { desktop: 'var(--fs-h4)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h4)' }, note: 'Awards title' },
          { class: '.about-compliance__title',     spec: { desktop: 'var(--fs-h5)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h5)' }, note: 'Compliance title' },
          { class: '.about-clients__name',         spec: { desktop: 'var(--fs-h1)', tablet: 'var(--fs-h1)', mobile: 'var(--fs-h4)' }, note: 'Client names' },
        ],
      },
      {
        label: 'Contact',
        items: [
          { class: '.contact-title',              spec: { desktop: 'var(--fs-h2)', tablet: 'var(--fs-h2)', mobile: 'var(--fs-h2) · ~61px @ 500 · uppercase · lh 116%' }, note: 'Page title' },
          { class: '.contact-description',         spec: { desktop: 'var(--fs-body-2)', tablet: 'var(--fs-body-2)', mobile: 'var(--fs-body-2) · ~29px @ 500 · fw 300' }, note: 'Description text' },
          { class: '.form-placeholder / input / textarea', spec: { desktop: 'fvw(24)', tablet: 'inherit', mobile: 'var(--fs-body-3) · ~27px @ 500' }, note: 'Form inputs' },
          { class: '.form-checkbox__text',         spec: { desktop: 'var(--fs-body-5)', tablet: 'var(--fs-body-5)', mobile: 'var(--fs-body-4) · ~21px @ 500' }, note: 'Checkbox label' },
          { class: '.submit-recaptcha',            spec: { desktop: 'var(--fs-body-5)', tablet: 'var(--fs-body-5)', mobile: 'var(--fs-body-5)' }, note: 'reCAPTCHA text' },
          { class: '.button--xl span',             spec: { desktop: 'var(--fs-h5)', tablet: 'var(--fs-h3)', mobile: 'var(--fs-body-3) · ~27px @ 500' }, note: 'Submit button' },
          { class: '.contact-block__text',         spec: { desktop: 'var(--fs-h6)', tablet: 'var(--fs-h6)', mobile: 'var(--fs-body-4) · ~21px @ 500' }, note: 'Info block text' },
          { class: '.contact-social__list a',      spec: { desktop: 'var(--fs-h3)', tablet: 'var(--fs-h3)', mobile: 'var(--fs-h3) · ~45px @ 500' }, note: 'Social links' },
        ],
      },
      {
        label: 'Navigation',
        items: [
          { class: '.nav__primary a',             spec: { desktop: 'var(--fs-h3)', tablet: 'calc(60 / 1024 * 100vw)', mobile: 'calc(42 / 375 * 100vw) · ~56px @ 500' }, note: 'Menu links' },
          { class: '.nav__secondary a',           spec: { desktop: 'var(--fs-body-5)', tablet: 'var(--fs-body-3)', mobile: 'calc(15 / 375 * 100vw) · ~20px @ 500' }, note: 'Social links' },
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
      '5 sizes (XS / S / M / L / XL) · 2 variants (Default / Secondary). ' +
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
          { class: '.button--xs', spec: '0.76vw · h 1.94vw · px 1.39vw' },
          { class: '.button--s',  spec: '0.73vw · h 2.20vw · px 1.92vw' },
          { class: '.button--m',  spec: '1.01vw · h 2.66vw · px 1.92vw' },
          { class: '.button--l',  spec: '1.19vw · h 3.94vw · px 1.92vw' },
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

  /* ── 08 COLORS ──────────────────────────────────── */
  {
    number: '08',
    title: 'Color Palette',
    subtitle: 'Colors',
    description:
      'Minimal high-contrast color system. Base colors for surface and text, ' +
      'functional neutrals for borders and secondary content, a signature accent, ' +
      'and theme-aware tokens that adapt across light and dark modes.',
    groups: [
      {
        label: 'Base Colors',
        items: [
          { token: '$m-white',     spec: '#FFFFFF · Pure white for backgrounds and primary highlights' },
          { token: '$m-black',     spec: '#000000 · Solid black for typography and deep shadows' },
          { token: '$m-deep-grey', spec: '#111111 · Charcoal grey for dark mode elements' },
        ],
      },
      {
        label: 'Surface & Borders',
        items: [
          { token: '$m-grey-light',  spec: '#F5F5F5 · Off-white for section dividers and card backgrounds' },
          { token: '$m-grey-medium', spec: '#E2E2E2 · Neutral grey for structural borders and grid lines' },
          { token: '$m-grey-dark',   spec: '#888888 · Muted grey for metadata, captions, and secondary info' },
        ],
      },
      {
        label: 'Accent & Functional',
        items: [
          { token: '$m-accent', spec: '#FF4D00 · Signature vibrant orange-red for high-energy accents' },
          { spec: '#FB6262 · Error red for validation states' },
        ],
      },
      {
        label: 'Theme Tokens (CSS Custom Properties)',
        items: [
          { token: '--foreground',       spec: 'Light: #000 · Dark: #FFF' },
          { token: '--foreground-muted', spec: 'Light: rgba(0,0,0,0.45) · Dark: rgba(255,255,255,0.45)' },
          { token: '--foreground-dim',   spec: 'Light: rgba(0,0,0,0.2) · Dark: rgba(255,255,255,0.2)' },
          { token: '--background',       spec: '#FFFFFF' },
        ],
      },
      {
        label: 'Material Effects',
        items: [
          { token: '$m-glass-bg',     spec: 'rgba(255,255,255,0.7) · Glassmorphism background' },
          { token: '$m-glass-border', spec: 'rgba(255,255,255,0.3) · Glassmorphism border' },
          { token: '$m-shadow-soft',  spec: '0 10px 30px rgba(0,0,0,0.05) · Soft elevation shadow' },
        ],
      },
    ],
  },

  /* ── 09 GRID & LAYOUT ──────────────────────────── */
  {
    number: '09',
    title: 'Breakpoints & Gutters',
    subtitle: 'Grid & Layout',
    description:
      'Four-tier responsive breakpoint system. Fluid vw-based spacing on desktop ' +
      'transitions to fixed px values on smaller screens. Above 1920px, sections ' +
      'stop growing and center-align (max-width: 1920px).',
    groups: [
      {
        label: 'Breakpoints',
        items: [
          { spec: 'Mobile · ≤ 575px',           note: 'Fixed px values' },
          { spec: 'Tablet · 576 – 1024px',      note: 'Fixed px values' },
          { spec: 'Desktop · 1025 – 1920px',    note: 'Fluid vw values' },
          { spec: 'Desktop XL · 1921px +',      note: 'max-width: 1920px · centered' },
        ],
      },
      {
        label: 'Media Queries',
        items: [
          { spec: '@media (max-width: 1023.98px) · Tablet and below → fixed px overrides' },
          { spec: '@media (max-width: 575.98px)  · Mobile only → tightest spacing' },
          { spec: '@media (min-width: 1921px)    · Desktop XL → max-width: 1920px · margin: 0 auto' },
        ],
      },
      {
        label: 'Side Gutters',
        items: [
          { token: '$gutter-desktop', spec: '3.3333vw · 48px @ 1440 · Uses $space-12' },
          { token: '$gutter-tablet',  spec: '20px · Fixed' },
          { token: '$gutter-mobile',  spec: '16px · Fixed' },
        ],
      },
    ],
  },

  /* ── 10 EFFECTS ─────────────────────────────────── */
  {
    number: '10',
    title: 'Material & Motion',
    subtitle: 'Effects',
    description:
      'Glassmorphism effects, elevation shadows, and standardized easing curves ' +
      'give the interface dimensional depth and fluid motion. All transition ' +
      'durations and curves are consistent across components.',
    groups: [
      {
        label: 'Transitions',
        items: [
          { spec: 'Theme transition · 0.4s ease · Used for bg/fg/border color shifts' },
          { spec: 'Body color · 0.6s ease-out · Global text color transition' },
          { spec: 'Button fill · 0.45s cubic-bezier(0.52, 0.24, 0.08, 1) · Hover fill animation' },
          { spec: 'Placeholder float · 0.3s ease · Form label animation' },
        ],
      },
      {
        label: 'Border Radius',
        items: [
          { spec: '0px · Sharp edges — default for containers' },
          { spec: '4px · Subtle rounding — spec labels, spacing bars' },
          { spec: '6px · Moderate rounding — card containers, button demos' },
          { spec: '9999px · Full pill — buttons, badges, tags' },
          { spec: '50% · Circle — theme toggle, avatar containers' },
        ],
      },
      {
        label: 'Elevation & Glass',
        items: [
          { token: '$m-shadow-soft',  spec: '0 10px 30px rgba(0,0,0,0.05) · Soft ambient shadow' },
          { token: '$m-glass-bg',     spec: 'rgba(255,255,255,0.7) · Glass surface' },
          { token: '$m-glass-border', spec: 'rgba(255,255,255,0.3) · Glass edge' },
          { spec: 'backdrop-filter: blur(20px) · Glass blur effect' },
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem('cm-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cm-theme', theme);
  }, [theme]);

  // Sync footer theme with the style-guide theme
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>('.footer');
    if (footer) footer.dataset.theme = theme;
  }, [theme]);

  // Restore footer to its original dark theme on page unmount
  useEffect(() => {
    return () => {
      const footer = document.querySelector<HTMLElement>('.footer');
      if (footer) footer.dataset.theme = 'dark';
    };
  }, []);

  // Detect breakpoints using the same criteria as CSS media queries
  // matchMedia fires only once when a boundary is crossed → no resize debounce needed
  useEffect(() => {
    const queries: [MediaQueryList, Breakpoint][] = [
      [window.matchMedia('(min-width: 1921px)'), 'desktopXl'],
      [window.matchMedia('(min-width: 1025px)'), 'desktop'],
      [window.matchMedia('(min-width: 576px)'),  'tablet'],
    ];

    function detect() {
      for (const [mq, bp] of queries) {
        if (mq.matches) { setBreakpoint(bp); return; }
      }
      setBreakpoint('mobile');
    }

    detect(); // initial detection

    queries.forEach(([mq]) => mq.addEventListener('change', detect));
    return () => queries.forEach(([mq]) => mq.removeEventListener('change', detect));
  }, []);

  const toggleBtn = (
    <button
      type="button"
      className="cm-theme-toggle"
      data-theme={theme}
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
  );

  return (
    <>
      {/* Portal: escapes the page-transition-container stacking context and mounts directly on body */}
      {mounted && createPortal(toggleBtn, document.body)}

    <div className="cm-root" data-theme={theme}>
      <article className="cd-doc">

        {/* Document head */}
        <header className="cd-doc__head">
          <h1 className="cd-doc__title">CSS Style Manual</h1>
          <p className="cd-doc__meta">Creative Moon Design System · v1.0</p>

          {/* Breakpoint selector */}
          <div className="cd-bp-selector" role="group" aria-label="Breakpoint">
            {(['desktopXl', 'desktop', 'tablet', 'mobile'] as const).map((bp) => (
              <button
                key={bp}
                type="button"
                className={`cd-bp-btn${breakpoint === bp ? ' is-active' : ''}`}
                onClick={() => setBreakpoint(bp)}
              >
                {BP_LABEL[bp]}
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
    </>
  );
}
