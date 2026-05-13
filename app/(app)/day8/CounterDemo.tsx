"use client";

import { Button } from "@/components/ui/Button";
import { PageHeading } from "@/components/ui/PageHeading";

type CounterDemoProps = {
  count: number;
  onIncrement: () => void;
};

export function CounterDemo({ count, onIncrement }: CounterDemoProps) {
  return (
    <header className="space-y-2">
      <PageHeading id="day8-title">
        Day 8 Learning React Hooks
      </PageHeading>
      <Button variant="primary" onClick={onIncrement}>
        Increase {count}
      </Button>
    </header>
  );
}
