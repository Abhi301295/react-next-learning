import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardContent } from "./DashboardContent";
import { DashboardContentSkeleton } from "./DashboardSkeleton";

export const dynamic = "force-dynamic";

const title = "Dashboard";
const description =
  "Overview of user totals, active vs inactive members, and recent activity across products and new directory entries.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    title: `${title} | User Dashboard`,
    description,
    url: "/dashboard",
    type: "website",
    images: [
      {
        url: "/file.svg",
        alt: "User Dashboard application preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | User Dashboard`,
    description,
    images: ["/file.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1
          id="dashboard-title"
          className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Dashboard
        </h1>
        <p className="max-w-2xl text-sm text-subtle sm:text-base">
          Live metrics from your user directory and a compact activity feed
          sourced from the latest products and newest members. Jump to{" "}
          <Link
            href="/users"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Users
          </Link>{" "}
          or{" "}
          <Link
            href="/products"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Products
          </Link>{" "}
          for full lists.
        </p>
      </header>

      <Suspense fallback={<DashboardContentSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
