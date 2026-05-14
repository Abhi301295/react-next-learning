import type { HttpResult } from "@/lib/http-result";
import { responseToJsonResult } from "@/lib/http-result";
import { messages } from "@/lib/constants/messages";

export type { HttpResult, HttpErr, HttpOk } from "@/lib/http-result";
export {
  isHttpOk,
  httpErrPublicMessage,
  responseToJsonResult,
} from "@/lib/http-result";

export function appApiUrl(pathUnderApi: string): string {
  const clean = pathUnderApi.replace(/^\//, "");
  return `/api/${clean}`;
}

export function appApiFetch(
  pathUnderApi: string,
  init?: RequestInit
): Promise<Response> {
  const url = appApiUrl(pathUnderApi);
  const headers = new Headers(init?.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  return fetch(url, { ...init, headers });
}

export async function runAppApiJson<T>(
  pathUnderApi: string,
  init?: RequestInit
): Promise<HttpResult<T>> {
  let res: Response;
  try {
    res = await appApiFetch(pathUnderApi, init);
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return { ok: false, kind: "aborted" };
    }
    return {
      ok: false,
      kind: "network",
      message:
        e instanceof Error ? e.message : messages.http.networkError,
    };
  }
  return responseToJsonResult<T>(res);
}
