import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import ProductsPageClient from "./ProductsPageClient";

const ogTitle = "Products | User Dashboard";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse catalog items with search, category filters, sortable columns, and pagination backed by DummyJSON.",
  alternates: {
    canonical: "/products",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: ogTitle,
    description:
      "Search, filter by category, sort, and open each product detail page from the dashboard.",
    type: "website",
    url: "/products",
    siteName: "User Dashboard",
    locale: "en_US",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description:
      "Search, filter by category, sort, and open each product detail page from the dashboard.",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
