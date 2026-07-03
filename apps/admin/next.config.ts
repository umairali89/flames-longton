import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@flames/ui', '@flames/theme', '@flames/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
