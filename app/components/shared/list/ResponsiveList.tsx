import ConfigurableTable, { type TableConfig } from "../table/core/ConfigurableTable";
import { EmptyState } from "../feedback/EmptyState";
import { ErrorState } from "../feedback/ErrorState";
import { LoadingState } from "../feedback/LoadingState";
import type { Column } from "../table/core/Table";
import List, { type ListConfig } from "./List";

type Props<T, K extends string = never> = {
  data: T[];
  /** When set, narrow layout uses this list (e.g. accumulated load-more rows) while the table uses `data`. */
  mobileData?: T[];
  loading?: boolean;
  loadingMore?: boolean;
  error?: string | null;
  onRetry?: () => void;

  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
  columns: readonly Column<T, keyof T>[];

  /**
   * Optional configurable table options for desktop mode.
   * `columns` and `getKey` are always driven by ResponsiveList props.
   */
  desktopTableConfig?: Omit<TableConfig<T, K>, "columns" | "getKey">;
  mobileListConfig?: ListConfig<T, K>;
  mobileStateConfig?: {
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
    emptyComponent?: React.ReactNode;
  };
};

export default function ResponsiveList<T, K extends string = never>({
  data,
  mobileData,
  loading,
  loadingMore = false,
  error,
  onRetry,
  getKey,
  renderItem,
  columns,
  desktopTableConfig,
  mobileListConfig,
  mobileStateConfig,
}: Props<T, K>) {
  const desktopConfig: TableConfig<T, K> = {
    ...desktopTableConfig,
    columns: [...columns],
    getKey,
  };

  return (
    <>
      <div className="block md:hidden">
        <List
          data={mobileData ?? data}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          onRetry={onRetry}
          getKey={(item) => String(getKey(item))}
          renderItem={renderItem}
          config={mobileListConfig}
          loadingComponent={
            mobileStateConfig?.loadingComponent ?? <LoadingState layout="cards" />
          }
          errorComponent={
            mobileStateConfig?.errorComponent ?? (
              <ErrorState message={error ?? "Something went wrong"} onRetry={onRetry} />
            )
          }
          emptyComponent={mobileStateConfig?.emptyComponent ?? <EmptyState />}
        />
      </div>

      <div className="hidden md:block overflow-x-auto">
        <ConfigurableTable
          data={data}
          loading={loading}
          error={error}
          onRetry={onRetry}
          config={desktopConfig}
        />
      </div>
    </>
  );
}