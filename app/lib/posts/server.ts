import {
  isHttpOk,
  isJsonRecordWithNumericId,
  runUpstreamJson,
  type HttpErr,
} from "@/lib/server-upstream";
import type { UpstreamPost } from "./types";

export type { UpstreamPost } from "./types";

export type FetchPostDetailResult =
  | { ok: true; post: UpstreamPost }
  | { ok: false; kind: "not_found" }
  | { ok: false; kind: "invalid" }
  | { ok: false; kind: "error"; cause: HttpErr };

export async function fetchPostById(
  id: string
): Promise<FetchPostDetailResult> {
  const path = `posts/${encodeURIComponent(id)}`;
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
  return { ok: true, post: data as UpstreamPost };
}

export function postDetailMetadataFallback(id: string) {
  return {
    title: `Post ${id}`,
    description: "Post could not be loaded.",
    alternates: { canonical: `/posts/${id}` } as const,
  };
}
