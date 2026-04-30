'use client';

import { Button } from "@/components/ui/button";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between border-b p-4 bg-white">
      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        onClick={onMenuClick}
      >
        ☰
      </Button>

      <h1 className="text-lg font-semibold">Header</h1>
    </header>
  );
}