import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Python fetchers read `scripts/sources.yaml`; the Next app uses `lib/sources-data.ts` (no YAML in the bundle).

  // Turbopack can mis-infer `web/app` as the project root; pin to the package directory (cwd when running npm from `web/`).
  turbopack: {
    root: path.resolve(process.cwd()),
  },

  // Avoid persistent Turbopack dev cache (SST on disk); helps on constrained/ephemeral filesystems.
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i0.hdslb.com",
      },
      {
        protocol: "https",
        hostname: "i1.hdslb.com",
      },
      {
        protocol: "https",
        hostname: "i2.hdslb.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "assets.fireside.fm",
      },
    ],
  },

  // Base path (uncomment if deploying to subdirectory)
  // basePath: '/oasis',
};

export default nextConfig;
