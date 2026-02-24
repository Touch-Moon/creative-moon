'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import './HomeSkills.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const skills = [
  {
    number: '01',
    title: 'Web Design & Development.',
    desc: 'Building responsive, performant websites and applications with a focus on clean architecture and seamless user experience. From concept to deployment.',
  },
  {
    number: '02',
    title: 'UI/UX Design.',
    desc: 'Crafting intuitive interfaces that balance aesthetics with functionality. Every interaction is intentional, every detail considered to create meaningful digital experiences.',
  },
  {
    number: '03',
    title: 'Brand Identity.',
    desc: 'Creating cohesive visual identities that communicate brand values clearly. Logo design, typography systems, color palettes, and guidelines that stand the test of time.',
  },
  {
    number: '04',
    title: 'Creative Direction.',
    desc: 'Guiding projects from initial vision to final execution. Bridging the gap between design and technology to deliver results that exceed expectations.',
  },
  {
    number: '05',
    title: 'Digital Strategy.',
    desc: 'Combining data insights with creative thinking to build digital strategies that drive growth, engage audiences, and create measurable impact for your business.',
  },
];

const itemVariants: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 0.25,
    y: 0,
    transition: { duration: 1.0, ease: EASE_OUT },
  },
};

const labelVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: 0,
    transition: { duration: 1.2, ease: EASE_OUT },
  },
};

// ── 각 아이템이 독립적으로 뷰포트 진입 감지 ──
type SkillItemProps = {
  item: typeof skills[0];
  index: number;
  isRevealed: boolean;
  setItemRef: (el: HTMLDivElement | null) => void;
};

function SkillItem({ item, index, isRevealed, setItemRef }: SkillItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });

  return (
    <motion.div
      ref={(el: HTMLDivElement | null) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        setItemRef(el);
      }}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? (isRevealed ? { opacity: 1, y: 0 } : 'visible') : 'hidden'}
      className="home-skills__item"
    >
      <div className="home-skills__item-inner">
        <span className="home-skills__number">{item.number}</span>
        <h3 className="home-skills__title">{item.title}</h3>
        <p className="home-skills__desc">{item.desc}</p>
      </div>

      {/* ── 라인 애니메이션 (plastic.design home-service__line 방식) ── */}
      <div className="home-skills__rule">
        <motion.span
          className="home-skills__rule-inner"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
        />
      </div>
    </motion.div>
  );
}

export default function HomeSkills() {
  const [activeIndex, setActiveIndex]   = useState(0);
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sectionRef  = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '0px 0px -40% 0px' });

  // 한 번 active된 항목은 영구 revealed 처리
  useEffect(() => {
    setRevealedItems(prev => new Set([...prev, activeIndex]));
  }, [activeIndex]);

  // 스크롤 위치에 따른 active 항목 업데이트
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
      {/* ── 좌측 sticky 라벨 ── */}
      <div className="home-skills__label-wrap">
        <motion.div
          className="home-skills__label"
          variants={labelVariants}
          initial="hidden"
          animate={sectionInView ? 'visible' : 'hidden'}
        >
          SKILLS
        </motion.div>
      </div>

      {/* ── 우측 번호 목록 — 각 항목 개별 진입 감지 ── */}
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
    </section>
  );
}
