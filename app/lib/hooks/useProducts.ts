"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ListConfig } from "@/components/shared/list/List";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import type { SortDirection } from "@/components/shared/table/core/Table";
import type { FilterValue } from "@/lib/hooks/useTableControls";
import { httpErrPublicMessage, isHttpOk } from "@/lib/app-api";
import { fetchProductListDummyJson } from "@/lib/products/client";
import type { CatalogProduct, UpstreamProduct } from "@/lib/products/types";
import {
  PRODUCT_COLUMNS,
  productsDesktopTableConfig,
  productsMobileListConfig,
  type ProductsFilterKey,
} from "@/(app)/products/tableConfigs";

const PRODUCT_SORT_API: Partial<Record<keyof CatalogProduct, string>> = {
  id: "id",
  title: "title",
  category: "category",
  price: "price",
  excerpt: "description",
};

function excerptFromDescription(text: string, max = 120): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function mapUpstreamProduct(p: UpstreamProduct): CatalogProduct {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
    excerpt: excerptFromDescription(p.description),
  };
}

function resolveTotal(
  totalFromApi: number,
  page: number,
  pageSize: number,
  rowCount: number
): number {
  if (Number.isFinite(totalFromApi) && totalFromApi > 0) {
    return totalFromApi;
  }
  if (rowCount === 0) {
    return Math.max(0, (page - 1) * pageSize);
  }
  return (page - 1) * pageSize + rowCount;
}

export function useProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [mobileProducts, setMobileProducts] = useState<CatalogProduct[]>([]);
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
  const [sortBy, setSortBy] = useState<keyof CatalogProduct | null>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const mobileProductsRef = useRef<CatalogProduct[]>([]);
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
        mobileProductsRef.current.length >= pageSize;

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
        const apiSort = PRODUCT_SORT_API[sortBy ?? "id"] ?? "id";
        const hasSearch = Boolean(debouncedSearch);
        const r = await fetchProductListDummyJson(
          {
            limit: itemsNeeded,
            skip: 0,
            search: debouncedSearch || undefined,
            categorySlug:
              hasSearch ? undefined : filterCategory !== "all" ? filterCategory : undefined,
            sortBy: apiSort,
            order: sortDirection,
          },
          signal
        );
        if (!isHttpOk(r)) {
          if (r.kind === "aborted") {
            requestAborted = true;
            return;
          }
          throw new Error(httpErrPublicMessage(r));
        }
        const { products: rows, total: catalogTotal } = r.data;
        const mapped = rows.map(mapUpstreamProduct);
        const tableSlice = mapped.slice(
          (tablePage - 1) * pageSize,
          tablePage * pageSize
        );
        const mobileSlice = mapped.slice(0, listLoadedPages * pageSize);
        setProducts(tableSlice);
        setMobileProducts(mobileSlice);
        mobileProductsRef.current = mobileSlice;
        lastListLoadedAfterFetchRef.current = listLoadedPages;
        setTotalItems(
          resolveTotal(catalogTotal, tablePage, pageSize, rows.length)
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
      filterCategory,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void load(controller.signal);
    });
    return () => controller.abort();
  }, [load]);

  const refetch = useCallback(() => {
    void load();
  }, [load]);

  const serverBlock = useMemo(
    () => {
      void filterCategory;
      return {
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
        onSortChange: (key: keyof CatalogProduct, direction: SortDirection) => {
          setSortBy(key);
          setSortDirection(direction);
          resetPaging();
        },
        onFiltersChange: (values: Record<ProductsFilterKey, FilterValue>) => {
          const v = values.category;
          setFilterCategory(typeof v === "string" ? v : "all");
          resetPaging();
        },
        onLoadMore: () => setListLoadedPages((n) => n + 1),
      };
    },
    [
      search,
      tablePage,
      pageSize,
      totalItems,
      sortBy,
      sortDirection,
      filterCategory,
      listLoadedPages,
      resetPaging,
    ]
  );

  const desktopTableConfig = useMemo<
    Omit<TableConfig<CatalogProduct, ProductsFilterKey>, "columns" | "getKey">
  >(
    () => ({
      ...productsDesktopTableConfig,
      server: serverBlock,
    }),
    [serverBlock]
  );

  const mobileListConfig = useMemo<
    ListConfig<CatalogProduct, ProductsFilterKey>
  >(
    () => ({
      ...productsMobileListConfig,
      server: serverBlock,
    }),
    [serverBlock]
  );

  return {
    products,
    mobileProducts,
    totalItems,
    loading,
    loadingMore,
    hasFetched,
    error,
    refetch,
    productColumns: PRODUCT_COLUMNS,
    desktopTableConfig,
    mobileListConfig,
  };
}
