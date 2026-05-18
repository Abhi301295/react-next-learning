import { messages } from "@/lib/constants/messages";

export type HttpOk<T> = { ok: true; status: number; data: T };

export type HttpErr =
  | { ok: false; kind: "aborted" }
  | { ok: false; kind: "network"; message: string }
  | {
      ok: false;
      kind: "http";
      status: number;
      statusText: string;
      body?: string;
    }
  | { ok: false; kind: "decode"; message: string };

export type HttpResult<T> = HttpOk<T> | HttpErr;

export function isHttpOk<T>(r: HttpResult<T>): r is HttpOk<T> {
  return r.ok === true;
}

export function httpErrPublicMessage(err: HttpErr): string {
  switch (err.kind) {
    case "aborted":
      return messages.common.requestCancelled;
    case "network":
      return err.message || `${messages.http.networkError}.`;
    case "http":
      return messages.http.requestFailed(err.status, err.statusText || "");
    case "decode":
      return err.message;
  }
  return messages.common.unexpectedError;
}

export async function responseToJsonResult<T>(
  res: Response
): Promise<HttpResult<T>> {
  const text = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      kind: "http",
      status: res.status,
      statusText: res.statusText,
      body:
        text.length > 220 ? `${text.slice(0, 220)}…` : text || undefined,
    };
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      ok: false,
      kind: "decode",
      message: messages.http.emptyResponse,
    };
  }
  try {
    return { ok: true, status: res.status, data: JSON.parse(trimmed) as T };
  } catch {
    return {
      ok: false,
      kind: "decode",
      message: messages.http.invalidJson,
    };
  }
}
