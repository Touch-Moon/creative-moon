'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
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

// ── Award data ─────────────────────────────────────────────────
const awards = [
  { org: 'Awwwards', name: 'Honorable Mention — Portfolio Redesign', year: '2025.' },
  { org: 'CSS Design Awards', name: 'UI Design, UX Design — Portfolio Website', year: '2025.' },
  { org: 'FWA', name: 'FWA of the Day — Portfolio Website', year: '2025.' },
  { org: 'Awwwards', name: 'Site of the Day — Brand Project', year: '2024.' },
  { org: 'CSS Design Awards', name: 'Website of the Day — E-commerce Platform', year: '2024.' },
  { org: 'Muzli', name: 'Muzli Honor — Dashboard Design', year: '2024.' },
  { org: 'Awwwards', name: 'Developer Award — Creative Moon Website', year: '2023.' },
  { org: 'Behance', name: 'Interaction Featured — Mobile App Concept', year: '2023.' },
];

// ── Compliance data ────────────────────────────────────────────
const compliance = [
  {
    number: '01.',
    heading: 'Quality first approach.',
    desc: 'Every project undergoes rigorous quality assurance to ensure that our deliverables meet the highest standards of design and development excellence.',
  },
  {
    number: '02.',
    heading: 'Transparent process.',
    desc: 'Our commitment to clear communication drives us to maintain open, honest, and collaborative relationships with every client we work with.',
  },
  {
    number: '03.',
    heading: 'Continuous improvement.',
    desc: 'We stay current with the latest technologies and design trends, constantly refining our processes to deliver cutting-edge digital solutions.',
  },
];

// ── Reusable section hook ──────────────────────────────────────
function useSection(margin = '-12%') {
  const ref = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inView = useInView(ref, { once: true, margin: margin as any });
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
              'I create meaningful',
              'digital experiences',
              'that connect people.',
            ].map((line, i) => (
              <span key={i} className="line">
                <motion.span
                  className="line-inner"
                  custom={i}
                  variants={clipReveal}
                  initial="hidden"
                  animate={heroVisible ? 'visible' : 'hidden'}
                >
                  <motion.span
                    custom={i}
                    variants={slideUp}
                    initial="hidden"
                    animate={heroVisible ? 'visible' : 'hidden'}
                    style={{ display: 'inline-block' }}
                  >
                    {line}
                  </motion.span>
                </motion.span>
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
          <motion.div
            className="about-full-image__image"
            variants={imageReveal}
            custom={0}
            initial="hidden"
            animate={fullImg.inView ? 'visible' : 'hidden'}
          >
            <Image
              src="/images/about/about-hero-v2.jpg"
              alt="Creative Moon — workspace"
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority
            />
          </motion.div>

          <motion.div
            className="about-full-image__text"
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            animate={fullImg.inView ? 'visible' : 'hidden'}
          >
            <p>
              Creative Moon is a design-driven studio focused on delivering
              high-quality digital products for forward-thinking brands.
              A versatile blend of designer, strategist, and developer —
              not too big, not too small, completely independent and
              deeply passionate about craft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          3. IMAGE LEFT + TEXT RIGHT
      ───────────────────────────────────────────────────────── */}
      <section className="about-image-text" data-theme="light" ref={imgText.ref}>
        <div className="wrapper">
          <div className="about-image-text__inner">
            <motion.div
              className="about-image-text__image"
              variants={imageReveal}
              custom={0}
              initial="hidden"
              animate={imgText.inView ? 'visible' : 'hidden'}
            >
              <Image
                src="/images/about/about-office-v2.jpg"
                alt="Creative Moon — office"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 575px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              className="about-image-text__content"
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              animate={imgText.inView ? 'visible' : 'hidden'}
            >
              <h2 className="about-image-text__heading">
                Best. User.<br />Experience. Ever.
              </h2>
              <p className="about-image-text__desc">
                At least, that&apos;s what I aim for. My goal for every project
                is the same: to elevate the connection between brands and their
                audience through design. I specialise in{' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: '0.2em' }}>
                  Web Design, UI/UX, Front-end Development, Brand Identity
                  and Creative Direction
                </span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          4. TWO-COLUMN IMAGES
      ───────────────────────────────────────────────────────── */}
      <section className="about-image-2col" data-theme="light" ref={twoCols.ref}>
        <div className="wrapper">
          <div className="about-image-2col__inner">
            <motion.div
              className="about-image-2col__image"
              variants={imageReveal}
              custom={0}
              initial="hidden"
              animate={twoCols.inView ? 'visible' : 'hidden'}
            >
              <Image
                src="/images/about/about-detail-01-v5.jpg"
                alt="Creative Moon — design process"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 575px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div
              className="about-image-2col__image"
              variants={imageReveal}
              custom={0.15}
              initial="hidden"
              animate={twoCols.inView ? 'visible' : 'hidden'}
            >
              <Image
                src="/images/about/about-detail-02-v2.jpg"
                alt="Creative Moon — development"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 575px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          5. TEXT LEFT — "It's all about the people"
      ───────────────────────────────────────────────────────── */}
      <section className="about-text-left" data-theme="light" ref={textLeft.ref}>
        <div className="wrapper">
          <motion.h2
            className="about-text-left__heading"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={textLeft.inView ? 'visible' : 'hidden'}
          >
            It&apos;s all about<br />the craft,<br />the craft.
          </motion.h2>

          <motion.div
            className="about-text-left__content"
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            animate={textLeft.inView ? 'visible' : 'hidden'}
          >
            <p>
              I put people first. Everything else flows from there.
              There are the users, who are the heart of every design decision.
              Then there are the clients, who trust me with their vision.
              Both deserve the same dedication — meticulous attention to detail,
              empathy-driven design, and solutions that truly work.{' '}
              <Link href="/projects">See my work</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          6. TEXT RIGHT — "If you're gonna do it..."
      ───────────────────────────────────────────────────────── */}
      <section className="about-text-right" data-theme="light" ref={textRight.ref}>
        <div className="wrapper">
          <div className="about-text-right__inner">
            <motion.div
              className="about-text-right__content"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate={textRight.inView ? 'visible' : 'hidden'}
            >
              <h2 className="about-text-right__heading">
                If you&apos;re gonna do it,<br />do it right, right?
              </h2>
              <p className="about-text-right__desc">
                Clients choose me because I develop projects that focus on quality.
                I don&apos;t act fast and think later, as often happens. I founded
                Creative Moon because I like to see the bigger picture. I appreciate
                what I do, and I like to work with clients and teams that share this
                crucial yet simple philosophy: If you&apos;re going to do it, do it right!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          7. AWARDS
      ───────────────────────────────────────────────────────── */}
      <section className="about-awards" data-theme="dark" ref={awardsSection.ref}>
        <div className="wrapper">
          <div className="about-awards__inner">
            <motion.h2
              className="about-awards__heading"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate={awardsSection.inView ? 'visible' : 'hidden'}
            >
              I&apos;ve won<br />some awards.
            </motion.h2>

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
          <motion.h2
            className="about-compliance__title"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={complianceSection.inView ? 'visible' : 'hidden'}
          >
            An important commitment to my clients.
          </motion.h2>

          <div className="about-compliance__grid">
            {compliance.map((item, i) => (
              <motion.div
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
              </motion.div>
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
    <motion.div
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
    </motion.div>
  );
}
