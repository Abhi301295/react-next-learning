import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import { messages } from "@/lib/constants/messages";
import type { HttpErr } from "@/lib/http-result";
import { cache } from "react";
import {
  getUserRecordById,
  userRecordToProfileDto,
} from "@/lib/users/user-repository";
import type { UserProfileDto } from "./types";

export type { UserProfileDto } from "./types";

export type FetchUserDetailResult =
  | { ok: true; user: UserProfileDto }
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
    const row = await getUserRecordById(trimmed);
    if (!row) {
      return { ok: false, kind: "not_found" };
    }
    const user = userRecordToProfileDto(row.id, row.data);
    return { ok: true, user };
  } catch (e: unknown) {
    return {
      ok: false,
      kind: "error",
      cause: {
        ok: false,
        kind: "network",
        message:
          e instanceof Error ? e.message : messages.users.detailLoadFailed,
      },
    };
  }
}

export const fetchUserById = cache(fetchUserByIdImpl);

export function userDetailMetadataFallback(id: string) {
  const title = `User ${id}`;
  const description = messages.users.detailMissingDescription;
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
