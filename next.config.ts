import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {},

  devIndicators: false, // 에러 없을 때 N 아이콘 숨김 (에러 발생 시 오버레이는 자동 표시)

  images: {
    remotePatterns: [
      // placehold.co — 더미 이미지 (Sanity 데이터 없을 때 fallback)
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      // Sanity CDN
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" },
    ],
  },
};

export default nextConfig;
