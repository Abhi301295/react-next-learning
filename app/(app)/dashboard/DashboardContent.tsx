import Link from "next/link";
import { CardContent, CardHeader } from "@/components/ui/Card";
import { PanelCard } from "@/components/ui/PanelCard";
import { TextLink } from "@/components/ui/TextLink";
import { fetchDashboardSnapshot } from "@/lib/dashboard/server";

const nf = new Intl.NumberFormat("en-US");

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <PanelCard>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-subtle">{label}</p>
      </CardHeader>
      <CardContent>
        <p
          className="text-display-sm font-semibold tabular-nums text-primary"
          aria-live="polite"
        >
          {nf.format(value)}
        </p>
      </CardContent>
    </PanelCard>
  );
}

export async function DashboardContent() {
  const result = await fetchDashboardSnapshot();

  if (!result.ok) {
    return (
      <PanelCard className="border-dashed">
        <CardHeader>
          <h2 className="text-base font-semibold text-foreground">
            Could not load dashboard
          </h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-subtle">
          <p>{result.message}</p>
          <p>
            Confirm{" "}
            <code className="rounded bg-background px-1 py-0.5 text-xs">
              FIREBASE_SERVICE_ACCOUNT_JSON
            </code>{" "}
            and{" "}
            <code className="rounded bg-background px-1 py-0.5 text-xs">
              NEXT_PUBLIC_FIREBASE_*
            </code>{" "}
            are set, then{" "}
            <TextLink href="/dashboard">reload the dashboard</TextLink>
            .
          </p>
        </CardContent>
      </PanelCard>
    );
  }

  const { totalUsers, activeUsers, inactiveUsers, activities } = result.data;

  return (
    <>
      <section aria-labelledby="dashboard-kpis-heading">
        <h2
          id="dashboard-kpis-heading"
          className="mb-3 text-lg font-semibold text-foreground"
        >
          Key metrics
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard label="Total users" value={totalUsers} />
          <KpiCard label="Active users" value={activeUsers} />
          <KpiCard label="Inactive users" value={inactiveUsers} />
        </div>
      </section>

      <PanelCard aria-labelledby="dashboard-activity-heading">
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="dashboard-activity-heading"
            className="text-lg font-semibold text-foreground"
          >
            Recent activity
          </h2>
          <p className="text-xs text-subtle">
            Newest members (by user id), refreshed periodically.
          </p>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-subtle">
              No activity to show yet.{" "}
              <TextLink href="/users">Open the user list</TextLink>{" "}
              to start managing people.
            </p>
          ) : (
            <ul className="divide-y divide-stroke">
              {activities.map((item) => (
                <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={item.href}
                    className="group block text-sm text-foreground transition-colors hover:text-primary"
                  >
                    <span className="font-medium group-hover:underline">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-subtle">
                      View details
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </PanelCard>
    </>
  );
}
