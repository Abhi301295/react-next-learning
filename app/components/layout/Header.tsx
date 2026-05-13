"use client";

import Dropdown from "@/components/shared/dropdown/Dropdown";
import DropdownOption from "@/components/shared/dropdown/DropdownOption";
import { SessionBar } from "@/components/layout/SessionBar";
import { Button } from "@/components/ui/Button";
import { IconMenu } from "@/components/icons";
import { useTheme } from "@/context/theme-context";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { themeMode, setTheme } = useTheme();
  const dropdownValue = themeMode;

  const handleThemeChange = (value: string | string[]) => {
    const next = Array.isArray(value) ? value[0] : value;
    if (next === "light" || next === "dark" || next === "system") {
      setTheme(next);
    }
  };

  return (
    <header
      className="flex min-w-0 items-center gap-2 border-b border-stroke bg-panel px-3 py-3 sm:gap-4 sm:px-4 sm:py-4"
      aria-label="Application"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <IconMenu className="h-5 w-5" />
        </Button>

        <p className="min-w-0 truncate text-base font-semibold text-primary sm:text-lg">
          User Management Dashboard
        </p>
      </div>

      <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
        <SessionBar />
        <div className="w-[6.25rem] shrink-0 sm:w-40 md:w-44">
          <Dropdown
            value={dropdownValue}
            onChange={handleThemeChange}
            size="sm"
            placeholder="Theme"
            ariaLabel="Theme appearance"
            className="w-full min-w-0"
          >
            <DropdownOption value="system">System</DropdownOption>
            <DropdownOption value="light">Light</DropdownOption>
            <DropdownOption value="dark">Dark</DropdownOption>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
