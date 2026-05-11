import { appApiFetch, isHttpOk, responseToJsonResult } from "@/lib/app-api";
import type { HttpResult } from "@/lib/http-result";
import type { UpstreamUserListItem } from "./types";

export async function fetchUserListWithQuery(
  params: URLSearchParams,
  signal?: AbortSignal
): Promise<HttpResult<{ users: UpstreamUserListItem[]; total: number }>> {
  const qs = params.toString();
  const path = qs ? `users?${qs}` : "users";
  let res: Response;
  try {
    res = await appApiFetch(path, { signal });
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
  const json = await responseToJsonResult<UpstreamUserListItem[]>(res);
  if (!isHttpOk(json)) {
    return json;
  }
  const totalFromHeader = Number(res.headers.get("x-total-count"));
  return {
    ok: true,
    status: res.status,
    data: {
      users: json.data,
      total: Number.isFinite(totalFromHeader) ? totalFromHeader : 0,
    },
  };
}
