'use client';
import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import './HomeIntro.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const imgVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: EASE_OUT, delay: i * 0.18 },
  }),
};

export default function HomeIntro() {
  const imgRef = useRef(null);
  const imgInView = useInView(imgRef, { once: true, margin: '-10%' });

  const textRef = useRef(null);
  const textInView = useInView(textRef, { once: true, margin: '-12%' });

  return (
    <section className="home-intro" data-theme="light">
      {/* ── 이미지 2개 — 높이 오프셋 ── */}
      <div ref={imgRef} className="home-intro__images">
        <motion.div
          className="home-intro__img home-intro__img--left"
          custom={0}
          variants={imgVariants}
          initial="hidden"
          animate={imgInView ? 'visible' : 'hidden'}
        >
          <Image
            src="/images/intro-left.jpg"
            alt="Creative Moon — Design"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 575px) 100vw, 50vw"
          />
        </motion.div>
        <motion.div
          className="home-intro__img home-intro__img--right"
          custom={1}
          variants={imgVariants}
          initial="hidden"
          animate={imgInView ? 'visible' : 'hidden'}
        >
          <Image
            src="/images/intro-right.jpg"
            alt="Creative Moon — Development"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 575px) 100vw, 50vw"
          />
        </motion.div>
      </div>

      {/* ── 소개 텍스트 ── */}
      <motion.div
        ref={textRef}
        className="home-intro__text"
        initial={{ opacity: 0, y: 40 }}
        animate={textInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <p>
          I&apos;m a web designer and full-stack developer with 15+ years of experience,
          crafting intuitive, scalable, and responsive digital experiences. My expertise
          spans UI/UX, front-end aesthetics, and back-end functionality — ensuring every
          project is both visually compelling and technically sound.
        </p>
      </motion.div>
    </section>
  );
}
