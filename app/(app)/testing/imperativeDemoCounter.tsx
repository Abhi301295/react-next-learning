"use client";

import { Button } from "@/components/ui/Button";
import { forwardRef, Ref, useImperativeHandle, useState } from "react";

const MIN = 0;
const MAX = 10;

export type CounterRef = {
  reset: () => void;
};

const CounterImperativeDemo = forwardRef<CounterRef>(function CounterImperativeDemo(_props, ref: Ref<CounterRef>) {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => Math.min(prev + 1, MAX));
  const decrement = () => setCount((prev) => Math.max(prev - 1, MIN));
  const reset = () => setCount(0);

  useImperativeHandle(ref, () => ({ reset }), []);

  return (
    <div className="space-y-3">
      <p className="text-muted">Count: {count}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={decrement} disabled={count <= MIN}>
          −1
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={increment} disabled={count >= MAX}>
          +1
        </Button>
      </div>
    </div>
  );
});

export default CounterImperativeDemo;
