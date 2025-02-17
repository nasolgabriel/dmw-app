import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    turbo: false,
  },
};

// next.config.js
module.exports = {
  experimental: {
    turbo: false,
  },
  async rewrites() {
    return [
      {
        source: '/:path*', // Matches all routes
        destination: '/',  // Always serve the SPA entry point
      },
    ];
  },
};


export default nextConfig;
