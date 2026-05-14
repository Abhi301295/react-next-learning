import { SkeletonPulse } from "@/components/shared/feedback/SkeletonPulse";

/**
 * Card skeleton sized to match the rendered `renderUserCard` output:
 * `<Card p-4>` + `<CardHeader mb-3>` (title + badge) + `<CardContent space-y-2>`
 * (email line, role line, action icon row). Matching the height per
 * card is what keeps mobile CLS low when the list resolves.
 */
function UserCardSkeleton() {
  return (
    <div className="rounded-xl border border-stroke bg-panel p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <SkeletonPulse className="h-6 w-40 max-w-full" />
        <SkeletonPulse className="h-6 w-16 rounded-md" />
      </div>
      <div className="space-y-2">
        <SkeletonPulse className="h-5 w-full max-w-[18rem]" />
        <SkeletonPulse className="h-5 w-3/4 max-w-[14rem]" />
        <SkeletonPulse className="mt-1 h-10 w-24" />
      </div>
    </div>
  );
}

type UsersMobileCardsSkeletonProps = {
  rows?: number;
  /** Reserve the "Load more users" footer height to avoid a shift when
   *  the real button appears after the first page resolves. */
  includeLoadMoreFooter?: boolean;
};

export function UsersMobileCardsSkeleton({
  rows = 5,
  includeLoadMoreFooter = true,
}: UsersMobileCardsSkeletonProps) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading users">
      <ul className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i}>
            <UserCardSkeleton />
          </li>
        ))}
      </ul>
      {includeLoadMoreFooter && (
        <div aria-hidden className="flex justify-center pt-2">
          <SkeletonPulse className="h-10 w-40 rounded-lg" />
        </div>
      )}
    </div>
  );
}
