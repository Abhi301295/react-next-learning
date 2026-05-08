import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";

if (isProd && !process.env.API_BASE_URL) {
  throw new Error("API_BASE_URL must be defined in production.");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
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