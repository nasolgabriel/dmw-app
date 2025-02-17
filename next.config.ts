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

export default nextConfig;
