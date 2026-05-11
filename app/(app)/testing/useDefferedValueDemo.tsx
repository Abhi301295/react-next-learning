"use client";

import Input from "@/components/ui/Input";
import { useDeferredValue, useId, useState } from "react";

const ITEMS = Array.from({ length: 400 }, (_, i) => {
  const tags = ["alpha", "beta", "gamma", "search", "demo", "react", "next"][i % 7];
  return `Record ${i + 1} — ${tags} #${i}`;
});

export default function UseDeferredValueDemo() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [deferList, setDeferList] = useState(true);
  const deferredQuery = useDeferredValue(query);
  const listFilter = deferList ? deferredQuery : query;
  const isStale = deferList && query !== deferredQuery;

  const q = listFilter.trim().toLowerCase();
  const visible = q
    ? ITEMS.filter((row) => row.toLowerCase().includes(q))
    : ITEMS;

  return (
    <section className="space-y-3 rounded-lg border border-stroke bg-panel p-4">
      <h2 className="text-lg font-semibold">useDeferredValue demo</h2>
      <p className="text-muted text-sm">
        The list rows are intentionally slow to paint. Filtering on every keystroke
        with the live query blocks the main thread, so typing feels sticky. When
        the list uses a <code>useDeferredValue</code> of the query, React can keep
        the input update urgent and defer the heavy list work.
      </p>

      <label
        htmlFor={`${id}-defer`}
        className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
      >
        <input
          id={`${id}-defer`}
          type="checkbox"
          className="h-4 w-4 rounded border-stroke accent-primary"
          checked={deferList}
          onChange={(e) => setDeferList(e.target.checked)}
        />
        Defer list updates (useDeferredValue)
      </label>

      <Input
        label="Search"
        placeholder="Try typing quickly…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputSize="sm"
        helperText={
          deferList
            ? "List filters on a deferred copy of this text."
            : "List filters on this text immediately (may stutter while rows render)."
        }
      />

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">
          {visible.length} row{visible.length === 1 ? "" : "s"}
        </span>
        {isStale && (
          <span className="text-muted">Updating results…</span>
        )}
      </div>

      <ul className="max-h-48 list-disc space-y-0.5 overflow-y-auto pl-5 text-sm">
        {visible.map((row) => (
          <SlowRow key={row} text={row} />
        ))}
      </ul>
    </section>
  );
}

const SlowRow = ({ text }: { text: string }) => {
  const start = performance.now();
  while (performance.now() - start < 1) {
    // intentionally burn ~1ms per row so search + paint is observably heavy
  }
  return <li>{text}</li>;
};
