import type { NextConfig } from "next";
import { DEFAULT_UPSTREAM_API_ORIGIN } from "./app/lib/upstream/default-origin";

const isProd = process.env.NODE_ENV === "production";
const API_BASE_URL = process.env.API_BASE_URL ?? DEFAULT_UPSTREAM_API_ORIGIN;

if (isProd && !process.env.API_BASE_URL) {
  throw new Error("API_BASE_URL must be defined in production.");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
    ],
  },
  images: {
    remotePatterns: (() => {
      const upstream = new URL(API_BASE_URL);
      const protocol = upstream.protocol === "https:" ? "https" : "http";
      return [
        {
          protocol,
          hostname: upstream.hostname,
          pathname: "/**",
        },
      ];
    })(),
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;