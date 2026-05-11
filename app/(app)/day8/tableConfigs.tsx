import type { Column } from "@/components/shared/table/core/Table";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import type { UpstreamProduct } from "@/lib/products/types";

export type Day8ApiKey = "api";

export type Day8ProductRow = {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
};

export const SORT_FIELD_MAP: Partial<Record<keyof Day8ProductRow, string>> = {
  id: "id",
  title: "title",
  category: "category",
  description: "description",
  price: "price",
};

export const productTableColumns: Column<Day8ProductRow>[] = [
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
  {
    key: "description",
    label: "Description",
    sortable: true,
    render: (value) => String(value).slice(0, 80),
  },
];

export const mapUpstreamProductToRow = (
  product: UpstreamProduct
): Day8ProductRow => ({
  id: product.id,
  title: product.title,
  category: product.category,
  description: product.description,
  price: product.price,
});

type CreateDay8ApiTableConfigArgs = {
  search: string;
  page: number;
  pageSize: number;
  totalItems: number;
  sortBy: keyof Day8ProductRow | null;
  sortDirection: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (key: keyof Day8ProductRow, direction: "asc" | "desc") => void;
};

export const createDay8ApiTableConfig = ({
  search,
  page,
  pageSize,
  totalItems,
  sortBy,
  sortDirection,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: CreateDay8ApiTableConfigArgs): TableConfig<Day8ProductRow, Day8ApiKey> => ({
  columns: productTableColumns,
  getKey: (row) => row.id,
  rowActionsLabel: "Product Actions",
  search: {
    enabled: true,
    label: "API Search",
    placeholder: "Search products by DummyJSON query",
    fields: ["title", "description"],
  },
  sorting: {
    enabled: true,
  },
  pagination: {
    enabled: true,
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 20],
  },
  server: {
    enabled: true,
    state: {
      search,
      page,
      pageSize,
      totalItems,
      sortBy,
      sortDirection,
    },
    onSearchChange,
    onPageChange,
    onPageSizeChange,
    onSortChange,
  },
  emptyState: {
    noResultsTitle: "No matching products",
    noResultsDescription: "Try changing your search.",
  },
});
