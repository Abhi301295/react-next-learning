import type { Column } from "@/components/shared/table/core/Table";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import type { UpstreamPost } from "@/lib/posts/types";

export type Day8ApiKey = "api";

export type Day8PostRow = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const SORT_FIELD_MAP: Partial<Record<keyof Day8PostRow, string>> = {
  userId: "userId",
  id: "id",
  title: "title",
  body: "body",
};

export const postTableColumns: Column<Day8PostRow>[] = [
  { key: "userId", label: "User ID", sortable: true },
  { key: "id", label: "Post ID", sortable: true },
  { key: "title", label: "Title", sortable: true },
  {
    key: "body",
    label: "Body",
    sortable: true,
    render: (value) => String(value).slice(0, 80),
  },
];

export const mapUpstreamPostToRow = (post: UpstreamPost): Day8PostRow => ({
  userId: post.userId,
  id: post.id,
  title: post.title,
  body: post.body,
});

type CreateDay8ApiTableConfigArgs = {
  search: string;
  page: number;
  pageSize: number;
  totalItems: number;
  sortBy: keyof Day8PostRow | null;
  sortDirection: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (key: keyof Day8PostRow, direction: "asc" | "desc") => void;
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
}: CreateDay8ApiTableConfigArgs): TableConfig<Day8PostRow, Day8ApiKey> => ({
  columns: postTableColumns,
  getKey: (row) => row.id,
  rowActionsLabel: "Post Actions",
  search: {
    enabled: true,
    label: "API Search",
    placeholder: "Search posts by title/body",
    fields: ["title", "body"],
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
    noResultsTitle: "No matching posts",
    noResultsDescription: "Try changing your search.",
  },
});
