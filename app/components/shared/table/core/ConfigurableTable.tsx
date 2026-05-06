'use client';

import { ReactNode, useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import Table, { Column, SortDirection } from "@/components/shared/table/core/Table";
import TableBulkActions from "@/components/shared/table/controls/TableBulkActions";
import TableFilter from "@/components/shared/table/filters/TableFilter";
import TablePagination from "@/components/shared/table/controls/TablePagination";
import TableSearch from "@/components/shared/table/controls/TableSearch";
import TableSkeleton from "@/components/shared/table/core/TableSkeleton";
import { FilterConfig, useTableControls } from "@/lib/hooks/useTableControls";

export type FilterTemplateContext<K extends string> = {
  values: Record<K, string>;
  setValue: (key: K, value: string) => void;
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
};

type ConfigurableTableProps<T, K extends string> = {
  data: T[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  config: TableConfig<T, K>;
  onTableStateChange?: (state: {
    search: string;
    filters: Record<K, string>;
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
  const columns = config.columns;
  const getKey = config.getKey;
  const rowActions = config.rowActions;
  const rowActionsLabel = config.rowActionsLabel;
  const searchConfig = config.search;
  const filtersConfig = config.filters;
  const sortingConfig = config.sorting;
  const paginationConfig = config.pagination;
  const selectionConfig = config.selection;

  const filterDefinitions = filtersConfig?.enabled ? filtersConfig.definitions : [];
  const hasSearch = Boolean(searchConfig?.enabled);
  const hasFilters = Boolean(filtersConfig?.enabled);
  const hasSorting = Boolean(sortingConfig?.enabled);
  const hasPagination = Boolean(paginationConfig?.enabled);
  const hasSelection = Boolean(selectionConfig?.enabled);

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
  } = useTableControls({
    data,
    searchFields: hasSearch ? searchConfig!.fields : [],
    filters: filterDefinitions as Array<FilterConfig<T, K>>,
    initialSortKey: hasSorting ? sortingConfig?.initialSortKey : undefined,
    initialSortDirection: sortingConfig?.initialSortDirection ?? "asc",
    initialPageSize: hasPagination
      ? paginationConfig?.initialPageSize ?? 5
      : Math.max(data.length, 1),
    debounceMs: 300,
    getRowKey: getKey,
  });

  const [draftFilters, setDraftFilters] = useState<Record<K, string>>(filterValues);

  const setDraftFilterValue = (key: K, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyDraftFilters = () => {
    (Object.keys(draftFilters) as K[]).forEach((key) => {
      onFilterChange(key, draftFilters[key]);
    });
    setPage(1);
  };

  useEffect(() => {
    onTableStateChange?.({
      search,
      filters: filterValues,
      page: currentPage,
      pageSize,
      sortBy,
      sortDirection,
    });
  }, [
    currentPage,
    filterValues,
    onTableStateChange,
    pageSize,
    search,
    sortBy,
    sortDirection,
  ]);

  return (
    <div className="space-y-4">
      {(hasSearch || hasFilters) && (
        <section className="grid gap-3 md:grid-cols-2">
          {hasSearch && (
            <TableSearch
              value={search}
              onChange={onSearchChange}
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
                  setDraftFilters(filterValues);
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

      {!loading && !error && emptyStateVariant === "no-data" && (
        <EmptyState
          title="No data available"
          description="No records found for this table."
        />
      )}

      {!loading && !error && emptyStateVariant === "no-results" && (
        <EmptyState
          title="No matching results"
          description="Try changing your search or filter values."
        />
      )}

      {!loading && !error && filteredCount > 0 && (
        <>
          {hasSelection && (
            <TableBulkActions
              selectedCount={selectedCount}
              onClearSelection={clearSelection}
              onAction={() => selectionConfig?.onBulkAction?.(selectedRowKeys)}
              actionLabel={selectionConfig?.bulkActionLabel ?? "Bulk Action"}
            />
          )}

          <Table
            data={paginatedData}
            columns={columns}
            getKey={getKey}
            rowActions={rowActions}
            rowActionsLabel={rowActionsLabel}
            selectable={hasSelection}
            selectedKeys={selectedRowKeys}
            allVisibleSelected={allVisibleSelected}
            onToggleRow={toggleRowSelection}
            onToggleAllVisible={toggleSelectAllVisible}
            sortBy={hasSorting ? sortBy : null}
            sortDirection={sortDirection}
            onSortChange={hasSorting ? onSortChange : undefined}
          />

          {hasPagination && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCount}
              pageSize={pageSize}
              pageSizeOptions={paginationConfig?.pageSizeOptions}
              onPageSizeChange={onPageSizeChange}
              onFirst={() => setPage(1)}
              onPrevious={() => setPage(Math.max(1, currentPage - 1))}
              onNext={() => setPage(Math.min(totalPages, currentPage + 1))}
              onLast={() => setPage(totalPages)}
            />
          )}
        </>
      )}
    </div>
  );
}
