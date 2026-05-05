import { useMemo, useState } from "react";

type ListControlsProps<T> = {
  data: T[];
  searchKey?: keyof T;
  itemsPerPage?: number;
};

export function useListControls<T>({
  data,
  searchKey,
  itemsPerPage = 5,
}: ListControlsProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search || !searchKey) return data;

    return data.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search, searchKey]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  return {
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    data: paginatedData,
  };
}
