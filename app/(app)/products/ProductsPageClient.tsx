"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ResponsiveList from "@/components/shared/list/ResponsiveList";
import { useProducts } from "@/lib/hooks/useProducts";
import type { CatalogProduct } from "@/lib/products/types";
import { cn } from "@/lib/utils";
import {
  productsMobileStateConfig,
  renderProductDetailLink,
} from "./tableConfigs";

const cardFocusInside =
  "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background";

function renderProductCard(product: CatalogProduct) {
  const headingId = `product-card-heading-${product.id}`;
  const priceFmt = `$${product.price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <Card
      role="article"
      aria-labelledby={headingId}
      className={cn("rounded-card border-stroke bg-panel", cardFocusInside)}
    >
      <CardHeader>
        <CardTitle as="p" id={headingId} className="line-clamp-2">
          {product.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-subtle">
        <p className="text-sm">
          <span className="text-subtle">Product ID:</span>{" "}
          <span className="tabular-nums text-foreground">{product.id}</span>
        </p>
        <p className="text-sm capitalize">
          <span className="text-subtle">Category:</span>{" "}
          <span className="text-foreground">{product.category}</span>
        </p>
        <p className="text-sm font-medium text-foreground">{priceFmt}</p>
        <p className="line-clamp-3 text-sm">{product.excerpt}</p>
        {renderProductDetailLink(product.id)}
      </CardContent>
    </Card>
  );
}

export default function ProductsPageClient() {
  const {
    products,
    mobileProducts,
    loading,
    loadingMore,
    error,
    refetch,
    productColumns,
    desktopTableConfig,
    mobileListConfig,
  } = useProducts();

  return (
    <section className="space-y-4" aria-labelledby="products-page-heading">
      <header>
        <h1
          id="products-page-heading"
          className="text-display-sm font-semibold text-primary"
          aria-describedby="products-page-summary"
        >
          Products
        </h1>
        <p id="products-page-summary" className="mt-1 max-w-prose text-sm text-subtle">
          Searchable product catalog backed by DummyJSON. Each row links to its
          own detail route for full description and imagery.
        </p>
      </header>

      <h2 id="catalog-heading" className="sr-only">
        Product catalog
      </h2>
      <div
        role="region"
        aria-labelledby="catalog-heading"
        className="space-y-3"
      >
        <ResponsiveList<CatalogProduct, "category">
          data={products}
          mobileData={mobileProducts}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          onRetry={refetch}
          getKey={(row) => row.id}
          columns={productColumns}
          desktopTableConfig={desktopTableConfig}
          mobileListConfig={mobileListConfig}
          mobileStateConfig={productsMobileStateConfig}
          renderItem={renderProductCard}
        />
      </div>
    </section>
  );
}
