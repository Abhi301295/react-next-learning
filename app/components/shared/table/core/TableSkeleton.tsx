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
    <div className="overflow-x-auto rounded-md border border-stroke bg-panel">
      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="p-3">
                <div className="h-4 w-24 rounded bg-slate-200 animate-pulse dark:bg-slate-700" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: columnCount }).map((_, j) => (
                <td key={j} className="p-3">
                  <div className="h-4 w-full rounded bg-slate-200 animate-pulse dark:bg-slate-700" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}