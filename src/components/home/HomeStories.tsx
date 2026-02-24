'use client';
import { useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ArrowButton from '@/components/common/ArrowButton';
import './HomeStories.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const titleVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: 0,
    transition: { duration: 1.4, ease: EASE_OUT },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE_OUT, delay: i * 0.1 },
  }),
};

const MotionLink = motion(Link);

// 임시 데이터 — 나중에 Sanity로 교체
const stories = [
  { id: '01', category: 'Insights', title: 'The future of web design in the age of AI.', slug: 'future-web-design-ai', src: '/images/story-01.jpg' },
  { id: '02', category: 'Insights', title: 'Design systems that scale with your product.', slug: 'design-systems-scale', src: '/images/story-02.jpg' },
  { id: '03', category: 'Process', title: 'How I approach a new branding project.', slug: 'branding-process', src: '/images/story-03.jpg' },
  { id: '04', category: 'Technology', title: 'Next.js and the modern frontend stack.', slug: 'nextjs-modern-stack', src: '/images/story-04.jpg' },
];

export default function HomeStories() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' });

  const scroll = (dir: 'prev' | 'next') => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector('.home-stories__card') as HTMLElement;
    const w = card ? card.offsetWidth + 24 : 400;
    const nextIdx = dir === 'prev'
      ? Math.max(0, current - 1)
      : Math.min(stories.length - 1, current + 1);
    setCurrent(nextIdx);
    trackRef.current.scrollBy({ left: dir === 'prev' ? -w : w, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="home-stories" data-theme="dark">
      {/* ── 헤더 ── */}
      <div className="wrap">
      <div className="home-stories__header">
        <div className="home-stories__title-wrap">
          <motion.h2
            className="home-stories__title"
            variants={titleVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            INSIGHT.
          </motion.h2>
        </div>
        <motion.div
          className="home-stories__arrows"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
        >
          <ArrowButton
            direction="prev"
            onClick={() => scroll('prev')}
            disabled={current === 0}
            ariaLabel="Previous story"
          />
          <ArrowButton
            direction="next"
            onClick={() => scroll('next')}
            disabled={current === stories.length - 1}
            ariaLabel="Next story"
          />
        </motion.div>
      </div>
      </div>

      {/* ── 카드 캐러셀 ── */}
      <div className="home-stories__track" ref={trackRef}>
        {stories.map((item, i) => (
          <MotionLink
            key={item.id}
            href={`/insight/${item.slug}`}
            className="home-stories__card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="home-stories__card-img">
              <Image
                src={item.src}
                alt={item.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 575px) 80vw, (max-width: 1023px) 65vw, 29vw"
              />
            </div>
            <span className="home-stories__card-category">{item.category}</span>
            <h3 className="home-stories__card-title">{item.title}</h3>
          </MotionLink>
        ))}
      </div>
    </section>
  );
}
