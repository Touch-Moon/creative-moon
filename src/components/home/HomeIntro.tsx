'use client';
import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
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
      <m.div
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
            preload="none"
            poster="/images/intro-video-placeholder.webp"
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
      </m.div>

      {/* ── 소개 텍스트 ── */}
      <m.div
        ref={textRef}
        className="home-intro__text"
        initial={{ opacity: 0, y: 40 }}
        animate={textInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <p>
          A Designer and Developer based in Canada. Focused on
          crafting responsive, interaction-driven websites where every detail of the user
          experience is considered, from how a page feels to how it responds. Every project
          is approached with the same standard: intentional design, clean code, and a
          finished product that holds&nbsp;up.
        </p>
      </m.div>
      </div>
    </section>
  );
}
