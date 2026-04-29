import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Header</h1>
      <Button size="sm">Logout</Button>
    </header>
  );
}