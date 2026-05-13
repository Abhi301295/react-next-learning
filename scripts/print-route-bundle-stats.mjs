#!/usr/bin/env node
/**
 * Reads Next.js build output (`.next/diagnostics/route-bundle-stats.json`) and prints
 * per-route first-load JS size (uncompressed). Run after `npm run build`.
 *
 * Note: Routes share many chunks, so summing routes would double-count; use this to
 * compare which pages pull the heaviest *additional* route bundles.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STATS = path.join(ROOT, ".next", "diagnostics", "route-bundle-stats.json");

if (!fs.existsSync(STATS)) {
  console.error(
    "Missing bundle stats. Run `npm run build` first, then re-run this script."
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(STATS, "utf8"));
const rows = data
  .map((r) => ({
    route: r.route,
    bytes: r.firstLoadUncompressedJsBytes ?? 0,
  }))
  .sort((a, b) => b.bytes - a.bytes);

console.log(
  "\nPer-route first-load JS (uncompressed). Shared chunks are counted per route — compare relative size, not sums.\n"
);
const label = "Route";
const sep = "─".repeat(42);
console.log(`${label.padEnd(28)} Uncompressed`);
console.log(sep);
for (const { route, bytes } of rows) {
  const kb = (bytes / 1024).toFixed(1);
  console.log(`${String(route).padEnd(28)} ${kb.padStart(8)} KB`);
}
const [largest] = rows;
if (largest) {
  console.log(sep);
  console.log(
    `Largest by this metric: ${largest.route} (~${(largest.bytes / 1024).toFixed(1)} KB uncompressed)\n`
  );
}
