"use client";

import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef } from "react";

function SpinnerRing() {
  return (
    <div
      className="grid h-[4.5rem] w-[4.5rem] place-items-center"
      aria-hidden
    >
      <svg
        className="col-start-1 row-start-1 h-[4.5rem] w-[4.5rem] text-primary motion-safe:animate-spin motion-reduce:opacity-90"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="3"
        />
        <path
          d="M20 3 A17 17 0 0 1 37 20"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="col-start-1 row-start-1 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(79,70,229,0.45)] motion-safe:animate-pulse motion-reduce:animate-none dark:shadow-[0_0_14px_rgba(129,140,248,0.4)]" />
    </div>
  );
}

function PreviewStrip() {
  return (
    <div
      className="w-full max-w-xl overflow-hidden rounded-card border border-stroke bg-panel p-4 shadow-soft ring-1 ring-primary/10 dark:ring-primary/20"
      aria-hidden
    >
      <div className="space-y-3">
        {[72, 88, 64, 80].map((w, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded-md bg-stroke motion-reduce:animate-none"
            style={{ width: `${w}%`, maxWidth: "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

type WorkspaceHandoffLoaderProps = {
  className?: string;
};

export function WorkspaceHandoffLoader({ className }: WorkspaceHandoffLoaderProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[110] flex items-center justify-center bg-background/90 px-4 py-10 backdrop-blur-md motion-reduce:backdrop-blur-none",
        className
      )}
      aria-busy="true"
      aria-live="polite"
      aria-labelledby="workspace-handoff-heading"
    >
      <div className="animate-fade-scale flex w-full max-w-xl flex-col items-center gap-8 sm:gap-10 outline-none">
        <SpinnerRing />

        <div className="max-w-lg text-center">
          <h2
            ref={headingRef}
            id="workspace-handoff-heading"
            tabIndex={-1}
            className="text-balance text-xl font-semibold tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-2xl"
          >
            Preparing your workspace
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-subtle sm:text-base">
            Loading your dashboard. On a slower connection this step can take a
            little while — your session is already secure.
          </p>
        </div>

        <PreviewStrip />
      </div>
    </div>
  );
}
