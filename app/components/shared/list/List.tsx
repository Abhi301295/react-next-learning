type ListProps<T> = {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => string;
};

export default function List<T>({
  data,
  renderItem,
  getKey,
}: ListProps<T>) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No data available</p>;
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