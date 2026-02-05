import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// ✅ Header와 Footer를 불러옵니다 (나중에 만들 파일들)
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// 1. PPNeueMontreal 로컬 폰트 설정
const neueMontreal = localFont({
  src: [
    {
      path: "../fonts/PPNeueMontreal-Thin.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/PPNeueMontreal-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/PPNeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/PPNeueMontreal-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal", // CSS 변수 이름
});

export const metadata: Metadata = {
  title: "Creative Moon | Portfolio",
  description: "Creative Moon의 새로운 포트폴리오 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {/* ✅ 모든 페이지 위에 Header 노출 */}
        <Header />
        
        {/* ✅ 실제 페이지 내용들 */}
        {children}
        
        {/* ✅ 모든 페이지 아래에 Footer 노출 */}
        <Footer />
      </body>
    </html>
  );
}