"use client";

import Link from "next/link";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import type { ListConfig } from "@/components/shared/list/List";
import TableFilterField from "@/components/shared/table/filters/TableFilterField";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import { Button } from "@/components/ui/Button";
import type { Column } from "@/components/shared/table/core/Table";
import type { Post } from "@/lib/posts/types";
import { useRouter } from "next/navigation";

export const EMPTY_POSTS_TITLE = "No posts found";
export const EMPTY_POSTS_DESCRIPTION =
  "Try again or check your API configuration.";

export type PostsFilterKey = "userId";

export const POST_COLUMNS: readonly Column<Post, keyof Post>[] = [
  { key: "id", label: "Post ID", sortable: true },
  { key: "title", label: "Title", sortable: true },
  { key: "userId", label: "User ID", sortable: true },
  { key: "excerpt", label: "Excerpt", sortable: true },
];

const userIdOptions = [
  { label: "All authors", value: "all" },
  ...Array.from({ length: 10 }, (_, i) => ({
    label: `User ${i + 1}`,
    value: String(i + 1),
  })),
];

const postsFilterDefinitions = [
  {
    key: "userId" as PostsFilterKey,
    initialValue: "all",
    predicate: (post: Post, value: string | boolean | string[]) =>
      value === "all" ? true : post.userId === Number(value),
  },
];

const renderPostsFilterFields = (
  values: Record<PostsFilterKey, string | boolean | string[]>,
  setValue: (key: PostsFilterKey, value: string | boolean | string[]) => void
) => (
  <div className="space-y-3">
    <TableFilterField
      label="Author (user)"
      value={values.userId}
      onChange={(value) => setValue("userId", value)}
      options={userIdOptions}
    />
  </div>
);

function PostViewActionButton({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      iconOnly
      icon="👁"
      aria-label={`Read post: ${post.title}`}
      tooltip={`Open post ${post.id}`}
      onClick={() => router.push(`/posts/${post.id}`)}
    />
  );
}

export const postsDesktopTableConfig: Omit<
  TableConfig<Post, PostsFilterKey>,
  "columns" | "getKey"
> = {
  rowActionsLabel: "Actions",
  rowActions: (post) => <PostViewActionButton post={post} />,
  search: {
    enabled: true,
    label: "Search posts",
    placeholder: "Search by post id, title, excerpt, or user id",
    fields: ["id", "title", "excerpt", "userId"],
  },
  filters: {
    enabled: true,
    mode: "panel",
    title: "Filter posts",
    triggerLabel: "Filters",
    definitions: postsFilterDefinitions,
    template: ({ values, setValue }) => renderPostsFilterFields(values, setValue),
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
    noDataTitle: EMPTY_POSTS_TITLE,
    noDataDescription: EMPTY_POSTS_DESCRIPTION,
  },
};

export const postsMobileStateConfig = {
  emptyComponent: (
    <EmptyState title={EMPTY_POSTS_TITLE} description={EMPTY_POSTS_DESCRIPTION} />
  ),
};

export const postsMobileListConfig: ListConfig<Post, PostsFilterKey> = {
  search: {
    enabled: true,
    label: "Search posts",
    placeholder: "Search by post id, title, excerpt, or user id",
    fields: ["id", "title", "excerpt", "userId"],
  },
  filters: {
    enabled: true,
    title: "Filter posts",
    triggerLabel: "Filters",
    definitions: postsFilterDefinitions,
    template: ({ values, setValue }) => renderPostsFilterFields(values, setValue),
  },
  sorting: {
    enabled: true,
    initialSortKey: "id",
    initialSortDirection: "asc",
    mobileFields: [
      { key: "id", label: "Post ID" },
      { key: "title", label: "Title" },
      { key: "userId", label: "User ID" },
      { key: "excerpt", label: "Description" },
    ],
  },
  pagination: {
    enabled: true,
    mode: "load-more",
    initialPageSize: 5,
    loadMoreLabel: "Load more posts",
  },
  emptyState: {
    noDataTitle: EMPTY_POSTS_TITLE,
    noDataDescription: EMPTY_POSTS_DESCRIPTION,
  },
};

export function renderPostDetailLink(postId: number) {
  return (
    <Link
      href={`/posts/${postId}`}
      className="inline-block text-sm font-medium text-primary hover:underline"
    >
      Read post
    </Link>
  );
}
