'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { sidebarItems } from "@/lib/config/sidebar";

export function Sidebar() {

  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r bg-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-2 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCollapsed(!collapsed)}
        >{collapsed ? "→" : "←"}</Button>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {sidebarItems?.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm transition",
                "hover:bg-gray-100",
                isActive && "bg-gray-200 font-medium",
                collapsed && "justify-center px-0"
              )}
            >{!collapsed && item.label}</Link>
          )
        })}
      </nav>
    </aside>
  );
}