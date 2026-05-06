'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import Table, { Column, SortDirection } from "@/components/shared/table/core/Table";
import TableBulkActions from "@/components/shared/table/controls/TableBulkActions";
import TableFilter from "@/components/shared/table/filters/TableFilter";
import TablePagination from "@/components/shared/table/controls/TablePagination";
import TableSearch from "@/components/shared/table/controls/TableSearch";
import TableSkeleton from "@/components/shared/table/core/TableSkeleton";
import { FilterConfig, FilterValue, useTableControls } from "@/lib/hooks/useTableControls";

export type FilterTemplateContext<K extends string> = {
  values: Record<K, FilterValue>;
  setValue: (key: K, value: FilterValue) => void;
};

export type TableConfig<T, K extends string> = {
  columns: Column<T>[];
  getKey: (item: T) => string | number;
  rowActions?: (row: T) => ReactNode;
  rowActionsLabel?: string;
  search?: {
    enabled: boolean;
    label?: string;
    placeholder?: string;
    fields: Array<keyof T>;
  };
  filters?: {
    enabled: boolean;
    mode: "panel";
    title?: string;
    triggerLabel?: string;
    definitions: Array<FilterConfig<T, K>>;
    template: (context: FilterTemplateContext<K>) => ReactNode;
  };
  sorting?: {
    enabled: boolean;
    initialSortKey?: keyof T;
    initialSortDirection?: SortDirection;
  };
  pagination?: {
    enabled: boolean;
    initialPageSize?: number;
    pageSizeOptions?: number[];
  };
  selection?: {
    enabled: boolean;
    bulkActionLabel?: string;
    onBulkAction?: (selectedKeys: Set<string | number>) => void;
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
    onSortChange: (key: keyof T, direction: SortDirection) => void;
  };
};

type ConfigurableTableProps<T, K extends string> = {
  data: T[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  config: TableConfig<T, K>;
  onTableStateChange?: (state: {
    search: string;
    filters: Record<K, FilterValue>;
    page: number;
    pageSize: number;
    sortBy: keyof T | null;
    sortDirection: SortDirection;
  }) => void;
};

export default function ConfigurableTable<T, K extends string>({
  data,
  loading = false,
  error = null,
  onRetry,
  config,
  onTableStateChange,
}: ConfigurableTableProps<T, K>) {
  const {
    columns,
    getKey,
    rowActions,
    rowActionsLabel,
    search: searchConfig,
    filters: filtersConfig,
    sorting: sortingConfig,
    pagination: paginationConfig,
    selection: selectionConfig,
    emptyState: emptyStateConfig,
    server: serverConfig,
  } = config;
  const isServerMode = Boolean(serverConfig?.enabled);

  const hasSearch = Boolean(searchConfig?.enabled);
  const hasFilters = Boolean(filtersConfig?.enabled);
  const hasSorting = Boolean(sortingConfig?.enabled);
  const hasPagination = Boolean(paginationConfig?.enabled);
  const hasSelection = Boolean(selectionConfig?.enabled);
  const searchFields = useMemo(
    () => (hasSearch ? searchConfig!.fields : ([] as Array<keyof T>)),
    [hasSearch, searchConfig]
  );
  const filterDefinitions = useMemo(
    () => (hasFilters ? filtersConfig!.definitions : ([] as Array<FilterConfig<T, K>>)),
    [filtersConfig, hasFilters]
  );
  const defaultDraftFilters = useMemo(
    () =>
      Object.fromEntries(
        filterDefinitions.map((filter) => [filter.key, filter.initialValue])
      ) as Record<K, FilterValue>,
    [filterDefinitions]
  );
  const nonPaginatedPageSize = Math.max(data.length, 1);

  const clientControls = useTableControls({
    data,
    searchFields,
    filters: filterDefinitions,
    initialSortKey: hasSorting ? sortingConfig?.initialSortKey : undefined,
    initialSortDirection: sortingConfig?.initialSortDirection ?? "asc",
    // When pagination UI is disabled, keep all rows visible in one page.
    initialPageSize: hasPagination ? paginationConfig?.initialPageSize ?? 5 : nonPaginatedPageSize,
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
    sortBy,
    sortDirection,
    onSortChange,
    currentPage,
    totalPages,
    setPage,
    filteredCount,
    paginatedData,
    selectedRowKeys,
    selectedCount,
    allVisibleSelected,
    toggleRowSelection,
    toggleSelectAllVisible,
    clearSelection,
    emptyStateVariant,
  } = clientControls;

  const [serverSelectedRowKeys, setServerSelectedRowKeys] = useState<Set<string | number>>(new Set());
  const serverSearch = serverConfig?.state.search ?? "";
  const serverPage = serverConfig?.state.page ?? 1;
  const serverPageSize = serverConfig?.state.pageSize ?? (paginationConfig?.initialPageSize ?? 5);
  const serverTotalItems = serverConfig?.state.totalItems ?? data.length;
  const serverTotalPages = Math.max(1, Math.ceil(serverTotalItems / Math.max(serverPageSize, 1)));
  const serverSortBy = serverConfig?.state.sortBy ?? null;
  const serverSortDirection = serverConfig?.state.sortDirection ?? "asc";
  const serverAllVisibleSelected =
    data.length > 0 && data.every((row) => serverSelectedRowKeys.has(getKey(row)));
  const serverSelectedCount = serverSelectedRowKeys.size;
  const serverEmptyStateVariant =
    data.length === 0
      ? serverSearch.trim().length > 0
        ? "no-results"
        : "no-data"
      : "has-results";

  const effectiveSearch = isServerMode ? serverSearch : search;
  const effectiveOnSearchChange = isServerMode ? serverConfig!.onSearchChange : onSearchChange;
  const effectiveCurrentPage = isServerMode ? serverPage : currentPage;
  const effectiveTotalPages = isServerMode ? serverTotalPages : totalPages;
  const effectivePageSize = isServerMode ? serverPageSize : pageSize;
  const effectiveFilteredCount = isServerMode ? serverTotalItems : filteredCount;
  const effectiveData = isServerMode ? data : paginatedData;
  const effectiveSortBy = isServerMode ? serverSortBy : hasSorting ? sortBy : null;
  const effectiveSortDirection = isServerMode ? serverSortDirection : sortDirection;
  const effectiveEmptyStateVariant = isServerMode ? serverEmptyStateVariant : emptyStateVariant;
  const effectiveSelectedKeys = isServerMode ? serverSelectedRowKeys : selectedRowKeys;
  const effectiveSelectedCount = isServerMode ? serverSelectedCount : selectedCount;
  const effectiveAllVisibleSelected = isServerMode ? serverAllVisibleSelected : allVisibleSelected;

  const effectiveToggleRow = (rowKey: string | number) => {
    if (!isServerMode) {
      toggleRowSelection(rowKey);
      return;
    }
    setServerSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  const effectiveToggleAllVisible = () => {
    if (!isServerMode) {
      toggleSelectAllVisible();
      return;
    }
    setServerSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (serverAllVisibleSelected) {
        data.forEach((row) => next.delete(getKey(row)));
      } else {
        data.forEach((row) => next.add(getKey(row)));
      }
      return next;
    });
  };

  const effectiveClearSelection = () => {
    if (!isServerMode) {
      clearSelection();
      return;
    }
    setServerSelectedRowKeys(new Set());
  };

  const effectiveOnSortChange = (key: keyof T) => {
    if (!hasSorting) return;
    if (!isServerMode) {
      onSortChange(key);
      return;
    }
    const nextDirection: SortDirection =
      serverSortBy === key ? (serverSortDirection === "asc" ? "desc" : "asc") : "asc";
    serverConfig!.onSortChange(key, nextDirection);
  };

  const [draftFilters, setDraftFilters] = useState<Record<K, FilterValue>>(defaultDraftFilters);
  const tableStateChangeRef = useRef(onTableStateChange);

  useEffect(() => {
    tableStateChangeRef.current = onTableStateChange;
  }, [onTableStateChange]);

  const setDraftFilterValue = (key: K, value: FilterValue) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyDraftFilters = () => {
    if (!hasFilters) return;
    (Object.keys(draftFilters) as K[]).forEach((key) => {
      onFilterChange(key, draftFilters[key]);
    });
    setPage(1);
  };

  useEffect(() => {
    tableStateChangeRef.current?.({
      search: effectiveSearch,
      filters: filterValues,
      page: effectiveCurrentPage,
      pageSize: effectivePageSize,
      sortBy: effectiveSortBy,
      sortDirection: effectiveSortDirection,
    });
  }, [
    effectiveCurrentPage,
    effectivePageSize,
    effectiveSortBy,
    effectiveSortDirection,
    filterValues,
    effectiveSearch,
  ]);

  return (
    <div className="space-y-4">
      {(hasSearch || hasFilters) && (
        <section className="grid gap-3 md:grid-cols-2">
          {hasSearch && (
            <TableSearch
              value={effectiveSearch}
              onChange={effectiveOnSearchChange}
              placeholder={searchConfig?.placeholder ?? "Search..."}
              label={searchConfig?.label ?? "Search"}
            />
          )}

          {hasFilters && (
            <div className="flex items-end">
              <TableFilter
                title={filtersConfig?.title ?? "Filters"}
                triggerLabel={filtersConfig?.triggerLabel ?? "Filters"}
                activeCount={activeFilterCount}
                onOpen={() => setDraftFilters(filterValues)}
                onClear={() => {
                  resetFilters();
                  setDraftFilters(defaultDraftFilters);
                  setPage(1);
                }}
                onApply={applyDraftFilters}
              >
                {filtersConfig?.template({
                  values: draftFilters,
                  setValue: setDraftFilterValue,
                })}
              </TableFilter>
            </div>
          )}
        </section>
      )}

      {loading && <TableSkeleton rows={5} columnCount={columns.length + 1} />}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}

      {!loading && !error && effectiveEmptyStateVariant === "no-data" && (
        <EmptyState
          title={emptyStateConfig?.noDataTitle ?? "No data available"}
          description={emptyStateConfig?.noDataDescription ?? "No records found for this table."}
        />
      )}

      {!loading && !error && effectiveEmptyStateVariant === "no-results" && (
        <EmptyState
          title={emptyStateConfig?.noResultsTitle ?? "No matching results"}
          description={
            emptyStateConfig?.noResultsDescription ?? "Try changing your search or filter values."
          }
        />
      )}

      {!loading && !error && effectiveFilteredCount > 0 && (
        <>
          {hasSelection && (
            <TableBulkActions
              selectedCount={effectiveSelectedCount}
              onClearSelection={effectiveClearSelection}
              onAction={() => selectionConfig?.onBulkAction?.(effectiveSelectedKeys)}
              actionLabel={selectionConfig?.bulkActionLabel ?? "Bulk Action"}
            />
          )}

          <Table
            data={effectiveData}
            columns={columns}
            getKey={getKey}
            rowActions={rowActions}
            rowActionsLabel={rowActionsLabel}
            selectable={hasSelection}
            selectedKeys={effectiveSelectedKeys}
            allVisibleSelected={effectiveAllVisibleSelected}
            onToggleRow={effectiveToggleRow}
            onToggleAllVisible={effectiveToggleAllVisible}
            sortBy={effectiveSortBy}
            sortDirection={effectiveSortDirection}
            onSortChange={hasSorting ? effectiveOnSortChange : undefined}
          />

          {hasPagination && (
            <TablePagination
              currentPage={effectiveCurrentPage}
              totalPages={effectiveTotalPages}
              totalItems={effectiveFilteredCount}
              pageSize={effectivePageSize}
              pageSizeOptions={paginationConfig?.pageSizeOptions}
              onPageSizeChange={
                isServerMode ? serverConfig!.onPageSizeChange : onPageSizeChange
              }
              onFirst={() =>
                isServerMode ? serverConfig!.onPageChange(1) : setPage(1)
              }
              onPrevious={() =>
                isServerMode
                  ? serverConfig!.onPageChange(Math.max(1, effectiveCurrentPage - 1))
                  : setPage(Math.max(1, effectiveCurrentPage - 1))
              }
              onNext={() =>
                isServerMode
                  ? serverConfig!.onPageChange(
                      Math.min(effectiveTotalPages, effectiveCurrentPage + 1)
                    )
                  : setPage(Math.min(effectiveTotalPages, effectiveCurrentPage + 1))
              }
              onLast={() =>
                isServerMode
                  ? serverConfig!.onPageChange(effectiveTotalPages)
                  : setPage(effectiveTotalPages)
              }
            />
          )}
        </>
      )}
    </div>
  );
}
