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
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="p-3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t">
              {Array.from({ length: columnCount }).map((_, j) => (
                <td key={j} className="p-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}