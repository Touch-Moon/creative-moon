'use client';
import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import './HomeIntro.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

export default function HomeIntro() {
  const videoRef = useRef(null);
  // No margin: prevents iOS Safari from missing triggers with a negative rootMargin
  // Animation starts as soon as the element enters the viewport
  const videoInView = useInView(videoRef, { once: true });

  const textRef = useRef(null);
  const textInView = useInView(textRef, { once: true });

  return (
    <section className="home-intro" data-theme="light">
      <div className="wrap">
      {/* ── Intro video placeholder ── */}
      <m.div
        ref={videoRef}
        className="home-intro-video"
        initial={{ opacity: 0, y: 60 }}
        animate={videoInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.4, ease: EASE_OUT }}
      >
        <div className="home-intro-video__video">
          {/* 1. Video */}
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
          {/* 2. Black mask */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          {/* 3. Logo */}
          <img
            src="/images/Logo-white.svg"
            alt="Creative Moon"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '37.5vw', height: 'auto' }}
          />
        </div>
      </m.div>

      {/* ── Intro text ── */}
      <m.div
        ref={textRef}
        className="home-intro__text"
        initial={{ opacity: 0, y: 40 }}
        animate={textInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <p>
          I&apos;m a designer based in Canada. I make functional things beautiful, always for the people who use them. I care about how a page looks and how it feels to use, down to the smallest detail. Every project holds the same standard: design that&apos;s thought through, and made to last.
        </p>
      </m.div>
      </div>
    </section>
  );
}
