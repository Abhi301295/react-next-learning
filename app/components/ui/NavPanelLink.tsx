import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const navPanelClass =
  "inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-lg border border-stroke bg-panel px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type NavPanelLinkProps = ComponentProps<typeof Link>;

export function NavPanelLink({ className, ...props }: NavPanelLinkProps) {
  return <Link className={cn(navPanelClass, className)} {...props} />;
}
