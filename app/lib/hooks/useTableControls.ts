import { useEffect, useMemo, useState } from "react";
import type { SortDirection } from "@/components/shared/table/Table";

type UseTableControlsOptions<T, F extends string> = {
  data: T[];
  searchFields: Array<keyof T>;
  initialFilter: F;
  initialSortKey?: keyof T;
  initialSortDirection?: SortDirection;
  initialPageSize?: number;
  debounceMs?: number;
  getRowKey: (row: T) => string | number;
  filterFn: (item: T, activeFilter: F) => boolean;
};

export function useTableControls<T, F extends string>({
  data,
  searchFields,
  initialFilter,
  initialSortKey,
  initialSortDirection = "asc",
  initialPageSize = 5,
  debounceMs = 300,
  getRowKey,
  filterFn,
}: UseTableControlsOptions<T, F>) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<F>(initialFilter);
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

      return matchesSearch && filterFn(item, activeFilter);
    });
  }, [activeFilter, data, filterFn, search, searchFields]);

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

  const allVisibleSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRowKeys.has(getRowKey(row)));

  const onSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const onFilterChange = (value: F) => {
    setActiveFilter(value);
    setPage(1);
  };

  const onPageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const onSortChange = (key: keyof T) => {
    setPage(1);
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(key);
    setSortDirection("asc");
  };

  const toggleRowSelection = (rowKey: string | number) => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }
      return next;
    });
  };

  const toggleSelectAllVisible = () => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        paginatedData.forEach((row) => next.delete(getRowKey(row)));
      } else {
        paginatedData.forEach((row) => next.add(getRowKey(row)));
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedRowKeys(new Set());
  };

  const selectedCount = selectedRowKeys.size;
  const emptyStateVariant =
    data.length === 0 ? "no-data" : filteredData.length === 0 ? "no-results" : "has-results";

  return {
    search: searchInput,
    onSearchChange,
    activeFilter,
    onFilterChange,
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
