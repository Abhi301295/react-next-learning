'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== 'development') return;
    console.info(`[web-vitals] ${metric.name}`, {
      id: metric.id,
      rating: metric.rating,
      value: metric.value,
      delta: 'delta' in metric ? metric.delta : undefined,
    });
  });

  return null;
}
