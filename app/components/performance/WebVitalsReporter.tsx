"use client";

import {
  WEB_VITAL_LABELS,
  formatWebVitalDisplay,
  webVitalCategory,
} from "@/lib/performance/web-vitals-dev";
import { useReportWebVitals } from "next/web-vitals";

/**
 * Logs Core Web Vitals in development (TTFB, FCP, LCP, INP, CLS, and FID when emitted).
 * Mounted from `Providers` only when `NODE_ENV === "development"`.
 * For lab scores on deployed builds, run `npm run perf:lighthouse` with the dev
 * server on port 3000, or use Chrome DevTools → Lighthouse.
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "development") return;

    const label = WEB_VITAL_LABELS[metric.name] ?? metric.name;
    const category = webVitalCategory(metric.name);
    console.info(`[web-vitals] ${metric.name} (${category}) — ${label}`, {
      display: formatWebVitalDisplay(metric.name, metric.value),
      rating: metric.rating,
      id: metric.id,
      numericValue: metric.value,
      delta: "delta" in metric ? metric.delta : undefined,
    });
  });

  return null;
}
