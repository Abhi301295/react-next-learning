import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

function Bar({ className }: { className: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-stroke", className)}
      aria-hidden
    />
  );
}

export default function ProductDetailLoading() {
  return (
    <section
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading product"
    >
      <Bar className="h-8 w-64 max-w-full" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <Card className="rounded-card border-stroke bg-panel shadow-soft">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Bar className="aspect-square w-full max-w-[16rem] rounded-card" />
            <Bar className="h-4 w-24" />
          </CardContent>
        </Card>
        <Card className="rounded-card border-stroke bg-panel shadow-soft">
          <CardHeader>
            <Bar className="h-7 w-3/4 max-w-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-[70%]" />
            <Bar className="h-12 w-40" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
