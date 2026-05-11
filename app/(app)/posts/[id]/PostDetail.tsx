import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { UpstreamPost } from "@/lib/posts/types";

export default function PostDetail({ post }: { post: UpstreamPost }) {
  return (
    <section className="space-y-4" aria-labelledby="post-heading">
      <header className="space-y-1">
        <h1
          id="post-heading"
          className="text-display-sm font-semibold text-primary"
        >
          {post.title}
        </h1>
        <p className="text-sm text-subtle">
          Post ID {post.id} · Author user ID {post.userId}
        </p>
      </header>

      <Card className="border-stroke bg-panel">
        <CardHeader>
          <CardTitle>Body</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground">{post.body}</p>
        </CardContent>
      </Card>

      <Link
        href="/posts"
        className="inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to posts
      </Link>
    </section>
  );
}
