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

import MotionProvider from "@/components/common/MotionProvider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://creative-moon.com';
const OG_DESC = 'Creative Moon is a design-driven studio crafting interactive, high-quality digital experiences — strategy, branding, and digital products.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Creative Moon | Design-Driven Digital Studio',
    template: '%s | Creative Moon',
  },
  description: OG_DESC,
  keywords: ['web design', 'branding', 'digital products', 'UX design', 'creative studio', 'portfolio'],
  authors: [{ name: 'Creative Moon', url: SITE_URL }],
  creator: 'Creative Moon',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'Creative Moon',
    title: 'Creative Moon | Design-Driven Digital Studio',
    description: OG_DESC,
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Creative Moon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Moon | Design-Driven Digital Studio',
    description: OG_DESC,
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
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
        {/* ✅ Skip-to-content: 키보드 사용자 메인 콘텐츠 바로 이동 */}
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <FontLoader>
          <MotionProvider>
          <SmoothScroll>
            {/* ✅ Viewport-based background transition layer + iOS 상태바 색상 동기화 */}
            <ThemeBackground />

            {/* ✅ Header rendered above all pages */}
            <Header />

            {/* ✅ Actual page content — PageTransition이 화이트 커튼 처리 */}
            <main id="main-content">
              {children}
            </main>

            {/* ✅ Footer rendered below all pages */}
            <Footer />
          </SmoothScroll>
          </MotionProvider>
        </FontLoader>
      </body>
    </html>
  );
}
