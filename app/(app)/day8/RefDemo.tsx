"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";

type RefDemoProps = {
  count: number;
};

export function RefDemo({ count }: RefDemoProps) {
  const [note, setNote] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [previousCount, setPreviousCount] = useState(count);

  const noteInputRef = useRef<HTMLInputElement | null>(null);
  const prevCountRef = useRef(count);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPreviousCount(prevCountRef.current);
    prevCountRef.current = count;
  }, [count]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStartTimer = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopTimer = () => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <section
      className="space-y-3 rounded-card border border-border bg-surface p-4 shadow-soft"
      aria-label="useRef examples"
    >
      <h2 className="text-lg font-semibold">useRef Examples</h2>

      <div className="space-y-2">
        <p>1) Focus input using ref</p>
        <input
          ref={noteInputRef}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type here and click focus"
          className="w-full max-w-sm rounded-card border border-border px-3 py-2"
        />
        <Button
          variant="primary"
          onClick={() => noteInputRef.current?.focus()}
        >
          Focus Input
        </Button>
      </div>

      <div className="space-y-1">
        <p>2) Previous count with ref: {previousCount}</p>
        <p>Current count: {count}</p>
      </div>

      <div className="space-y-2">
        <p>3) Timer id in ref: {seconds}s</p>
        <div className="flex gap-2 pt-18">
          <Button variant="primary" onClick={handleStartTimer}>
            Start Timer
          </Button>
          <Button variant="primary" onClick={handleStopTimer}>
            Stop Timer
          </Button>
          <Button variant="primary" onClick={() => setSeconds(0)}>
            Reset Seconds
          </Button>
        </div>
      </div>
    </section>
  );
}
