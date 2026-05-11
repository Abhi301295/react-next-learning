"use client";

import { Button } from "@/components/ui/Button";
import { useRef } from "react";
import CounterImperativeDemo, { type CounterRef } from "./imperativeDemoCounter";

export default function UseImperativeDemo() {
  const counterRef = useRef<CounterRef>(null);

  return (
    <section className="space-y-3 rounded-lg border border-stroke bg-panel p-4">
      <h2 className="text-lg font-semibold">useImperativeHandle demo</h2>
      <CounterImperativeDemo ref={counterRef} />
      <Button type="button" variant="outline" size="sm" onClick={() => counterRef.current?.reset()}>
        Reset from parent
      </Button>
    </section>
  );
}
