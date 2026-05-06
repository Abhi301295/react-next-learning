import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of key metrics and recent user activity.",
  alternates: {
    canonical: "/dashboard",
  },
};

const kpiItems = [
  { label: "Total Users", value: "1,240" },
  { label: "Active Users", value: "1,042" },
  { label: "New This Week", value: "86" },
];

const recentActivities = [
  "Jane Miller updated profile details",
  "Simon Reed status changed to inactive",
  "John Carter was added to the users list",
];

export default function DashboardPage() {
  return (
    <section className="space-y-4" aria-labelledby="dashboard-title">
      <header>
        <h1 id="dashboard-title" className="text-display-sm font-semibold text-brand-600">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Starter dashboard for upcoming final project tasks.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="KPI cards">
        {kpiItems.map((item) => (
          <Card key={item.label} className="rounded-card border-border bg-surface shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm text-muted">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-display-sm font-semibold text-brand-600">
              {item.value}
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="rounded-card border-border bg-surface shadow-soft">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentActivities.map((activity) => (
              <li key={activity} className="text-sm text-muted">
                {activity}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
