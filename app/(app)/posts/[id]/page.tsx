import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "./PostDetail";
import { fetchPostById } from "@/lib/server-upstream";

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
  const post = await fetchPostById(id);

  if (!post) {
    return {
      title: `Post ${id}`,
      description: "Post could not be loaded.",
      alternates: { canonical: `/posts/${id}` },
    };
  }

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

  const post = await fetchPostById(id);
  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}
