"use client";

import { Button } from "@/components/ui/Button";
import { useActionState } from "react";

type FormState = {
  message: string | null;
  ok: boolean;
};

async function greetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  await new Promise((r) => setTimeout(r, 400));
  if (!name) {
    return { message: "Please enter a name.", ok: false };
  }
  return { message: `Hello, ${name}!`, ok: true };
}

export default function UseActionStateDemo() {
  const [state, formAction, isPending] = useActionState(greetAction, {
    message: null,
    ok: false,
  });

  return (
    <section className="space-y-3 rounded-lg border border-stroke bg-panel p-4">
      <h2 className="text-lg font-semibold">useActionState demo</h2>
      <p className="text-muted text-sm">
        <code className="text-foreground">useActionState</code> runs a function when the form is
        submitted and keeps the latest result in state. The third value is{" "}
        <code className="text-foreground">isPending</code> while the action runs (here simulated
        with a short delay).
      </p>

      <form action={formAction} className="flex max-w-md flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            className="rounded-lg border border-stroke bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isPending}
          />
        </label>
        <Button type="submit" variant="primary" size="sm" disabled={isPending}>
          {isPending ? "Submitting…" : "Greet"}
        </Button>
      </form>

      {state.message && (
        <p className={state.ok ? "text-foreground" : "text-red-500"}>{state.message}</p>
      )}
    </section>
  );
}
