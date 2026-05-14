import { NavPanelLink } from "@/components/ui/NavPanelLink";
import { PageHeading } from "@/components/ui/PageHeading";
import { TextLink } from "@/components/ui/TextLink";
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

export default function NotFound() {
  return (
    <section
      className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-12 text-center"
      aria-labelledby="global-not-found-title"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-subtle">
          Error 404
        </p>
        <PageHeading id="global-not-found-title">
          This page does not exist
        </PageHeading>
        <p className="text-subtle">
          The URL may be mistyped, or the page may have been moved. Pick a destination
          below to get back to your work.
        </p>
      </div>
      <nav
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
        aria-label="Suggested pages"
      >
        <NavPanelLink href="/dashboard" prefetch={false}>
          Dashboard
        </NavPanelLink>
        <NavPanelLink href="/users">Users</NavPanelLink>
      </nav>
      <p className="text-xs text-subtle">
        Need to sign in?{" "}
        <TextLink href="/login" accent="brand" showFocusRing>
          Go to login
        </TextLink>
        .
      </p>
    </section>
  );
}
