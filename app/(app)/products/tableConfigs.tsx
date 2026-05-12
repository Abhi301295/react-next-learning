"use client";

import Link from "next/link";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import type { ListConfig } from "@/components/shared/list/List";
import TableFilterField from "@/components/shared/table/filters/TableFilterField";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import type { Column } from "@/components/shared/table/core/Table";
import type { CatalogProduct } from "@/lib/products/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const EMPTY_PRODUCTS_TITLE = "No products found";
export const EMPTY_PRODUCTS_DESCRIPTION =
  "Try again or check your API configuration.";

export type ProductsFilterKey = "category";

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

const productsFilterDefinitions = [
  {
    key: "category" as ProductsFilterKey,
    initialValue: "all",
    predicate: (product: CatalogProduct, value: string | boolean | string[]) =>
      value === "all" ? true : product.category === value,
  },
];

const renderProductsFilterFields = (
  values: Record<ProductsFilterKey, string | boolean | string[]>,
  setValue: (key: ProductsFilterKey, value: string | boolean | string[]) => void
) => (
  <div className="space-y-3">
    <TableFilterField
      label="Category"
      value={values.category}
      onChange={(value) => setValue("category", value)}
      options={CATEGORY_OPTIONS}
    />
  </div>
);

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

export const productsDesktopTableConfig: Omit<
  TableConfig<CatalogProduct, ProductsFilterKey>,
  "columns" | "getKey"
> = {
  rowActionsLabel: "Actions",
  rowActions: (product) => <ProductDetailNavLink product={product} />,
  search: {
    enabled: true,
    label: "Search products",
    placeholder: "Search by title, description, category",
    fields: ["title", "excerpt", "category"],
  },
  filters: {
    enabled: true,
    mode: "panel",
    title: "Filter products",
    triggerLabel: "Filters",
    definitions: productsFilterDefinitions,
    template: ({ values, setValue }) =>
      renderProductsFilterFields(values, setValue),
  },
  sorting: {
    enabled: true,
    initialSortKey: "id",
    initialSortDirection: "asc",
  },
  pagination: {
    enabled: true,
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20],
  },
  emptyState: {
    noDataTitle: EMPTY_PRODUCTS_TITLE,
    noDataDescription: EMPTY_PRODUCTS_DESCRIPTION,
  },
};

export const productsMobileStateConfig = {
  emptyComponent: (
    <EmptyState
      title={EMPTY_PRODUCTS_TITLE}
      description={EMPTY_PRODUCTS_DESCRIPTION}
    />
  ),
};

export const productsMobileListConfig: ListConfig<
  CatalogProduct,
  ProductsFilterKey
> = {
  search: {
    enabled: true,
    label: "Search products",
    placeholder: "Search by id, title, description, category, or price",
    fields: ["id", "title", "excerpt", "category", "price"],
  },
  filters: {
    enabled: true,
    title: "Filter products",
    triggerLabel: "Filters",
    definitions: productsFilterDefinitions,
    template: ({ values, setValue }) =>
      renderProductsFilterFields(values, setValue),
  },
  sorting: {
    enabled: true,
    initialSortKey: "id",
    initialSortDirection: "asc",
    mobileFields: [
      { key: "id", label: "Product ID" },
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price" },
      { key: "excerpt", label: "Description" },
    ],
  },
  pagination: {
    enabled: true,
    mode: "load-more",
    initialPageSize: 5,
    loadMoreLabel: "Load more products",
  },
  emptyState: {
    noDataTitle: EMPTY_PRODUCTS_TITLE,
    noDataDescription: EMPTY_PRODUCTS_DESCRIPTION,
  },
};

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
