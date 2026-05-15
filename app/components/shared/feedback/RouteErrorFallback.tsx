"use client";

import { messages } from "@/lib/constants/messages";
import { Button } from "@/components/ui/Button";
import { PageHeading } from "@/components/ui/PageHeading";
import { safeInternalPath } from "@/lib/navigation/safe-internal-path";
import { useAppRouter } from "@/lib/navigation/use-app-router";
import { useCallback } from "react";

type RouteErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref: string;
  homeLabel: string;
};

export function RouteErrorFallback({
  error,
  reset,
  homeHref,
  homeLabel,
}: RouteErrorFallbackProps) {
  const router = useAppRouter();
  const digest = error.digest;

  const goHome = useCallback(() => {
    const path = safeInternalPath(homeHref) ?? "/";
    router.replace(path);
  }, [router, homeHref]);

  return (
    <section
      className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 py-12 text-center"
      aria-labelledby="route-error-title"
    >
      <div
        className="flex max-w-lg flex-col gap-2"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <PageHeading id="route-error-title">
          {messages.common.somethingWentWrong}
        </PageHeading>
        <p className="text-subtle">
          {error.message || messages.errors.routePageBody}
        </p>
        {digest ? (
          <p className="text-xs text-subtle">
            Reference:{" "}
            <span className="font-mono text-foreground">{digest}</span>
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          {messages.actions.tryAgain}
        </Button>
        <Button type="button" variant="outline" onClick={goHome}>
          {homeLabel}
        </Button>
      </div>
    </section>
  );
}
