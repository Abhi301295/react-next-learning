import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import {
  isHttpOk,
  isJsonRecordWithNumericId,
  runUpstreamJson,
  type HttpErr,
} from "@/lib/server-upstream";
import { cache } from "react";
import type { UpstreamUserDetail } from "./types";

export type { UpstreamUserDetail } from "./types";

export type FetchUserDetailResult =
  | { ok: true; user: UpstreamUserDetail }
  | { ok: false; kind: "not_found" }
  | { ok: false; kind: "invalid" }
  | { ok: false; kind: "error"; cause: HttpErr };

function detailFromUpstream(data: Record<string, unknown>): UpstreamUserDetail | null {
  if (typeof data.id !== "number") return null;
  const fn = typeof data.firstName === "string" ? data.firstName : "";
  const ln = typeof data.lastName === "string" ? data.lastName : "";
  const username = typeof data.username === "string" ? data.username.trim() : "";
  const name = `${fn} ${ln}`.trim() || username || `User ${data.id}`;
  if (typeof data.email !== "string") return null;
  const user: UpstreamUserDetail = { id: data.id, name, email: data.email };
  if (typeof data.phone === "string") user.phone = data.phone;
  if (typeof data.image === "string") user.image = data.image;
  const company = data.company;
  if (
    typeof company === "object" &&
    company !== null &&
    "name" in company &&
    typeof (company as { name: unknown }).name === "string"
  ) {
    user.company = { name: (company as { name: string }).name };
  }
  return user;
}

async function fetchUserByIdImpl(
  id: string
): Promise<FetchUserDetailResult> {
  const path = `users/${encodeURIComponent(id)}`;
  const json = await runUpstreamJson<unknown>(path);
  if (!isHttpOk(json)) {
    if (json.kind === "http" && json.status === 404) {
      return { ok: false, kind: "not_found" };
    }
    return { ok: false, kind: "error", cause: json };
  }
  const data = json.data;
  if (!isJsonRecordWithNumericId(data)) {
    return { ok: false, kind: "invalid" };
  }
  const normalized = detailFromUpstream(data as Record<string, unknown>);
  if (!normalized) {
    return { ok: false, kind: "invalid" };
  }
  return { ok: true, user: normalized };
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
