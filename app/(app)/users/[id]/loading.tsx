import { Card, CardContent, CardHeader } from "@/components/ui/Card";

function Bar({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-stroke ${className}`}
      aria-hidden
    />
  );
}

export default function UserDetailLoading() {
  return (
    <section
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading user profile"
    >
      <Bar className="h-8 w-56 max-w-full" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <Card className="rounded-card border-stroke bg-panel shadow-soft">
          <CardHeader>
            <Bar className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-[80%]" />
            <Bar className="h-4 w-2/3" />
            <Bar className="h-24 w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-card border-stroke bg-panel shadow-soft">
          <CardHeader>
            <Bar className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-[75%]" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
