"use client";

import { WebVitalsReporter } from "@/components/performance/WebVitalsReporter";
import { ThemeProvider } from "@/context/theme-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WebVitalsReporter />
      {children}
    </ThemeProvider>
  );
}
