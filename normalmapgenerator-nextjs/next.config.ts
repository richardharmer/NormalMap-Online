import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置 - 适合Vercel免费部署
  output: 'export',

  // 图片优化配置
  images: {
    unoptimized: true, // 静态导出需要
  },

  // 严格模式
  reactStrictMode: true,

  // 尾部斜杠
  trailingSlash: true,
};

export default nextConfig;
