'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sidebarItems } from "@/lib/config/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

export function Sidebar({ mobileOpen, setMobileOpen }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-white transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse Toggle */}
        <div className="p-2 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const firstLetter = item.label.charAt(0).toUpperCase();

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm",
                  "hover:bg-gray-100",
                  isActive && "bg-gray-200 font-medium",
                  collapsed && "justify-center px-0"
                )}
              >
                {collapsed ? firstLetter : item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="w-64 bg-white p-4 shadow-lg">
            <div className="flex justify-end mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </Button>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded",
                      "hover:bg-gray-100",
                      isActive && "bg-gray-200 font-medium"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}