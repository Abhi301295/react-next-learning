'use client';

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function TablePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: TablePaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
