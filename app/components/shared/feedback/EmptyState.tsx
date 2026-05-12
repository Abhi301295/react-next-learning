import type { ReactNode } from "react";

export function EmptyState({
  title = "No data found",
  description = "There is nothing to display here.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-lg font-medium text-foreground">{title}</p>
      <p className="max-w-md text-sm text-subtle">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}