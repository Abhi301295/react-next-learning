export type Column<T, K extends keyof T = keyof T> = {
  key: K;
  label: string;
  render?: (value: T[K], row: T) => React.ReactNode;
};

type TableProps<T, C extends readonly Column<T, keyof T>[]> = {
  data: T[];
  columns: C;
  getKey: (item: T) => string | number;
  loading?: boolean;
  error?: string | null;
};

export default function Table<
  T,
  C extends readonly Column<T, keyof T>[]
>({
  data,
  columns,
  getKey,
  loading,
  error,
}: TableProps<T, C>) {

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  if (!data.length) {
    return <p className="p-4 text-gray-500">No data available</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm">

        <thead className="bg-gray-100 text-left">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="p-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr
              key={getKey(item)}
              className="border-t hover:bg-gray-50 transition"
            >
              {columns.map((col) => {
                const value = item[col.key];

                return (
                  <td key={String(col.key)} className="p-3">
                    {col.render
                      ? col.render(value, item)
                      : String(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}