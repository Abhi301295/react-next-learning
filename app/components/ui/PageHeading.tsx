import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type PageHeadingProps = {
  as?: "h1" | "h2";
} & HTMLAttributes<HTMLElement>;

export function PageHeading({
  as: Comp = "h1",
  className,
  ...props
}: PageHeadingProps) {
  return (
    <Comp
      className={cn("text-display-sm font-semibold text-brand-600", className)}
      {...props}
    />
  );
}
