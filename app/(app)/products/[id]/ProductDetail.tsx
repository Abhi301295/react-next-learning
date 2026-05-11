import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { UpstreamProduct } from "@/lib/products/types";

const linkFocus =
  "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function ProductDetail({
  product,
}: {
  product: UpstreamProduct;
}) {
  const hero =
    typeof product.images?.[0] === "string"
      ? product.images[0]
      : typeof product.thumbnail === "string"
        ? product.thumbnail
        : null;
  const priceFmt = `$${product.price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const imageAlt = `${product.title}${product.brand ? `. ${product.brand}.` : "."} Product preview image`;

  return (
    <article className="space-y-6" aria-labelledby="product-heading">
      <header className="space-y-4">
        <h1
          id="product-heading"
          className="text-display-sm font-semibold text-primary"
        >
          {product.title}
        </h1>

        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-subtle">Product ID</dt>
            <dd className="font-medium text-foreground">{product.id}</dd>
          </div>
          <div>
            <dt className="text-subtle">Category</dt>
            <dd className="font-medium capitalize text-foreground">
              {product.category}
            </dd>
          </div>
          {product.brand ? (
            <div>
              <dt className="text-subtle">Brand</dt>
              <dd className="font-medium text-foreground">{product.brand}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-subtle">Price</dt>
            <dd className="font-semibold text-foreground">{priceFmt}</dd>
          </div>
        </dl>
      </header>

      {hero ? (
        <figure className="max-w-xl">
          <div
            className="relative aspect-video overflow-hidden rounded-card border border-stroke bg-panel"
            role="presentation"
          >
            <Image
              src={hero}
              alt={imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, min(36rem, 85vw)"
              priority
            />
          </div>
          <figcaption className="mt-2 text-xs text-subtle">
            Illustrated image supplied by the product catalog API.
          </figcaption>
        </figure>
      ) : null}

      <section
        className="rounded-card border border-stroke bg-panel p-4"
        aria-labelledby="product-description-heading"
      >
        <h2 id="product-description-heading" className="text-base font-semibold text-foreground">
          Description
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm text-subtle md:text-[0.9375rem] md:text-foreground">
          {product.description}
        </p>
      </section>

      <nav aria-label="Product page navigation">
        <Link
          href="/products"
          className={cn(
            "inline-block text-sm font-medium text-primary underline-offset-4 hover:underline",
            linkFocus
          )}
        >
          ← Back to all products
        </Link>
      </nav>
    </article>
  );
}
