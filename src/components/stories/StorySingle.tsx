'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlockComponent, PortableTextMarkComponentProps } from '@portabletext/react';
import type {
  StorySingleData,
  StoryMediaModule,
  StoryTwoColImageModule,
  StoryTextModule,
  StoryHeroMedia,
} from '@/sanity/queries';
import './StorySingle.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

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

// ── Hero Media Module ─────────────────────────────────────────────
function HeroModuleBlock({ heroMedia }: { heroMedia: StoryHeroMedia }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  if (heroMedia.mediaType === 'video' && heroMedia.video?.asset?.url) {
    return (
      <div className="story-module story-module--hero" ref={ref}>
        <m.div
          className="story-module__media-inner"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <video
            src={heroMedia.video.asset.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="story-module__hero-video"
          />
        </m.div>
      </div>
    );
  }

  if (heroMedia.image?.asset?.url) {
    return (
      <div className="story-module story-module--hero" ref={ref}>
        <m.div
          className="story-module__media-inner"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <div className="story-module__hero-image-wrap">
            <Image
              src={heroMedia.image.asset.url}
              alt=""
              fill
              className="story-module__hero-image"
              sizes="(max-width: 575px) 100vw, (max-width: 1023px) 100vw, 80vw"
              quality={85}
              priority
            />
          </div>
        </m.div>
      </div>
    );
  }

  return null;
}

// ── Media Module ──────────────────────────────────────────────────
function MediaModuleBlock({ mod }: { mod: StoryMediaModule }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  if (mod.mediaType === 'video' && mod.video?.asset?.url) {
    return (
      <div
        className={`story-module story-module--media${mod.narrow ? ' story-module--narrow' : ''}`}
        ref={ref}
      >
        <m.div
          className="story-module__media-inner"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <video
            src={mod.video.asset.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="story-module__video"
          />
        </m.div>
      </div>
    );
  }

  if (mod.image?.asset?.url) {
    return (
      <div
        className={`story-module story-module--media${mod.narrow ? ' story-module--narrow' : ''}`}
        ref={ref}
      >
        <m.div
          className="story-module__media-inner"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <div className="story-module__image-wrap">
            <Image
              src={mod.image.asset.url}
              alt=""
              fill
              className="story-module__image"
              sizes="(max-width: 575px) 100vw, (max-width: 1023px) 100vw, 80vw"
              quality={80}
            />
          </div>
        </m.div>
      </div>
    );
  }

  return null;
}

// ── Two-Col Image Module ──────────────────────────────────────────
function TwoColImageModuleBlock({ mod }: { mod: StoryTwoColImageModule }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <div className="story-module story-module--two-col-image" ref={ref}>
      <div className="story-module__two-col-inner">
        {mod.leftImage?.asset?.url && (
          <m.div
            className="story-module__two-col-item"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0 }}
          >
            <Image
              src={mod.leftImage.asset.url}
              alt=""
              fill
              className="story-module__two-col-img"
              sizes="(max-width: 575px) 100vw, 50vw"
              quality={80}
            />
          </m.div>
        )}
        {mod.rightImage?.asset?.url && (
          <m.div
            className="story-module__two-col-item"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
          >
            <Image
              src={mod.rightImage.asset.url}
              alt=""
              fill
              className="story-module__two-col-img"
              sizes="(max-width: 575px) 100vw, 50vw"
              quality={80}
            />
          </m.div>
        )}
      </div>
    </div>
  );
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
function TextModuleBlock({ mod }: { mod: StoryTextModule }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const paddingTop = mod.paddingTop ?? 160;
  const centered   = mod.centered !== false; // default true
  const colWidth   = mod.colWidth ?? 6;
  const offsetCols = mod.offsetCols ?? 0;
  const headingInSeparateCol = mod.headingInSeparateCol ?? false;
  const headingColWidth = mod.headingColWidth ?? 5;

  // ── Centered layout ────────────────────────────────────────────
  if (centered) {
    return (
      <div
        className="story-module story-module--text story-module--text-centered"
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
      className="story-module story-module--text story-module--text-grid"
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

// ── Dummy data (Sanity 미연결 시) ─────────────────────────────────
const DUMMY_STORY: StorySingleData = {
  _id: 'dummy',
  title: 'We review a decade of experience in retail.',
  slug: { current: 'a-decade-of-experience-in-retail' },
  category: 'Insights',
  publishedAt: '2024-01-15T00:00:00Z',
  excerpt: 'A reflection on ten years of e-commerce and retail design.',
  modules: [
    {
      _type: 'storyTextModule',
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
      _type: 'storyTextModule',
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
      _type: 'storyTextModule',
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
        if (mod._type === 'storyMediaModule') {
          return <MediaModuleBlock key={mod._key} mod={mod} />;
        }
        if (mod._type === 'storyTwoColImageModule') {
          return <TwoColImageModuleBlock key={mod._key} mod={mod} />;
        }
        if (mod._type === 'storyTextModule') {
          return <TextModuleBlock key={mod._key} mod={mod} />;
        }
        return null;
      })}

      {/* Bottom spacer */}
      <div className="story-single__end" />
    </div>
  );
}
