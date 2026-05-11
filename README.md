# User Dashboard

A Next.js dashboard for exploring **users**, **products**, and a **metrics overview**, with **DummyJSON** as the upstream API and a **cookie-based auth** layer. Built for coursework (day-wise tasks), reusable tables/lists, forms, accessibility, SEO, and a responsive app shell.

## Features

### Application

- **Authentication** — Sign in with a DummyJSON **username/password** (`POST /api/auth/login`). Session JWT is stored in an **httpOnly** cookie; **`/api/auth/session`** proxies **`/auth/me`**; **`/api/auth/logout`** clears the cookie.
- **Route protection** — Root **`middleware.ts`** redirects anonymous users to **`/login`** and keeps authenticated users out of login when appropriate. Expired JWTs are detected via payload **`exp`** (hint only); invalid sessions are cleared via the session route.
- **Dashboard** — Server-rendered overview (totals, activity) with suspense fallback.
- **Users** — Search, role/status filters, sort, pagination (desktop **table**, mobile **list**), profile detail with optional **`next/image`** avatar when the API supplies a URL.
- **Products** — Search, category filter, sort, pagination, product detail with optimized hero **`next:image`** (`sizes`, **`priority`** where appropriate).
- **Layout** — Responsive **sidebar** (collapsible desktop, drawer on small screens), **header** with session bar and theme picker, skip link, **`global-error`** boundary.

### Engineering

- **Server Components by default** — Route **`page.tsx`** files stay on the server; interactivity lives in **client islands** (`*PageClient`, **`AppLayoutClient`**, forms, tables, theme).
- **`next/font`** — Inter + JetBrains Mono (CSS variables wired to Tailwind tokens).
- **Web Vitals (dev)** — Optional logging via **`WebVitalsReporter`** (`useReportWebVitals`).
- **SEO** — **`metadata`** per route; **`robots.ts`**, **`sitemap.ts`**; Open Graph / Twitter images use **`alt`** text; canonical URLs where configured.
- **Security headers** — `X-Frame-Options`, `X-Content-Type-Options` via **`next.config.ts`**.

## Stack

| Area        | Choice                          |
| ----------- | ------------------------------- |
| Framework   | Next.js **16** (App Router)     |
| UI          | React **19**, TypeScript        |
| Styling     | Tailwind CSS **v4**             |
| Forms       | React Hook Form + **Zod**       |
| Data (demo) | **DummyJSON** (`API_BASE_URL`)  |

## Requirements

- **Node.js** 20+ recommended (matches toolchain in `package.json`).

## Environment

Create **`.env.local`** (see project root):

| Variable                 | Purpose |
| ------------------------ | ------- |
| `API_BASE_URL`           | DummyJSON-compatible API origin (no trailing slash). **Required for `npm run build` in production** (`next.config.ts` enforces this). |
| `NEXT_PUBLIC_SITE_URL`   | Optional. Canonical site URL for **metadataBase**, sitemap, and robots (`https://your-domain.example` in production). |

Example:

```bash
API_BASE_URL=https://dummyjson.com
NEXT_PUBLIC_SITE_URL=https://user-dashboard.local
```

DummyJSON demo account (docs): **`emilys`** / **`emilyspass`**.

## Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build (needs API_BASE_URL in prod)
npm run start        # Serve production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## API & data flow

1. **`/api/auth/*`** — Implemented as **App Router Route Handlers** under `app/api/auth/` (cookie, login, logout, session). These **must not** rely on blindly proxying upstream auth if you customize paths.
2. **Other `/api/...`** — `next.config.ts` **rewrites** `/api/:path*` → `{API_BASE_URL}/:path*`. Browser `fetch('/api/products/…')`-style calls hit DummyJSON via that rewrite. Prefer adding **`app/api/.../route.ts`** whenever a path must stay on Next (same origin, cookies, custom logic).

Server-side loaders use **`app/lib/server-upstream.ts`** to call `API_BASE_URL` directly (ISR/revalidate where set).

## Project structure (overview)

```
app/
  (app)/              # Main app routes: dashboard, users, products, day1–day8, testing
  (auth)/login/       # Login page (+ Suspense for search params)
  api/auth/           # Login, logout, session route handlers
  components/         # UI primitives, layout, tables, icons, feedback
  context/            # Theme
  lib/                # Hooks, validation, upstream helpers, auth helpers, metadata defaults
middleware.ts         # Auth redirects + JWT exp hint on cookie
```

## Contributing / coursework notes

- **Server vs client** — `app/(app)/layout.tsx` documents how **`AppLayoutClient`** wraps server `children`.
- **Images** — Use **`remotePatterns`** in `next.config.ts` when adding image hosts (`cdn.dummyjson.com`, etc.).

## License

Private coursework / internal use (`"private": true` in `package.json`).
