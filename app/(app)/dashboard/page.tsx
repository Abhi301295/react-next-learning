import type { Metadata } from "next";
import { Suspense } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/metadata/defaults";
import { DashboardContent } from "./DashboardContent";
import { DashboardContentSkeleton } from "./DashboardSkeleton";

/** Matches `fetch` cache in dashboard snapshot + avoids fully-dynamic TTFB on every visit. */
export const revalidate = 60;

const title = "Dashboard";
const description =
  "Summary of people in the workspace and recent directory activity.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: "/dashboard",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1
          id="dashboard-title"
          className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Dashboard
        </h1>
      </header>

      <Suspense fallback={<DashboardContentSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
