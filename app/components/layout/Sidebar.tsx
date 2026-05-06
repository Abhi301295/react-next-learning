'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sidebarItems, type SidebarItem } from "@/lib/config/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

export function Sidebar({ mobileOpen, setMobileOpen }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const hasActiveChild = (item: SidebarItem) => {
    if (!item.children) return false;
    return item.children.some((child) => child.href === pathname);
  };

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
            const groupHasActiveChild = hasActiveChild(item);
            const isGroupOpen = openGroups[item.label] ?? groupHasActiveChild;
            const firstLetter = item.label.charAt(0).toUpperCase();

            if (item.children) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((prev) => ({ ...prev, [item.label]: !prev[item.label] }))
                    }
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100",
                      groupHasActiveChild && "bg-gray-100 font-medium",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <span className="truncate">{collapsed ? firstLetter : item.label}</span>
                    {!collapsed && (
                      <span className="ml-auto text-xs">{isGroupOpen ? "▾" : "▸"}</span>
                    )}
                  </button>

                  {!collapsed && isGroupOpen && (
                    <div className="ml-3 border-l border-gray-200 pl-2">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href ?? "#"}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm hover:bg-gray-100",
                              isChildActive && "bg-gray-200 font-medium"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href ?? "#"}
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
                const groupHasActiveChild = hasActiveChild(item);
                const isGroupOpen = openGroups[item.label] ?? groupHasActiveChild;

                if (item.children) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGroups((prev) => ({ ...prev, [item.label]: !prev[item.label] }))
                        }
                        className={cn(
                          "flex w-full items-center rounded px-3 py-2 text-left hover:bg-gray-100",
                          groupHasActiveChild && "bg-gray-100 font-medium"
                        )}
                      >
                        <span>{item.label}</span>
                        <span className="ml-auto text-xs">{isGroupOpen ? "▾" : "▸"}</span>
                      </button>

                      {isGroupOpen && (
                        <div className="ml-3 border-l border-gray-200 pl-2">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href ?? "#"}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  "block rounded px-3 py-2 hover:bg-gray-100",
                                  isChildActive && "bg-gray-200 font-medium"
                                )}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href ?? "#"}
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