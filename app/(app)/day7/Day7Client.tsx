'use client';

import { useMemo, useState } from 'react';
import UserTable from '@/components/features/users/UserTable';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { LoadingState } from '@/components/shared/feedback/LoadingState';
import Dropdown from '@/components/shared/dropdown/Dropdown';
import DropdownOption from '@/components/shared/dropdown/DropdownOption';
import Input from '@/components/ui/Input';
import { useUsers } from '@/lib/hooks/useUsers';

type StatusFilter = 'all' | 'active' | 'inactive';

export default function Day7Client() {
  const { users, loading, error, refetch } = useUsers();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');

  const filteredUsers = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery);

      const matchesStatus = status === 'all' || user.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, status]);

  return (
    <div className="p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Day 7 - Search and Filter</h1>
        <p className="text-sm text-gray-500">
          Find users by name or email and filter by active status.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email"
          label="Search"
        />

        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <Dropdown
            value={status}
            onChange={(value) => setStatus(value as StatusFilter)}
            placeholder="Filter by status"
          >
            <DropdownOption value="all">All</DropdownOption>
            <DropdownOption value="active">Active</DropdownOption>
            <DropdownOption value="inactive">Inactive</DropdownOption>
          </Dropdown>
        </div>
      </section>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && filteredUsers.length === 0 && (
        <EmptyState
          title="No users matched your filters"
          description="Try a different search keyword or status."
        />
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Filtered Users</h2>
            <span className="text-sm text-gray-500">
              Showing: {filteredUsers.length}
            </span>
          </div>
          <UserTable users={filteredUsers} />
        </section>
      )}
    </div>
  );
}
