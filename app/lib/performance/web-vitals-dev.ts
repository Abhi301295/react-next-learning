/**
 * Dev-only helpers for `WebVitalsReporter` (browser metrics from `next/web-vitals`).
 * Interpreting scores: https://web.dev/articles/vitals
 */

export const WEB_VITAL_LABELS: Record<string, string> = {
  TTFB: "Time to First Byte",
  FCP: "First Contentful Paint",
  LCP: "Largest Contentful Paint",
  INP: "Interaction to Next Paint",
  CLS: "Cumulative Layout Shift",
  FID: "First Input Delay",
};

export type WebVitalCategory =
  | "server"
  | "paint"
  | "layout"
  | "interaction"
  | "other";

export function webVitalCategory(name: string): WebVitalCategory {
  switch (name) {
    case "TTFB":
      return "server";
    case "FCP":
    case "LCP":
      return "paint";
    case "CLS":
      return "layout";
    case "INP":
    case "FID":
      return "interaction";
    default:
      return "other";
  }
}

export function formatWebVitalDisplay(name: string, value: number): string {
  if (name === "CLS") return value.toFixed(4);
  return `${Math.round(value)} ms`;
}
