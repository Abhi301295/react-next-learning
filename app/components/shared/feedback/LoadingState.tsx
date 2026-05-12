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
              <div className="mb-3 h-5 max-w-[min(100%,20rem)] animate-pulse rounded-md bg-stroke" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded-md bg-stroke" />
                <div className="h-3 w-[80%] max-w-lg animate-pulse rounded-md bg-stroke" />
                <div className="h-3 w-[60%] max-w-sm animate-pulse rounded-md bg-stroke" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-md border border-stroke bg-panel"
      aria-busy="true"
      aria-label="Loading table"
    >
      <table className="w-full">
        <thead className="border-b border-stroke bg-secondary/5">
          <tr>
            {[1, 2, 3, 4].map((i) => (
              <th key={i} className="p-3">
                <div className="h-4 w-20 animate-pulse rounded-md bg-stroke" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {[1, 2, 3, 4].map((j) => (
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