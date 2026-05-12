export function safeInternalPath(href: string): string | null {
  const s = href.trim();
  if (!s.startsWith("/")) return null;
  if (s.startsWith("//")) return null;
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/u.test(s)) return null;

  try {
    const base = "https://routing.invalid";
    const u = new URL(s, base);
    if (u.origin !== base) return null;
    const out = u.pathname + u.search + u.hash;
    return out.startsWith("/") ? out : null;
  } catch {
    return null;
  }
}
