"use client";

/**
 * ============================================================================
 * PRODUCTS LISTING — TABLE + MOBILE CONFIG (“tableConfigs” pattern)
 * ============================================================================
 *
 * Mirrors **`app/(app)/users/tableConfigs.tsx`**. Read that file’s header first;
 * this file only describes product-specific wiring.
 *
 * HOOK: `useProducts` (`app/lib/hooks/useProducts.ts`)
 * - Merges **`server`** into **`productsPaginatedDesktopBase`** and
 *   **`productsPaginatedMobileListBase`** (same pattern as `useUsers`).
 *
 * DUMMYJSON
 * - **`GET /products/search?q=`** — single text query (title, description, tags…).
 * - While search text is non-empty, **`useProducts`** clears **category** slug on
 *   the API call — use **Filters → category** when the search box is empty.
 * - Docs: https://dummyjson.com/docs/products
 *
 * SECTION MAP
 * 1. Empty copy   2. Filter keys   3. Category options   4. Columns
 * 5. Filter defs  6. Shared **`PRODUCTS_FILTERS`** (same object on table + list)
 * 7. Row actions   8. Search   9. Sort + mobile labels   10. Empty   11. Responsive merge
 * 12. Pagination   13. Composed exports   14. Mobile empty   15. Card helper
 * ============================================================================
 */

import Link from "next/link";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import type { ListConfig } from "@/components/shared/list/List";
import TableFilterField from "@/components/shared/table/filters/TableFilterField";
import type {
  FilterTemplateContext,
  TableConfig,
} from "@/components/shared/table/core/ConfigurableTable";
import type { Column } from "@/components/shared/table/core/Table";
import type { CatalogProduct } from "@/lib/products/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── 1. Empty-state copy ──────────────────────────────────────────────────────

export const EMPTY_PRODUCTS_TITLE = "No products found";
export const EMPTY_PRODUCTS_DESCRIPTION =
  "Try again or check your API configuration.";

// ─── 2. Filter keys ────────────────────────────────────────────────────────────

export type ProductsFilterKey = "category";

// ─── 3. Category filter options (slug must match DummyJSON) ───────────────────

const CATEGORY_OPTIONS: { label: string; value: string }[] = [
  { label: "All categories", value: "all" },
  { label: "Beauty", value: "beauty" },
  { label: "Smartphones", value: "smartphones" },
  { label: "Laptops", value: "laptops" },
  { label: "Furniture", value: "furniture" },
  { label: "Groceries", value: "groceries" },
  { label: "Fragrances", value: "fragrances" },
  { label: "Home decoration", value: "home-decoration" },
  { label: "Skin care", value: "skin-care" },
];

// ─── 4. Desktop table columns ─────────────────────────────────────────────────

export const PRODUCT_COLUMNS: readonly Column<
  CatalogProduct,
  keyof CatalogProduct
>[] = [
  { key: "id", label: "Product ID", sortable: true },
  { key: "title", label: "Title", sortable: true },
  { key: "category", label: "Category", sortable: true },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: (value) =>
      `$${Number(value ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  },
  { key: "excerpt", label: "Description", sortable: true },
];

// ─── 5. Filter definitions ────────────────────────────────────────────────────

export const productsFilterDefinitions = [
  {
    key: "category" as ProductsFilterKey,
    initialValue: "all",
    predicate: (product: CatalogProduct, value: string | boolean | string[]) =>
      value === "all" ? true : product.category === value,
  },
];

// ─── 6. `PRODUCTS_FILTERS` (template + metadata; used by table and list) ───────

function ProductsFilterFields(ctx: FilterTemplateContext<ProductsFilterKey>) {
  return (
    <div className="space-y-3">
      <TableFilterField
        label="Category"
        value={ctx.values.category}
        onChange={(value) => ctx.setValue("category", value)}
        options={CATEGORY_OPTIONS}
      />
    </div>
  );
}

/**
 * Shared by **table and list** (`TableConfig` and `ListConfig` use the same shape).
 */
const PRODUCTS_FILTERS = {
  enabled: true,
  title: "Filter products",
  triggerLabel: "Filters",
  definitions: productsFilterDefinitions,
  template: ProductsFilterFields,
} as const;

// ─── 7. Row action (desktop table) ────────────────────────────────────────────

function ProductDetailNavLink({ product }: { product: CatalogProduct }) {
  return (
    <Button
      href={`/products/${product.id}`}
      variant="outline"
      iconOnly
      aria-label={`View product: ${product.title}`}
      tooltip={`Open product ${product.id}`}
    >
      👁
    </Button>
  );
}

const PRODUCTS_TABLE_ACTIONS = {
  rowActionsLabel: "Actions" as const,
  rowActions: (product: CatalogProduct) => (
    <ProductDetailNavLink product={product} />
  ),
};

// ─── 8. Search (DummyJSON single `q`; see module header) ──────────────────────

const PRODUCTS_SEARCH: NonNullable<
  TableConfig<CatalogProduct, ProductsFilterKey>["search"]
> = {
  enabled: true,
  label: "Search products",
  placeholder:
    "Title or description keywords (DummyJSON). Category: Filters when search is empty.",
  fields: ["title", "excerpt"],
};

// ─── 9. Sorting ───────────────────────────────────────────────────────────────

const PRODUCTS_SORT_CORE: NonNullable<
  TableConfig<CatalogProduct, ProductsFilterKey>["sorting"]
> = {
  enabled: true,
  initialSortKey: "id",
  initialSortDirection: "asc",
};

const PRODUCTS_MOBILE_SORT_FIELDS = [
  { key: "id", label: "Product ID" },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "excerpt", label: "Description" },
] as const;

// ─── 10. Empty state ───────────────────────────────────────────────────────────

const PRODUCTS_EMPTY: NonNullable<
  TableConfig<CatalogProduct, ProductsFilterKey>["emptyState"]
> = {
  noDataTitle: EMPTY_PRODUCTS_TITLE,
  noDataDescription: EMPTY_PRODUCTS_DESCRIPTION,
};

const PRODUCTS_RESPONSIVE_CONTROLS = {
  search: PRODUCTS_SEARCH,
  emptyState: PRODUCTS_EMPTY,
};

// ─── 11. Pagination ────────────────────────────────────────────────────────────

const PRODUCTS_PAGINATION_TABLE: NonNullable<
  TableConfig<CatalogProduct, ProductsFilterKey>["pagination"]
> = {
  enabled: true,
  initialPageSize: 5,
  pageSizeOptions: [5, 10, 20],
};

const PRODUCTS_PAGINATION_LIST: NonNullable<
  ListConfig<CatalogProduct, ProductsFilterKey>["pagination"]
> = {
  enabled: true,
  mode: "load-more",
  initialPageSize: 5,
  loadMoreLabel: "Load more products",
};

// ─── 12. Composed configs (same names as users module for `use*` parity) ───────

export const productsPaginatedDesktopBase: Omit<
  TableConfig<CatalogProduct, ProductsFilterKey>,
  "columns" | "getKey" | "server"
> = {
  ...PRODUCTS_TABLE_ACTIONS,
  ...PRODUCTS_RESPONSIVE_CONTROLS,
  filters: PRODUCTS_FILTERS,
  sorting: PRODUCTS_SORT_CORE,
  pagination: PRODUCTS_PAGINATION_TABLE,
};

export const productsPaginatedMobileListBase: Omit<
  ListConfig<CatalogProduct, ProductsFilterKey>,
  "server"
> = {
  ...PRODUCTS_RESPONSIVE_CONTROLS,
  filters: PRODUCTS_FILTERS,
  sorting: {
    ...PRODUCTS_SORT_CORE,
    mobileFields: PRODUCTS_MOBILE_SORT_FIELDS,
  },
  pagination: PRODUCTS_PAGINATION_LIST,
};

export const productsDesktopTableConfig: Omit<
  TableConfig<CatalogProduct, ProductsFilterKey>,
  "columns" | "getKey"
> = productsPaginatedDesktopBase;

export const productsMobileListConfig: ListConfig<
  CatalogProduct,
  ProductsFilterKey
> = productsPaginatedMobileListBase;

// ─── 13. Mobile list empty override ────────────────────────────────────────────

export const productsMobileStateConfig = {
  emptyComponent: (
    <EmptyState
      title={EMPTY_PRODUCTS_TITLE}
      description={EMPTY_PRODUCTS_DESCRIPTION}
    />
  ),
};

// ─── 14. Card helper ───────────────────────────────────────────────────────────

export function renderProductDetailLink(productId: number) {
  return (
    <Link
      href={`/products/${productId}`}
      className={cn(
        "inline-block text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      View product details<span className="sr-only">{`, product ${productId}`}</span>
    </Link>
  );
}
