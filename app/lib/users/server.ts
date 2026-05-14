import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import type { HttpErr } from "@/lib/http-result";
import { cache } from "react";
import {
  directoryDocToDetail,
  getDirectoryUserById,
} from "@/lib/users/directory-repository";
import type { UpstreamUserDetail } from "./types";

export type { UpstreamUserDetail } from "./types";

export type FetchUserDetailResult =
  | { ok: true; user: UpstreamUserDetail }
  | { ok: false; kind: "not_found" }
  | { ok: false; kind: "invalid" }
  | { ok: false; kind: "error"; cause: HttpErr };

async function fetchUserByIdImpl(
  id: string
): Promise<FetchUserDetailResult> {
  const trimmed = id.trim();
  if (!trimmed) {
    return { ok: false, kind: "invalid" };
  }

  try {
    const row = await getDirectoryUserById(trimmed);
    if (!row) {
      return { ok: false, kind: "not_found" };
    }
    const user = directoryDocToDetail(row.id, row.data);
    return { ok: true, user };
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "error",
      cause: {
        ok: false,
        kind: "network",
        message: e instanceof Error ? e.message : "Failed to load user.",
      },
    };
  }
}

export const fetchUserById = cache(fetchUserByIdImpl);

export function userDetailMetadataFallback(id: string) {
  const title = `User ${id}`;
  const description = "This user could not be loaded.";
  return {
    title,
    description,
    alternates: { canonical: `/users/${id}` } as const,
    robots: { index: false, follow: true } as const,
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: `/users/${id}`,
      images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
    },
    twitter: {
      card: "summary" as const,
      title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
    },
  };
}
