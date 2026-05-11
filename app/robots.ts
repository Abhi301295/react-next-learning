import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://user-dashboard.local";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/testing",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
