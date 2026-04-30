import { EmptyState } from "../feedback/EmptyState";
import { ErrorState } from "../feedback/ErrorState";
import { LoadingState } from "../feedback/LoadingState";

type ListProps<T> = {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;

  loading?: boolean;
  error?: string | null;

  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
};

export default function List<T>({
  data,
  renderItem,
  getKey,
  loading,
  error,
  loadingComponent,
  errorComponent,
  emptyComponent,
}: ListProps<T>) {
  if (loading) {
    return loadingComponent || <LoadingState />;
  }

  if (error) {
    return errorComponent || <ErrorState message={error} />;
  }

  if (!data || data.length === 0) {
    return emptyComponent || <EmptyState />;
  }

  return (
    <ul className="space-y-2">
      {data.map((item) => (
        <li key={getKey(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}