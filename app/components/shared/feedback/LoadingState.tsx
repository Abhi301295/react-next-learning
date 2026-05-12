import { SkeletonPulse } from "./SkeletonPulse";

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
              <SkeletonPulse className="mb-3 h-5 max-w-[min(100%,20rem)]" />
              <div className="space-y-2">
                <SkeletonPulse className="h-3 w-full" />
                <SkeletonPulse className="h-3 w-[80%] max-w-lg" />
                <SkeletonPulse className="h-3 w-[60%] max-w-sm" />
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
                <SkeletonPulse className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {[1, 2, 3, 4].map((j) => (
                <td key={j} className="p-3">
                  <SkeletonPulse className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
