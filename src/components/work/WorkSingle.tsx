'use client';
/**
 * WorkSingle — /work/{slug} single page
 * Structure: .work__top → .work__hero → .work__text → .work__modules → WorkRelated
 * Module system: mediaBlock / textBlock / spacerBlock (3-module system)
 */
import { useState, useRef, useEffect } from 'react';
import { m, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import type {
  WorkSingleData,
  ModuleType,
  MediaBlock,
  TextBlock,
  SpacerBlock,
  SelectedWorkSanity,
} from '@/sanity/queries';
import { sanityImg } from '@/sanity/queries';
import WorkRelated from './WorkRelated';
import TechStack from '@/components/common/TechStack';
import './WorkSingle.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];
const EASE_INOUT: BezierDefinition = [0.76, 0, 0.24, 1];

// ── Title word clip-path + slide variants ───────────────────────
const clipVariants: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
  visible: (i: number) => ({
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: { duration: 1.2, ease: EASE_OUT, delay: i * 0.08 },
  }),
};

const slideVariants: Variants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.2, ease: EASE_OUT, delay: i * 0.08 },
  }),
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  }),
};

// ── Dummy single data ─────────────────────────────────────────────
const DUMMY_SINGLE: WorkSingleData = {
  _id: 'dummy',
  title: 'Hyundai Annual Convention.',
  slug: { current: 'hyundai' },
  year: '2025',
  subtitle: 'Designing the visual concept and identity for a large-scale brand experience event.',
  overview:
    'Hyundai Motor Company approached us to conceptualize and design the full visual identity for their annual convention — a gathering of thousands of dealers, partners, and stakeholders.',
  services: ['Strategic Design', 'Visual Identity', 'Motion Design', 'Experiences'],
  siteUrl: 'https://www.hyundai.com',
  githubUrl: undefined,
  categories: [],
  heroMedia: { type: 'image', image: undefined },
  modules: [
    { _type: 'textBlock', _key: 'm1', heading: 'Challenge',
      body: 'The convention needed to feel both premium and approachable — reflecting Hyundai\'s ambition while remaining human-centered.', columnWidth: 7 } as TextBlock,
    { _type: 'mediaBlock', _key: 'm2', layout: '1col', fullBleed: true, image1: undefined } as unknown as MediaBlock,
    { _type: 'mediaBlock', _key: 'm3', layout: '2col', image1: undefined, image2: undefined } as unknown as MediaBlock,
    { _type: 'textBlock', _key: 'm4', heading: 'Outcome',
      body: 'The final identity was implemented across 14 event spaces and 200+ assets.', columnWidth: 7 } as TextBlock,
    { _type: 'mediaBlock', _key: 'm5', layout: '1col', image1: undefined } as unknown as MediaBlock,
  ],
};

// ── Placeholder URL utility ──────────────────────────────────────
function ph(w: number, h: number, n = '') {
  return `https://placehold.co/${w}x${h}/1a1a1a/555555${n ? `?text=${encodeURIComponent(n)}` : ''}`;
}
const isPlaceholder = (src: string) => src.includes('placehold.co');

// ── Viewport-aware Video (play at 50% entry, pause when out of view) ─
function ViewportVideo({ src, style }: { src: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      style={{ width: '100%', height: 'auto', display: 'block', ...style }}
    />
  );
}

// ── Device Config ─────────────────────────────────────────────────
// All values are percentage-based — responsive regardless of column width
// Note: mobile.frameRatio — adjust after verifying the actual PNG dimensions
const DEVICE_CONFIG = {
  desktop: {
    src: null,                      // No PNG — pure CSS frame
    frameRatio: null,               // height auto (follows video size)
    paddingTopBottom: 13.54,        // (680-413)/2 ÷ 986 × 100
  },
  tablet: {
    src: '/images/devices/ipad.webp',
    frameRatio: '1308 / 931',       // Measured from PNG
    screen: {
      left:         4.09,
      top:          5.49,
      width:        91.82,
      aspectRatio:  '1201 / 830',
      borderRadius: 2.0,
    },
  },
  mobile: {
    src: '/images/devices/iphone.webp',
    frameRatio: '440 / 916',        // Measured from PNG (881×1834 @2x)
    screen: {
      left:         4.09,           // (881-808)/2 ÷ 881 → (440-404)/2 ÷ 440
      top:          2.24,           // (1834-1750)/2 ÷ 1834 → (916-875)/2 ÷ 916
      width:        91.82,          // 808 ÷ 881 → 404 ÷ 440
      aspectRatio:  '808 / 1750',   // Video mask aspect ratio
      borderRadius: 13.61,          // 110 ÷ 808
    },
  },
} as const;

const BG_COLORS: Record<string, string> = {
  dark:  '#2E2F32',
  light: '#E8E9ED',
  white: '#FFFFFF',
};

type DeviceSkin = 'none' | 'desktop' | 'tablet' | 'mobile';
type DeviceBg   = 'transparent' | 'dark' | 'light' | 'white' | 'image';

// ── Device Mockup wrapper ─────────────────────────────────────────
function DeviceMockup({
  skin,
  bg = 'transparent',
  bgImageUrl,
  children,
}: {
  skin: Exclude<DeviceSkin, 'none'>;
  bg?: DeviceBg;
  bgImageUrl?: string;
  children: React.ReactNode;
}) {
  const bgColor  = bg === 'image' ? undefined : BG_COLORS[bg];
  const bgStyle  = bgImageUrl && bg === 'image'
    ? { backgroundImage: `url(${bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'top' }
    : bgColor ? { backgroundColor: bgColor }
    : {};

  // ── Desktop: pure CSS frame without PNG ─────────────────────────
  if (skin === 'desktop') {
    const { paddingTopBottom } = DEVICE_CONFIG.desktop;
    return (
      <div className="dm dm--desktop" style={{ paddingTop: `${paddingTopBottom}%`, paddingBottom: `${paddingTopBottom}%`, ...bgStyle }}>
        <div className="dm__content">
          {children}
        </div>
      </div>
    );
  }

  // ── Tablet / Mobile: PNG frame ──────────────────────────────────
  const cfg = DEVICE_CONFIG[skin];
  const { frameRatio, screen } = cfg as typeof DEVICE_CONFIG.tablet;

  return (
    <div className={`dm dm--${skin}`} style={bgStyle}>
      {/* Device wrapper (max-width + centered) */}
      <div className="dm__device" style={{ aspectRatio: frameRatio }}>
        {/* [1] Video/image content */}
        <div
          className="dm__screen"
          style={{
            left:         `${screen.left}%`,
            top:          `${screen.top}%`,
            width:        `${screen.width}%`,
            aspectRatio:  screen.aspectRatio,
            borderRadius: `${screen.borderRadius}%`,
          }}
        >
          {children}
        </div>
        {/* [2] Device frame PNG — rendered on top */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="dm__frame" src={cfg.src!} alt="" aria-hidden="true" />
      </div>
    </div>
  );
}

// ── Slot renderer ─────────────────────────────────────────────────
function MediaSlot({
  videoUrl, imageField, fallback, w = 900, sizes,
  skin, skinBg, skinBgImageUrl,
}: {
  videoUrl?: string;
  imageField?: { asset?: { url?: string } };
  fallback?: string;
  w?: number;
  /** next/image sizes string — injected by ModuleMediaBlock based on layout */
  sizes?: string;
  skin?: DeviceSkin;
  skinBg?: DeviceBg;
  skinBgImageUrl?: string;
}) {
  const media = videoUrl
    ? <ViewportVideo src={videoUrl} />
    : (() => {
        // Apply Sanity CDN transform (auto=format → auto-serve WebP/AVIF, fit=max, width, quality)
        const rawUrl = imageField?.asset?.url ?? null;
        const src = sanityImg(rawUrl, w) ?? fallback ?? ph(w, Math.round(w * 0.75));
        return <Image src={src} alt="" width={w} height={Math.round(w * 0.75)}
          unoptimized={isPlaceholder(src)} quality={80}
          sizes={sizes ?? '(max-width: 575px) 100vw, 90vw'}
          style={{ width: '100%', height: 'auto' }} />;
      })();

  if (skin && skin !== 'none') {
    return (
      <DeviceMockup skin={skin} bg={skinBg} bgImageUrl={skinBgImageUrl}>
        {media}
      </DeviceMockup>
    );
  }
  return media;
}

// ── Module renderer: Media Block ─────────────────────────────────
function ModuleMediaBlock({ mod, delay = 0 }: { mod: MediaBlock; delay?: number }) {
  const layout = mod.layout || '1col';
  const bleed = mod.fullBleed ?? false;
  const spacing = mod.spacing || 'default';
  const spacingCls = spacing === 'tight' ? ' wm--sp-tight' : spacing === 'none' ? ' wm--sp-none' : spacing === 'no-gap' ? ' wm--sp-no-gap' : '';

  // 1-column
  if (layout === '1col') {
    const wrapCls = `wm wm--media wm--animate${bleed ? ' wm--bleed' : ''}${spacingCls}`;
    return (
      <div className={wrapCls} style={{ '--anim-delay': `${delay}ms` } as React.CSSProperties}>
        <MediaSlot videoUrl={mod.video1?.asset?.url} imageField={mod.image1} w={1440}
          sizes="(max-width: 575px) 100vw, (max-width: 1023px) 100vw, 90vw"
          skin={mod.skin1} skinBg={mod.skinBg1} skinBgImageUrl={mod.skinBgImage1?.asset?.url} />
      </div>
    );
  }

  // Multi-column — configure sizes
  const is3 = layout === '3col';
  // narrow-wide / wide-narrow have different ratios per column, so specify individually
  const sizesMain: string = is3
    ? '(max-width: 575px) 100vw, 33vw'
    : layout === '2col-narrow-wide'
      ? '(max-width: 575px) 100vw, 35vw'   // narrow col
      : layout === '2col-wide-narrow'
        ? '(max-width: 575px) 100vw, 60vw'  // wide col
        : '(max-width: 575px) 100vw, (max-width: 1023px) 50vw, 48vw'; // 2col equal
  const sizesSub: string = is3
    ? '(max-width: 575px) 100vw, 33vw'
    : layout === '2col-narrow-wide'
      ? '(max-width: 575px) 100vw, 60vw'   // wide col
      : layout === '2col-wide-narrow'
        ? '(max-width: 575px) 100vw, 35vw' // narrow col
        : '(max-width: 575px) 100vw, (max-width: 1023px) 50vw, 48vw';

  const layoutCls = is3 ? 'wm--3col' :
    layout === '2col-narrow-wide' ? 'wm--2col wm--2col-nw' :
    layout === '2col-wide-narrow' ? 'wm--2col wm--2col-wn' :
    'wm--2col';

  const wrapCls = `wm ${layoutCls} wm--animate${bleed ? ' wm--bleed' : ''}${spacingCls}`;

  return (
    <div className={wrapCls} style={{ '--anim-delay': `${delay}ms` } as React.CSSProperties}>
      <div className="wm__col">
        <MediaSlot videoUrl={mod.video1?.asset?.url} imageField={mod.image1}
          sizes={sizesMain}
          skin={mod.skin1} skinBg={mod.skinBg1} skinBgImageUrl={mod.skinBgImage1?.asset?.url} />
      </div>
      <div className="wm__col">
        <MediaSlot videoUrl={mod.video2?.asset?.url} imageField={mod.image2} fallback={ph(900, 675, '2')}
          sizes={sizesSub}
          skin={mod.skin2} skinBg={mod.skinBg2} skinBgImageUrl={mod.skinBgImage2?.asset?.url} />
      </div>
      {is3 && (
        <div className="wm__col">
          <MediaSlot videoUrl={mod.video3?.asset?.url} imageField={mod.image3} fallback={ph(900, 675, '3')}
            sizes="(max-width: 575px) 100vw, 33vw"
            skin={mod.skin3} skinBg={mod.skinBg3} skinBgImageUrl={mod.skinBgImage3?.asset?.url} />
        </div>
      )}
    </div>
  );
}

// ── Module renderer: Text Block ──────────────────────────────────
function ModuleTextBlock({ mod, delay = 0 }: { mod: TextBlock; delay?: number }) {
  const layout = mod.layout || 'default';
  const theme = mod.theme || 'light';
  const col = mod.columnWidth || 7;
  const offset = mod.offsetCols || 0;
  const centered = mod.centered ?? false;
  const pt = mod.paddingTop || 'default';

  const ptCls = pt === 'large' ? ' wm--pt-lg' : pt === 'none' ? ' wm--pt-none' : '';
  const themeCls = theme === 'dark' ? ' wm--dark' : '';
  const centerCls = centered ? ' wm--text-center' : '';
  const offsetStyle = offset > 0 ? { marginLeft: `${(offset / 12) * 100}%` } : undefined;

  // ── Split layout: body left + large heading right ────────────────
  if (layout === 'split') {
    return (
      <div className={`wm wm--text wm--text-split wm--animate${ptCls}${themeCls}`}
        style={{ '--anim-delay': `${delay}ms` } as React.CSSProperties}>
        <div className="wm__split-body">
          {mod.body && <p className="wm__body body-text-2">{mod.body}</p>}
        </div>
        <div className="wm__split-heading">
          {mod.heading && <p className="wm__heading-lg">{mod.heading}</p>}
        </div>
      </div>
    );
  }

  // ── Default layout ───────────────────────────────────────────────
  return (
    <div className={`wm wm--text wm--animate${ptCls}${centerCls}${themeCls}`}
      style={{ '--anim-delay': `${delay}ms`, ...offsetStyle } as React.CSSProperties}>
      <div className={`wm__text-col wm__text-col--${col}`}>
        {mod.heading && <p className="wm__heading body-text-caps">{mod.heading}</p>}
        {mod.body && <p className="wm__body body-text-2">{mod.body}</p>}
      </div>
    </div>
  );
}

// ── Module renderer: Spacer ──────────────────────────────────────
function ModuleSpacer({ mod }: { mod: SpacerBlock }) {
  const size = mod.size || 'medium';
  return <div className={`wm wm--spacer wm--spacer-${size}`} />;
}

// ── Module dispatcher ─────────────────────────────────────────────
function renderModule(mod: ModuleType, index: number) {
  const delay = index * 100;
  switch (mod._type) {
    case 'mediaBlock':  return <ModuleMediaBlock key={mod._key} mod={mod} delay={delay} />;
    case 'textBlock':   return <ModuleTextBlock key={mod._key} mod={mod} delay={delay} />;
    case 'spacerBlock': return <ModuleSpacer key={mod._key} mod={mod} />;
    default: return null;
  }
}

// ── WorkSingle ─────────────────────────────────────────────────────
type Props = { data?: WorkSingleData | null; selectedWorks?: SelectedWorkSanity[] };

export default function WorkSingle({ data, selectedWorks }: Props) {
  const work = data || DUMMY_SINGLE;
  const heroRawUrl = (work.heroMedia?.image as { asset?: { url?: string } })?.asset?.url ?? null;
  const heroSrc = sanityImg(heroRawUrl, 1440, 85) ?? ph(1440, 900, work.title);

  const [heroDone, setHeroDone] = useState(false);
  const animState = heroDone ? 'visible' : 'hidden';
  const titleWords = work.title.split(' ');

  return (
    <article className="work-single" data-theme="light">

      {/* ── .work__top ── */}
      <div className="work-single__top">
        <div className="work-single__title-row">
          <div className="work-single__title-mask">
            <h1 className="work-single__title headline-1">
              {titleWords.map((word, i) => (
                <m.span
                  key={i}
                  className="work-single__title-word"
                  custom={i}
                  variants={clipVariants}
                  initial="hidden"
                  animate={animState}
                >
                  <m.span
                    className="work-single__title-inner"
                    custom={i}
                    variants={slideVariants}
                    initial="hidden"
                    animate={animState}
                  >
                    {word}
                  </m.span>
                </m.span>
              ))}
            </h1>
          </div>
          {work.year && (
            <m.span
              className="work-single__year headline-3"
              custom={0.15}
              variants={fadeUpVariants}
              initial="hidden"
              animate={animState}
            >
              ©{work.year}
            </m.span>
          )}
        </div>
        {work.subtitle && (
          <m.p
            className="work-single__subtitle body-text-4"
            custom={0.25}
            variants={fadeUpVariants}
            initial="hidden"
            animate={animState}
          >
            {work.subtitle}
          </m.p>
        )}
      </div>

      {/* ── .work__hero ── */}
      <m.div
        className={`work-single__hero${work.heroMedia?.fullBleed === false ? ' work-single__hero--guttered' : ''}`}
        initial={{ y: '100vh' }}
        animate={{ y: '0vh' }}
        transition={{ duration: 1.0, ease: EASE_INOUT }}
        onAnimationComplete={() => setHeroDone(true)}
      >
        {(work.heroMedia?.video as { asset?: { url?: string } })?.asset?.url ? (
          <ViewportVideo
            src={(work.heroMedia!.video as { asset: { url: string } }).asset.url}
            style={{ width: '100%' }}
          />
        ) : (
          <Image src={heroSrc} alt={work.title} width={1440} height={900} priority
            unoptimized={isPlaceholder(heroSrc)} quality={85}
            sizes="100vw"
            style={{ width: '100%', height: 'auto', display: 'block' }} />
        )}
      </m.div>

      {/* ── .work__text: project info ── */}
      <div className="work-single__text work-single__text--animate">
        <div className="work-single__text-inner">
          {work.services && work.services.length > 0 && (
            <div className="work-single__summary">
              <p className="work-single__label body-text-caps">What I did</p>
              <ul className="work-single__services">
                {work.services.map((s, i) => (
                  <li key={i} className="body-text-4">{s}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="work-single__overview">
            <p className="work-single__label body-text-caps">Overview</p>
            {work.overview && (
              <p className="work-single__overview-text body-text-3">{work.overview}</p>
            )}
            {(work.siteUrl || work.githubUrl) && (
              <div className="work-single__links">
                {work.siteUrl && (
                  <a href={work.siteUrl} target="_blank" rel="noopener noreferrer"
                    className="work-single__link body-text-5">
                    Visit website →
                  </a>
                )}
                {work.githubUrl && (
                  <a href={work.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="work-single__link body-text-5">
                    GitHub →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── .work__modules ── */}
      {work.modules && work.modules.length > 0 && (
        <div
          className={`work-single__modules${work.tools && work.tools.length > 0 ? ' work-single__modules--has-builtwith' : ''}`}
          data-theme="light"
        >
          {work.modules.map((mod, i) => renderModule(mod, i))}
        </div>
      )}

      {/* ── Built with (Tech Stack, centered, bottom) ── */}
      {work.tools && work.tools.length > 0 && (
        <section className="work-single__builtwith">
          <p className="work-single__label body-text-caps">Built with</p>
          <TechStack items={work.tools} />
        </section>
      )}

      {/* ── Related Works ── */}
      <WorkRelated currentSlug={work.slug.current} serverWorks={selectedWorks} />

    </article>
  );
}
