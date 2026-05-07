'use client';

import { Button } from '@/components/ui/Button';

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageSizeChange: (value: number) => void;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
};

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  onPageSizeChange,
  onFirst,
  onPrevious,
  onNext,
  onLast,
}: TablePaginationProps) {
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-end border-t border-stroke pt-4"
    >
      <div className="flex flex-wrap items-center justify-end gap-2 text-sm text-subtle">
        <span>Rows per page:</span>
        <select
          aria-label="Rows per page"
          className="rounded border border-stroke bg-panel px-2 py-1 text-foreground"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="min-w-24 text-right">
          {rangeStart}-{rangeEnd} of {totalItems}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          iconOnly
          aria-label="First page"
          onClick={onFirst}
          disabled={currentPage <= 1}
          icon={"<<"}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconOnly
          aria-label="Previous page"
          onClick={onPrevious}
          disabled={currentPage <= 1}
          icon={"<"}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconOnly
          aria-label="Next page"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          icon={">"}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconOnly
          aria-label="Last page"
          onClick={onLast}
          disabled={currentPage >= totalPages}
          icon={">>"}
        />
      </div>
    </nav>
  );
}
