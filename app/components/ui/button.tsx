import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-600 text-white hover:bg-gray-700",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variantClasses[variant ?? "primary"],
        sizeClasses[size ?? "md"],
        className
      )}
      {...props}
    />
  );
}