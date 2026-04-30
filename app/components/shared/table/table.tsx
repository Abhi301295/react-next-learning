type Column<T> = {
  key: keyof T;
  label: string;
};

type TableProps<T> = {
  data: T[];
  columns: readonly Column<T>[];
  getKey: (item: T) => string;
};

export default function Table<T>({
  data,
  columns,
  getKey,
}: TableProps<T>) {
  if (!data.length) return <p>No data</p>;

  return (
    <table className="w-full border rounded-md overflow-hidden">
      <thead className="bg-gray-100 text-left">
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="p-3 text-sm font-medium">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={getKey(item)} className="border-t">
            {columns.map((col) => (
              <td key={String(col.key)} className="p-3">
                {String(item[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}