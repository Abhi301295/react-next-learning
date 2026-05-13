import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://user-dashboard.local";
  const lastModified = new Date();
  const routes = ["/", "/login", "/dashboard", "/users"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" || route === "/dashboard" ? 0.9 : 0.7,
  }));
}
