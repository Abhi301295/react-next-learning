import { type HttpResult, responseToJsonResult } from "@/lib/http-result";

export type UpstreamRequestInit = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export type { HttpResult, HttpErr, HttpOk } from "@/lib/http-result";
export { isHttpOk, httpErrPublicMessage, responseToJsonResult } from "@/lib/http-result";

export function getUpstreamApiOrigin(): string {
  return process.env.API_BASE_URL ?? "https://dummyjson.com";
}

export function upstreamUrl(path: string): string {
  const base = getUpstreamApiOrigin().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function upstreamFetch(
  path: string,
  init?: UpstreamRequestInit
): Promise<Response> {
  const url = upstreamUrl(path);
  const { next, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  return fetch(url, {
    ...rest,
    headers,
    next: next ?? { revalidate: 300 },
  });
}

export async function runUpstreamJson<T>(
  path: string,
  init?: UpstreamRequestInit
): Promise<HttpResult<T>> {
  let res: Response;
  try {
    res = await upstreamFetch(path, init);
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
  return responseToJsonResult<T>(res);
}

export function isJsonRecordWithNumericId(
  value: unknown
): value is { id: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as { id: unknown }).id === "number"
  );
}
