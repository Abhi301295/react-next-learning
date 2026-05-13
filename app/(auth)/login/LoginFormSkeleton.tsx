"use client";

import { SkeletonPulse } from "@/components/shared/feedback/SkeletonPulse";

/** Inline placeholder while the sign-in form chunk loads (LCP-friendly shell is on the page). */
export default function LoginFormSkeleton() {
  return (
    <div
      className="space-y-4"
      aria-busy="true"
      aria-label="Loading sign-in form"
    >
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-20" />
        <SkeletonPulse className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-16" />
        <SkeletonPulse className="h-10 w-full rounded-lg" />
      </div>
      <SkeletonPulse className="h-11 w-full rounded-lg" />
    </div>
  );
}
