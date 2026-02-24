'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import './HomeMarquee.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const clients = [
  'Hyundai', 'Samsung', 'LG', 'Kakao', 'Naver',
  'SK Telecom', 'Lotte', 'Kia', 'Amorepacific', 'CJ',
];

export default function HomeMarquee() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const items = [...clients, ...clients];

  return (
    <motion.section
      ref={ref}
      className="home-marquee"
      data-theme="dark"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1.0, ease: EASE_OUT }}
    >
      <div className="home-marquee__track">
        <div className="home-marquee__inner">
          {items.map((name, i) => (
            <span key={i} className="home-marquee__item">
              {name}<span className="home-marquee__dot">.</span>
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
