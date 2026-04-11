'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import './HomeIntro.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

export default function HomeIntro() {
  const videoRef = useRef(null);
  const videoInView = useInView(videoRef, { once: true, margin: '-10%' });

  const textRef = useRef(null);
  const textInView = useInView(textRef, { once: true, margin: '-12%' });

  return (
    <section className="home-intro" data-theme="light">
      <div className="wrap">
      {/* ── Video placeholder — plastic.design home-intro-video 영역 매칭 ── */}
      <motion.div
        ref={videoRef}
        className="home-intro-video"
        initial={{ opacity: 0, y: 60 }}
        animate={videoInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.4, ease: EASE_OUT }}
      >
        <div className="home-intro-video__video">
          {/* 1. 비디오 */}
          <video
            src="/videos/video-moon-ver1.2.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* 2. 블랙 마스크 */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          {/* 3. 로고 */}
          <img
            src="/images/Logo-white.svg"
            alt="Creative Moon"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '37.5vw', height: 'auto' }}
          />
        </div>
      </motion.div>

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
      </div>
    </section>
  );
}
