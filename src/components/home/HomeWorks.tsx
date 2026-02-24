'use client';
import { useRef, useState, useCallback } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ArrowButton from '@/components/common/ArrowButton';
import './HomeWorks.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const titleLineVariants: Variants = {
  hidden: { y: '115%' },
  visible: (i: number) => ({
    y: 0,
    transition: { duration: 1.4, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: EASE_OUT, delay: i * 0.1 },
  }),
};

const MotionLink = motion(Link);

// 임시 데이터 — 나중에 Sanity로 교체
const works = [
  { id: '01', title: 'Hyundai Annual Convention.', slug: 'hyundai', src: '/images/work-01.jpg' },
  { id: '02', title: 'Brand Identity System.', slug: 'brand-identity', src: '/images/work-02.jpg' },
  { id: '03', title: 'Digital Experience Platform.', slug: 'digital-platform', src: '/images/work-03.jpg' },
  { id: '04', title: 'E-Commerce Redesign.', slug: 'ecommerce', src: '/images/work-04.jpg' },
  { id: '05', title: 'Mobile App Interface.', slug: 'mobile-app', src: '/images/work-05.jpg' },
];

export default function HomeWorks() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' });

  const scrollTo = (idx: number) => {
    if (!trackRef.current) return;
    const card = trackRef.current.children[idx] as HTMLElement;
    if (card) {
      trackRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
    setCurrent(idx);
  };

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    const card = trackRef.current.children[0] as HTMLElement;
    if (!card) return;
    const cardW = card.offsetWidth + 16;
    const idx = Math.round(scrollLeft / cardW);
    setCurrent(Math.min(idx, works.length - 1));
  }, []);

  return (
    <section ref={sectionRef} className="home-works" data-theme="dark">
      <div className="home-works__inner">

        {/* ── 왼쪽 사이드바 ── */}
        <div className="home-works__sidebar">
          <h2 className="home-works__title">
            {['SELECTED', 'WORKS'].map((line, i) => (
              <div key={i} className="home-works__title-line">
                <motion.span
                  custom={i}
                  variants={titleLineVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h2>

          <motion.div
            className="home-works__nav"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.4 }}
          >
            <span className="home-works__counter">
              {String(current + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
            </span>
            <div className="home-works__arrows">
              <ArrowButton
                direction="prev"
                onClick={() => scrollTo(Math.max(0, current - 1))}
                disabled={current === 0}
                ariaLabel="Previous work"
              />
              <ArrowButton
                direction="next"
                onClick={() => scrollTo(Math.min(works.length - 1, current + 1))}
                disabled={current === works.length - 1}
                ariaLabel="Next work"
              />
            </div>
          </motion.div>
        </div>

        {/* ── 캐러셀 트랙 ── */}
        <div
          className="home-works__track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {works.map((work, i) => (
            <MotionLink
              key={work.id}
              href={`/work/${work.slug}`}
              className="home-works__card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div className="home-works__card-img">
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 575px) 80vw, (max-width: 1023px) 65vw, 46vw"
                />
              </div>
              <p className="home-works__card-title">{work.title}</p>
            </MotionLink>
          ))}
        </div>

      </div>
    </section>
  );
}
