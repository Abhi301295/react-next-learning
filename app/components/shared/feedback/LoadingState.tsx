type LoadingStateProps = {
  rows?: number;
  layout?: "table" | "cards";
};

export function LoadingState({ rows = 5, layout = "table" }: LoadingStateProps) {
  if (layout === "cards") {
    return (
      <ul className="space-y-2" aria-busy="true" aria-label="Loading list">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i}>
            <div className="rounded-xl border border-stroke bg-panel p-4 shadow-sm">
              <div className="mb-3 h-5 max-w-[min(100%,20rem)] rounded-md bg-slate-200 animate-pulse dark:bg-slate-700" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded-md bg-slate-200 animate-pulse dark:bg-slate-700" />
                <div className="h-3 w-4/5 max-w-lg rounded-md bg-slate-200 animate-pulse dark:bg-slate-700" />
                <div className="h-3 w-3/5 max-w-sm rounded-md bg-slate-200 animate-pulse dark:bg-slate-700" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

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