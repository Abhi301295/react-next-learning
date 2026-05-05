'use client';

import UserTable from '@/components/features/users/UserTable';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import TableBulkActions from '@/components/shared/table/TableBulkActions';
import TableFilter from '@/components/shared/table/TableFilter';
import TablePagination from '@/components/shared/table/TablePagination';
import TableSearch from '@/components/shared/table/TableSearch';
import TableSkeleton from '@/components/shared/table/TableSkeleton';
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
    sortBy,
    sortDirection,
    onSortChange,
    currentPage,
    totalPages,
    setPage,
    filteredCount,
    paginatedData: paginatedUsers,
    selectedRowKeys,
    selectedCount,
    allVisibleSelected,
    toggleRowSelection,
    toggleSelectAllVisible,
    clearSelection,
    emptyStateVariant,
  } = useTableControls({
    data: users,
    searchFields: ['name', 'email'],
    initialFilter: 'all' as StatusFilter,
    initialSortKey: 'name',
    initialSortDirection: 'asc',
    initialPageSize: 5,
    debounceMs: 300,
    getRowKey: (user) => user.id,
    filterFn: (user, statusFilter) =>
      statusFilter === 'all' || user.status === statusFilter,
  });

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Day 7</h1>
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
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            icon="⟲"
            onClick={() => {
              onSearchChange("");
              onFilterChange("all");
              onPageSizeChange(5);
              setPage(1);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </section>

      {loading && <TableSkeleton rows={5} columnCount={5} />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && emptyStateVariant === 'no-data' && (
        <EmptyState
          title="No users available"
          description="The user list is currently empty."
        />
      )}

      {!loading && !error && emptyStateVariant === 'no-results' && (
        <EmptyState
          title="No users matched your filters"
          description="Try a different search keyword or status filter."
        />
      )}

      {!loading && !error && filteredCount > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium">Users List</h2>
            <span className="text-sm text-gray-500">
              Showing {paginatedUsers.length} of {filteredCount}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Selected IDs:{" "}
            {selectedCount > 0 ? Array.from(selectedRowKeys).join(', ') : 'none'}
          </div>

          <TableBulkActions
            selectedCount={selectedCount}
            onClearSelection={clearSelection}
            onAction={() => {}}
            actionLabel="Export Selected"
          />

          <UserTable
            users={paginatedUsers}
            rowActionsLabel="Row Actions"
            rowActions={(user) => (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  iconOnly
                  icon="👁"
                  aria-label={`View user ${user.name}`}
                  onClick={() => {}}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  icon="✎"
                  className="w-full sm:w-auto"
                  onClick={() => {}}
                >
                  Edit
                </Button>
              </>
            )}
            selectable
            selectedKeys={selectedRowKeys}
            allVisibleSelected={allVisibleSelected}
            onToggleRow={toggleRowSelection}
            onToggleAllVisible={toggleSelectAllVisible}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
          />
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCount}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            onFirst={() => setPage(1)}
            onPrevious={() => setPage(Math.max(1, currentPage - 1))}
            onNext={() => setPage(Math.min(totalPages, currentPage + 1))}
            onLast={() => setPage(totalPages)}
          />
        </section>
      )}
    </div>
  );
}
