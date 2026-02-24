import type { Metadata } from "next";
import "./globals.css";
import "@/styles/base/_reset.scss";
import "@/styles/tokens/_typography.scss";
import "@/styles/tokens/_spacing.scss";
import "@/styles/type/_body.scss";
import "@/styles/type/_headlines.scss";
import "@/styles/components/_button.scss";
import "@/styles/components/_form.scss";
import "@/styles/pages/_style-guide.scss";
import "@/styles/pages/_css-doc.scss";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ThemeBackground from "@/components/common/ThemeBackground";
import FontLoader from "@/components/common/FontLoader";
import SmoothScroll from "@/components/common/SmoothScroll";

export const metadata: Metadata = {
  title: "Creative Moon | Portfolio",
  description: "Creative Moon의 새로운 포트폴리오 사이트",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    // 1. html 태그에 속성 추가
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
      </head>
      {/* 2. body 태그에도 속성 추가 */}
      <body suppressHydrationWarning>
        <FontLoader>
          <SmoothScroll>
            {/* ✅ 뷰포트 기반 배경 전환 레이어 */}
            <ThemeBackground />

            {/* ✅ 모든 페이지 위에 Header 노출 */}
            <Header />

            {/* ✅ 실제 페이지 내용들 */}
            {children}

            {/* ✅ 모든 페이지 아래에 Footer 노출 */}
            <Footer />
          </SmoothScroll>
        </FontLoader>
      </body>
    </html>
  );
}
