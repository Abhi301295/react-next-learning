import { SkeletonPulse } from "@/components/shared/feedback/SkeletonPulse";

type TableSkeletonProps = {
  rows?: number;
  columnCount?: number;
  /**
   * Reserve a trailing actions column whose cell matches the real
   * `iconOnly md` action button height/width (`h-10 w-10`).
   * Keeping this in sync with `<Table rowActions>` is what prevents
   * a per-row 16–20px shift when data resolves.
   */
  includeActionColumn?: boolean;
  /**
   * Render a placeholder that mirrors `<TablePagination>` directly below
   * the table. Reserves the ~52px footer so the appearance of real
   * pagination after data load does not push content below it.
   */
  includePaginationFooter?: boolean;
};

/**
 * Skeleton tuned to match `<Table>`'s rendered geometry so swapping the
 * loading state for real rows does not contribute to CLS. In particular:
 *
 * - Each cell uses `h-10` content (matching the `iconOnly md` action button
 *   which dominates row height) instead of `h-4`, so the per-row height
 *   matches `<Table>` rows.
 * - When the real table renders an actions column, include it here too.
 * - When pagination is enabled, reserve the footer height up-front.
 */
export default function TableSkeleton({
  rows = 5,
  columnCount = 4,
  includeActionColumn = false,
  includePaginationFooter = false,
}: TableSkeletonProps) {
  const totalCols = columnCount + (includeActionColumn ? 1 : 0);

  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading table">
      <div className="overflow-x-auto rounded-md border border-stroke bg-panel">
        <table className="w-full">
          <thead className="border-b border-stroke bg-secondary/5">
            <tr>
              {Array.from({ length: totalCols }).map((_, i) => (
                <th key={i} className="p-3">
                  <SkeletonPulse className="h-5 w-24" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td key={colIndex} className="p-3">
                    <div className="flex h-10 items-center">
                      <SkeletonPulse className="h-4 w-full max-w-[12rem]" />
                    </div>
                  </td>
                ))}
                {includeActionColumn && (
                  <td className="p-3">
                    <div className="flex h-10 items-center justify-start sm:justify-end">
                      <SkeletonPulse className="h-10 w-10 rounded-lg" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {includePaginationFooter && (
        <div
          aria-hidden
          className="flex justify-end border-t border-stroke pt-4"
        >
          <div className="flex flex-wrap items-center justify-end gap-2">
            <SkeletonPulse className="h-5 w-24" />
            <SkeletonPulse className="h-8 w-16 rounded" />
            <SkeletonPulse className="h-5 w-20" />
            <SkeletonPulse className="h-8 w-8 rounded-lg" />
            <SkeletonPulse className="h-8 w-8 rounded-lg" />
            <SkeletonPulse className="h-8 w-8 rounded-lg" />
            <SkeletonPulse className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
