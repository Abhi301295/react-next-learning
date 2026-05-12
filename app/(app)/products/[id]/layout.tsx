import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata/defaults";
import { httpErrPublicMessage } from "@/lib/server-upstream";
import {
  fetchProductById,
  productDetailMetadataFallback,
} from "@/lib/products/server";

type Props = { children: ReactNode; params: Promise<{ id: string }> };

function metaDescription(description: string): string {
  const oneLine = description.replace(/\s+/g, " ").trim();
  if (oneLine.length <= 160) return oneLine;
  return `${oneLine.slice(0, 157)}…`;
}

function heroImageUrl(product: {
  thumbnail?: string;
  images?: string[];
}): string | null {
  const first = product.images?.[0];
  if (typeof first === "string" && /^https?:\/\//i.test(first)) {
    return first;
  }
  if (
    typeof product.thumbnail === "string" &&
    /^https?:\/\//i.test(product.thumbnail)
  ) {
    return product.thumbnail;
  }
  return null;
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { id } = await params;
  const r = await fetchProductById(id);

  if (!r.ok) {
    if (r.kind === "not_found" || r.kind === "invalid") {
      return productDetailMetadataFallback(id);
    }
    throw new Error(httpErrPublicMessage(r.cause));
  }

  const product = r.product;
  const description = metaDescription(product.description);
  const pageTitle = `${product.title} | User Dashboard`;
  const hero = heroImageUrl(product);

  const openGraphImages: NonNullable<
    Metadata["openGraph"]
  >["images"] = hero
    ? [{ url: hero, alt: `${product.title} product image` }]
    : [
        {
          url: DEFAULT_OG_IMAGE.url,
          alt: `${product.title} · ${DEFAULT_OG_IMAGE.alt}`,
        },
      ];

  /**
   * Per-product text lives on `openGraph` / `twitter` so we do not overwrite the
   * parent `products/layout` `<meta name="description">` (async replace can race
   * Lighthouse’s MetaElements snapshot).
   */
  return {
    title: product.title,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: "website",
      url: `/products/${product.id}`,
      siteName: "User Dashboard",
      locale: "en_US",
      images: openGraphImages,
    },
    twitter: {
      card: hero ? "summary_large_image" : "summary",
      title: pageTitle,
      description,
      images: openGraphImages,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
