'use client';

import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
import { sidebarItems, type SidebarItem } from '@/lib/config/sidebar';
import { cn } from '@/lib/utils';

type SidebarNavProps = {
  pathname: string;
  variant: 'desktop' | 'mobile';
  collapsed?: boolean;
  openGroups: Record<string, boolean>;
  setOpenGroups: Dispatch<SetStateAction<Record<string, boolean>>>;
  onNavigate?: () => void;
};

const navButtonActive = 'bg-stroke/40 font-medium text-foreground';
const navHover = 'hover:bg-background';

function hasActiveChild(item: SidebarItem, pathname: string) {
  if (!item.children) return false;
  return item.children.some((child) => child.href === pathname);
}

export function SidebarNav({
  pathname,
  variant,
  collapsed = false,
  openGroups,
  setOpenGroups,
  onNavigate,
}: SidebarNavProps) {
  const isDesktop = variant === 'desktop';

  return (
    <>
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        const groupHasActiveChild = hasActiveChild(item, pathname);
        const isGroupOpen = openGroups[item.label] ?? groupHasActiveChild;
        const firstLetter = item.label.charAt(0).toUpperCase();

        if (item.children) {
          return (
            <div key={item.label} className="space-y-1">
              <button
                type="button"
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [item.label]: !prev[item.label],
                  }))
                }
                title={isDesktop && collapsed ? item.label : undefined}
                className={cn(
                  'flex w-full items-center rounded-md px-3 py-2 text-sm',
                  navHover,
                  groupHasActiveChild && navButtonActive,
                  isDesktop && collapsed && 'justify-center px-0'
                )}
              >
                <span className="truncate">
                  {isDesktop && collapsed ? firstLetter : item.label}
                </span>
                {(!isDesktop || !collapsed) && (
                  <span className="ml-auto text-xs">{isGroupOpen ? '▾' : '▸'}</span>
                )}
              </button>

              {(!isDesktop || !collapsed) && isGroupOpen && (
                <div className="ml-3 border-l border-stroke pl-2">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href ?? '#'}
                        onClick={onNavigate}
                        className={cn(
                          'block rounded-md px-3 py-2 text-sm',
                          navHover,
                          isChildActive && navButtonActive
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
            href={item.href ?? '#'}
            onClick={onNavigate}
            title={isDesktop && collapsed ? item.label : undefined}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm',
              navHover,
              isActive && navButtonActive,
              isDesktop && collapsed && 'justify-center px-0'
            )}
          >
            {isDesktop && collapsed ? firstLetter : item.label}
          </Link>
        );
      })}
    </>
  );
}
