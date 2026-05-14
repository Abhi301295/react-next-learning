"use client";

import { createPortal } from "react-dom";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type SnackbarTone = "success" | "error" | "info";

export type ShowSnackbarOptions = {
  message: string;
  tone?: SnackbarTone;
};

type SnackbarState = {
  id: number;
  message: string;
  tone: SnackbarTone;
};

const AUTO_DISMISS_MS = 5200;

type SnackbarContextValue = {
  showSnackbar: (opts: ShowSnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }
  return ctx;
}

function SnackbarSurface({
  state,
  onDismiss,
}: {
  state: SnackbarState;
  onDismiss: () => void;
}) {
  const role = state.tone === "error" ? "alert" : "status";
  const ariaLive = state.tone === "error" ? "assertive" : "polite";

  return (
    <div
      className={cn(
        "pointer-events-auto flex max-w-[min(100vw-2rem,24rem)] items-start gap-3 rounded-lg border px-4 py-3 shadow-soft animate-fade-slide",
        "bg-panel text-foreground",
        state.tone === "success" &&
          "border-emerald-600/40 dark:border-emerald-400/35",
        state.tone === "error" && "border-red-600/50 dark:border-red-400/40",
        state.tone === "info" && "border-stroke"
      )}
      role={role}
      aria-live={ariaLive}
    >
      <p className="min-w-0 flex-1 text-sm leading-snug">{state.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded px-2 py-0.5 text-sm text-subtle underline-offset-2 hover:bg-background hover:text-foreground hover:underline"
      >
        Dismiss
      </button>
    </div>
  );
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearTimer();
    setState(null);
  }, [clearTimer]);

  const showSnackbar = useCallback(
    ({ message, tone = "info" }: ShowSnackbarOptions) => {
      clearTimer();
      const id = Date.now();
      setState({ id, message, tone });
      dismissTimer.current = setTimeout(() => {
        dismissTimer.current = null;
        setState(null);
      }, AUTO_DISMISS_MS);
    },
    [clearTimer]
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" && state
        ? createPortal(
            <div
              className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-full max-w-[min(100vw-2rem,24rem)] -translate-x-1/2 justify-center px-4 sm:bottom-6"
              aria-label="Notifications"
            >
              <SnackbarSurface key={state.id} state={state} onDismiss={dismiss} />
            </div>,
            document.body
          )
        : null}
    </SnackbarContext.Provider>
  );
}
