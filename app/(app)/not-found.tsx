import { NavPanelLink } from "@/components/ui/NavPanelLink";
import { PageHeading } from "@/components/ui/PageHeading";
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
        <PageHeading id="app-not-found-title">
          We could not find that
        </PageHeading>
        <p className="text-subtle">
          The address may be wrong, or the item may have been removed. Choose a
          section below to keep working.
        </p>
      </div>
      <nav
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
        aria-label="Suggested pages"
      >
        <NavPanelLink href="/dashboard">Dashboard</NavPanelLink>
        <NavPanelLink href="/users">Users</NavPanelLink>
        <NavPanelLink href="/products">Products</NavPanelLink>
      </nav>
    </section>
  );
}
