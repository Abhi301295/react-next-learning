"use client";

import { RouteErrorFallback } from "@/components/shared/feedback/RouteErrorFallback";

export default function AppSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      homeHref="/dashboard"
      homeLabel="Dashboard"
    />
  );
}
