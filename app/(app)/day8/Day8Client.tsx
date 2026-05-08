"use client";

import { useState } from "react";
import { ApiTableDemo } from "./ApiTableDemo";
import { CallbackDemo } from "./CallbackDemo";
import { CounterDemo } from "./CounterDemo";
import { MemoDemo } from "./MemoDemo";
import { RefDemo } from "./RefDemo";
import { ThemeTokenDemo } from "./ThemeTokenDemo";

const Day8Client = () => {
  const [count, setCount] = useState(0);

  return (
    <section className="space-y-4" aria-labelledby="day8-title">
      <CounterDemo count={count} onIncrement={() => setCount((c) => c + 1)} />
      <MemoDemo />
      <CallbackDemo />
      <RefDemo count={count} />
      <ThemeTokenDemo />
      <ApiTableDemo />
    </section>
  );
};

export default Day8Client;
