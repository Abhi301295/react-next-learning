import { cn } from "@/lib/utils";

export function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-stroke", className)}
      aria-hidden
    />
  );
}
