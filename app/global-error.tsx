"use client";

import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background px-4 py-12 text-center text-foreground antialiased">
        <main className="mx-auto flex max-w-md flex-col items-center gap-4">
          <h1 className="text-display-sm font-semibold text-brand-600">
            Something went wrong
          </h1>
          <p className="text-sm text-subtle">
            {error.message ||
              "The application failed to load. Try again or refresh the page."}
          </p>
          <Button type="button" onClick={() => reset()}>
            Try again
          </Button>
        </main>
      </body>
    </html>
  );
}
