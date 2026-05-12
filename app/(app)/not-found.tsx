import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
  description:
    "That page or record is not available in the dashboard. Use the links below to continue.",
  robots: {
    index: false,
    follow: true,
  },
};

const linkClass =
  "inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-lg border border-stroke bg-panel px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function AppNotFound() {
  return (
    <section
      className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-12 text-center"
      aria-labelledby="app-not-found-title"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-subtle">
          404
        </p>
        <h1
          id="app-not-found-title"
          className="text-display-sm font-semibold text-brand-600"
        >
          We could not find that
        </h1>
        <p className="text-subtle">
          The address may be wrong, or the item may have been removed. Choose a
          section below to keep working.
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
    </section>
  );
}
