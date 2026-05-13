import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type PanelCardProps = ComponentProps<typeof Card> & {
  /** `soft` adds the standard panel shadow; `flat` matches list/card surfaces without elevation. */
  elevation?: "soft" | "flat";
};

export function PanelCard({
  className,
  elevation = "soft",
  ...props
}: PanelCardProps) {
  return (
    <Card
      className={cn(
        "rounded-card border-stroke bg-panel",
        elevation === "soft" && "shadow-soft",
        className
      )}
      {...props}
    />
  );
}
