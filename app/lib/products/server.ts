import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import {
  isHttpOk,
  isJsonRecordWithNumericId,
  runUpstreamJson,
  type HttpErr,
} from "@/lib/server-upstream";
import type { UpstreamProduct } from "./types";

export type { UpstreamProduct } from "./types";

export type FetchProductDetailResult =
  | { ok: true; product: UpstreamProduct }
  | { ok: false; kind: "not_found" }
  | { ok: false; kind: "invalid" }
  | { ok: false; kind: "error"; cause: HttpErr };

function isProductDetail(data: Record<string, unknown>): data is UpstreamProduct {
  return (
    typeof data.title === "string" &&
    typeof data.description === "string" &&
    typeof data.category === "string" &&
    typeof data.price === "number"
  );
}

export async function fetchProductById(
  id: string
): Promise<FetchProductDetailResult> {
  const path = `products/${encodeURIComponent(id)}`;
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
  const rec = data as Record<string, unknown>;
  if (!isProductDetail(rec)) {
    return { ok: false, kind: "invalid" };
  }
  return {
    ok: true,
    product: {
      id: rec.id,
      title: rec.title,
      description: rec.description,
      category: rec.category,
      price: rec.price,
      brand: typeof rec.brand === "string" ? rec.brand : undefined,
      thumbnail:
        typeof rec.thumbnail === "string" ? rec.thumbnail : undefined,
      images: Array.isArray(rec.images)
        ? (rec.images.filter((x) => typeof x === "string") as string[])
        : undefined,
    },
  };
}

export function productDetailMetadataFallback(id: string) {
  const description = `The product with id ${id} could not be loaded. Browse other items from the dashboard catalog instead.`;
  return {
    title: `Product ${id}`,
    description,
    alternates: { canonical: `/products/${id}` } as const,
    robots: { index: false, follow: true } as const,
    openGraph: {
      title: `Product ${id} | User Dashboard`,
      description,
      url: `/products/${id}`,
      type: "website" as const,
      images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
    },
    twitter: {
      card: "summary" as const,
      title: `Product ${id} | User Dashboard`,
      description,
      images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
    },
  };
}
