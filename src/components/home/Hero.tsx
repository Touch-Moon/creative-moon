'use client';
import { motion, type Variants } from "framer-motion";
import type { BezierDefinition } from "framer-motion";
import "./Hero.scss";

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];
const EASE_INOUT: BezierDefinition = [0.76, 0, 0.24, 1];

export default function Hero() {
  const lines = ["Transform ideas", "into fluid digital", "solutions."];

  const maskVariants: Variants = {
    hidden: {
      y: "115%",
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    },
    visible: (i: number) => ({
      y: 0,
      clipPath: "polygon(0% -20%, 100% -20%, 100% 120%, 0% 120%)",
      transition: {
        duration: 1.6,
        ease: EASE_OUT,
        delay: i * 0.12,
      },
    }),
  };

  const sectionVariants: Variants = {
    initial: { height: "100vh" },
    animate: {
      height: "80vh",
      transition: {
        duration: 1.4,
        ease: EASE_INOUT,
        delay: 0.75,
      }
    }
  };

  return (
    <motion.section
      className="home-hero"
      data-theme="light"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
    >
      <div className="wrap">
      <h1 className="home-hero__title">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="home-hero__word">
            {line.split(" ").map((word, wordIndex) => (
              <div key={wordIndex} className="home-hero__module">
                <motion.div
                  custom={lineIndex * 1.5 + wordIndex}
                  variants={maskVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {word}
                </motion.div>
              </div>
            ))}
          </div>
        ))}
      </h1>
      </div>
    </motion.section>
  );
}
