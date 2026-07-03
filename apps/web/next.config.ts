import type { NextConfig } from 'next';

function resolveApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  const base = (process.env.API_SERVICE_URL || 'http://localhost:4000').replace(/\/$/, '');
  return `${base}/v1`;
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: resolveApiUrl(),
  },
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
