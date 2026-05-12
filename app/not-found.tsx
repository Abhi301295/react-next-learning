import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you requested is not part of this dashboard. Use the links below to continue.",
  robots: {
    index: false,
    follow: true,
  },
};

const linkClass =
  "inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-lg border border-stroke bg-panel px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-subtle">
          Error 404
        </p>
        <h1 className="text-display-sm font-semibold text-brand-600">
          This page does not exist
        </h1>
        <p className="text-subtle">
          The URL may be mistyped, or the page may have been moved. Pick a destination
          below to get back to your work.
        </p>
      </div>
      <nav
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
        aria-label="Suggested pages"
      >
        <Link href="/dashboard" className={linkClass}>
          Dashboard
        </Link>
        <Link href="/users" className={linkClass}>
          Users
        </Link>
        <Link href="/products" className={linkClass}>
          Products
        </Link>
      </nav>
      <p className="text-xs text-subtle">
        Need to sign in?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Go to login
        </Link>
        .
      </p>
    </main>
  );
}
