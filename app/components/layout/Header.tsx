'use client';

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/theme-context";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface p-4">
      <div className="flex items-center gap-2">
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
      </div>

      <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "light" ? "Dark" : "Light"}
      </Button>
    </header>
  );
}