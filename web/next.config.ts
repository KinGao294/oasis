import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow importing JSON files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.yaml$/,
      use: 'yaml-loader',
    });
    return config;
  },
  
  // Image domains for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.hdslb.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.hdslb.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.hdslb.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.fireside.fm',
      },
    ],
  },
  
  // Base path (uncomment if deploying to subdirectory)
  // basePath: '/oasis',
};

export default nextConfig;
