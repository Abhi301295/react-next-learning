import { notFound } from "next/navigation";
import UserDetail from "./UserDetail";
import { httpErrPublicMessage } from "@/lib/server-upstream";
import { fetchUserById } from "@/lib/users/server";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

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
