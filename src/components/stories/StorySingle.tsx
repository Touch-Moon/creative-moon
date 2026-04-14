'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlockComponent, PortableTextMarkComponentProps } from '@portabletext/react';
import { sanityImg } from '@/sanity/queries';
import type {
  StorySingleData,
  StoryMediaBlock,
  StoryTextBlock,
  StorySpacerBlock,
  StoryHeroMedia,
} from '@/sanity/queries';
import './StorySingle.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];
const EASE_INOUT: BezierDefinition = [0.76, 0, 0.24, 1];

// ── Portable Text components ──────────────────────────────────────
type LinkMark = { _type: 'link'; href: string; blank?: boolean };

const ptComponents = {
  block: {
    normal: (({ children }) => (
      <p className="body-text-4">{children}</p>
    )) as PortableTextBlockComponent,
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<LinkMark>) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="story-link"
      >
        {children}
      </a>
    ),
  },
};

// ── Hero Media Module (same as Work: slide-up from bottom) ───────
function HeroModuleBlock({ heroMedia }: { heroMedia: StoryHeroMedia }) {
  const videoUrl = heroMedia.video?.asset?.url;
  const rawImageUrl = heroMedia.image?.asset?.url;
  if (!videoUrl && !rawImageUrl) return null;

  const isVideo = heroMedia.type === 'video' && !!videoUrl;
  const fullBleed = heroMedia.fullBleed !== false; // default true
  const bleedCls = fullBleed ? '' : ' story-single__hero--guttered';
  // Apply Sanity CDN transforms: auto=format (WebP/AVIF), w=1440, q=85
  const imageUrl = sanityImg(rawImageUrl, 1440, 85);

  return (
    <m.div
      className={`story-single__hero${bleedCls}`}
      initial={{ y: '100vh' }}
      animate={{ y: '0vh' }}
      transition={{ duration: 1.0, ease: EASE_INOUT }}
    >
      {isVideo ? (
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="story-single__hero-video"
          style={{ width: '100%', display: 'block' }}
        />
      ) : (
        <div className="story-single__hero-image-wrap">
          <Image
            src={imageUrl as string}
            alt=""
            width={1440}
            height={900}
            priority
            quality={85}
            sizes="100vw"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )}
    </m.div>
  );
}

// ── Media Slot (single image or video inside a block cell) ────────
function StoryMediaSlot({
  videoUrl,
  imageUrl,
  sizes,
}: {
  videoUrl?: string;
  imageUrl?: string;
  sizes?: string;
}) {
  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="story-module__video"
      />
    );
  }
  if (imageUrl) {
    // Apply Sanity CDN transforms before passing to next/image
    const optimizedUrl = sanityImg(imageUrl, 1440, 80);
    return (
      <div className="story-module__image-wrap">
        <Image
          src={optimizedUrl as string}
          alt=""
          fill
          className="story-module__image"
          sizes={sizes ?? '(max-width: 575px) 100vw, (max-width: 1023px) 100vw, 80vw'}
          quality={80}
        />
      </div>
    );
  }
  return null;
}

// ── Media Block ───────────────────────────────────────────────────
// Same layout (Frame) + Image/Video slot structure as Work's mediaBlock
function MediaBlock({ mod }: { mod: StoryMediaBlock }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const layout = mod.layout || '1col';
  const spacing = mod.spacing || 'default';
  const bleed = mod.fullBleed ?? false;
  const narrow = mod.narrow ?? false;

  const spacingCls =
    spacing === 'tight' ? ' story-media--sp-tight'
    : spacing === 'none' ? ' story-media--sp-none'
    : spacing === 'no-gap' ? ' story-media--sp-no-gap'
    : '';
  const bleedCls = bleed ? ' story-media--bleed' : '';
  const narrowCls = narrow && layout === '1col' ? ' story-module--narrow' : '';

  const slot1 = (sizes?: string) => (
    <StoryMediaSlot
      videoUrl={mod.video1?.asset?.url}
      imageUrl={mod.image1?.asset?.url}
      sizes={sizes}
    />
  );
  const slot2 = (sizes?: string) => (
    <StoryMediaSlot
      videoUrl={mod.video2?.asset?.url}
      imageUrl={mod.image2?.asset?.url}
      sizes={sizes}
    />
  );
  const slot3 = (sizes?: string) => (
    <StoryMediaSlot
      videoUrl={mod.video3?.asset?.url}
      imageUrl={mod.image3?.asset?.url}
      sizes={sizes}
    />
  );

  // 1-column layout
  if (layout === '1col') {
    return (
      <div
        className={`story-module story-module--media story-media--1col${bleedCls}${spacingCls}${narrowCls}`}
        ref={ref}
      >
        <m.div
          className="story-module__media-inner"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          {slot1('(max-width: 575px) 100vw, (max-width: 1023px) 100vw, 90vw')}
        </m.div>
      </div>
    );
  }

  // 2/3-column layouts
  const is3 = layout === '3col';
  const layoutCls =
    is3 ? 'story-media--3col'
    : layout === '2col-narrow-wide' ? 'story-media--2col story-media--2col-nw'
    : layout === '2col-wide-narrow' ? 'story-media--2col story-media--2col-wn'
    : 'story-media--2col';

  const sizesMain = is3
    ? '(max-width: 575px) 100vw, 33vw'
    : layout === '2col-narrow-wide' ? '(max-width: 575px) 100vw, 35vw'
    : layout === '2col-wide-narrow' ? '(max-width: 575px) 100vw, 60vw'
    : '(max-width: 575px) 100vw, (max-width: 1023px) 50vw, 48vw';
  const sizesSub = is3
    ? '(max-width: 575px) 100vw, 33vw'
    : layout === '2col-narrow-wide' ? '(max-width: 575px) 100vw, 60vw'
    : layout === '2col-wide-narrow' ? '(max-width: 575px) 100vw, 35vw'
    : '(max-width: 575px) 100vw, (max-width: 1023px) 50vw, 48vw';

  return (
    <div
      className={`story-module story-module--media ${layoutCls}${bleedCls}${spacingCls}`}
      ref={ref}
    >
      <m.div
        className="story-module__two-col-inner"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      >
        <div className="story-module__two-col-item">{slot1(sizesMain)}</div>
        <div className="story-module__two-col-item">{slot2(sizesSub)}</div>
        {is3 && <div className="story-module__two-col-item">{slot3(sizesSub)}</div>}
      </m.div>
    </div>
  );
}

// ── Spacer Block ──────────────────────────────────────────────────
function SpacerBlock({ mod }: { mod: StorySpacerBlock }) {
  const size = mod.size || 'medium';
  return <div className={`story-module story-module--spacer story-module--spacer-${size}`} />;
}

// ── Text Module ───────────────────────────────────────────────────
//
// Layout modes:
//
//   [centered = true] (default)
//     └─ Single column, centered on the page.
//        Width controlled by colWidth (e.g. 6 = 50% of content area).
//        Heading (if any) renders above the body in the same column.
//
//   [centered = false, headingInSeparateCol = false]
//     └─ Left-aligned column, optional left offset spacer.
//        │ [offset spacer] │ [body column] │ …
//
//   [centered = false, headingInSeparateCol = true]
//     └─ Heading column + body column side by side.
//        │ [offset] │ [heading col] │ [body col] │ …
//
function TextModuleBlock({ mod }: { mod: StoryTextBlock }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const paddingTop = mod.paddingTop ?? 160;
  const centered   = mod.centered !== false; // default true
  const colWidth   = mod.colWidth ?? 6;
  const offsetCols = mod.offsetCols ?? 0;
  const headingInSeparateCol = mod.headingInSeparateCol ?? false;
  const headingColWidth = mod.headingColWidth ?? 5;
  const themeCls = mod.theme === 'dark' ? ' story-module--dark' : '';

  // ── Centered layout ────────────────────────────────────────────
  if (centered) {
    return (
      <div
        className={`story-module story-module--text story-module--text-centered${themeCls}`}
        style={{ '--story-pt': paddingTop } as React.CSSProperties}
        ref={ref}
      >
        <m.div
          className="story-module__centered-body"
          style={{ '--col-w': colWidth } as React.CSSProperties}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        >
          {mod.heading && (
            <h2 className="headline-4 story-module__section-heading">
              {mod.heading}
            </h2>
          )}
          <div className="story-module__wysiwyg">
            {mod.body && <PortableText value={mod.body} components={ptComponents} />}
          </div>
        </m.div>
      </div>
    );
  }

  // ── Left-aligned layout (12-col grid) ─────────────────────────
  return (
    <div
      className={`story-module story-module--text story-module--text-grid${themeCls}`}
      style={{ '--story-pt': paddingTop } as React.CSSProperties}
      ref={ref}
    >
      <div className="story-module__cols">
        {/* Left offset spacer */}
        {offsetCols > 0 && (
          <div
            className="story-module__spacer"
            style={{ gridColumn: `span ${offsetCols}` }}
            aria-hidden="true"
          />
        )}

        {/* Separate heading column */}
        {headingInSeparateCol && mod.heading && (
          <m.div
            className="story-module__heading-col"
            style={{ gridColumn: `span ${headingColWidth}` }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.05 }}
          >
            <h2 className="headline-4 story-module__section-heading">
              {mod.heading}
            </h2>
          </m.div>
        )}

        {/* Body column */}
        <m.div
          className="story-module__body-col"
          style={{ gridColumn: `span ${colWidth}` }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 1.1,
            ease: EASE_OUT,
            delay: headingInSeparateCol ? 0.15 : 0.05,
          }}
        >
          {!headingInSeparateCol && mod.heading && (
            <h2 className="headline-4 story-module__section-heading story-module__section-heading--inline">
              {mod.heading}
            </h2>
          )}
          <div className="story-module__wysiwyg">
            {mod.body && <PortableText value={mod.body} components={ptComponents} />}
          </div>
        </m.div>
      </div>
    </div>
  );
}

// ── Title Block ───────────────────────────────────────────────────
function TitleBlock({ title, category }: { title: string; category?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <div className="story-module story-module--title" ref={ref}>
      <div className="story-module__title-inner">
        {category && (
          <m.h3
            className="body-text-4 story-module__category"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            {category}.
          </m.h3>
        )}
        <div className="story-module__headline-wrap">
          <m.h1
            className="headline-2 story-module__headline"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.1 }}
          >
            {title}
          </m.h1>
        </div>
      </div>
    </div>
  );
}

// ── Dummy data (used when Sanity is not connected) ────────────────
const DUMMY_STORY: StorySingleData = {
  _id: 'dummy',
  title: 'We review a decade of experience in retail.',
  slug: { current: 'a-decade-of-experience-in-retail' },
  category: 'Insights',
  publishedAt: '2024-01-15T00:00:00Z',
  excerpt: 'A reflection on ten years of e-commerce and retail design.',
  modules: [
    {
      _type: 'storyTextBlock',
      _key: 'intro',
      paddingTop: 120,
      centered: true,
      colWidth: 6,
      body: [
        {
          _type: 'block',
          _key: 'p1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 's1',
              text: "It's hard to believe that ten years have already passed. We've come a long way, working tirelessly. And suddenly, we realize that we've had the opportunity to be involved in a wide range of truly fascinating projects in the world of e-commerce retail.",
            },
          ],
          markDefs: [],
        },
      ],
    },
    {
      _type: 'storyTextBlock',
      _key: 'section1',
      paddingTop: 160,
      centered: false,
      offsetCols: 0,
      colWidth: 5,
      heading: 'The science and art of conversion.',
      headingInSeparateCol: true,
      headingColWidth: 5,
      body: [
        {
          _type: 'block',
          _key: 'p2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 's2',
              text: "In our journey, we've discovered that conversion is like building a house — it needs a solid structure. Every brick, every design detail is essential to create a successful framework that converts visitors into loyal customers.",
            },
          ],
          markDefs: [],
        },
      ],
    },
    {
      _type: 'storyTextBlock',
      _key: 'section2',
      paddingTop: 160,
      centered: true,
      colWidth: 8,
      heading: 'What design really sells.',
      body: [
        {
          _type: 'block',
          _key: 'p3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 's3',
              text: "After a decade in retail, one truth remains constant: design that respects the user always outperforms design that decorates the product. The best e-commerce experiences are invisible — they simply guide people toward what they already want.",
            },
          ],
          markDefs: [],
        },
      ],
    },
  ],
};

// ── Main Component ────────────────────────────────────────────────
export default function StorySingle({ data }: { data: StorySingleData | null }) {
  const story = data ?? DUMMY_STORY;

  return (
    <div className="story-single">
      {/* Title */}
      <TitleBlock title={story.title} category={story.category} />

      {/* Hero Media (after title, before content modules) */}
      {story.heroMedia && <HeroModuleBlock heroMedia={story.heroMedia} />}

      {/* Content modules */}
      {story.modules?.map((mod) => {
        if (mod._type === 'storyMediaBlock') {
          return <MediaBlock key={mod._key} mod={mod} />;
        }
        if (mod._type === 'storyTextBlock') {
          return <TextModuleBlock key={mod._key} mod={mod} />;
        }
        if (mod._type === 'storySpacerBlock') {
          return <SpacerBlock key={mod._key} mod={mod} />;
        }
        return null;
      })}

      {/* Bottom spacer */}
      <div className="story-single__end" />
    </div>
  );
}
