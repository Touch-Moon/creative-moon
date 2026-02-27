'use client';
import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import type { BezierDefinition } from "framer-motion";
import { useFontsLoaded } from "@/context/FontContext";
import "./Hero.scss";

const EASE_OUT: BezierDefinition = [0.19, 1, 0.22, 1];
const EASE_INOUT: BezierDefinition = [0.76, 0, 0.24, 1];

export default function Hero() {
  const fontsLoaded = useFontsLoaded();
  const lines = ["Transform ideas", "into fluid digital", "solutions."];

  // 매 마운트마다 false → true 변화를 만들어 페이지 전환 후에도 애니메이션 재실행
  const [shouldAnimate, setShouldAnimate] = useState(false);
  useEffect(() => {
    if (fontsLoaded) {
      setShouldAnimate(true);
    }
  }, [fontsLoaded]);

  /* ── clip-path on .home-hero__module (parent mask) ── */
  const clipVariants: Variants = {
    hidden: {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    },
    visible: (i: number) => ({
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      transition: {
        duration: 1.2,
        ease: EASE_OUT,
        delay: i * 0.12,
      },
    }),
  };

  /* ── translateY on inner child ── */
  const slideVariants: Variants = {
    hidden: {
      y: "100%",
    },
    visible: (i: number) => ({
      y: "0%",
      transition: {
        duration: 1.2,
        ease: EASE_OUT,
        delay: i * 0.12,
      },
    }),
  };

  /* ── section height shrink ── */
  const sectionVariants: Variants = {
    initial: { height: "100vh" },
    animate: {
      height: "80vh",
      transition: {
        duration: 1.4,
        ease: EASE_INOUT,
        delay: 0.75,
      },
    },
  };

  /* shouldAnimate가 true일 때만 애니메이션 트리거
     (페이지 전환 후에도 false → true 변화가 생겨 재실행됨) */
  const animState = shouldAnimate ? "visible" : "hidden";
  const sectionAnimState = shouldAnimate ? "animate" : "initial";

  return (
    <motion.section
      className="home-hero"
      data-theme="light"
      variants={sectionVariants}
      initial="initial"
      animate={sectionAnimState}
    >
      <div className="wrap">
        <h1 className="home-hero__title">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="home-hero__word">
              {line.split(" ").map((word, wordIndex) => {
                const i = lineIndex * 1.5 + wordIndex;
                return (
                  <motion.div
                    key={wordIndex}
                    className="home-hero__module"
                    custom={i}
                    variants={clipVariants}
                    initial="hidden"
                    animate={animState}
                  >
                    <motion.div
                      className="home-hero__module-child"
                      custom={i}
                      variants={slideVariants}
                      initial="hidden"
                      animate={animState}
                    >
                      {word}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </h1>
      </div>
    </motion.section>
  );
}
