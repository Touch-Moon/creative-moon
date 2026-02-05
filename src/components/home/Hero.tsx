'use client';
import { motion } from "framer-motion";
import "./Hero.scss";

export default function Hero() {
  const lines = ["Transform ideas", "into fluid digital", "solutions."];

  // 1. 텍스트 마스크 애니메이션 (기존 유지)
  const maskVariants = {
    hidden: { 
      y: "115%", 
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
    },
    visible: (i: number) => ({
      y: 0,
      clipPath: "polygon(0% -20%, 100% -20%, 100% 120%, 0% 120%)",
      transition: {
        duration: 1.6,
        ease: [0.19, 1, 0.22, 1],
        delay: i * 0.12,
      },
    }),
  };

  // 2. 섹션 높이 애니메이션 설정
  const sectionVariants = {
    initial: { height: "100vh" },
    animate: { 
      height: "80vh",
      transition: {
        duration: 1.4,
        ease: [0.76, 0, 0.24, 1], // 쫀득한 가속도
        delay: 2.0, // 텍스트가 거의 다 올라온 뒤 시작
      }
    }
  };

  return (
    <motion.section 
      className="home-hero"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
    >
      <h1 className="home-hero-title">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="home-hero-word">
            {line.split(" ").map((word, wordIndex) => (
              <div key={wordIndex} className="home-hero-word-module">
                <motion.div
                  custom={lineIndex * 1.5 + wordIndex}
                  variants={maskVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ willChange: 'transform, clip-path' }}
                >
                  {word}
                </motion.div>
              </div>
            ))}
          </div>
        ))}
      </h1>
    </motion.section>
  );
}