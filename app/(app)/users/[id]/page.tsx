import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UserDetail from "./UserDetail";
import { httpErrPublicMessage } from "@/lib/server-upstream";
import {
  fetchUserById,
  userDetailMetadataFallback,
} from "@/lib/users/server";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

function userDescription(user: {
  name: string;
  email: string;
  company?: { name?: string };
}): string {
  const company = user.company?.name ? ` · ${user.company.name}` : "";
  return `Profile for ${user.name} (${user.email})${company}.`;
}

export async function generateMetadata({
  params,
}: UserDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const r = await fetchUserById(id);

  if (!r.ok) {
    if (r.kind === "not_found" || r.kind === "invalid") {
      return userDetailMetadataFallback(id);
    }
    throw new Error(httpErrPublicMessage(r.cause));
  }

  const user = r.user;
  const description = userDescription(user);

  return {
    title: user.name,
    description,
    alternates: {
      canonical: `/users/${user.id}`,
    },
    openGraph: {
      title: user.name,
      description,
      type: "profile",
      url: `/users/${user.id}`,
    },
    twitter: {
      card: "summary",
      title: user.name,
      description,
    },
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const r = await fetchUserById(id);
  if (r.ok) {
    return <UserDetail user={r.user} />;
  }
  if (r.kind === "not_found" || r.kind === "invalid") {
    notFound();
  }
  throw new Error(httpErrPublicMessage(r.cause));
}
