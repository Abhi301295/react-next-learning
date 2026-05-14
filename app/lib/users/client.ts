import { appApiFetch, isHttpOk, responseToJsonResult } from "@/lib/app-api";
import { parseUsersListEnvelope } from "@/lib/upstream/users-payload";
import type { HttpResult } from "@/lib/http-result";
import type { UpstreamUserListItem } from "./types";

export async function fetchUserList(
  opts: {
    limit: number;
    skip?: number;
    search?: string;
    sortBy: string;
    order: "asc" | "desc";
  },
  signal?: AbortSignal
): Promise<HttpResult<{ users: UpstreamUserListItem[]; total: number }>> {
  const skip = Math.max(0, opts.skip ?? 0);
  const qs = new URLSearchParams();
  qs.set("limit", opts.limit <= 0 ? "0" : String(opts.limit));
  qs.set("skip", String(skip));
  qs.set("sortBy", opts.sortBy);
  qs.set("order", opts.order);
  if (opts.search?.trim()) {
    qs.set("q", opts.search.trim());
  }
  const pathBase = `users?${qs.toString()}`;
  let res: Response;
  try {
    res = await appApiFetch(pathBase, { signal });
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { ok: false, kind: "aborted" };
    }
    return {
      ok: false,
      kind: "network",
      message: e instanceof Error ? e.message : "Network error",
    };
  }
  const json = await responseToJsonResult<unknown>(res);
  if (!isHttpOk(json)) return json;
  const env = parseUsersListEnvelope(json.data);
  if (!env) {
    return {
      ok: false,
      kind: "decode",
      message: "Unexpected users response shape.",
    };
  }
  return {
    ok: true,
    status: json.status,
    data: env,
  };
}
