import { SkeletonPulse } from "@/components/shared/feedback/SkeletonPulse";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type AppMainRouteSkeletonProps = {
  variant?: "default" | "compact";
};

export function AppMainRouteSkeleton({
  variant = "default",
}: AppMainRouteSkeletonProps) {
  return (
    <section
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading page"
    >
      <header className="space-y-2">
        <SkeletonPulse className="h-8 w-48 max-w-full sm:h-9" />
        <SkeletonPulse className="h-4 w-full max-w-xl" />
      </header>

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          variant === "compact" && "sm:gap-2"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          <SkeletonPulse className="h-10 w-full min-w-[8rem] max-w-xs sm:max-w-sm" />
          <SkeletonPulse className="h-10 w-28" />
        </div>
        <SkeletonPulse className="h-10 w-full max-w-[10rem] sm:w-32" />
      </div>

      <Card className="rounded-card border-stroke bg-panel shadow-soft">
        <CardHeader className="pb-3">
          <SkeletonPulse className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-stroke">
            <div className="grid grid-cols-4 gap-0 border-b border-stroke bg-panel p-3">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonPulse key={i} className="h-4 w-16" />
              ))}
            </div>
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-4 items-center gap-2 p-3 sm:gap-3"
                >
                  {[1, 2, 3, 4].map((col) => (
                    <SkeletonPulse
                      key={col}
                      className={cn(
                        "h-4",
                        col === 1 ? "w-full max-w-[14rem]" : "w-full"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function RootRouteSkeleton() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="w-full max-w-md space-y-4 rounded-card border border-stroke bg-panel p-8 shadow-soft">
        <SkeletonPulse className="mx-auto h-10 w-48 max-w-full" />
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-[85%]" />
        <SkeletonPulse className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
