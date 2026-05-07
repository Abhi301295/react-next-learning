'use client';

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ConfigurableTable from "@/components/shared/table/core/ConfigurableTable";
import { initialItems, shuffleList } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Search from "./Search";
import { Day8ApiKey, Day8PostRow } from "./tableConfigs";
import { useDay8ApiTable } from "./useDay8ApiTable";


const allUsers = [
  "john",
  "jane",
  "doe",
  "jill",
  "jack",
  "simon",
]

const Day8Client = () => {
  const [count, setCount] = useState(0);
  const [items] = useState(initialItems);
  const [users, setUsers] = useState(allUsers);
  const { tableRows, tableLoading, tableError, tableConfig, retry } = useDay8ApiTable();

  // use effect
  useEffect(() => {
    console.log(count, 'count');
    return () => {
      console.log('clean up', count);
    }
  }, [count]);

  // useMemo 
  const selectedItem = useMemo(() => items.find(item => item.isSelected), [items]);

  // useCallback

  // Intentionally depends on `users` to demonstrate how useCallback
  // recreates the function when a dependency changes.
  const handleSearch = useCallback((text: string) => {
    console.log(users[0]);
    
    const filteredUsers = allUsers.filter(user => user.includes(text));
    setUsers(filteredUsers);
  }, [users]);

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
    <section className="space-y-4" aria-labelledby="day8-title">
      <header className="space-y-2">
        <h1 id="day8-title" className="text-display-sm font-semibold text-brand-600">Day 8 Learning React Hooks</h1>
        <Button variant="primary" onClick={() => setCount(count + 1)}>
          Increase {count}
        </Button>
      </header>

      <section aria-label="Selected item">
        <p>Selected Item: {selectedItem?.id}</p>
      </section>

      <section className="mt-4 space-y-3" aria-label="User search and list">
        <div className="flex w-full items-end gap-2">
          <div className="shrink-0">
            <Button variant="primary" onClick={() => setUsers((prevUsers) => shuffleList(prevUsers))}>
              Shuffle Users
            </Button>
          </div>
          <div className="w-full max-w-sm">
            <Search onChange={handleSearch} />
          </div>
        </div>

        <ul className="mt-2 list-disc pl-5" aria-live="polite">
          {users.map((user, index) => (
            <li key={user + index.toString()}>{user}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-card border border-stroke bg-panel p-4 shadow-soft" aria-label="useRef examples">
        <h2 className="text-lg font-semibold">useRef Examples</h2>

        <div className="space-y-2">
          <p>1) Focus input using ref</p>
          <input
            ref={noteInputRef}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type here and click focus"
            className="w-full max-w-sm rounded-card border border-stroke px-3 py-2"
          />
          <Button variant="primary" onClick={() => noteInputRef.current?.focus()}>
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
            <Button
              variant="primary"
              onClick={() => {
                setSeconds(0);
              }}
            >
              Reset Seconds
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-card border border-stroke p-4" aria-label="day 8 demo">
        <h2 className="text-lg font-semibold text-brand-600">Day 8 Tailwind Theme Token Demo</h2>
        <p className="text-sm text-subtle">
          Tailwind theme token preview (colors, spacing, font size, radius, and shadow).
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="rounded-card border-stroke bg-panel shadow-soft">
            <CardHeader>
              <CardTitle className="text-display-sm text-brand-600">Variant 1: Surface Card</CardTitle>
            </CardHeader>
            <CardContent className="text-subtle">Soft background + card radius + soft shadow.</CardContent>
          </Card>

          <Card className="rounded-card border-stroke bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-brand-600">Variant 2: Outline Card</CardTitle>
            </CardHeader>
            <CardContent className="text-subtle">Border-focused neutral card for secondary sections.</CardContent>
          </Card>

          <Card className="rounded-card border-none bg-brand-500 shadow-soft">
            <CardHeader>
              <CardTitle className="text-display-sm text-white">Variant 3: Brand Card</CardTitle>
            </CardHeader>
            <CardContent className="text-white/90">Primary emphasis block using brand color token.</CardContent>
          </Card>

          <Card className="rounded-card border-stroke bg-panel shadow-none">
            <CardHeader>
              <CardTitle className="text-brand-600">Variant 4: Compact Meta</CardTitle>
            </CardHeader>
            <CardContent className="mt-18 text-subtle">Uses custom spacing token (`mt-18`) for layout rhythm.</CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3 rounded-card border border-stroke p-4" aria-label="api driven table">
        <h2 className="text-lg font-semibold text-brand-600">API Driven Table (Posts API with 100 records)</h2>
        <ConfigurableTable<Day8PostRow, Day8ApiKey>
          data={tableRows}
          loading={tableLoading}
          error={tableError}
          onRetry={retry}
          config={tableConfig}
        />
      </section>
    </section>
  );
}

export default Day8Client;