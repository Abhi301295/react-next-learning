import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 border-r p-4 min-h-screen">
      <nav className="space-y-2">
        <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>

        <Link href="/day1" className="block px-3 py-2 rounded hover:bg-gray-100">
          Day 1 Tasks
        </Link>
        <Link href="/day2" className="block px-3 py-2 rounded hover:bg-gray-100">
          Day 2 Tasks
        </Link>
        <Link href="/testing" className="block px-3 py-2 rounded hover:bg-gray-100">
          Testing
        </Link>
      </nav>
    </aside>
  );
}