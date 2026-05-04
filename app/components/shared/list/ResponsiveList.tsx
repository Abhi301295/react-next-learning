import Table from "../table/Table";
import List from "./List";

type Column<T> = {
  key: keyof T;
  label: string;
};

type Props<T> = {
  data: T[];
  loading?: boolean;
  error?: string | null;

  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;

  columns: readonly Column<T>[];
};

export default function ResponsiveList<T>({
  data,
  loading,
  error,
  getKey,
  renderItem,
  columns,
}: Props<T>) {
  return (
    <>
      <div className="block md:hidden">
        <List
          data={data}
          loading={loading}
          error={error}
          getKey={getKey}
          renderItem={renderItem}
        />
      </div>

      <div className="hidden md:block overflow-x-auto">
        <Table data={data} columns={columns} getKey={getKey} />
      </div>
    </>
  );
}