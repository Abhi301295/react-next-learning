"use client";

import { WebVitalsReporter } from "@/components/performance/WebVitalsReporter";
import { NavigationProgressProvider } from "@/context/navigation-progress-context";
import { ThemeProvider } from "@/context/theme-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <NavigationProgressProvider>
        {process.env.NODE_ENV === "development" ? (
          <WebVitalsReporter />
        ) : null}
        {children}
      </NavigationProgressProvider>
    </ThemeProvider>
  );
}
