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
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 0.25,
    y: 0,
    transition: { duration: 1.0, ease: EASE_OUT, delay: i * 0.08 },
  }),
};

const labelVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: 0,
    transition: { duration: 1.2, ease: EASE_OUT },
  },
};

export default function HomeSkills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-8%' });

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

      {/* ── 우측 번호 목록 ── */}
      <div className="home-skills__list">
        {skills.map((item, i) => (
          <motion.div
            key={item.number}
            ref={el => { itemRefs.current[i] = el; }}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate={sectionInView ? (i === activeIndex ? { opacity: 1, y: 0 } : 'visible') : 'hidden'}
            className={`home-skills__item ${i === activeIndex ? 'is-active' : ''}`}
          >
            <div className="home-skills__item-inner">
              <span className="home-skills__number">{item.number}</span>
              <h3 className="home-skills__title">{item.title}</h3>
              <p className="home-skills__desc">{item.desc}</p>
            </div>
            <div className="home-skills__rule" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
