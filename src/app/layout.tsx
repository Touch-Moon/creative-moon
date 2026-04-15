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
const OG_DESC = "I'm a Design Engineer based in Canada — I design in Figma and ship in Next.js. Crafting interaction-driven websites where design and engineering are owned end-to-end.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Creative Moon | Design Engineer Portfolio',
    template: '%s | Creative Moon',
  },
  description: OG_DESC,
  keywords: ['design engineer', 'UI/UX design', 'front-end development', 'React', 'Next.js', 'portfolio', 'Figma'],
  authors: [{ name: 'Creative Moon', url: SITE_URL }],
  creator: 'Creative Moon',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'Creative Moon',
    title: 'Creative Moon | Design Engineer Portfolio',
    description: OG_DESC,
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Creative Moon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Moon | Design Engineer Portfolio',
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

// Initial color for iOS Safari status bar / address bar (dynamically updated by JS)
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
        {/* ✅ Skip-to-content: allows keyboard users to jump directly to main content */}
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <FontLoader>
          <MotionProvider>
          <SmoothScroll>
            {/* ✅ Viewport-based background transition layer + iOS status bar color sync */}
            <ThemeBackground />

            {/* ✅ Header rendered above all pages */}
            <Header />

            {/* ✅ Actual page content — PageTransition handles the white curtain effect */}
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
