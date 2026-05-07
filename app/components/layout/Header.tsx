'use client';

import Dropdown from "@/components/shared/dropdown/Dropdown";
import DropdownOption from "@/components/shared/dropdown/DropdownOption";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/theme-context";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { themeMode, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-stroke bg-panel p-4">
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

      <div className="w-36">
        <Dropdown
          size="sm"
          ariaLabel="Theme mode"
          value={themeMode}
          onChange={(value) => setTheme(value as "system" | "light" | "dark")}
          placeholder="Theme"
        >
          <DropdownOption value="system">System</DropdownOption>
          <DropdownOption value="light">Light</DropdownOption>
          <DropdownOption value="dark">Dark</DropdownOption>
        </Dropdown>
      </div>
    </header>
  );
}