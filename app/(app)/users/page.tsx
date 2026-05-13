import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import UsersPageClient from "./UsersPageClient";

const usersDescription =
  "Browse the user directory with sortable columns, role and status filters, and mobile-friendly list cards. Open any profile for full contact details.";

export const metadata: Metadata = {
  title: "Users",
  description: usersDescription,
  alternates: {
    canonical: "/users",
  },
  openGraph: {
    title: "Users | User Dashboard",
    description: usersDescription,
    url: "/users",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Users | User Dashboard",
    description: usersDescription,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  robots: { index: true, follow: true },
};

export default function UsersPage() {
  return <UsersPageClient />;
}

