export function EmptyState({
  title = "No data found",
  description = "There is nothing to display here.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}