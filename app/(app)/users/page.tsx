/**
 * `/users` route: server prefetch (`initial-list`) + static heading for LCP, then client island.
 * @see root README — "How the `/users` list works (maintainers)"
 */
import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/metadata/defaults";
import { fetchUsersListInitialForPage } from "@/lib/users/initial-list";
import UsersListing from "./UsersListing";

const usersDescription =
  "People and accounts you can manage in this workspace.";

export const metadata: Metadata = {
  title: "Users",
  description: usersDescription,
  alternates: {
    canonical: "/users",
  },
  openGraph: {
    title: `Users | ${SITE_NAME}`,
    description: usersDescription,
    url: "/users",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Users | ${SITE_NAME}`,
    description: usersDescription,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  robots: { index: true, follow: true },
};

export const revalidate = 30;

export default async function UsersPage() {
  const initial = await fetchUsersListInitialForPage();

  return (
    <section className="space-y-4" aria-labelledby="users-title">
      <header>
        <h1
          id="users-title"
          className="text-balance text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
        >
          Users
        </h1>
      </header>
      <UsersListing initial={initial} />
    </section>
  );
}
