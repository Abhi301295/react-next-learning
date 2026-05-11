"use client";

import { useCallback, useEffect, useState } from "react";

type ApiPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Post = {
  id: number;
  title: string;
  userId: number;
  excerpt: string;
};

function toExcerpt(body: string, max = 120): string {
  const t = body.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (signal?: AbortSignal) => {
    let requestAborted = false;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/posts", { signal });

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data: ApiPost[] = await res.json();

      const mapped: Post[] = data.map((p) => ({
        id: p.id,
        title: p.title,
        userId: p.userId,
        excerpt: toExcerpt(p.body),
      }));

      setPosts(mapped);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        requestAborted = true;
        return;
      }
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      if (requestAborted || signal?.aborted) return;
      setLoading(false);
      setHasFetched(true);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => fetchPosts(controller.signal));
    return () => controller.abort();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    hasFetched,
    error,
    refetch: fetchPosts,
  };
}
