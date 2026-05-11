import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "./PostDetail";
import { httpErrPublicMessage } from "@/lib/server-upstream";
import {
  fetchPostById,
  postDetailMetadataFallback,
} from "@/lib/posts/server";

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

function metaDescription(body: string): string {
  const oneLine = body.replace(/\s+/g, " ").trim();
  if (oneLine.length <= 160) return oneLine;
  return `${oneLine.slice(0, 157)}…`;
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const r = await fetchPostById(id);

  if (!r.ok) {
    if (r.kind === "not_found" || r.kind === "invalid") {
      return postDetailMetadataFallback(id);
    }
    throw new Error(httpErrPublicMessage(r.cause));
  }

  const post = r.post;
  const description = metaDescription(post.body);

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/posts/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/posts/${post.id}`,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const r = await fetchPostById(id);
  if (r.ok) {
    return <PostDetail post={r.post} />;
  }
  if (r.kind === "not_found" || r.kind === "invalid") {
    notFound();
  }
  throw new Error(httpErrPublicMessage(r.cause));
}
