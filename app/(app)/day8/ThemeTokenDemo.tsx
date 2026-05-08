"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export function ThemeTokenDemo() {
  return (
    <section
      className="space-y-3 rounded-card border border-border p-4"
      aria-label="day 8 theme tokens"
    >
      <h2 className="text-lg font-semibold text-brand-600">
        Day 8 Tailwind Theme Token Demo
      </h2>
      <p className="text-sm text-muted">
        Tailwind theme token preview (colors, spacing, font size, radius, and
        shadow).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="rounded-card border-border bg-surface shadow-soft">
          <CardHeader>
            <CardTitle className="text-display-sm text-brand-600">
              Variant 1: Surface Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            Soft background + card radius + soft shadow.
          </CardContent>
        </Card>

        <Card className="rounded-card border-border bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-brand-600">Variant 2: Outline Card</CardTitle>
          </CardHeader>
          <CardContent>
            Border-focused neutral card for secondary sections.
          </CardContent>
        </Card>

        <Card className="rounded-card border-none bg-brand-500 shadow-soft">
          <CardHeader>
            <CardTitle className="text-display-sm text-white">
              Variant 3: Brand Card
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/90">
            Primary emphasis block using brand color token.
          </CardContent>
        </Card>

        <Card className="rounded-card border-border bg-surface shadow-none">
          <CardHeader>
            <CardTitle className="text-brand-600">Variant 4: Compact Meta</CardTitle>
          </CardHeader>
          <CardContent className="mt-18 text-muted">
            Uses custom spacing token (`mt-18`) for layout rhythm.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
