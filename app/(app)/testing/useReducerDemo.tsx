"use client";

import { Button } from "@/components/ui/Button";
import { useReducer } from "react";

type State = { count: number, error?: string | null };
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment": {
        const incrementedCount = state.count + 1;
        const error = incrementedCount > 10 ? "Count cannot be greater than 10" : null;
        return { count: error ? state.count : incrementedCount, error };
    }
    case "decrement": {
        const decrementedCount = state.count - 1;
        const error = decrementedCount < 0 ? "Count cannot be less than 0" : null;
        return { count: error ? state.count : decrementedCount, error };
    }
    case "reset": {
        return { count: 0, error: null };
    }
    default:
      return state;
  }
}

export default function UseReducerDemo() {
  const [{ count, error }, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <section className="space-y-3 rounded-lg border border-stroke bg-panel p-4">
      <h2 className="text-lg font-semibold">useReducer demo</h2>
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-muted">Count: {count}</p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: "decrement" })}
        >
          −1
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: "increment" })}
        >
          +1
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={() => dispatch({ type: "reset" })}>
          Reset
        </Button>
      </div>
    </section>
  );
}
