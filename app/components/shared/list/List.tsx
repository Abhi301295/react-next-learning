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
    return loadingComponent || <p>Loading...</p>;
  }

  if (error) {
    return errorComponent || <p className="text-red-500">{error}</p>;
  }

  if (!data || data.length === 0) {
    return emptyComponent || <p>No data available</p>;
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