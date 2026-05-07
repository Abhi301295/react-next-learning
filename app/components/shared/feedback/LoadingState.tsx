export function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-md border border-stroke bg-panel">
      <table className="w-full">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            {[1, 2, 3, 4].map((i) => (
              <th key={i} className="p-3">
                <div className="h-4 w-20 rounded bg-slate-200 animate-pulse dark:bg-slate-700" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {[1, 2, 3, 4].map((j) => (
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