'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ApiPost,
  createDay8ApiTableConfig,
  Day8ApiKey,
  Day8PostRow,
  mapApiPostToRow,
  SORT_FIELD_MAP,
} from './tableConfigs';

export function useDay8ApiTable() {
  const [tableRows, setTableRows] = useState<Day8PostRow[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);
  const [tableSearchInput, setTableSearchInput] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(5);
  const [tableTotalItems, setTableTotalItems] = useState(0);
  const [tableSortBy, setTableSortBy] = useState<keyof Day8PostRow | null>('title');
  const [tableSortDirection, setTableSortDirection] = useState<'asc' | 'desc'>('asc');
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTableSearch(tableSearchInput.trim());
      setTablePage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [tableSearchInput]);

  useEffect(() => {
    const controller = new AbortController();
    let requestAborted = false;

    const fetchUsers = async () => {
      try {
        setTableLoading(true);
        setTableError(null);

        const params = new URLSearchParams();
        params.set('_page', String(tablePage));
        params.set('_limit', String(tablePageSize));
        if (tableSearch) params.set('q', tableSearch);

        const apiSortKey = tableSortBy ? SORT_FIELD_MAP[tableSortBy] : undefined;
        if (apiSortKey) {
          params.set('_sort', apiSortKey);
          params.set('_order', tableSortDirection);
        }

        const response = await fetch(`/api/posts?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed to fetch records');

        const totalFromHeader = Number(response.headers.get('x-total-count'));
        setTableTotalItems(Number.isFinite(totalFromHeader) ? totalFromHeader : 0);

        const data: ApiPost[] = await response.json();
        setTableRows(data.map(mapApiPostToRow));
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          requestAborted = true;
          return;
        }
        setTableError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (requestAborted || controller.signal.aborted) return;
        setTableLoading(false);
      }
    };

    void fetchUsers();
    return () => controller.abort();
  }, [
    tablePage,
    tablePageSize,
    tableSearch,
    tableSortBy,
    tableSortDirection,
    tableRefreshKey,
  ]);

  const tableConfig = useMemo(
    () =>
      createDay8ApiTableConfig({
        search: tableSearchInput,
        page: tablePage,
        pageSize: tablePageSize,
        totalItems: tableTotalItems,
        sortBy: tableSortBy,
        sortDirection: tableSortDirection,
        onSearchChange: (value) => setTableSearchInput(value),
        onPageChange: (page) => setTablePage(page),
        onPageSizeChange: (size) => {
          setTablePageSize(size);
          setTablePage(1);
        },
        onSortChange: (key, direction) => {
          if (!SORT_FIELD_MAP[key]) return;
          setTableSortBy(key);
          setTableSortDirection(direction);
          setTablePage(1);
        },
      }),
    [tableSearchInput, tablePage, tablePageSize, tableTotalItems, tableSortBy, tableSortDirection]
  );

  return {
    tableRows,
    tableLoading,
    tableError,
    tableConfig,
    retry: () => setTableRefreshKey((prev) => prev + 1),
  } as const;
}

export type { Day8ApiKey };
