"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import { LoadingState } from "@/components/shared/feedback/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type ApiUserDetail = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  company?: { name?: string };
};

export default function UserDetailClient({ userId }: { userId: string }) {
  const [user, setUser] = useState<ApiUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load user details");
        const data: ApiUserDetail = await res.json();
        setUser(data);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadUser();
    return () => controller.abort();
  }, [userId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!user) return <ErrorState message="User not found" />;

  return (
    <section className="space-y-4" aria-labelledby="user-detail-title">
      <header className="space-y-1">
        <h1 id="user-detail-title" className="text-display-sm font-semibold text-brand-600">
          User Detail
        </h1>
        <p className="text-sm text-subtle">SEO-friendly dynamic route: /users/[id]</p>
      </header>

      <Card className="border-stroke bg-panel">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-subtle">Email: {user.email}</p>
          {user.phone && <p className="text-sm text-subtle">Phone: {user.phone}</p>}
          {user.website && <p className="text-sm text-subtle">Website: {user.website}</p>}
          {user.company?.name && (
            <p className="text-sm text-subtle">Company: {user.company.name}</p>
          )}
        </CardContent>
      </Card>

      <Link href="/users" className="inline-block text-sm font-medium text-brand-600 hover:underline">
        ← Back to users
      </Link>
    </section>
  );
}

