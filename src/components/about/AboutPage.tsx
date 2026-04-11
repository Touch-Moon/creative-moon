'use client';

import { useRef, useState, useEffect } from 'react';
import { m, useInView, type Variants, type UseInViewOptions } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import HomeMarquee from '@/components/home/HomeMarquee';
import './AboutPage.scss';

// ── Easing curves ──────────────────────────────────────────────
const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

// ── Shared animation variants ──────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: EASE_OUT, delay },
  }),
};

const clipReveal: Variants = {
  hidden: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
  },
  visible: (i: number) => ({
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: { duration: 1.2, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

const slideUp: Variants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 1.2, ease: EASE_OUT, delay: i * 0.12 },
  }),
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 1.6, ease: EASE_OUT, delay },
  }),
};

// ── Tech stack data ────────────────────────────────────────────
const awards = [
  { org: 'React', name: 'Component Architecture & Modern Front-End', year: 'JS' },
  { org: 'Next.js', name: 'Full-Stack Applications & Static Sites', year: 'JS' },
  { org: 'TypeScript', name: 'Type-Safe Front-End Engineering', year: 'JS' },
  { org: 'Shopify', name: 'Custom Theme Development & Optimization', year: 'E-COM' },
  { org: 'WordPress', name: 'Custom Themes, Plugins & CMS Architecture', year: 'CMS' },
  { org: 'Sanity / Supabase', name: 'Headless CMS & Backend Integration', year: 'Stack' },
  { org: 'Figma', name: 'UI/UX Design & Prototyping Workflows', year: 'Design' },
  { org: 'HTML / CSS / SCSS', name: 'Responsive Layouts & Design Systems', year: 'Core' },
];

// ── Approach data ──────────────────────────────────────────────
const compliance = [
  {
    number: '01.',
    heading: 'Design before code.',
    desc: 'Every project starts with layout, hierarchy, and user flow — before touching a line of code. Design decisions shape technical ones, not the other way around.',
  },
  {
    number: '02.',
    heading: 'Clear communication, always.',
    desc: 'Transparent updates from kickoff to launch. What\'s being built, why, and how — no surprises at delivery. Documented setups and clean handoffs come standard.',
  },
  {
    number: '03.',
    heading: 'Performance by default.',
    desc: 'Page speed, semantic markup, and accessibility are built in from the start, not added on. Every site is optimized for real-world performance, not just a dev preview.',
  },
];

// ── Reusable section hook ──────────────────────────────────────
function useSection(margin: UseInViewOptions['margin'] = '-12%') {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

// ================================================================
// COMPONENT
// ================================================================
export default function AboutPage() {
  // Hero uses mounted state for immediate trigger (no scroll needed)
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fullImg = useSection('-10%');
  const imgText = useSection('-10%');
  const twoCols = useSection('-10%');
  const textLeft = useSection('-10%');
  const textRight = useSection('-10%');
  const awardsSection = useSection('-5%');
  const complianceSection = useSection('-10%');

  return (
    <div className="about">
      {/* ─────────────────────────────────────────────────────────
          1. HERO TITLE
      ───────────────────────────────────────────────────────── */}
      <section className="about-title" data-theme="light">
        <div className="wrapper">
          <h1 className="about-title__content">
            {[
              'Design-driven work.',
              'Built with precision',
              'and purpose.',
            ].map((line, i) => (
              <span key={i} className="line">
                <m.span
                  className="line-inner"
                  custom={i}
                  variants={clipReveal}
                  initial="hidden"
                  animate={heroVisible ? 'visible' : 'hidden'}
                >
                  <m.span
                    custom={i}
                    variants={slideUp}
                    initial="hidden"
                    animate={heroVisible ? 'visible' : 'hidden'}
                    style={{ display: 'inline-block' }}
                  >
                    {line}
                  </m.span>
                </m.span>
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. FULL-WIDTH IMAGE + TEXT
      ───────────────────────────────────────────────────────── */}
      <section className="about-full-image" data-theme="light" ref={fullImg.ref}>
        <div className="wrapper">
          <m.div
            className="about-full-image__image"
            variants={imageReveal}
            custom={0}
            initial="hidden"
            animate={fullImg.inView ? 'visible' : 'hidden'}
          >
            <Image
              src="/images/about/about-hero-v2.webp"
              alt="Creative Moon — workspace"
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              quality={85}
              priority
            />
          </m.div>

          <m.div
            className="about-full-image__text"
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            animate={fullImg.inView ? 'visible' : 'hidden'}
          >
            <p>
              I&apos;m a Designer and Developer based in Canada. Grounded in
              years of hands-on experience and built around modern tools, every
              project is delivered with the same commitment — strong design,
              clean code, and a website that performs well after launch. From
              e-commerce builds to custom web applications, the focus is always
              on craft and how it feels to use.
            </p>
          </m.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          3. IMAGE LEFT + TEXT RIGHT
      ───────────────────────────────────────────────────────── */}
      <section className="about-image-text" data-theme="light" ref={imgText.ref}>
        <div className="wrapper">
          <div className="about-image-text__inner">
            <m.div
              className="about-image-text__image"
              variants={imageReveal}
              custom={0}
              initial="hidden"
              animate={imgText.inView ? 'visible' : 'hidden'}
            >
              <Image
                src="/images/about/about-office-v2.webp"
                alt="Creative Moon — office"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 575px) 100vw, 50vw"
                quality={80}
              />
            </m.div>

            <m.div
              className="about-image-text__content"
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              animate={imgText.inView ? 'visible' : 'hidden'}
            >
              <h2 className="about-image-text__heading">
                Design that works,<br />from the first click.
              </h2>
              <p className="about-image-text__desc">
                Every decision starts with the user — how they move through a page,
                what draws attention, and where friction lives. The goal is always
                the same: a website that feels intuitive, loads fast, and guides
                visitors toward what matters. Work spans{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '0.2em' }}>
                  Web Design, UI/UX Design, Front-End Development,
                  and interactive digital experiences
                </span>.
              </p>
            </m.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          4. TWO-COLUMN IMAGES
      ───────────────────────────────────────────────────────── */}
      <section className="about-image-2col" data-theme="light" ref={twoCols.ref}>
        <div className="wrapper">
          <div className="about-image-2col__inner">
            <m.div
              className="about-image-2col__image"
              variants={imageReveal}
              custom={0}
              initial="hidden"
              animate={twoCols.inView ? 'visible' : 'hidden'}
            >
              <Image
                src="/images/about/about-detail-01-v5.webp"
                alt="Creative Moon — design process"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 575px) 100vw, 50vw"
                quality={80}
              />
            </m.div>
            <m.div
              className="about-image-2col__image"
              variants={imageReveal}
              custom={0.15}
              initial="hidden"
              animate={twoCols.inView ? 'visible' : 'hidden'}
            >
              <Image
                src="/images/about/about-detail-02-v2.webp"
                alt="Creative Moon — development"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 575px) 100vw, 50vw"
                quality={80}
              />
            </m.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          5. TEXT LEFT — "It's all about the people"
      ───────────────────────────────────────────────────────── */}
      <section className="about-text-left" data-theme="light" ref={textLeft.ref}>
        <div className="wrapper">
          <m.h2
            className="about-text-left__heading"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={textLeft.inView ? 'visible' : 'hidden'}
          >
            Built with intent,<br />not just<br />instructions.
          </m.h2>

          <m.div
            className="about-text-left__content"
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            animate={textLeft.inView ? 'visible' : 'hidden'}
          >
            <p>
              Good websites aren&apos;t assembled — they&apos;re considered. That means
              understanding the project&apos;s purpose before writing a line of code,
              choosing the right approach for the job, and building something that
              lasts. Every project is treated as a long-term investment in quality,
              not just a deliverable to hand off.{' '}
              <Link href="/work">See the work</Link>.
            </p>
          </m.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          6. TEXT RIGHT — "If you're gonna do it..."
      ───────────────────────────────────────────────────────── */}
      <section className="about-text-right" data-theme="light" ref={textRight.ref}>
        <div className="wrapper">
          <div className="about-text-right__inner">
            <m.div
              className="about-text-right__content"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate={textRight.inView ? 'visible' : 'hidden'}
            >
              <h2 className="about-text-right__heading">
                Clean code today.<br />Less trouble tomorrow.
              </h2>
              <p className="about-text-right__desc">
                Code written without care becomes a problem down the line. Fast load
                times, structured markup, documented setups — not just for launch,
                but for everything that comes after. Whatever the project, whatever
                the platform, the standard doesn&apos;t change.
              </p>
            </m.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          7. AWARDS
      ───────────────────────────────────────────────────────── */}
      <section className="about-awards" data-theme="dark" ref={awardsSection.ref}>
        <div className="wrapper">
          <div className="about-awards__inner">
            <m.h2
              className="about-awards__heading"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate={awardsSection.inView ? 'visible' : 'hidden'}
            >
              The tools.<br />The stack.
            </m.h2>

            <div className="about-awards__list">
              {awards.map((award, i) => (
                <AwardItem key={i} award={award} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          8. PHILOSOPHY (홈페이지와 공유)
      ───────────────────────────────────────────────────────── */}
      <HomeMarquee />

      {/* ─────────────────────────────────────────────────────────
          9. COMPLIANCE
      ───────────────────────────────────────────────────────── */}
      <section className="about-compliance" data-theme="dark" ref={complianceSection.ref}>
        <div className="wrapper">
          <m.h2
            className="about-compliance__title"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={complianceSection.inView ? 'visible' : 'hidden'}
          >
            How every project gets done.
          </m.h2>

          <div className="about-compliance__grid">
            {compliance.map((item, i) => (
              <m.div
                key={i}
                className="about-compliance__card"
                variants={fadeUp}
                custom={i * 0.12}
                initial="hidden"
                animate={complianceSection.inView ? 'visible' : 'hidden'}
              >
                <div className="about-compliance__card-number">{item.number}</div>
                <h3 className="about-compliance__card-heading">{item.heading}</h3>
                <p className="about-compliance__card-desc">{item.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Award item — whileInView (no flicker) ──────────────────────
function AwardItem({ award }: { award: typeof awards[0] }) {
  return (
    <m.div
      className="about-awards__item"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      whileHover={{ opacity: 1 }}
    >
      <span className="about-awards__award-org">{award.org}</span>
      <span className="about-awards__award-name">{award.name}</span>
      <span className="about-awards__award-year">{award.year}</span>
    </m.div>
  );
}
