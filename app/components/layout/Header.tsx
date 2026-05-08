'use client';

import Dropdown from '@/components/shared/dropdown/Dropdown';
import DropdownOption from '@/components/shared/dropdown/DropdownOption';
import { Button } from '@/components/ui/Button';
import { useTheme } from '../../context/theme-context';
import { useEffect, useState } from 'react';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { themeMode, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** Until mounted, pin to "system" so SSR + first client paint match saved-theme from localStorage. */
  const dropdownValue = mounted ? themeMode : 'system';

  const handleThemeChange = (value: string | string[]) => {
    const next = Array.isArray(value) ? value[0] : value;
    if (next === 'light' || next === 'dark' || next === 'system') {
      setTheme(next);
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          ☰
        </Button>

        <p className="truncate text-lg font-semibold text-foreground">Dashboard</p>
      </div>

      <div className="w-44 shrink-0">
        <Dropdown
          value={dropdownValue}
          onChange={handleThemeChange}
          size="sm"
          placeholder="Theme"
          ariaLabel="Theme appearance"
          className="w-full"
        >
          <DropdownOption value="system">System</DropdownOption>
          <DropdownOption value="light">Light</DropdownOption>
          <DropdownOption value="dark">Dark</DropdownOption>
        </Dropdown>
      </div>
    </header>
  );
}
