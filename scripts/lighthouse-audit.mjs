#!/usr/bin/env node
/**
 * Runs Lighthouse against every app route (and /login).
 * Requires `npm run build && npm run start` (or set START_SERVER=1 to spawn next start).
 *
 * Authenticated routes use POST /api/auth/login (emilys / emilyspass) and pass Cookie via --extra-headers.
 */

import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LH_PORT =
  process.env.LH_PORT ??
  (process.env.START_SERVER === "1" ? "3010" : "3000");
const BASE =
  process.env.LH_BASE_URL ?? `http://127.0.0.1:${LH_PORT}`;
const OUT_DIR = path.join(ROOT, "lighthouse-reports");
const lighthouseBin = path.join(ROOT, "node_modules", ".bin", "lighthouse");
const nextBin = path.join(ROOT, "node_modules", ".bin", "next");

async function waitForServer(maxAttempts = 90) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const r = await fetch(BASE, { redirect: "manual" });
      if (r.status < 500) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server not reachable at ${BASE}`);
}

/**
 * Prime dynamic routes before Lighthouse so streamed metadata (e.g. merged
 * from parent layouts) is present on the first audit pass — avoids flaky
 * `meta-description` on cold requests.
 */
async function warmupAuthenticatedRoutes(cookie) {
  const paths = ["/", "/dashboard", "/users", "/users/1"];
  await Promise.all(
    paths.map((pathname) =>
      fetch(`${BASE}${pathname}`, {
        redirect: "follow",
        headers: { ...cookie },
      }).catch(() => {})
    )
  );
}

async function getAuthCookieHeader() {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "emilys", password: "emilyspass" }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Login failed ${r.status}: ${t}`);
  }
  const setCookie = r.headers.get("set-cookie");
  if (!setCookie) throw new Error("No Set-Cookie from /api/auth/login");
  const m = /auth_token=([^;]+)/.exec(setCookie);
  if (!m) throw new Error("auth_token missing in Set-Cookie");
  return { Cookie: `auth_token=${decodeURIComponent(m[1])}` };
}

function slugify(routePath) {
  return routePath.replace(/^\//, "").replace(/\//g, "_") || "root";
}

/**
 * @param {string} routePath pathname only
 * @param {Record<string, string>} extraHeaders
 */
function runLighthouse(name, routePath, extraHeaders) {
  const url = `${BASE}${routePath}`;
  const args = [
    url,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    "--output-path=stdout",
    "--quiet",
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
  ];
  if (extraHeaders && Object.keys(extraHeaders).length > 0) {
    args.push("--extra-headers", JSON.stringify(extraHeaders));
  }
  const stdout = execFileSync(lighthouseBin, args, {
    encoding: "utf8",
    cwd: ROOT,
    maxBuffer: 80 * 1024 * 1024,
    env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH },
  });
  const data = JSON.parse(stdout);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, `${slugify(name)}.json`),
    JSON.stringify(data, null, 2)
  );
  return data;
}

/**
 * Lighthouse category score is 0–1 (= 0–100 in UI).
 * @param {number | null | undefined} score
 * @returns {string | null}
 */
function markCategory(score) {
  if (typeof score !== "number") return null;
  if (score >= 0.95) return "excellent";
  if (score >= 0.9) return "good";
  if (score >= 0.5) return "needs-improvement";
  return "poor";
}

/**
 * LCP (ms): Core Web Vitals–aligned bands (lab).
 * @param {number | null | undefined} ms
 */
function markLcp(ms) {
  if (typeof ms !== "number") return null;
  if (ms <= 2000) return "excellent";
  if (ms <= 2500) return "good";
  if (ms <= 4000) return "needs-improvement";
  return "poor";
}

/**
 * CLS: cumulative layout shift.
 * @param {number | null | undefined} cls
 */
function markCls(cls) {
  if (typeof cls !== "number") return null;
  if (cls <= 0.05) return "excellent";
  if (cls <= 0.1) return "good";
  if (cls <= 0.25) return "needs-improvement";
  return "poor";
}

/**
 * FCP (ms): first contentful paint.
 * @param {number | null | undefined} ms
 */
function markFcp(ms) {
  if (typeof ms !== "number") return null;
  if (ms <= 1000) return "excellent";
  if (ms <= 1800) return "good";
  if (ms <= 3000) return "needs-improvement";
  return "poor";
}

/**
 * TBT (ms): total blocking time (lab proxy for interactivity).
 * @param {number | null | undefined} ms
 */
function markTbt(ms) {
  if (typeof ms !== "number") return null;
  if (ms <= 150) return "excellent";
  if (ms <= 200) return "good";
  if (ms <= 600) return "needs-improvement";
  return "poor";
}

/**
 * Enrich one summary row with *Mark fields for tooling / spreadsheets.
 * @param {Record<string, unknown>} row
 */
function addMarks(row) {
  return {
    ...row,
    performanceMark: markCategory(
      /** @type {number | undefined} */ (row.performance)
    ),
    accessibilityMark: markCategory(
      /** @type {number | undefined} */ (row.accessibility)
    ),
    bestPracticesMark: markCategory(
      /** @type {number | undefined} */ (row.bestPractices)
    ),
    seoMark: markCategory(/** @type {number | undefined} */ (row.seo)),
    fcpMark: markFcp(/** @type {number | undefined} */ (row.fcpMs)),
    lcpMark: markLcp(/** @type {number | undefined} */ (row.lcpMs)),
    tbtMark: markTbt(/** @type {number | undefined} */ (row.tbtMs)),
    clsMark: markCls(/** @type {number | undefined} */ (row.cls)),
  };
}

/**
 * Build a Markdown table + legend for quick reading.
 * @param {Array<Record<string, unknown>>} rows
 */
function buildRatedMarkdown(rows) {
  const legend = `## Lighthouse ratings legend

Category scores (Lighthouse Performance / Accessibility / Best practices / SEO), 0–1 scale:

| Mark | Range |
|------|--------|
| **excellent** | ≥ 0.95 (95–100) |
| **good** | 0.90 – 0.94 (90–94) |
| **needs-improvement** | 0.50 – 0.89 (50–89) |
| **poor** | < 0.50 (<50) |

**LCP** marks (ms): **excellent** ≤2000 · **good** ≤2500 · **needs-improvement** ≤4000 · **poor** \>4000.

**CLS** marks: **excellent** ≤0.05 · **good** ≤0.1 · **needs-improvement** ≤0.25 · **poor** \>0.25.

All \`*Mark\` fields are also in \`summary.json\` for spreadsheets (\`performanceMark\`, \`lcpMark\`, \`clsMark\`, \`fcpMark\`, \`tbtMark\`, …).

---

## Per-route summary

| Route | Performance | Accessibility | Best practices | SEO | LCP (ms) · mark | CLS · mark |
|-------|-------------|--------------|----------------|-----|------------------|------------|
`;

  const lines = rows.map((r) => {
    const lcp =
      typeof r.lcpMs === "number" ? `${Math.round(r.lcpMs)}` : "—";
    const cls =
      typeof r.cls === "number" ? r.cls.toFixed(4) : "—";
    return `| ${r.path} | ${cellScore(r.performance, r.performanceMark)} | ${cellScore(r.accessibility, r.accessibilityMark)} | ${cellScore(r.bestPractices, r.bestPracticesMark)} | ${cellScore(r.seo, r.seoMark)} | ${lcp} · ${r.lcpMark ?? "—"} | ${cls} · ${r.clsMark ?? "—"} |`;
  });

  return `${legend}${lines.join("\n")}\n`;
}

function formatPct(v) {
  if (typeof v !== "number") return "—";
  return `${Math.round(v * 100)}%`;
}

function cellScore(score, mark) {
  if (typeof score !== "number") return "—";
  const p = formatPct(score);
  return mark ? `${p} (${mark})` : p;
}

function aggregateOpportunities(allReports) {
  /** @type {Map<string, { maxMs: number, route: string, title?: string }>} */
  const byId = new Map();
  for (const { path: routePath, data } of allReports) {
    for (const audit of Object.values(data.audits ?? {})) {
      if (audit.score === 1 || audit.score === null) continue;
      if (audit.details?.type !== "opportunity") continue;
      const ms = audit.numericValue;
      if (typeof ms !== "number") continue;
      const prev = byId.get(audit.id);
      if (!prev || ms > prev.maxMs) {
        byId.set(audit.id, {
          maxMs: ms,
          route: routePath,
          title: audit.title,
        });
      }
    }
  }
  return [...byId.entries()]
    .sort((a, b) => b[1].maxMs - a[1].maxMs)
    .slice(0, 20)
    .map(([id, v]) => ({
      id,
      maxEstimatedSavingsMs: Math.round(v.maxMs),
      worstRoute: v.route,
      title: v.title,
    }));
}

async function maybeStartServer() {
  if (process.env.START_SERVER !== "1") return null;
  const proc = spawn(nextBin, ["start", "-p", LH_PORT, "-H", "127.0.0.1"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  await waitForServer();
  return proc;
}

async function main() {
  let proc = await maybeStartServer();
  if (!proc && process.env.START_SERVER !== "1") {
    await waitForServer();
  }

  const cookie = await getAuthCookieHeader();

  await fetch(`${BASE}/login`, { redirect: "manual" }).catch(() => {});
  await warmupAuthenticatedRoutes(cookie);

  const routes = [
    { name: "login", path: "/login", headers: {} },
    /** Logged-in hit on `/` (middleware redirects to `/dashboard`). */
    { name: "root", path: "/", headers: cookie },
    { name: "dashboard", path: "/dashboard", headers: cookie },
    { name: "users", path: "/users", headers: cookie },
    { name: "users_1", path: "/users/1", headers: cookie },
  ];

  const summary = [];
  const full = [];

  for (const r of routes) {
    process.stdout.write(`Lighthouse: ${r.name} (${r.path})…\n`);
    const data = runLighthouse(r.name, r.path, r.headers);
    full.push({ path: r.path, data });
    const base = {
      path: r.path,
      performance: data.categories?.performance?.score,
      accessibility: data.categories?.accessibility?.score,
      bestPractices: data.categories?.["best-practices"]?.score,
      seo: data.categories?.seo?.score,
      fcpMs:
        data.audits?.["first-contentful-paint"]?.numericValue ?? null,
      lcpMs:
        data.audits?.["largest-contentful-paint"]?.numericValue ?? null,
      tbtMs: data.audits?.["total-blocking-time"]?.numericValue ?? null,
      cls: data.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
    };
    summary.push(addMarks(base));
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(summary, null, 2)
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "summary-rated.md"),
    buildRatedMarkdown(summary)
  );
  const opps = aggregateOpportunities(full);
  fs.writeFileSync(
    path.join(OUT_DIR, "opportunities-top.json"),
    JSON.stringify(opps, null, 2)
  );

  process.stdout.write(
    `\nWrote ${OUT_DIR}/summary.json (with *Mark fields), summary-rated.md, and per-route *.json\n`
  );
  process.stdout.write(`Top opportunities: ${OUT_DIR}/opportunities-top.json\n`);

  const minPerf = Number(process.env.LH_MIN_PERFORMANCE ?? "0.9");
  const minOther = Number(process.env.LH_MIN_OTHER ?? "0.95");
  let failed = false;
  for (const row of summary) {
    const checks = [
      ["performance", row.performance, minPerf],
      ["accessibility", row.accessibility, minOther],
      ["bestPractices", row.bestPractices, minOther],
      ["seo", row.seo, minOther],
    ];
    for (const [label, score, min] of checks) {
      if (typeof score !== "number") continue;
      if (score < min) {
        process.stdout.write(
          `FAIL ${row.path} ${label} ${score} < ${min}\n`
        );
        failed = true;
      }
    }
  }
  if (failed) {
    process.stderr.write(
      `\nSet LH_MIN_PERFORMANCE / LH_MIN_OTHER to adjust thresholds (default perf ${minPerf}, other ${minOther}).\n`
    );
    if (proc) proc.kill("SIGTERM");
    process.exit(1);
  }
  process.stdout.write(
    `All routes meet thresholds (performance ≥ ${minPerf}, others ≥ ${minOther}).\n`
  );

  if (proc) {
    proc.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
