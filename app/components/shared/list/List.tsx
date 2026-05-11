"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "../feedback/EmptyState";
import { ErrorState } from "../feedback/ErrorState";
import { LoadingState } from "../feedback/LoadingState";
import TableSearch from "../table/controls/TableSearch";
import TableFilter from "../table/filters/TableFilter";
import TablePagination from "../table/controls/TablePagination";
import { Button } from "@/components/ui/Button";
import type { SortDirection } from "../table/core/Table";
import {
  type FilterConfig,
  type FilterValue,
  useTableControls,
} from "@/lib/hooks/useTableControls";

export type ListFilterTemplateContext<K extends string> = {
  values: Record<K, FilterValue>;
  setValue: (key: K, value: FilterValue) => void;
};

export type ListConfig<T, K extends string = never> = {
  search?: {
    enabled: boolean;
    label?: string;
    placeholder?: string;
    fields: Array<keyof T>;
  };
  filters?: {
    enabled: boolean;
    title?: string;
    triggerLabel?: string;
    definitions: Array<FilterConfig<T, K>>;
    template: (context: ListFilterTemplateContext<K>) => React.ReactNode;
  };
  sorting?: {
    enabled: boolean;
    initialSortKey?: keyof T;
    initialSortDirection?: SortDirection;
  };
  pagination?: {
    enabled: boolean;
    mode?: "pages" | "load-more";
    initialPageSize?: number;
    pageSizeOptions?: number[];
    loadMoreLabel?: string;
  };
  emptyState?: {
    noDataTitle?: string;
    noDataDescription?: string;
    noResultsTitle?: string;
    noResultsDescription?: string;
  };
  server?: {
    enabled: boolean;
    state: {
      search: string;
      page: number;
      pageSize: number;
      totalItems: number;
      sortBy: keyof T | null;
      sortDirection: SortDirection;
    };
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onSortChange?: (key: keyof T, direction: SortDirection) => void;
  };
};

type ListProps<T, K extends string = never> = {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
  listClassName?: string;
  itemClassName?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  config?: ListConfig<T, K>;
};

export default function List<T, K extends string = never>({
  data,
  renderItem,
  getKey,
  listClassName,
  itemClassName,
  loading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  config,
}: ListProps<T, K>) {
  if (!config) {
    if (loading) return loadingComponent || <LoadingState />;
    if (error) return errorComponent || <ErrorState message={error} onRetry={onRetry} />;
    if (!data || data.length === 0) return emptyComponent || <EmptyState />;
    return (
      <ul className={cn("space-y-2", listClassName)}>
        {data.map((item) => (
          <li key={getKey(item)} className={itemClassName}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ConfiguredList
      data={data}
      loading={loading}
      error={error}
      onRetry={onRetry}
      getKey={getKey}
      listClassName={listClassName}
      itemClassName={itemClassName}
      renderItem={renderItem}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      emptyComponent={emptyComponent}
      config={config}
    />
  );
}

function ConfiguredList<T, K extends string>({
  data,
  renderItem,
  getKey,
  listClassName,
  itemClassName,
  loading,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  config,
}: ListProps<T, K> & { config: ListConfig<T, K> }) {

  const hasSearch = Boolean(config.search?.enabled);
  const hasFilters = Boolean(config.filters?.enabled);
  const hasSorting = Boolean(config.sorting?.enabled);
  const hasPagination = Boolean(config.pagination?.enabled);
  const paginationMode = config.pagination?.mode ?? "pages";
  const isServerMode = Boolean(config.server?.enabled);
  const nonPaginatedPageSize = Math.max(data.length, 1);

  const controls = useTableControls({
    data,
    searchFields: hasSearch ? config.search!.fields : ([] as Array<keyof T>),
    filters: hasFilters ? config.filters!.definitions : [],
    initialSortKey: hasSorting ? config.sorting?.initialSortKey : undefined,
    initialSortDirection: config.sorting?.initialSortDirection ?? "asc",
    initialPageSize: hasPagination
      ? config.pagination?.initialPageSize ?? 5
      : nonPaginatedPageSize,
    debounceMs: 300,
    getRowKey: getKey,
  });

  const {
    search,
    onSearchChange,
    filterValues,
    onFilterChange,
    resetFilters,
    activeFilterCount,
    pageSize,
    onPageSizeChange,
    currentPage,
    totalPages,
    setPage,
    filteredCount,
    sortedData,
    paginatedData,
    emptyStateVariant,
  } = controls;

  useEffect(() => {
    if (isServerMode || hasPagination) return;
    if (pageSize !== nonPaginatedPageSize) onPageSizeChange(nonPaginatedPageSize);
  }, [hasPagination, isServerMode, nonPaginatedPageSize, onPageSizeChange, pageSize]);

  const [draftFilters, setDraftFilters] = useState<Record<K, FilterValue>>(
    filterValues as Record<K, FilterValue>
  );
  useEffect(() => {
    setDraftFilters(filterValues as Record<K, FilterValue>);
  }, [filterValues]);

  const effectiveSearch = isServerMode ? config.server!.state.search : search;
  const effectivePage = isServerMode ? config.server!.state.page : currentPage;
  const effectivePageSize = isServerMode ? config.server!.state.pageSize : pageSize;
  const effectiveTotalItems = isServerMode ? config.server!.state.totalItems : filteredCount;
  const effectiveTotalPages = Math.max(
    1,
    Math.ceil(effectiveTotalItems / Math.max(effectivePageSize, 1))
  );

  const effectiveData = useMemo(() => {
    if (isServerMode) return data;
    if (!hasPagination) return sortedData;
    if (paginationMode === "load-more") {
      const visible = effectivePage * effectivePageSize;
      return sortedData.slice(0, visible);
    }
    return paginatedData;
  }, [
    data,
    effectivePage,
    effectivePageSize,
    hasPagination,
    isServerMode,
    paginatedData,
    paginationMode,
    sortedData,
  ]);

  const showNoData = !loading && !error && (isServerMode ? data.length === 0 && effectiveSearch.trim().length === 0 : emptyStateVariant === "no-data");
  const showNoResults = !loading && !error && (isServerMode ? data.length === 0 && effectiveSearch.trim().length > 0 : emptyStateVariant === "no-results");

  return (
    <div className="space-y-3">
      {(hasSearch || hasFilters) && (
        <section
          className={cn(
            "flex gap-2",
            hasSearch && hasFilters
              ? "flex-row items-end"
              : "flex-col gap-3"
          )}
        >
          {hasSearch && (
            <div className={cn(hasFilters && "min-w-0 flex-1")}>
              <TableSearch
                value={effectiveSearch}
                onChange={isServerMode ? config.server!.onSearchChange : onSearchChange}
                placeholder={config.search?.placeholder ?? "Search..."}
                label={config.search?.label ?? "Search"}
              />
            </div>
          )}
          {hasFilters && (
            <div className="flex shrink-0">
              <TableFilter
                title={config.filters?.title ?? "Filters"}
                triggerLabel={config.filters?.triggerLabel ?? "Filters"}
                activeCount={activeFilterCount}
                onOpen={() => setDraftFilters(filterValues as Record<K, FilterValue>)}
                onClear={() => {
                  resetFilters();
                  setPage(1);
                }}
                onApply={() => {
                  (Object.keys(draftFilters) as K[]).forEach((key) =>
                    onFilterChange(key, draftFilters[key])
                  );
                  setPage(1);
                }}
              >
                {config.filters!.template({
                  values: draftFilters,
                  setValue: (key, value) =>
                    setDraftFilters((prev) => ({ ...prev, [key]: value })),
                })}
              </TableFilter>
            </div>
          )}
        </section>
      )}

      {loading && (loadingComponent || <LoadingState />)}
      {!loading &&
        error &&
        (errorComponent || <ErrorState message={error} onRetry={onRetry} />)}

      {showNoData &&
        (emptyComponent || (
          <EmptyState
            title={config.emptyState?.noDataTitle ?? "No data available"}
            description={
              config.emptyState?.noDataDescription ?? "No records found for this list."
            }
          />
        ))}
      {showNoResults &&
        (emptyComponent || (
          <EmptyState
            title={config.emptyState?.noResultsTitle ?? "No matching results"}
            description={
              config.emptyState?.noResultsDescription ??
              "Try changing your search or filter values."
            }
          />
        ))}

      {!loading && !error && effectiveData.length > 0 && (
        <>
          <ul className={cn("space-y-2", listClassName)}>
            {effectiveData.map((item) => (
              <li key={getKey(item)} className={itemClassName}>
                {renderItem(item)}
              </li>
            ))}
          </ul>

          {hasPagination && paginationMode === "pages" && (
            <TablePagination
              currentPage={effectivePage}
              totalPages={effectiveTotalPages}
              totalItems={effectiveTotalItems}
              pageSize={effectivePageSize}
              pageSizeOptions={config.pagination?.pageSizeOptions}
              onPageSizeChange={
                isServerMode ? config.server!.onPageSizeChange : onPageSizeChange
              }
              onFirst={() =>
                isServerMode ? config.server!.onPageChange(1) : setPage(1)
              }
              onPrevious={() =>
                isServerMode
                  ? config.server!.onPageChange(Math.max(1, effectivePage - 1))
                  : setPage(Math.max(1, effectivePage - 1))
              }
              onNext={() =>
                isServerMode
                  ? config.server!.onPageChange(
                      Math.min(effectiveTotalPages, effectivePage + 1)
                    )
                  : setPage(Math.min(effectiveTotalPages, effectivePage + 1))
              }
              onLast={() =>
                isServerMode
                  ? config.server!.onPageChange(effectiveTotalPages)
                  : setPage(effectiveTotalPages)
              }
            />
          )}

          {hasPagination && paginationMode === "load-more" && effectivePage < effectiveTotalPages && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  isServerMode
                    ? config.server!.onPageChange(effectivePage + 1)
                    : setPage(effectivePage + 1)
                }
              >
                {config.pagination?.loadMoreLabel ?? "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}