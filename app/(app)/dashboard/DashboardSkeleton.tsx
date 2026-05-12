import { Card, CardContent, CardHeader } from "@/components/ui/Card";

function KpiSkeleton() {
  return (
    <Card className="rounded-card border-stroke bg-panel shadow-soft">
      <CardHeader className="pb-2">
        <div className="h-4 w-24 animate-pulse rounded bg-stroke" />
      </CardHeader>
      <CardContent>
        <div className="min-h-[2.75rem] w-28 max-w-full animate-pulse rounded-md bg-stroke" />
      </CardContent>
    </Card>
  );
}

export function DashboardContentSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard content">
      <section aria-hidden>
        <div className="mb-3 h-7 w-36 animate-pulse rounded bg-stroke" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
      </section>

      <Card className="rounded-card border-stroke bg-panel shadow-soft">
        <CardHeader>
          <div className="h-6 w-40 animate-pulse rounded bg-stroke" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-full animate-pulse rounded bg-stroke"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardFullPageSkeleton() {
  return (
    <section
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="space-y-2">
        <div className="h-8 w-48 max-w-full animate-pulse rounded bg-stroke" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-stroke" />
      </div>
      <DashboardContentSkeleton />
    </section>
  );
}
