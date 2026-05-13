import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const primaryUnderline =
  "font-medium text-primary underline-offset-4 hover:underline";

const brandUnderline =
  "font-medium text-brand-600 underline-offset-4 hover:underline";

const focusRing =
  "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const brandFocusExtra = "rounded-sm focus:outline-none";

export type TextLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
  accent?: "primary" | "brand";
  /** `inline` for sentence links; `inlineBlock` for compact CTAs with optional focus treatment. */
  variant?: "inline" | "inlineBlock";
  /** Visible focus ring; defaults to `true` when `variant` is `inlineBlock`. */
  showFocusRing?: boolean;
};

export function TextLink({
  accent = "primary",
  variant = "inline",
  showFocusRing,
  className,
  ...props
}: TextLinkProps) {
  const needsRing = showFocusRing ?? variant === "inlineBlock";

  return (
    <Link
      className={cn(
        accent === "primary" ? primaryUnderline : brandUnderline,
        variant === "inlineBlock" && "inline-block text-sm",
        needsRing && focusRing,
        accent === "brand" && needsRing && brandFocusExtra,
        className
      )}
      {...props}
    />
  );
}
