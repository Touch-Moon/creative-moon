/**
 * TechStack — small 24px B&W icon badges with label beside.
 *
 * Accepts free-form strings (from Sanity). Each item is normalized and
 * matched against Simple Icons via an alias table; unmatched items
 * render as text-only badges so we never break the list.
 */
import * as icons from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';
import './TechStack.scss';

// ── Alias table ───────────────────────────────────────────────────
// Keys are *normalized* (lower-case, strip non-alphanumeric). Values
// are the Simple Icons export suffix (e.g. 'react' → icons.siReact).
// Extend as you onboard more stacks.
const ALIAS: Record<string, string> = {
  // Frameworks / languages
  react: 'react',
  nextjs: 'nextdotjs',
  nextdotjs: 'nextdotjs',
  typescript: 'typescript',
  ts: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
  nodejs: 'nodedotjs',
  node: 'nodedotjs',
  html: 'html5',
  html5: 'html5',
  css: 'css',
  scss: 'sass',
  sass: 'sass',

  // 3D / graphics
  threejs: 'threedotjs',
  threedotjs: 'threedotjs',
  reactthreefiber: 'react',       // no dedicated icon — reuse React
  r3f: 'react',
  reactthreedrei: 'react',
  reactthreepostprocessing: 'react',
  glsl: 'opengl',
  opengl: 'opengl',
  webgl: 'webgl',

  // Styling / tooling
  tailwindcss: 'tailwindcss',
  tailwind: 'tailwindcss',
  framermotion: 'framer',         // simple-icons exports it as 'framer'
  framer: 'framer',
  motion: 'framer',
  gsap: 'greensock',
  greensock: 'greensock',

  // Build / bundlers
  vite: 'vite',
  webpack: 'webpack',
  turbopack: 'vercel',
  vercel: 'vercel',
  createreactapp: 'react',

  // Backend / data
  sanity: 'sanity',
  supabase: 'supabase',
  firebase: 'firebase',
  stripe: 'stripe',
  resend: 'resend',
  shopify: 'shopify',

  // Design
  figma: 'figma',
  adobexd: 'adobexd',
  illustrator: 'adobeillustrator',
  photoshop: 'adobephotoshop',

  // Misc
  github: 'github',
  vscode: 'visualstudiocode',
  jest: 'jest',
  prismic: 'prismic',
  contentful: 'contentful',
};

// Strip brand-y punctuation so "Three.js r160" matches "threejs".
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/\br\d+[a-z0-9]*\b/g, '') // version markers like "r160"
    .replace(/[^a-z0-9]/g, '');
}

function lookup(label: string): SimpleIcon | null {
  const norm = normalize(label);
  if (!norm) return null;

  // Try alias first
  const aliased = ALIAS[norm];
  const target = aliased ?? norm;
  const exportName = `si${target.charAt(0).toUpperCase()}${target.slice(1)}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const found = (icons as any)[exportName];
  return found && typeof found.svg === 'string' ? (found as SimpleIcon) : null;
}

// ── Component ─────────────────────────────────────────────────────
export default function TechStack({
  items,
  theme = 'light',
}: {
  items: string[];
  /** Controls icon color: 'light' = black icons, 'dark' = white icons */
  theme?: 'light' | 'dark';
}) {
  if (!items?.length) return null;

  return (
    <ul className={`tech-stack tech-stack--${theme}`} aria-label="Tech stack">
      {items.map((raw, i) => {
        const label = raw.trim();
        if (!label) return null;
        const icon = lookup(label);
        return (
          <li key={`${label}-${i}`} className="tech-stack__item">
            {icon ? (
              <span
                className="tech-stack__icon"
                aria-hidden="true"
                // Simple Icons ships SVG strings — inject so we can
                // colorize via currentColor (fill is hard-coded in the
                // string, but we override with CSS below).
                dangerouslySetInnerHTML={{ __html: icon.svg }}
              />
            ) : (
              <span className="tech-stack__icon tech-stack__icon--empty" aria-hidden="true" />
            )}
            <span className="tech-stack__label">{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
