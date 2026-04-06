import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // AliExpress CDN
      { protocol: 'https', hostname: '**.alicdn.com' },
      { protocol: 'https', hostname: '**.aliexpress.com' },
      // Amazon
      { protocol: 'https', hostname: 'images-amazon.com' },
      { protocol: 'https', hostname: '**.images-amazon.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
      // Alibaba
      { protocol: 'https', hostname: '**.alibaba.com' },
      { protocol: 'https', hostname: '**.alibabaimg.com' },
    ],
  },
};

export default nextConfig;
