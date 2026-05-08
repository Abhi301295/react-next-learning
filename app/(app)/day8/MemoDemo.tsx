"use client";

import { useMemo, useState } from "react";
import { DAY8_MEMO_ITEMS, type Day8MemoItem } from "./demoData";

export function MemoDemo() {
  const [items] = useState<Day8MemoItem[]>(DAY8_MEMO_ITEMS);

  const selectedItem = useMemo(
    () => items.find((item) => item.isSelected),
    [items]
  );

  return (
    <section aria-label="Selected item">
      <p>Selected Item: {selectedItem?.id}</p>
    </section>
  );
}
