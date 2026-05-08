import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:opacity-90",
  secondary:
    "border border-stroke bg-secondary/15 text-foreground hover:bg-secondary/25",
  outline:
    "border border-stroke bg-transparent text-foreground hover:bg-panel",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3",
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 w-8 p-0",
  md: "h-10 w-10 p-0",
  lg: "h-12 w-12 p-0",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  /** Optional hover tooltip (maps to native `title`). */
  tooltip?: string;
};

export function Button({
  className,
  variant,
  size,
  icon,
  iconPosition = "left",
  iconOnly = false,
  tooltip,
  children,
  "aria-label": ariaLabel,
  title,
  ...props
}: ButtonProps) {
  const resolvedSize = size ?? "md";

  return (
    <button
      className={cn(
        base,
        variantClasses[variant ?? "primary"],
        iconOnly ? iconOnlySizeClasses[resolvedSize] : sizeClasses[resolvedSize],
        !iconOnly && icon && "gap-2",
        className
      )}
      aria-label={ariaLabel}
      title={tooltip ?? title}
      {...props}
    >
      {iconOnly ? (
        <span aria-hidden="true" className="inline-flex items-center justify-center">
          {icon}
        </span>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span aria-hidden="true" className="inline-flex items-center justify-center">
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span aria-hidden="true" className="inline-flex items-center justify-center">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
