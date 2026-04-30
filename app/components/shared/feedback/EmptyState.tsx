export function EmptyState({ message = "No data found" }: { message?: string }) {
  return (
    <div className="text-center py-6 text-gray-500">
      <p>{message}</p>
    </div>
  );
}