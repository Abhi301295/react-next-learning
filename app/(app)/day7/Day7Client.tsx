'use client';

import UserTable from '@/components/features/users/UserTable';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import TableFilter from '@/components/shared/table/TableFilter';
import TablePagination from '@/components/shared/table/TablePagination';
import TableSearch from '@/components/shared/table/TableSearch';
import { useTableControls } from '@/lib/hooks/useTableControls';
import { useUsers } from '@/lib/hooks/useUsers';

type StatusFilter = 'all' | 'active' | 'inactive';

export default function Day7Client() {
  const { users, loading, error, refetch } = useUsers();
  const {
    search,
    onSearchChange,
    activeFilter,
    onFilterChange,
    pageSize,
    onPageSizeChange,
    currentPage,
    totalPages,
    setPage,
    filteredCount,
    paginatedData: paginatedUsers,
  } = useTableControls({
    data: users,
    searchFields: ['name', 'email'],
    initialFilter: 'all' as StatusFilter,
    initialPageSize: 5,
    filterFn: (user, statusFilter) =>
      statusFilter === 'all' || user.status === statusFilter,
  });

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-sm text-gray-500">
          Search, filter, and paginate users in the listing view.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <TableSearch
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name or email"
          label="Search"
        />

        <TableFilter
          label="Status"
          value={activeFilter}
          onChange={(value) => onFilterChange(value as StatusFilter)}
          placeholder="Filter by status"
          options={[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
        />

        <TableFilter
          label="Rows"
          value={String(pageSize)}
          onChange={(value) => onPageSizeChange(Number(value))}
          placeholder="Rows per page"
          options={[
            { label: '5 / page', value: '5' },
            { label: '10 / page', value: '10' },
            { label: '20 / page', value: '20' },
          ]}
          className="md:max-w-[10rem]"
        />
      </section>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && filteredCount === 0 && (
        <EmptyState
          title="No users matched your filters"
          description="Try a different search keyword or status."
        />
      )}

      {!loading && !error && filteredCount > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Users List</h2>
            <span className="text-sm text-gray-500">
              Showing {paginatedUsers.length} of {filteredCount}
            </span>
          </div>

          <UserTable users={paginatedUsers} />
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setPage(Math.max(1, currentPage - 1))}
            onNext={() => setPage(Math.min(totalPages, currentPage + 1))}
          />
        </section>
      )}
    </div>
  );
}
