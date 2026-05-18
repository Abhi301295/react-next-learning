import { SkeletonPulse } from "@/components/shared/feedback/SkeletonPulse";
import TableSkeleton from "@/components/shared/table/core/TableSkeleton";
import { USER_COLUMNS } from "./tableConfigs";
import { UsersMobileCardsSkeleton } from "./UsersMobileCardsSkeleton";

/**
 * Route-segment loading fallback that mirrors `UsersPageClient` exactly:
 * same `section` spacing, same header sizes, same search/filter row,
 * and a `TableSkeleton` with action column + paginated footer reserved.
 *
 * Keeping this structurally identical to the resolved page is what holds
 * CLS low when navigating into `/users` (and when the route streams on a
 * slow network on production).
 */
export function UsersPageSkeleton() {
  return (
    <section
      className="space-y-4"
      aria-busy="true"
      aria-label="Loading users"
    >
      <header className="flex items-center justify-between gap-3">
        <SkeletonPulse className="h-8 w-32 sm:h-9 sm:w-40" />
        <SkeletonPulse className="h-10 w-32 shrink-0 rounded-lg" />
      </header>

      <div className="block md:hidden">
        <div className="space-y-3">
          <section className="flex flex-row items-end gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <SkeletonPulse className="h-4 w-24" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <SkeletonPulse className="h-10 w-10 shrink-0 rounded-lg" />
          </section>
          <UsersMobileCardsSkeleton />
        </div>
      </div>

      <div className="hidden md:block">
        <div className="space-y-4">
          <section className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <SkeletonPulse className="h-4 w-24" />
              <SkeletonPulse className="h-10 w-full rounded-md" />
            </div>
            <div className="flex items-end">
              <SkeletonPulse className="h-10 w-10 rounded-lg" />
            </div>
          </section>

          <TableSkeleton
            rows={5}
            columnCount={USER_COLUMNS.length}
            includeActionColumn
            includePaginationFooter
          />
        </div>
      </div>
    </section>
  );
}
