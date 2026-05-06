import { useCallback, useEffect, useMemo, useState } from "react";
import type { SortDirection } from "@/components/shared/table/core/Table";

export type FilterConfig<T, K extends string> = {
  key: K;
  initialValue: string;
  predicate: (item: T, value: string) => boolean;
};

type UseTableControlsOptions<T, K extends string> = {
  data: T[];
  searchFields: Array<keyof T>;
  filters: Array<FilterConfig<T, K>>;
  initialSortKey?: keyof T;
  initialSortDirection?: SortDirection;
  initialPageSize?: number;
  debounceMs?: number;
  getRowKey: (row: T) => string | number;
};

export function useTableControls<T, K extends string>({
  data,
  searchFields,
  filters,
  initialSortKey,
  initialSortDirection = "asc",
  initialPageSize = 5,
  debounceMs = 300,
  getRowKey,
}: UseTableControlsOptions<T, K>) {
  const initialFilterValues = useMemo(
    () =>
      filters.reduce((acc, filter) => {
        acc[filter.key] = filter.initialValue;
        return acc;
      }, {} as Record<K, string>),
    [filters]
  );

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<K, string>>(initialFilterValues);
  const [sortBy, setSortBy] = useState<keyof T | null>(initialSortKey ?? null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string | number>>(
    new Set()
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [debounceMs, searchInput]);

  const filteredData = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return data.filter((item) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        searchFields.some((field) =>
          String(item[field]).toLowerCase().includes(normalizedQuery)
        );

      const matchesFilters = filters.every((filter) =>
        filter.predicate(item, filterValues[filter.key])
      );

      return matchesSearch && matchesFilters;
    });
  }, [data, filterValues, filters, search, searchFields]);

  const sortedData = useMemo(() => {
    if (!sortBy) {
      return filteredData;
    }

    const sorted = [...filteredData];

    sorted.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aText = String(aValue ?? "").toLowerCase();
      const bText = String(bValue ?? "").toLowerCase();
      const comparison = aText.localeCompare(bText);
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [currentPage, sortedData, pageSize]);

  const allVisibleSelected = useMemo(
    () =>
      paginatedData.length > 0 &&
      paginatedData.every((row) => selectedRowKeys.has(getRowKey(row))),
    [getRowKey, paginatedData, selectedRowKeys]
  );

  const onSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const onFilterChange = useCallback((key: K, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilterValues(initialFilterValues);
    setPage(1);
  }, [initialFilterValues]);

  const onPageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    setPage(1);
  }, []);

  const onSortChange = useCallback((key: keyof T) => {
    setPage(1);
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDirection("asc");
  }, [sortBy]);

  const toggleRowSelection = useCallback((rowKey: string | number) => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }
      return next;
    });
  }, []);

  const toggleSelectAllVisible = useCallback(() => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        paginatedData.forEach((row) => next.delete(getRowKey(row)));
      } else {
        paginatedData.forEach((row) => next.add(getRowKey(row)));
      }
      return next;
    });
  }, [allVisibleSelected, getRowKey, paginatedData]);

  const clearSelection = useCallback(() => {
    setSelectedRowKeys(new Set());
  }, []);

  const selectedCount = selectedRowKeys.size;
  const activeFilterCount = useMemo(
    () =>
      filters.filter((filter) => filterValues[filter.key] !== filter.initialValue).length,
    [filterValues, filters]
  );
  const emptyStateVariant =
    data.length === 0 ? "no-data" : filteredData.length === 0 ? "no-results" : "has-results";

  return {
    search: searchInput,
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
    filteredCount: filteredData.length,
    paginatedData,
    selectedRowKeys,
    selectedCount,
    allVisibleSelected,
    toggleRowSelection,
    toggleSelectAllVisible,
    clearSelection,
    emptyStateVariant,
  };
}
