import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  images: {
    domains: [],
  },
  // Prevent Google Fonts from causing page reloads
  optimizeFonts: true,
  // Disable Google Fonts optimization warnings
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
