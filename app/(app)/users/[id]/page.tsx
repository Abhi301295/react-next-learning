import type { Metadata } from "next";
import UserDetailClient from "./UserDetailClient";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: UserDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `User ${id}`,
    description: `View details for user ${id}.`,
    alternates: {
      canonical: `/users/${id}`,
    },
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  return <UserDetailClient userId={id} />;
}

