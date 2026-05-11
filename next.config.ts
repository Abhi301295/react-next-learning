import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const API_BASE_URL = process.env.API_BASE_URL ?? "https://dummyjson.com";

if (isProd && !process.env.API_BASE_URL) {
  throw new Error("API_BASE_URL must be defined in production.");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      /**
       * Proxies `/api/*` → upstream for client-side `/api/products` calls, etc.
       * Prefer App Router **`app/api/.../route.ts`** handlers (e.g. `api/auth`) for
       * anything that must not hit the upstream verbatim.
       */
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