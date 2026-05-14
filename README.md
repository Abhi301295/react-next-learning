# User Management Dashboard

A **Next.js 16** (App Router) **user management** app with **Tailwind CSS v4** theming (light/dark), a **REST user directory** upstream, **cookie-based auth**, and routes focused on **login**, **dashboard**, and **users** (list, search with debounce, status filter, pagination, add/edit flows, and dynamic user detail).

## Features (rubric)

| Area | Implementation |
|------|----------------|
| **Login** | `app/(auth)/login/` — React Hook Form + Zod, `POST /api/auth/login`, httpOnly session cookie |
| **Dashboard** | Server-rendered KPI cards + recent activity (`app/lib/dashboard/server.ts`, `revalidate: 60`) |
| **User list** | Responsive table (desktop) + list (mobile), `ConfigurableTable` / `UsersPageClient` |
| **Search** | Debounced name/email search via `useTableControls` / `useListControls` |
| **Filter** | Status filter |
| **Pagination** | Table pagination controls |
| **Add / edit user** | `UserForm` in `UsersFormDialog` (modal); `POST`/`PUT` `app/api/user-mutations` → upstream; listing merges via `useUsers` |
| **User detail** | Dynamic `app/(app)/users/[id]/` with `generateMetadata` |
| **API** | Route handlers under `app/api/auth/`; other reads use `API_BASE_URL` (`app/lib/server-upstream.ts`) and `next.config` rewrites for `/api/*` |
| **States** | Loading UI, error/empty components, `not-found`, `error.tsx`, `global-error.tsx` |
| **Tailwind theme** | CSS variables + `@theme` in `app/globals.css` — primary/secondary, surfaces, radius, shadow, typography tokens; dark via `.dark` |
| **Performance** | `next/image` where avatars apply; dynamic import for post-login handoff overlay; `optimizePackageImports`; dashboard snapshot uses a **single** upstream `users` request; login form is in the main bundle so LCP is not blocked by a lazy chunk |
| **Web Vitals** | Dev logging: `WebVitalsReporter` + `useReportWebVitals`. Lab: `npm run lighthouse:ci` (writes `lighthouse-reports/`) |
| **SEO** | Root + per-route `metadata` (title, description, canonical, Open Graph, Twitter); `robots.ts`, `sitemap.ts`; semantic sections and one **h1** per page pattern |

## Stack

- **Next.js** 16 · **React** 19 · **TypeScript**
- **Tailwind** 4 (`@import "tailwindcss"`, `@theme inline`)
- **react-hook-form** + **Zod** + **@hookform/resolvers**

## Troubleshooting

- If TypeScript reports missing modules under `app/(app)/day*` or `products` after you remove routes locally, delete the Next cache and rebuild: `rm -rf .next && npm run build`.

## Environment

Create **`.env.local`** at the project root:

| Variable | Purpose |
|----------|---------|
| `API_BASE_URL` | Origin of the user directory HTTP API (no trailing slash). Must match the API your deployment uses. **Required for production builds** (`next.config.ts`). |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for `metadataBase`, canonical URLs, sitemap, and robots (e.g. `https://your-app.vercel.app`). |

Example:

```bash
API_BASE_URL=https://example.com
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

For local development you can point `API_BASE_URL` at any compatible JSON user service (see `app/lib/upstream/users-payload.ts` for the expected list shape). A sample public endpoint is often used in `.env.example`; use credentials from that service’s documentation.

## Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Serve production build
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm run health           # typecheck + lint + build
npm run lighthouse:audit # Lighthouse JSON + summary (needs running server on LH_PORT)
npm run lighthouse:ci    # build, start server, audit core routes → lighthouse-reports/
npm run perf:bundle-stats # After build: print per-route JS from .next diagnostics
```

## Deploy (Vercel)

### Option A — Dashboard (recommended)

1. Commit and push this repo to **GitHub**, **GitLab**, or **Bitbucket**.
2. In [Vercel](https://vercel.com) → **Add New** → **Project** → import the repository. Vercel auto-detects **Next.js**; leave defaults unless you use a monorepo root.
3. Under **Environment Variables**, add for **Production** (and **Preview** if previews should call a real API):

   | Name | Example value |
   |------|----------------|
   | `API_BASE_URL` | Your user API origin, e.g. `https://api.yourcompany.com` |
   | `NEXT_PUBLIC_SITE_URL` | Your Vercel URL, e.g. `https://user-dashboard-xxx.vercel.app` (use the real deployment URL so metadata, sitemap, and robots stay correct) |

4. Click **Deploy**. When the build finishes, open the deployment URL, sign in at **`/login`** with credentials from your upstream, then confirm **`/dashboard`**, **`/users`**, and a user detail page load.

If you add a custom domain later, update **`NEXT_PUBLIC_SITE_URL`** to that domain and trigger **Redeploy**.

### Option B — Vercel CLI (from your laptop)

```bash
cd /path/to/user-dashboard
npm exec vercel@latest login    # browser / device flow once
npm exec vercel@latest --prod   # follow prompts; link env vars in the dashboard to match Option A
```

`npm run build` already passes with **`API_BASE_URL`** set (required in production per `next.config.ts`).

## Project layout (high level)

```
app/
  (app)/           # Authenticated shell: dashboard, users, user [id]
  (auth)/login/    # Login (post-submit handoff overlay lazy-loaded)
  api/auth/        # login, logout, session
  components/      # UI, layout, tables, forms
  context/         # Theme provider
  lib/             # hooks, validation, upstream helpers, metadata defaults
proxy.ts           # Auth redirects, JWT exp hint on cookie (Next.js proxy convention)
```

## Submission checklists (mark in your report)

After `npm run lighthouse:ci`, set **Yes** where the lab numbers meet your course thresholds. **Web Vitals:** LCP, CLS, INP, FCP, TTFB appear in Lighthouse JSON (`audits` keys) and in `lighthouse-reports/summary.json`. **SEO:** titles, descriptions, OG/Twitter, canonicals, and dynamic user metadata are implemented in code — confirm scores in the same Lighthouse run. **Tailwind:** see `app/globals.css` and shared components `Button`, `Input`, `Card`, `Badge`, `PanelCard`.

## License

Private coursework (`"private": true` in `package.json`).
