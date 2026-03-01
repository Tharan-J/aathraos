import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: 50 * 1024 * 1024,
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://akashc6-aathraos.hf.space/:path*",
      },
      {
        source: "/api/mobility/:path*",
        destination: "https://akashc6-aathraos-mobility.hf.space/:path*",
      },
    ];
  },
};

export default nextConfig;
