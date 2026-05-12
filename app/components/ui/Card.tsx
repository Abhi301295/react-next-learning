import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stroke bg-panel p-4 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("mb-3 space-y-1", className)} {...props} />;
}

type CardTitleProps = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
} & HTMLAttributes<HTMLElement>;

export function CardTitle({
  className,
  as: Comp = "h3",
  ...props
}: CardTitleProps) {
  return (
    <Comp
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  );
}

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn("text-sm text-subtle", className)} {...props} />
  );
}
