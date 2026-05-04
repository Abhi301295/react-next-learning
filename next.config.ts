import type { NextConfig } from "next";

const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:3000";

if (!process.env.API_BASE_URL) {
  console.warn(
    "⚠️ API_BASE_URL is not defined. Falling back to http://localhost:3000"
  );
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      {
        source: "/api/users",
        destination: `${API_BASE_URL}/users`,
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