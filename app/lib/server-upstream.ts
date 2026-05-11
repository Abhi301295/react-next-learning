/**
 * Server-only upstream base (matches `next.config.ts` rewrites target).
 * Client code should keep using `/api/*` so requests stay same-origin.
 */
export function getUpstreamApiOrigin(): string {
  return process.env.API_BASE_URL ?? "http://localhost:3001";
}

export type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export async function fetchPostById(
  id: string
): Promise<JsonPlaceholderPost | null> {
  const res = await fetch(`${getUpstreamApiOrigin()}/posts/${id}`, {
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const data: unknown = await res.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof (data as { id: unknown }).id !== "number"
  ) {
    return null;
  }
  return data as JsonPlaceholderPost;
}
