import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://user-dashboard.local";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/dashboard", "/day1", "/day2", "/day3", "/day5", "/day6", "/day7", "/day8", "/login"],
      disallow: ["/testing"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
