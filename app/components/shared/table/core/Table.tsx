export type Column<T, K extends keyof T = keyof T> = {
  key: K;
  label: string;
  render?: (value: T[K], row: T) => React.ReactNode;
  sortable?: boolean;
};

export type SortDirection = "asc" | "desc";

type TableProps<T, C extends readonly Column<T, keyof T>[]> = {
  data: T[];
  columns: C;
  getKey: (item: T) => string | number;
  rowActions?: (row: T) => React.ReactNode;
  rowActionsLabel?: string;
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  allVisibleSelected?: boolean;
  onToggleRow?: (key: string | number) => void;
  onToggleAllVisible?: () => void;
  sortBy?: keyof T | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: keyof T) => void;
};

export default function Table<
  T,
  C extends readonly Column<T, keyof T>[]
>({
  data,
  columns,
  getKey,
  rowActions,
  rowActionsLabel = "Actions",
  selectable = false,
  selectedKeys,
  allVisibleSelected = false,
  onToggleRow,
  onToggleAllVisible,
  sortBy = null,
  sortDirection = "asc",
  onSortChange,
}: TableProps<T, C>) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm">

        <thead className="bg-gray-100 text-left">
          <tr>
            {selectable && (
              <th className="p-3 w-12">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={onToggleAllVisible}
                  aria-label="Select all visible rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={String(col.key)} className="p-3 font-medium">
                {col.sortable ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => onSortChange?.(col.key)}
                    aria-label={`Sort by ${col.label}`}
                  >
                    <span>{col.label}</span>
                    <span className="text-xs">
                      {sortBy === col.key ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            {rowActions && (
              <th className="p-3 font-medium text-left sm:text-right">{rowActionsLabel}</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={getKey(item)} className="border-t hover:bg-gray-50 transition">
              {selectable && (
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedKeys?.has(getKey(item)) ?? false}
                    onChange={() => onToggleRow?.(getKey(item))}
                    aria-label={`Select row ${String(getKey(item))}`}
                  />
                </td>
              )}
              {columns.map((col) => {
                const value = item[col.key];

                return (
                  <td key={String(col.key)} className="p-3">
                    {col.render
                      ? col.render(value, item)
                      : String(value)}
                  </td>
                );
              })}
              {rowActions && (
                <td className="p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    {rowActions(item)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}