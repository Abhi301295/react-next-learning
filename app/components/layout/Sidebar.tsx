'use client';

import { SidebarNav } from '@/components/layout/SidebarNav';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

export function Sidebar({ mobileOpen, setMobileOpen }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <>
      <aside
        className={cn(
          'hidden flex-col border-r border-stroke bg-panel text-foreground transition-all duration-300 md:flex',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex justify-end p-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '→' : '←'}
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          <SidebarNav
            pathname={pathname}
            variant="desktop"
            collapsed={collapsed}
            openGroups={openGroups}
            setOpenGroups={setOpenGroups}
          />
        </nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            type="button"
            aria-label="Close navigation panel"
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="w-64 border-l border-stroke bg-panel p-4 text-foreground shadow-lg">
            <div className="mb-4 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </Button>
            </div>

            <nav className="space-y-2">
              <SidebarNav
                pathname={pathname}
                variant="mobile"
                openGroups={openGroups}
                setOpenGroups={setOpenGroups}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
