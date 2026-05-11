"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ListConfig } from "@/components/shared/list/List";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import type { SortDirection } from "@/components/shared/table/core/Table";
import type { FilterValue } from "@/lib/hooks/useTableControls";
import { httpErrPublicMessage, isHttpOk } from "@/lib/app-api";
import { fetchPostListWithQuery } from "@/lib/posts/client";
import type { Post, UpstreamPost } from "@/lib/posts/types";
import {
  POST_COLUMNS,
  postsDesktopTableConfig,
  postsMobileListConfig,
  type PostsFilterKey,
} from "@/(app)/posts/tableConfigs";

const POST_SORT_API: Partial<Record<keyof Post, string>> = {
  id: "id",
  title: "title",
  userId: "userId",
  excerpt: "title",
};

function toExcerpt(body: string, max = 120): string {
  const t = body.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function mapUpstreamPost(p: UpstreamPost): Post {
  return {
    id: p.id,
    title: p.title,
    userId: p.userId,
    excerpt: toExcerpt(p.body),
  };
}

function resolveTotal(
  headerVal: number,
  page: number,
  pageSize: number,
  rowCount: number
): number {
  if (Number.isFinite(headerVal) && headerVal > 0) {
    return headerVal;
  }
  if (rowCount === 0) {
    return Math.max(0, (page - 1) * pageSize);
  }
  return (page - 1) * pageSize + rowCount;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mobilePosts, setMobilePosts] = useState<Post[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tablePage, setTablePage] = useState(1);
  const [listLoadedPages, setListLoadedPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Post | null>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterUserId, setFilterUserId] = useState<string>("all");

  const mobilePostsRef = useRef<Post[]>([]);
  const lastListLoadedAfterFetchRef = useRef(0);

  const resetPaging = useCallback(() => {
    setTablePage(1);
    setListLoadedPages(1);
    lastListLoadedAfterFetchRef.current = 0;
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      let requestAborted = false;
      const extendMobileListOnly =
        lastListLoadedAfterFetchRef.current > 0 &&
        listLoadedPages > lastListLoadedAfterFetchRef.current &&
        mobilePostsRef.current.length >= pageSize;

      try {
        if (extendMobileListOnly) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const itemsNeeded = Math.max(
          tablePage * pageSize,
          listLoadedPages * pageSize
        );
        const params = new URLSearchParams();
        params.set("_page", "1");
        params.set("_limit", String(itemsNeeded));
        if (debouncedSearch) {
          params.set("q", debouncedSearch);
        }
        if (filterUserId !== "all") {
          params.set("userId", filterUserId);
        }
        const apiSort = POST_SORT_API[sortBy ?? "id"] ?? "id";
        params.set("_sort", apiSort);
        params.set("_order", sortDirection);

        const r = await fetchPostListWithQuery(params, signal);
        if (!isHttpOk(r)) {
          if (r.kind === "aborted") {
            requestAborted = true;
            return;
          }
          throw new Error(httpErrPublicMessage(r));
        }
        const { posts: rows, total: headerTotal } = r.data;
        const mapped = rows.map(mapUpstreamPost);
        const tableSlice = mapped.slice(
          (tablePage - 1) * pageSize,
          tablePage * pageSize
        );
        const mobileSlice = mapped.slice(0, listLoadedPages * pageSize);
        setPosts(tableSlice);
        setMobilePosts(mobileSlice);
        mobilePostsRef.current = mobileSlice;
        lastListLoadedAfterFetchRef.current = listLoadedPages;
        setTotalItems(
          resolveTotal(headerTotal, tablePage, pageSize, rows.length)
        );
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          requestAborted = true;
          return;
        }
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        if (requestAborted || signal?.aborted) return;
        setLoading(false);
        setLoadingMore(false);
        setHasFetched(true);
      }
    },
    [
      tablePage,
      listLoadedPages,
      pageSize,
      debouncedSearch,
      sortBy,
      sortDirection,
      filterUserId,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const refetch = useCallback(() => {
    void load();
  }, [load]);

  const serverBlock = useMemo(
    () => ({
      enabled: true as const,
      state: {
        search,
        page: tablePage,
        pageSize,
        totalItems,
        sortBy,
        sortDirection,
        listLoadedPages,
      },
      onSearchChange: (value: string) => {
        setSearch(value);
        resetPaging();
      },
      onPageChange: (p: number) => setTablePage(p),
      onPageSizeChange: (size: number) => {
        setPageSize(size);
        resetPaging();
      },
      onSortChange: (key: keyof Post, direction: SortDirection) => {
        setSortBy(key);
        setSortDirection(direction);
        resetPaging();
      },
      onFiltersChange: (values: Record<PostsFilterKey, FilterValue>) => {
        const v = values.userId;
        setFilterUserId(typeof v === "string" ? v : "all");
        resetPaging();
      },
      onLoadMore: () => setListLoadedPages((n) => n + 1),
    }),
    [
      search,
      tablePage,
      pageSize,
      totalItems,
      sortBy,
      sortDirection,
      filterUserId,
      listLoadedPages,
      resetPaging,
    ]
  );

  const desktopTableConfig = useMemo<
    Omit<TableConfig<Post, PostsFilterKey>, "columns" | "getKey">
  >(
    () => ({
      ...postsDesktopTableConfig,
      server: serverBlock,
    }),
    [serverBlock]
  );

  const mobileListConfig = useMemo<ListConfig<Post, PostsFilterKey>>(
    () => ({
      ...postsMobileListConfig,
      server: serverBlock,
    }),
    [serverBlock]
  );

  return {
    posts,
    mobilePosts,
    totalItems,
    loading,
    loadingMore,
    hasFetched,
    error,
    refetch,
    postColumns: POST_COLUMNS,
    desktopTableConfig,
    mobileListConfig,
  };
}
