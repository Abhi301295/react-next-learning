import { useMemo, useState } from "react";

type UseTableControlsOptions<T, F extends string> = {
  data: T[];
  searchFields: Array<keyof T>;
  initialFilter: F;
  initialPageSize?: number;
  filterFn: (item: T, activeFilter: F) => boolean;
};

export function useTableControls<T, F extends string>({
  data,
  searchFields,
  initialFilter,
  initialPageSize = 5,
  filterFn,
}: UseTableControlsOptions<T, F>) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<F>(initialFilter);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

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

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [currentPage, filteredData, pageSize]);

  const onSearchChange = (value: string) => {
    setSearch(value);
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

  return {
    search,
    onSearchChange,
    activeFilter,
    onFilterChange,
    pageSize,
    onPageSizeChange,
    currentPage,
    totalPages,
    setPage,
    filteredCount: filteredData.length,
    paginatedData,
  };
}
