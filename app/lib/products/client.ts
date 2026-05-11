import { appApiFetch, isHttpOk, responseToJsonResult } from "@/lib/app-api";
import { djProductsEnvelope } from "@/lib/dummy-json/payload";
import type { HttpResult } from "@/lib/http-result";
import type { UpstreamProduct } from "./types";

export async function fetchProductListDummyJson(
  opts: {
    limit: number;
    skip?: number;
    search?: string;
    categorySlug?: string;
    sortBy: string;
    order: "asc" | "desc";
  },
  signal?: AbortSignal
): Promise<HttpResult<{ products: UpstreamProduct[]; total: number }>> {
  const skip = Math.max(0, opts.skip ?? 0);
  const lim = opts.limit <= 0 ? "0" : String(opts.limit);
  const sortQs = () => {
    const q = new URLSearchParams();
    q.set("limit", lim);
    q.set("skip", String(skip));
    q.set("sortBy", opts.sortBy);
    q.set("order", opts.order);
    return q.toString();
  };
  let path: string;
  const hasSearch = Boolean(opts.search?.trim());
  if (hasSearch) {
    path = `products/search?q=${encodeURIComponent(opts.search!.trim())}&${sortQs()}`;
  } else if (opts.categorySlug && opts.categorySlug !== "all") {
    path = `products/category/${encodeURIComponent(opts.categorySlug)}?${sortQs()}`;
  } else {
    path = `products?${sortQs()}`;
  }
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
  const json = await responseToJsonResult<unknown>(res);
  if (!isHttpOk(json)) return json;
  const env = djProductsEnvelope(json.data);
  if (!env) {
    return {
      ok: false,
      kind: "decode",
      message: "Unexpected products response shape.",
    };
  }
  return {
    ok: true,
    status: json.status,
    data: env,
  };
}
