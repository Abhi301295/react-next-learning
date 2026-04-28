import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"  
  },
  async rewrites() {
    return [
      {
        source: "/api/users",
        destination: `${process.env.API_BASE_URL}/users`,
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
