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

const navButtonActive = 'bg-primary/15 font-medium text-primary';
const navHover = 'hover:bg-background';

/** Avoid stale KPIs: client router can reuse prefetched `/dashboard` RSC payloads. */
function navPrefetch(href: string | undefined) {
  return href === "/dashboard" ? false : undefined;
}
const groupId = (variant: string, label: string) =>
  `${variant}-group-${label.toLowerCase().replace(/\s+/g, "-")}`;

function matchesNavHref(pathname: string, href: string | undefined): boolean {
  if (!href || href === '#') return false;
  if (pathname === href) return true;
  if (href === '/') return false;
  return pathname.startsWith(`${href}/`);
}

function hasActiveChild(item: SidebarItem, pathname: string) {
  if (!item.children) return false;
  return item.children.some((child) => matchesNavHref(pathname, child.href));
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
        const isActive = matchesNavHref(pathname, item.href);
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
                aria-expanded={isGroupOpen}
                aria-controls={groupId(variant, item.label)}
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
                <div
                  id={groupId(variant, item.label)}
                  className="ml-3 border-l border-stroke pl-2"
                >
                  {item.children.map((child) => {
                    const isChildActive = matchesNavHref(pathname, child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href ?? '#'}
                        prefetch={navPrefetch(child.href)}
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
            prefetch={navPrefetch(item.href)}
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
