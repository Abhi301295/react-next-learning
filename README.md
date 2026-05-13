# User Management Dashboard

## About this project

This is a **user management admin UI** built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS v4**. It includes **light / dark** theming, a responsive shell (sidebar and header), and **cookie-based sign-in** against a configurable **JSON HTTP API** (the default setup targets a public demo API you can swap via `API_BASE_URL`).

Typical use: sign in, review **dashboard** metrics and recent activity, then work with the **users** directory—search, filter by role and status, paginate, open profiles, and use add/edit flows where implemented.

## What’s in the app

| Area | What you get |
|------|----------------|
| **Authentication** | Sign-in form with validation; session stored in an **httpOnly** cookie; protected routes via `proxy.ts`. |
| **Dashboard** | KPI-style counts and a recent-activity list (server-rendered, cached). |
| **Users** | Responsive **table** (desktop) and **cards** (mobile); debounced search; filters; pagination; detail pages under `/users/[id]`. |
| **Quality** | Loading, error, and empty states; global and route error boundaries; accessible patterns (skip link, landmarks, table actions). |
| **Theming** | Design tokens in `app/globals.css` (colors, radius, shadows); shared **Button**, **Input**, **Card**, **Badge**, etc. |

Implementation map (for developers): login lives under `app/(auth)/login/`, the main shell under `app/(app)/`, auth API routes under `app/api/auth/`, shared UI under `app/components/`, and domain logic under `app/lib/`.

## Requirements

- **Node.js** 20+ (matches the toolchain in `package.json`).

## Using the project

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment** — create **`.env.local`** in the project root:

   | Variable | Purpose |
   |----------|---------|
   | `API_BASE_URL` | Base URL of the JSON API (no trailing slash). **Required** for `npm run build` in production mode (`next.config.ts`). For local development a default may apply; set it explicitly to avoid surprises. |
   | `NEXT_PUBLIC_SITE_URL` | Site origin used in metadata, `sitemap`, and `robots` (use your real URL in production; for local dev, `http://localhost:3000` is fine). |

   Example for local development:

   ```bash
   API_BASE_URL=https://dummyjson.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open **http://localhost:3000**. You’ll be redirected to **`/login`** or **`/dashboard`** depending on whether you already have a session cookie.

4. **Sign in** — use credentials issued for your API. For the default demo host above, a common test account is **`emilys`** / **`emilyspass`** (subject to that service’s terms).

5. **Explore** — use **Dashboard** and **Users** in the sidebar; open a row or card to view **`/users/[id]`**; use theme control in the header as needed.

6. **Production build locally** (optional)

   ```bash
   npm run build
   npm run start
   ```

   Ensure `API_BASE_URL` is set; production builds enforce it.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run the production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run health` | `typecheck` + `lint` + `build` |
| `npm run lighthouse:ci` | Build, start server, run Lighthouse on core routes → `lighthouse-reports/` (optional quality check) |
| `npm run perf:bundle-stats` | After `build`, print per-route JS sizes from `.next` diagnostics |

## How the `/users` list works (maintainers)

The users page mixes **server** and **client** work so the first screen paints quickly:

1. **`app/(app)/users/page.tsx`** (Server Component) renders the **Users** heading and calls **`fetchUsersListInitialForPage()`** in `app/lib/users/initial-list.ts` to load the first page of data.
2. It passes **`initial`** (`{ users, total }` or `null`) into **`UsersListing`** (`"use client"`).
3. **`useUsers(initial)`** in `app/lib/hooks/useUsers.ts` seeds the table when `initial` is present, avoids a duplicate first fetch, and runs normal fetches when search, filters, sort, or pagination change.
4. **`tableConfigs.tsx`** defines columns, filters, search labels, and pagination defaults shared by the desktop table and mobile list.

**Important:** the server query in `initial-list.ts` (limit, skip, sort field, order) must stay aligned with the **default** first client request in `useUsers` (see `USER_SORT_API` for name → `firstName`). Both use a **30s** revalidate window with `export const revalidate = 30` on the page.

## Project layout (high level)

```
app/
  (app)/           # Authenticated shell: dashboard, users, user [id]
  (auth)/login/    # Login (server shell + LoginFormGate / LoginFormFields)
  api/auth/        # login, logout, session
  components/      # UI, layout, tables, forms
  context/         # Theme provider
  lib/             # hooks, validation, upstream helpers, metadata defaults
proxy.ts           # Auth gate (Next.js proxy convention)
```

## Troubleshooting

- **`API_BASE_URL` errors on `npm run build`** — define `API_BASE_URL` in `.env.local` (or the environment running the build).
- **Stale TypeScript errors after big file moves** — run `rm -rf .next && npm run build`.

## Course / submission notes (optional)

If this repo is used for coursework: run **`npm run lighthouse:ci`** when a server is available; reports land in **`lighthouse-reports/`**. Use **`summary.json`** for Web Vitals–style metrics and the SEO category alongside your own checklist.

## License

Private coursework / internal use (`"private": true` in `package.json`).
