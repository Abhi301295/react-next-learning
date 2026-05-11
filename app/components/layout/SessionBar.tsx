'use client';

import { IconLogOut } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useCallback, useEffect, useState } from "react";

type SessionUser = {
  username?: string;
  firstName?: string;
  lastName?: string;
};

export function SessionBar() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const data = (await res.json()) as { user: SessionUser | null };
        if (!cancelled) {
          setUser(res.ok ? data.user ?? null : null);
        }
      } catch {
        if (!cancelled) setUser(null);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }, []);

  if (user === undefined) {
    return (
      <div
        className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-stroke sm:h-9 sm:w-[7rem] md:w-40"
        aria-hidden
      />
    );
  }

  if (user === null) {
    return null;
  }

  const label =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    "Signed in";

  const signOutLabel = `Sign out ${label}`;

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
      <span
        className="hidden max-w-[10rem] truncate text-sm text-subtle md:inline"
        title={label}
      >
        {label}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        iconOnly
        className="sm:hidden"
        icon={<IconLogOut className="h-4 w-4" />}
        onClick={() => void logout()}
        aria-label={signOutLabel}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="hidden sm:inline-flex"
        onClick={() => void logout()}
        aria-label={signOutLabel}
      >
        Log out
      </Button>
    </div>
  );
}
