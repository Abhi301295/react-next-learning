import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { UpstreamUserDetail } from "@/lib/users/types";

export default function UserDetail({
  user,
}: {
  user: UpstreamUserDetail;
}) {
  return (
    <section className="space-y-4" aria-labelledby="user-heading">
      <header className="space-y-1">
        <h1
          id="user-heading"
          className="text-display-sm font-semibold text-primary"
        >
          {user.name}
        </h1>
        <p className="text-sm text-subtle">
          Profile · User ID {user.id}
        </p>
      </header>

      <Card className="border-stroke bg-panel">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-subtle">Email: {user.email}</p>
          {user.phone && (
            <p className="text-sm text-subtle">Phone: {user.phone}</p>
          )}
          {user.website && (
            <p className="text-sm text-subtle">Website: {user.website}</p>
          )}
          {user.company?.name && (
            <p className="text-sm text-subtle">Company: {user.company.name}</p>
          )}
        </CardContent>
      </Card>

      <Link
        href="/users"
        className="inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to users
      </Link>
    </section>
  );
}
