'use client';

import { Button } from "@/components/ui/Button";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between border-b p-4 bg-white">
      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        ☰
      </Button>

      <p className="text-lg font-semibold">Dashboard</p>
    </header>
  );
}