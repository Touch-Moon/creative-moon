'use client';

import { useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { sanityImg } from '@/sanity/queries';
import type { StoryListItem } from '@/sanity/queries';
import './StoriesList.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

// ── Dummy data (used when Sanity is not connected) ────────────────
const DUMMY_STORIES: StoryListItem[] = [
  {
    _id: '1',
    title: 'The digital challenge of the industrial sector.',
    slug: { current: 'the-digital-challenge-of-the-industrial-sector' },
    category: 'Insights',
    publishedAt: '2024-11-20T00:00:00Z',
    excerpt: 'Exploring how digital transformation is reshaping industrial companies and what design can do to help.',
    order: 1,
  },
  {
    _id: '2',
    title: 'Reflections on design, current context.',
    slug: { current: 'reflections-on-design-current-context' },
    category: 'Process',
    publishedAt: '2024-09-10T00:00:00Z',
    excerpt: 'A look at how design practice evolves with technology and changing user expectations.',
    order: 2,
  },
  {
    _id: '3',
    title: 'Digital symphony: branding evolution.',
    slug: { current: 'digital-symphony-branding-evolution' },
    category: 'Branding',
    publishedAt: '2024-07-05T00:00:00Z',
    excerpt: 'Successful brands act like master orchestras — a symphony that evolves with each customer interaction.',
    order: 3,
  },
  {
    _id: '4',
    title: 'Tech innovation and effective healthcare.',
    slug: { current: 'tech-innovation-effective-healthcare' },
    category: 'Technology',
    publishedAt: '2024-04-18T00:00:00Z',
    excerpt: 'How technology and thoughtful design are transforming patient experiences across the healthcare sector.',
    order: 4,
  },
  {
    _id: '5',
    title: 'We review a decade of experience in retail.',
    slug: { current: 'a-decade-of-experience-in-retail' },
    category: 'Insights',
    publishedAt: '2024-01-15T00:00:00Z',
    excerpt: 'Reflecting on ten years of e-commerce retail work — conversion, creativity, and what design really sells.',
    order: 5,
  },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ── Story Card ────────────────────────────────────────────────────
function StoryCard({ story, index }: { story: StoryListItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  // Apply Sanity CDN transforms (WebP/AVIF, w=960)
  const optimizedThumb = sanityImg(story.thumbnailUrl, 960, 80);
  // Canvas (PageTransition clone): CORS-safe URL via /_next/image proxy
  const heroSrc = optimizedThumb
    ? optimizedThumb.startsWith('https://cdn.sanity.io')
      ? `/_next/image?url=${encodeURIComponent(optimizedThumb)}&w=960&q=80`
      : optimizedThumb
    : '';

  return (
    <m.div
      ref={ref}
      className="story-card"
      data-hero-src={heroSrc}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: EASE_OUT, delay: (index % 2) * 0.1 }}
    >
      <Link href={`/stories/${story.slug.current}`} className="story-card__link">
        {/* Thumbnail */}
        <div className="story-card__image">
          {optimizedThumb ? (
            <Image
              src={optimizedThumb}
              alt={story.title}
              fill
              className="story-card__img"
              sizes="(max-width: 575px) 100vw, (max-width: 1023px) 50vw, 40vw"
              quality={80}
            />
          ) : (
            <div className="story-card__placeholder" />
          )}
        </div>

        {/* Content */}
        <div className="story-card__content">
          {/* Meta */}
          <div className="story-card__meta">
            {story.category && (
              <span className="story-card__category body-text-caps">
                {story.category}
              </span>
            )}
            {story.publishedAt && (
              <span className="story-card__date body-text-caps">
                {formatDate(story.publishedAt)}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="story-card__title">{story.title}</h2>

          {/* Excerpt */}
          {story.excerpt && (
            <p className="story-card__excerpt">{story.excerpt}</p>
          )}

        </div>
      </Link>
    </m.div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function StoriesList({ stories: initialStories }: { stories: StoryListItem[] }) {
  const stories = initialStories.length > 0 ? initialStories : DUMMY_STORIES;
  const [viewMode, setViewMode] = useState<'column' | 'list'>('column');

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-5%' });

  return (
    <div className="stories-list">
      {/* Header */}
      <div className="stories-list__header" ref={headerRef}>
        <div className="stories-list__header-inner">
          <div className="stories-list__title-wrap">
            <m.h1
              className="stories-list__title"
              initial={{ y: '110%' }}
              animate={headerInView ? { y: 0 } : {}}
              transition={{ duration: 1.4, ease: EASE_OUT }}
            >
              INSIGHTS.
            </m.h1>
          </div>
          <m.p
            className="stories-list__subtitle body-text-4"
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.3 }}
          >
            Thoughts, reflections, and ideas on design,<br />
            technology, and the world we work in.
          </m.p>
        </div>
      </div>

      {/* Divider */}
      <m.div
        className="stories-list__divider"
        initial={{ scaleX: 0 }}
        animate={headerInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.2 }}
      />

      {/* View Mode Toggle */}
      <div className="stories-list__view-toggle">
        <button
          className={`stories-list__view-btn ${viewMode === 'column' ? 'is-active' : ''}`}
          onClick={() => setViewMode('column')}
          title="Column view"
          aria-label="Column view"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <rect x="2" y="2" width="8" height="8" />
            <rect x="14" y="2" width="8" height="8" />
            <rect x="2" y="14" width="8" height="8" />
            <rect x="14" y="14" width="8" height="8" />
          </svg>
        </button>
        <button
          className={`stories-list__view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
          onClick={() => setViewMode('list')}
          title="List view"
          aria-label="List view"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Grid */}
      <div className={`stories-list__grid ${viewMode === 'list' ? 'stories-list__grid--list' : ''}`}>
        {stories.map((story, i) => (
          <StoryCard key={story._id} story={story} index={i} />
        ))}
      </div>
    </div>
  );
}
