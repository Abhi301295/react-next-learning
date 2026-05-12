import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import { httpErrPublicMessage } from "@/lib/server-upstream";
import {
  fetchUserById,
  userDetailMetadataFallback,
} from "@/lib/users/server";

type Props = { children: ReactNode; params: Promise<{ id: string }> };

function userDescription(user: {
  name: string;
  email: string;
  company?: { name?: string };
}): string {
  const company = user.company?.name ? ` · ${user.company.name}` : "";
  return `Profile for ${user.name} (${user.email})${company}.`;
}

function profilePhotoUrl(raw: string | undefined): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : null;
}

/**
 * Per-user text lives on `openGraph` / `twitter` so we do not overwrite the
 * parent `users/layout` `<meta name="description">` (async replace can race
 * Lighthouse’s MetaElements snapshot).
 */
export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { id } = await params;
  const r = await fetchUserById(id);

  if (!r.ok) {
    if (r.kind === "not_found" || r.kind === "invalid") {
      return userDetailMetadataFallback(id);
    }
    throw new Error(httpErrPublicMessage(r.cause));
  }

  const user = r.user;
  const description = userDescription(user);
  const portrait = profilePhotoUrl(user.image);
  const socialImages = portrait
    ? [{ url: portrait, alt: `Profile photo for ${user.name}` }]
    : [
        {
          url: DEFAULT_OG_IMAGE.url,
          alt: `${user.name} · ${DEFAULT_OG_IMAGE.alt}`,
        },
      ];

  return {
    title: user.name,
    alternates: {
      canonical: `/users/${user.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: user.name,
      description,
      type: "profile",
      url: `/users/${user.id}`,
      images: socialImages,
    },
    twitter: {
      card: portrait ? "summary_large_image" : "summary",
      title: user.name,
      description,
      images: socialImages,
    },
  };
}

export default function UserDetailLayout({ children }: { children: ReactNode }) {
  return children;
}
