import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*", // Matches all routes
        destination: "/", // Always serve the SPA entry point
      },
    ];
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
