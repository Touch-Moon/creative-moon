'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import type { BezierDefinition } from 'framer-motion';
import './ManifestoPage.scss';

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];

const manifestoItems = [
  {
    number: '01.',
    titleLine1: 'Put people',
    titleLine2: 'first.',
    desc: 'Every interface begins with the people who use it — how they feel, what they need, and where the experience can do more.',
    svg: (
      <svg viewBox="0 0 433 50" fill="none" className="manifesto-item__svg">
        <path className="line-1" d="M6 33C144.426 14.9078 283.988 21.4657 423 15" stroke="currentColor" strokeWidth="3" />
        <path className="line-2" d="M116 43.9999C207.469 35.7124 299.349 39.632 391 40.9999" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    number: '02.',
    titleLine1: 'Make great',
    titleLine2: 'work.',
    desc: 'Quality is non-negotiable. If the work isn\'t great, it isn\'t done.',
    svg: (
      <svg viewBox="0 0 120 166" fill="none" className="manifesto-item__svg">
        <path className="exclamation-1" d="M91.9303 5C74.8182 43.7873 51.2733 81.9882 32.8125 118.91" stroke="currentColor" strokeWidth="3" />
        <path className="exclamation-2" d="M114.996 15.0938C97.9254 48.6662 80.9976 82.3134 63.889 115.866C61.7563 120.049 60.6782 121.992 57.3203 124.678" stroke="currentColor" strokeWidth="3" />
        <path className="point-1" d="M13.5492 150.499C-5.52854 157.998 24.1893 163.264 20.9427 154.375C18.129 146.67 7.43763 153.632 4.15579 157.516" stroke="currentColor" strokeWidth="3" />
        <path className="point-2" d="M51.9846 153.572C49.9148 154.19 41.1378 155.223 43.6863 159.188C45.4663 161.957 51.1413 163.503 54.0435 161.87C63.5991 156.495 46.2125 153.572 43 153.572" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    number: '03.',
    titleLine1: 'See the',
    titleLine2: 'bigger picture.',
    desc: 'Understanding where you\'re coming from helps me move in the right direction — together.',
    svg: (
      <svg viewBox="0 0 403 202" fill="none" className="manifesto-item__svg">
        <path className="rec-3" d="M180.016 19.4492C249.726 13.0944 319.19 10.546 389.06 7.36567C392.099 7.22733 393.568 7.30206 394.05 10.7042C396.871 30.5975 396.639 50.7982 399.578 70.728" stroke="currentColor" strokeWidth="3" />
        <path className="rec-1" d="M3.94066 122.235C5.567 143.746 5.97557 166.01 9.87196 187.298C10.1131 188.616 10.3585 190.765 11.1099 189.863" stroke="currentColor" strokeWidth="3" />
        <path className="rec-2" d="M9.17969 190.039C23.9772 190.67 38.7199 189.622 53.5169 189.289C105.876 188.109 158.138 186.508 210.439 183.742" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    number: '04.',
    titleLine1: 'Think globally.',
    titleLine2: '',
    desc: 'Different industries, markets, and contexts sharpen the approach. Staying curious keeps the work current.',
    svg: (
      <svg viewBox="0 0 507 278" fill="none" className="manifesto-item__svg">
        <path className="circle" d="M302.343 42.0972C75.9064 8.46663 1.06023 78.4822 16.5949 124.884C32.1295 171.286 108.104 220.67 238.64 240.976C369.176 261.281 462.564 222.716 485.814 188.897C509.064 155.078 455.706 69.029 223.04 49.5" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    number: '05.',
    titleLine1: 'Never stop',
    titleLine2: 'learning.',
    desc: 'Technology moves fast. Design moves on. So it\'s important to keep learning. It\'s fun too.',
    svg: (
      <svg viewBox="0 0 225 178" fill="none" className="manifesto-item__svg">
        <path className="curly-line" d="M3.45532 26.4969C31.3056 21.8484 41.6892 21.8079 50.0893 22.357C61.3952 23.0982 75.1534 24.3157 86.1133 27.1996C95.7575 29.7373 105.189 33.1654 113.838 38.1811C120.661 42.1371 128.662 47.8288 129.381 56.4512C129.966 63.4693 124.878 69.4436 120.046 73.8954C112.471 80.8727 102.929 84.5649 93.1364 87.2541C78.1969 91.3568 56.1005 95.5883 41.9462 86.3024C34.3866 81.3429 40.4875 75.7054 46.7252 73.6041C54.5417 70.9709 63.242 70.5647 71.4119 70.4594C87.9712 70.2458 103.735 73.3436 119.547 78.1378C136.131 83.1661 152.036 89.7095 166.862 98.7438C182.091 108.023 197.56 118.748 208.91 132.693C217.958 143.808 222.797 157.109 220.844 171.569" stroke="currentColor" strokeWidth="3" />
        <path className="arrow-1" d="M2.02344 27.2147C12.8625 28.7201 25.6741 29.6497 35.7155 33.9531" stroke="currentColor" strokeWidth="3" />
        <path className="arrow-2" d="M2.02344 24.9688C13.1765 20.3359 29.0855 17.6077 35.7155 6.99965" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    number: '06.',
    titleLine1: 'Do the',
    titleLine2: 'right thing.',
    desc: 'Clear communication, honest timelines, and fair terms. That\'s the standard for every project — and every client.',
    svg: (
      <svg viewBox="0 0 131 135" fill="none" className="manifesto-item__svg">
        <path className="eye-1" d="M31.0391 6.47266C31.793 27.3013 32.7754 48.1334 32.7754 68.9792" stroke="currentColor" strokeWidth="3" />
        <path className="eye-2" d="M57.0781 3C57.7128 26.165 59.3 49.3135 60.5507 72.4517" stroke="currentColor" strokeWidth="3" />
        <path className="smile" d="M5 126.277C50.0975 142.979 94.8758 125.018 128.277 93.2871" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
];

/* ── Individual Manifesto item ── */
function ManifestoItem({ item, index }: { item: typeof manifestoItems[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });

  return (
    <div ref={ref} className={`manifesto-item${inView ? ' is-visible' : ''}`}>
      {/* Line */}
      <div className="manifesto-item__line">
        <m.div
          className="manifesto-item__line-inner"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
        />
      </div>

      {/* Content */}
      <m.div
        className="manifesto-item__content"
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 1.0, ease: EASE_OUT, delay: 0.2 }}
      >
        <div className="manifesto-item__title">
          <h2 className="headline-2 manifesto-item__title-text">
            {item.titleLine1}
            {item.titleLine2 && <><br />{item.titleLine2}</>}
          </h2>
          <span className="headline-3 manifesto-item__title-number">{item.number}</span>
          {item.svg}
        </div>
        <p className="manifesto-item__description body-text-3">
          {item.desc}
        </p>
      </m.div>
    </div>
  );
}

/* ── Main Manifesto page ── */
export default function ManifestoPage() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const stickyInView = useInView(stickyRef, { once: true, margin: '0px 0px -30% 0px' });

  const itemsRef = useRef<HTMLDivElement>(null);
  const itemsInView = useInView(itemsRef, { once: true, margin: '0px 0px -10% 0px' });

  return (
    <div className="manifesto-page" data-theme="dark">
      {/* ── Manifesto section ── */}
      <section className="manifesto-section">
        <div className="wrapper">
          <div className="manifesto-section__content">
            {/* Left sticky text */}
            <div className="manifesto-section__sticky-col" ref={stickyRef}>
              <m.div
                className="manifesto-section__sticky"
                initial={{ opacity: 0 }}
                animate={stickyInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.2, ease: EASE_OUT }}
              >
                <div className="manifesto-section__intro body-text-3">
                  <p>
                    Great work and good values go hand in hand.
                    This is the standard every project is held to.
                  </p>
                  <p className="manifesto-section__intro-em">
                    — <em>This is my Manifesto.</em>
                  </p>
                </div>
              </m.div>
            </div>

            {/* Right item list */}
            <m.div
              className="manifesto-section__items"
              ref={itemsRef}
              initial={{ opacity: 0 }}
              animate={itemsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              {manifestoItems.map((item, i) => (
                <ManifestoItem key={item.number} item={item} index={i} />
              ))}
            </m.div>
          </div>
        </div>
      </section>

    </div>
  );
}
