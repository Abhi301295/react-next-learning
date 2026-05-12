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
  const paths = [
    "/dashboard",
    "/users",
    "/users/1",
    "/products",
    "/products/1",
    "/testing",
    "/day1",
    "/day2",
    "/day3",
    "/day5",
    "/day6",
    "/day7",
    "/day8",
  ];
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
    { name: "dashboard", path: "/dashboard", headers: cookie },
    { name: "users", path: "/users", headers: cookie },
    { name: "users_1", path: "/users/1", headers: cookie },
    { name: "products", path: "/products", headers: cookie },
    { name: "products_1", path: "/products/1", headers: cookie },
    { name: "testing", path: "/testing", headers: cookie },
    { name: "day1", path: "/day1", headers: cookie },
    { name: "day2", path: "/day2", headers: cookie },
    { name: "day3", path: "/day3", headers: cookie },
    { name: "day5", path: "/day5", headers: cookie },
    { name: "day6", path: "/day6", headers: cookie },
    { name: "day7", path: "/day7", headers: cookie },
    { name: "day8", path: "/day8", headers: cookie },
  ];

  const summary = [];
  const full = [];

  for (const r of routes) {
    process.stdout.write(`Lighthouse: ${r.name} (${r.path})…\n`);
    const data = runLighthouse(r.name, r.path, r.headers);
    full.push({ path: r.path, data });
    summary.push({
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
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(summary, null, 2)
  );
  const opps = aggregateOpportunities(full);
  fs.writeFileSync(
    path.join(OUT_DIR, "opportunities-top.json"),
    JSON.stringify(opps, null, 2)
  );

  process.stdout.write(`\nWrote ${OUT_DIR}/summary.json and per-route *.json\n`);
  process.stdout.write(`Top opportunities: ${OUT_DIR}/opportunities-top.json\n`);

  if (proc) {
    proc.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
