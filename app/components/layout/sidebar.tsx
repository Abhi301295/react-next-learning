import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r p-4">
      <nav className="space-y-2">
        <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>
        <Link
          href="/users"
          className="block px-3 py-2 rounded hover:bg-gray-100"
        >
          Users
        </Link>
      </nav>
    </aside>
  );
}