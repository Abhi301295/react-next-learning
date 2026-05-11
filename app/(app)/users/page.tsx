import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import UsersPageClient from "./UsersPageClient";

export const metadata: Metadata = {
  title: "Users",
  description: "Browse and manage users.",
  alternates: {
    canonical: "/users",
  },
  openGraph: {
    title: "Users | User Dashboard",
    description: "Browse and manage users.",
    url: "/users",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Users | User Dashboard",
    description: "Browse and manage users.",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  robots: { index: true, follow: true },
};

export default function UsersPage() {
  return <UsersPageClient />;
}

