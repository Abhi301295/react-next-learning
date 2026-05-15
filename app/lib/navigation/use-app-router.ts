"use client";

import { useNavigationProgress } from "@/context/navigation-progress-context";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

/**
 * Same as `useRouter()` from `next/navigation`, but `push`, `replace`, and `refresh`
 * also start the top navigation progress bar. Same-origin `<Link>` navigations are
 * already covered by {@link NavigationProgressProvider}'s document listener.
 *
 * Use under {@link NavigationProgressProvider} (see `app/providers.tsx`).
 */
export function useAppRouter() {
  const router = useRouter();
  const { beginNavigation } = useNavigationProgress();

  return useMemo(
    () => ({
      ...router,
      push: (...args: Parameters<typeof router.push>) => {
        beginNavigation();
        return router.push(...args);
      },
      replace: (...args: Parameters<typeof router.replace>) => {
        beginNavigation();
        return router.replace(...args);
      },
      refresh: () => {
        beginNavigation();
        return router.refresh();
      },
    }),
    [router, beginNavigation]
  );
}
