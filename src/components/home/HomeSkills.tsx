'use client';
import { useRef, useState, useEffect } from 'react';
import { m, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import './HomeSkills.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const skills = [
  {
    number: '01',
    title: 'Design & Development.',
    desc: 'Building responsive, interactive websites from concept to launch. Focused on layout, typography, motion, and the small details that shape how people see, feel, and move through every page.',
  },
  {
    number: '02',
    title: 'Commerce & Shopify.',
    desc: 'Custom theme builds, performance, and integrations for Shopify stores. Focused on a shopping experience that\'s fast, considered, and keeps people coming back.',
  },
  {
    number: '03',
    title: 'Content Systems.',
    desc: 'Structuring content systems with WordPress, Sanity, and headless CMS setups. Delivering scalable, intuitive solutions that are straightforward to manage after launch.',
  },
  {
    number: '04',
    title: 'Interface & Interaction.',
    desc: 'Designing interfaces where every interaction is intentional, from micro-animations to user flow. Wireframes to polished, accessible experiences with clarity at every touchpoint.',
  },
  {
    number: '05',
    title: 'Engineering & Performance.',
    desc: 'Building front-end applications with React and Next.js, so the design ships exactly as I intended. Fast, solid, and made to hold up, with the craft carried all the way to production.',
  },
];

const itemVariants: Variants = {
  hidden:  { opacity: 0.5, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: EASE_OUT },
  },
};

const labelClipVariants: Variants = {
  hidden: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
  visible: {
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      'polygon(0% 0%, 100% 0%, 100% 15%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ],
    transition: { duration: 1.8, ease: EASE_OUT, times: [0, 0.4, 1] },
  },
};

const labelSlideVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 1.2, ease: EASE_OUT },
  },
};

// ── Each item detects viewport entry independently ──
type SkillItemProps = {
  item: typeof skills[0];
  index: number;
  isRevealed: boolean;
  setItemRef: (el: HTMLDivElement | null) => void;
};

function SkillItem({ item, index, isRevealed, setItemRef }: SkillItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -50% 0px' });

  return (
    <m.div
      ref={(el: HTMLDivElement | null) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        setItemRef(el);
      }}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="home-skills__item"
    >
      <div className="home-skills__item-inner">
        <span className="home-skills__number">{item.number}</span>
        <h3 className="home-skills__title">{item.title}</h3>
        <p className="home-skills__desc">{item.desc}</p>
      </div>

      {/* ── Line animation (per-item rule) ── */}
      <div className="home-skills__rule">
        <m.span
          className="home-skills__rule-inner"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
        />
      </div>
    </m.div>
  );
}

export default function HomeSkills() {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sectionRef  = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '0px 0px -40% 0px' });

  // Items that have been active once are permanently marked as revealed
  useEffect(() => {
    setRevealedItems(prev => new Set([...prev, activeIndex]));
  }, [activeIndex]);

  // Update active item based on scroll position
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section ref={sectionRef} className="home-skills" data-theme="light">
      <div className="wrap">
      {/* ── Left sticky label ── */}
      <m.div
        className="home-skills__label-wrap"
        variants={labelClipVariants}
        initial="hidden"
        animate={sectionInView ? 'visible' : 'hidden'}
      >
        <m.div
          className="home-skills__label"
          variants={labelSlideVariants}
        >
          SKILLS
        </m.div>
      </m.div>

      {/* ── Right numbered list — each item detects entry individually ── */}
      <div className="home-skills__list">
        {skills.map((item, i) => (
          <SkillItem
            key={item.number}
            item={item}
            index={i}
            isRevealed={revealedItems.has(i)}
            setItemRef={el => { itemRefs.current[i] = el; }}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
