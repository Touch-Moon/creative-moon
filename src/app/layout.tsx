import type { Metadata, Viewport } from "next";
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
import PageTransition from "@/components/common/PageTransition";

export const metadata: Metadata = {
  title: "Creative Moon | Portfolio",
  description: "Creative Moon's new portfolio site",
};

// iOS Safari 상태바 / 주소바 초기 색상 (JS에서 동적 업데이트됨)
export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    // 1. Add attributes to the html tag
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
      </head>
      {/* 2. Add attributes to the body tag as well */}
      <body suppressHydrationWarning>
        <FontLoader>
          <SmoothScroll>
            {/* ✅ Viewport-based background transition layer + iOS 상태바 색상 동기화 */}
            <ThemeBackground />

            {/* ✅ Header rendered above all pages */}
            <Header />

            {/* ✅ Actual page content — PageTransition이 화이트 커튼 처리 */}
            <PageTransition>{children}</PageTransition>

            {/* ✅ Footer rendered below all pages */}
            <Footer />
          </SmoothScroll>
        </FontLoader>
      </body>
    </html>
  );
}
