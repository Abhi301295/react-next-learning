"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ListConfig } from "@/components/shared/list/List";
import type { TableConfig } from "@/components/shared/table/core/ConfigurableTable";
import type { SortDirection } from "@/components/shared/table/core/Table";
import type { FilterValue } from "@/lib/hooks/useTableControls";
import { httpErrPublicMessage, isHttpOk } from "@/lib/app-api";
import { fetchUserListDummyJson } from "@/lib/users/client";
import { mapUpstreamListRow } from "@/lib/users/map-row";
import type { User } from "@/lib/users/types";
import {
  USER_COLUMNS,
  usersFilterDefinitions,
  usersPaginatedDesktopBase,
  usersPaginatedMobileListBase,
  type UsersFilterKey,
} from "@/(app)/users/tableConfigs";

const USER_SORT_API: Partial<Record<keyof User, string>> = {
  id: "id",
  name: "firstName",
  email: "email",
};

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

const UPSTREAM_USER_FETCH_CAP = 0;

function sortUsers(
  users: User[],
  sortBy: keyof User | null,
  sortDirection: SortDirection
): User[] {
  if (!sortBy) return [...users];
  const copy = [...users];
  copy.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (typeof av === "number" && typeof bv === "number") {
      return sortDirection === "asc" ? av - bv : bv - av;
    }
    const aText = String(av ?? "").toLowerCase();
    const bText = String(bv ?? "").toLowerCase();
    const c = aText.localeCompare(bText);
    return sortDirection === "asc" ? c : -c;
  });
  return copy;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [mobileUsers, setMobileUsers] = useState<User[]>([]);
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
  const [sortBy, setSortBy] = useState<keyof User | null>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const bulkFilteredSnapshotRef = useRef<{ key: string; users: User[] } | null>(
    null
  );
  const mobileUsersRef = useRef<User[]>([]);
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
      const filtersActive = filterRole !== "all" || filterStatus !== "all";
      const useClientSort =
        filtersActive ||
        sortBy === "role" ||
        sortBy === "status";

      const extendMobileListOnly =
        lastListLoadedAfterFetchRef.current > 0 &&
        listLoadedPages > lastListLoadedAfterFetchRef.current &&
        mobileUsersRef.current.length >= pageSize;

      try {
        if (extendMobileListOnly) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        if (!useClientSort) {
          bulkFilteredSnapshotRef.current = null;
          const itemsNeeded = Math.max(
            tablePage * pageSize,
            listLoadedPages * pageSize
          );
          const apiSort = USER_SORT_API[sortBy ?? "id"] ?? "id";
          const r = await fetchUserListDummyJson(
            {
              limit: itemsNeeded,
              skip: 0,
              search: debouncedSearch || undefined,
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
          const { users: rows, total: catalogTotal } = r.data;
          const mapped = rows.map(mapUpstreamListRow);
          const tableSlice = mapped.slice(
            (tablePage - 1) * pageSize,
            tablePage * pageSize
          );
          const mobileSlice = mapped.slice(0, listLoadedPages * pageSize);
          setUsers(tableSlice);
          setMobileUsers(mobileSlice);
          mobileUsersRef.current = mobileSlice;
          lastListLoadedAfterFetchRef.current = listLoadedPages;
          setTotalItems(
            resolveTotal(catalogTotal, tablePage, pageSize, rows.length)
          );
        } else {
          const bulkKey = `${filterRole}\0${filterStatus}\0${debouncedSearch}\0${String(sortBy)}\0${sortDirection}`;
          let sorted: User[];
          const snap = bulkFilteredSnapshotRef.current;
          if (snap?.key === bulkKey) {
            sorted = snap.users;
          } else {
            const r = await fetchUserListDummyJson(
              {
                limit: UPSTREAM_USER_FETCH_CAP,
                skip: 0,
                search: debouncedSearch || undefined,
                sortBy: "id",
                order: "asc",
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
            const mapped = r.data.users.map(mapUpstreamListRow);
            const fv: Record<UsersFilterKey, FilterValue> = {
              role: filterRole,
              status: filterStatus,
            };
            const filtered = mapped.filter((u) =>
              usersFilterDefinitions.every((f) => f.predicate(u, fv[f.key]))
            );
            sorted = sortUsers(filtered, sortBy, sortDirection);
            bulkFilteredSnapshotRef.current = { key: bulkKey, users: sorted };
          }

          setTotalItems(sorted.length);
          const tableSlice = sorted.slice(
            (tablePage - 1) * pageSize,
            tablePage * pageSize
          );
          const mobileSlice = sorted.slice(0, listLoadedPages * pageSize);
          setUsers(tableSlice);
          setMobileUsers(mobileSlice);
          mobileUsersRef.current = mobileSlice;
          lastListLoadedAfterFetchRef.current = listLoadedPages;
        }
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
      filterRole,
      filterStatus,
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
      onSortChange: (key: keyof User, direction: SortDirection) => {
        setSortBy(key);
        setSortDirection(direction);
        resetPaging();
      },
      onFiltersChange: (values: Record<UsersFilterKey, FilterValue>) => {
        const role = typeof values.role === "string" ? values.role : "all";
        const status = typeof values.status === "string" ? values.status : "all";
        setFilterRole(role);
        setFilterStatus(status);
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
      filterRole,
      filterStatus,
      listLoadedPages,
      resetPaging,
    ]
  );

  const desktopTableConfig = useMemo<
    Omit<TableConfig<User, "role" | "status">, "columns" | "getKey">
  >(
    () => ({
      ...usersPaginatedDesktopBase,
      server: serverBlock,
    }),
    [serverBlock]
  );

  const mobileListConfig = useMemo<
    Omit<ListConfig<User, "role" | "status">, "server">
  >(
    () => ({
      ...usersPaginatedMobileListBase,
    }),
    []
  );

  const mobileListConfigWithServer = useMemo<
    ListConfig<User, "role" | "status">
  >(
    () => ({
      ...mobileListConfig,
      server: serverBlock,
    }),
    [mobileListConfig, serverBlock]
  );

  return {
    users,
    mobileUsers,
    totalItems,
    loading,
    loadingMore,
    hasFetched,
    error,
    refetch,
    userColumns: USER_COLUMNS,
    desktopTableConfig,
    mobileListConfig: mobileListConfigWithServer,
  };
}
