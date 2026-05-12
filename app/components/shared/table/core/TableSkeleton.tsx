'use client';

type TableSkeletonProps = {
  rows?: number;
  columnCount?: number;
};

export default function TableSkeleton({
  rows = 5,
  columnCount = 4,
}: TableSkeletonProps) {
  return (
    <div
      className="overflow-x-auto rounded-md border border-stroke bg-panel"
      aria-busy="true"
      aria-label="Loading table"
    >
      <table className="w-full">
        <thead className="border-b border-stroke bg-secondary/5">
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="p-3">
                <div className="h-4 w-24 animate-pulse rounded-md bg-stroke" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: columnCount }).map((_, j) => (
                <td key={j} className="p-3">
                  <div className="h-4 w-full animate-pulse rounded-md bg-stroke" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}