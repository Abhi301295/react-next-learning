"use client";

import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Suspense,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type NavigationProgressContextValue = {
  beginNavigation: () => void;
};

const NavigationProgressContext =
  createContext<NavigationProgressContextValue | null>(null);

const noopNavigationProgress: NavigationProgressContextValue = {
  beginNavigation: () => {},
};

export function useNavigationProgress(): NavigationProgressContextValue {
  return useContext(NavigationProgressContext) ?? noopNavigationProgress;
}

/**
 * If this anchor would perform an in-app route change, returns the pathname+search key.
 * Same rules as router navigation (skip new tab, download, mailto, pure hash-only, external).
 */
function getSameOriginNavigationKey(
  a: HTMLAnchorElement
): string | null {
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download")) return null;

  const hrefAttr = a.getAttribute("href");
  if (
    !hrefAttr ||
    hrefAttr.startsWith("mailto:") ||
    hrefAttr.startsWith("tel:") ||
    hrefAttr.startsWith("javascript:")
  ) {
    return null;
  }

  if (hrefAttr.startsWith("#")) return null;

  let nextUrl: URL;
  try {
    nextUrl = new URL(hrefAttr, window.location.origin);
  } catch {
    return null;
  }

  if (nextUrl.origin !== window.location.origin) return null;

  return `${nextUrl.pathname}${nextUrl.search}`;
}

function isModifiedClick(e: MouseEvent) {
  return (
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    e.button !== 0
  );
}

const TopNavigationProgressBar = memo(function TopNavigationProgressBar({
  active,
}: {
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-1.5 transition-opacity duration-300 ease-out",
        active ? "opacity-100" : "opacity-0"
      )}
      role="progressbar"
      aria-valuetext={active ? "Loading" : undefined}
      aria-hidden={!active}
      aria-busy={active}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full overflow-hidden bg-primary/20 dark:bg-primary/30">
        <div
          className={cn(
            "h-full w-[42%] max-w-md rounded-r-full bg-primary shadow-[0_0_12px_rgba(79,70,229,0.35)] dark:shadow-[0_0_14px_rgba(129,140,248,0.35)]",
            active && "animate-nav-progress-bar"
          )}
        />
      </div>
    </div>
  );
});

/**
 * `useSearchParams` must live under Suspense. Keep it in this leaf-only component so it
 * never blocks painting the rest of the app (improves FCP vs wrapping all children).
 */
function NavigationSearchParamSync({
  onRouteQueryChange,
}: {
  onRouteQueryChange: () => void;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    onRouteQueryChange();
  }, [search, onRouteQueryChange]);

  return null;
}

function NavigationProgressInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  const clearBar = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setActive(false);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    function onPopState() {
      setActive(true);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (isModifiedClick(e)) return;

      const el = (e.target as Element | null)?.closest("a[href]");
      if (!el) return;

      const a = el as HTMLAnchorElement;
      const nextKey = getSameOriginNavigationKey(a);
      if (nextKey === null) return;

      const curKey = `${window.location.pathname}${window.location.search}`;
      if (nextKey === curKey) return;

      setActive(true);
    }

    document.addEventListener("click", onDocumentClick, { capture: true });
    return () =>
      document.removeEventListener("click", onDocumentClick, { capture: true });
  }, []);

  const beginNavigation = useCallback(() => {
    setActive(true);
  }, []);

  const value = useMemo(
    () => ({ beginNavigation }),
    [beginNavigation]
  );

  return (
    <NavigationProgressContext.Provider value={value}>
      <TopNavigationProgressBar active={active} />
      {children}
      <Suspense fallback={null}>
        <NavigationSearchParamSync onRouteQueryChange={clearBar} />
      </Suspense>
    </NavigationProgressContext.Provider>
  );
}

export function NavigationProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <NavigationProgressInner>{children}</NavigationProgressInner>;
}
