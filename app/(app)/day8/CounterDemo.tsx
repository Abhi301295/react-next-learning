"use client";

import { Button } from "@/components/ui/Button";

type CounterDemoProps = {
  count: number;
  onIncrement: () => void;
};

export function CounterDemo({ count, onIncrement }: CounterDemoProps) {
  return (
    <header className="space-y-2">
      <h1
        id="day8-title"
        className="text-display-sm font-semibold text-brand-600"
      >
        Day 8 Learning React Hooks
      </h1>
      <Button variant="primary" onClick={onIncrement}>
        Increase {count}
      </Button>
    </header>
  );
}
