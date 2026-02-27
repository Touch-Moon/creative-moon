'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import Link from 'next/link';
import './PolicyPage.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

export interface PolicySection {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

interface PolicyPageProps {
  label: string;
  title: string;
  updatedDate: string;
  sections: PolicySection[];
}

/* ── 개별 섹션 ── */
function Section({ section, index }: { section: PolicySection; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });

  return (
    <motion.div
      ref={ref}
      id={section.id}
      className="policy-section"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.05 * index }}
    >
      <div className="policy-section__divider" />
      <p className="policy-section__number">{section.number}</p>
      <h2 className="policy-section__title">{section.title}</h2>
      {section.paragraphs.map((p, i) => (
        <p key={i} className="policy-section__text">{p}</p>
      ))}
      {section.list && (
        <ul className="policy-section__list">
          {section.list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

/* ── 메인 Policy 페이지 ── */
export default function PolicyPage({ label, title, updatedDate, sections }: PolicyPageProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '0px 0px -10% 0px' });

  return (
    <div className="policy-page">
      <div className="wrapper">
        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          className="policy-header"
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.0, ease: EASE_OUT }}
        >
          <span className="policy-header__label">{label}</span>
          <h1 className="policy-header__title">{title}</h1>
          <span className="policy-header__updated">Last updated: {updatedDate}</span>
        </motion.div>

        {/* ── Content ── */}
        <div className="policy-content">
          {/* TOC */}
          <nav className="policy-toc">
            <ul className="policy-toc__list">
              {sections.map((s) => (
                <li key={s.id} className="policy-toc__item">
                  <a href={`#${s.id}`} className="policy-toc__link">
                    {s.number} {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Body */}
          <div className="policy-body">
            {sections.map((section, i) => (
              <Section key={section.id} section={section} index={i} />
            ))}

            <Link href="/" className="policy-back">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
