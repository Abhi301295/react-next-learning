"use client";

import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const digest = error.digest;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <div
        className="flex max-w-lg flex-col gap-2"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <h1 className="text-display-sm font-semibold text-brand-600">
          Something went wrong
        </h1>
        <p className="text-subtle">
          {error.message ||
            "We could not load this page. Check your connection and try again."}
        </p>
        {digest ? (
          <p className="text-xs text-subtle">
            Reference: <span className="font-mono text-foreground">{digest}</span>
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="outline" onClick={() => window.location.assign("/")}>
          Go home
        </Button>
      </div>
    </main>
  );
}
