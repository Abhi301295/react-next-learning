'use client';

import ConfigurableTable from '@/components/shared/table/core/ConfigurableTable';
import { useUsers } from "@/lib/hooks/useUsers";
import type { User } from "@/lib/users/types";
import { Day7FilterKey, panelTableConfig } from './tableConfigs';

export default function Day7Client() {
  const { users, loading, hasFetched, error, refetch } = useUsers();

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Day 7</h1>
        <p className="text-sm text-subtle">
          Demo: configurable filters with select, date, and checkbox inputs.
        </p>
      </header>
      <ConfigurableTable<User, Day7FilterKey>
        data={users}
        loading={loading || !hasFetched}
        error={error}
        onRetry={refetch}
        config={panelTableConfig}
      />
    </div>
  );
}
