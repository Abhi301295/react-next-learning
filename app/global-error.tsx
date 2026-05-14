"use client";

import { messages } from "@/lib/constants/messages";
import { Button } from "@/components/ui/Button";
import { PageHeading } from "@/components/ui/PageHeading";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const digest = error.digest;

  return (
    <html lang="en">
      <body className="min-h-screen bg-background px-4 py-12 text-foreground antialiased">
        <main
          className="mx-auto flex max-w-md flex-col items-center gap-6 text-center"
          aria-labelledby="global-error-title"
        >
          <div role="alert" aria-live="assertive" aria-atomic="true">
            <PageHeading id="global-error-title">
              {messages.common.somethingWentWrong}
            </PageHeading>
            <p className="mt-3 text-sm text-subtle">
              {error.message || messages.errors.globalAppBody}
            </p>
            {digest ? (
              <p className="mt-3 text-xs text-subtle">
                Reference:{" "}
                <span className="font-mono text-foreground">{digest}</span>
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={() => reset()}>
              {messages.actions.tryAgain}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              {messages.actions.reloadPage}
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
