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
  { org: 'Figma', name: 'UI/UX Design & Prototyping', year: 'Design' },
  { org: 'Adobe CC', name: 'Brand, Video & Visual Design', year: 'Design' },
  { org: 'HTML / CSS / SCSS', name: 'Responsive Layouts & Design Systems', year: 'Core' },
  { org: 'Three.js / R3F', name: 'Real-time 3D Scenes', year: '3D' },
  { org: 'WebGL / GLSL', name: 'Custom Shaders & Graphics', year: 'Shaders' },
  { org: 'GSAP', name: 'Motion & Interaction', year: 'Motion' },
  { org: 'React', name: 'Component Architecture & Modern Front-End', year: 'JS' },
  { org: 'Next.js', name: 'Full-Stack Applications & Static Sites', year: 'JS' },
  { org: 'TypeScript', name: 'Type-Safe Front-End Engineering', year: 'JS' },
  { org: 'WordPress', name: 'Custom Themes, Plugins & CMS', year: 'CMS' },
  { org: 'Shopify', name: 'Custom Theme Development', year: 'E-COM' },
  { org: 'Sanity / Supabase', name: 'Headless CMS & Backend Integration', year: 'Stack' },
];

// ── Approach data ──────────────────────────────────────────────
const compliance = [
  {
    number: '01.',
    heading: 'Start with people.',
    desc: 'Every project begins with the people who\'ll use it: how they feel, what they need, and where the experience can do more. Design leads, and everything else follows from there.',
  },
  {
    number: '02.',
    heading: 'Nothing less than great.',
    desc: 'Quality isn\'t a final step, it\'s there the whole way through. If the work isn\'t great, it isn\'t finished. Every project is treated as something to be proud of, not just delivered.',
  },
  {
    number: '03.',
    heading: 'Honest, start to finish.',
    desc: 'Clear updates, honest timelines, and no surprises at the end. The same care that shapes how I work shapes the user experience it leads to.',
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
              'The functional,',
              'made beautiful.',
              'Always for people.',
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
              src="/images/about-hero.jpg"
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
              I&apos;m a designer based in Canada. I take the functional and make it beautiful, always for the people who use it. I build it myself, so nothing gets lost along the way.
              After years across design and development, the way I work doesn&apos;t change: design that&apos;s thought through, made with care, and built to last. I design in Figma and build in Next.js, but the tools only ever serve the idea. Whatever the project, I stay with it from the first idea to the last detail.
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
                Every decision starts with the user: how they move through a page,
                what draws attention, and where friction lives. The goal is always
                the same: a website that feels intuitive, loads fast, and guides
                visitors toward what matters. Work spans{' '}
                <span className="about-image-text__desc-underline">
                  UI/UX Design, Design Engineering, Front-End Development,
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
              Good websites aren&apos;t assembled. They&apos;re considered. That means
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
                Made with care.<br />Made to last.
              </h2>
              <p className="about-text-right__desc">
                Anything rushed shows it later. So I make things with care, so they last, stay easy to live with, and still feel right long after launch. Whatever the project, the standard doesn&apos;t change.
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
          8. PHILOSOPHY (shared with homepage)
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
