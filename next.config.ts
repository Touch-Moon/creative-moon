import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {},

  devIndicators: false, // 에러 없을 때 N 아이콘 숨김 (에러 발생 시 오버레이는 자동 표시)

  // Allow local network IPs to access the dev server (HMR WebSocket + cross-origin).
  // Next 15.2+ blocks cross-origin dev requests by default.
  allowedDevOrigins: ['192.168.68.60'],

  images: {
    // AVIF → WebP → 원본 순으로 브라우저 지원에 따라 자동 제공
    formats: ['image/avif', 'image/webp'],
    // 30일 캐시 (기본값 60초 → 대폭 개선)
    minimumCacheTTL: 2592000,
    // /_next/image 허용 너비 목록 (기본값에 960 추가 — WorkList half 카드용)
    deviceSizes: [640, 750, 828, 960, 1080, 1200, 1920, 2048, 3840],
    // /_next/image 허용 quality 목록 (미지정 시 Next.js 15는 기본값만 허용)
    qualities: [75, 80, 85, 90],
    remotePatterns: [
      // placehold.co — 더미 이미지 (Sanity 데이터 없을 때 fallback)
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      // Sanity CDN
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
    ],
  },
};

export default nextConfig;
