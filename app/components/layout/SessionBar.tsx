'use client';

import { IconLogOut } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useNavigationProgress } from "@/context/navigation-progress-context";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type SessionUser = {
  username?: string;
  firstName?: string;
  lastName?: string;
};

export function SessionBar() {
  const router = useRouter();
  const { beginNavigation } = useNavigationProgress();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  /** Avoid clearing session UI before `/login` RSC arrives on slow networks. */
  const [logoutPending, setLogoutPending] = useState(false);
  const logoutInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await res.json()) as { user: SessionUser | null };
        if (!cancelled) {
          setUser(res.ok ? data.user ?? null : null);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("[SessionBar] session fetch failed", err);
        }
        if (!cancelled) setUser(null);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    if (logoutInFlight.current) return;
    logoutInFlight.current = true;
    setLogoutPending(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        logoutInFlight.current = false;
        setLogoutPending(false);
        return;
      }
      beginNavigation();
      router.replace("/login");
      router.refresh();
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[SessionBar] logout failed", err);
      }
      logoutInFlight.current = false;
      setLogoutPending(false);
    }
  }, [router, beginNavigation]);

  /**
   * Fixed shell so the skeleton state, the empty-session state, and the
   * loaded "name + Log out" state all occupy the same width on every
   * breakpoint. Prevents the theme dropdown to the right from sliding
   * left when the session API resolves (the only CLS culprit Lighthouse
   * detected for `/users` locally).
   */
  const shellClass =
    "flex h-8 w-8 shrink-0 items-center justify-end overflow-hidden sm:h-9 sm:w-[8.5rem] md:w-[13rem]";

  if (user === undefined) {
    return (
      <div className={shellClass} aria-hidden>
        <div className="h-8 w-8 animate-pulse rounded-md bg-stroke sm:h-9 sm:w-full" />
      </div>
    );
  }

  if (user === null) {
    return <div className={shellClass} aria-hidden />;
  }

  const label =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    "Signed in";

  const signOutLabel = `Sign out ${label}`;
  const signOutAria = logoutPending ? "Signing out" : signOutLabel;

  return (
    <div
      className={`${shellClass} gap-1.5 sm:gap-2 md:gap-3`}
      aria-busy={logoutPending}
    >
      <span
        className="hidden min-w-0 flex-1 truncate text-right text-sm text-subtle md:inline-block"
        title={label}
      >
        {logoutPending ? "Signing out…" : label}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        iconOnly
        className="sm:hidden"
        icon={<IconLogOut className="h-4 w-4" />}
        onClick={() => void logout()}
        aria-label={signOutAria}
        disabled={logoutPending}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden shrink-0 sm:inline-flex"
        onClick={() => void logout()}
        aria-label={signOutAria}
        disabled={logoutPending}
      >
        {logoutPending ? "Signing out…" : "Log out"}
      </Button>
    </div>
  );
}
