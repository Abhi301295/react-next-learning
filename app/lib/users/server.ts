import {
  isHttpOk,
  isJsonRecordWithNumericId,
  runUpstreamJson,
  type HttpErr,
} from "@/lib/server-upstream";
import type { UpstreamUserDetail } from "./types";

export type { UpstreamUserDetail } from "./types";

export type FetchUserDetailResult =
  | { ok: true; user: UpstreamUserDetail }
  | { ok: false; kind: "not_found" }
  | { ok: false; kind: "invalid" }
  | { ok: false; kind: "error"; cause: HttpErr };

export async function fetchUserById(
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
  return { ok: true, user: data as UpstreamUserDetail };
}

export function userDetailMetadataFallback(id: string) {
  return {
    title: `User ${id}`,
    description: "This user could not be loaded.",
    alternates: { canonical: `/users/${id}` } as const,
  };
}
