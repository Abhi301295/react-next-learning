"use client";

import ConfigurableTable from "@/components/shared/table/core/ConfigurableTable";
import { Day8ApiKey, Day8ProductRow } from "./tableConfigs";
import { useDay8ApiTable } from "./useDay8ApiTable";

export function ApiTableDemo() {
  const { tableRows, tableLoading, tableError, tableConfig, retry } =
    useDay8ApiTable();

  return (
    <section
      className="space-y-3 rounded-card border border-border p-4"
      aria-label="api driven table"
    >
      <h2 className="text-lg font-semibold text-brand-600">
        API Driven Table (DummyJSON products)
      </h2>
      <ConfigurableTable<Day8ProductRow, Day8ApiKey>
        data={tableRows}
        loading={tableLoading}
        error={tableError}
        onRetry={retry}
        config={tableConfig}
      />
    </section>
  );
}
