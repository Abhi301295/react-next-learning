# User Management Dashboard

A **Next.js 16** (App Router) **user management** app with **Tailwind CSS v4** theming (light/dark), **Firebase Auth** (email/password) + **Firestore** for stored users, **cookie-based session** auth, and routes focused on **login**, **dashboard**, and **users** (list, search with debounce, filters, pagination, add/edit flows, and dynamic user detail).

## Features (rubric)

| Area | Implementation |
|------|----------------|
| **Login** | `app/(auth)/login/` — React Hook Form + Zod, `POST /api/auth/login`, httpOnly session cookie |
| **Dashboard** | Server-rendered KPI cards + recent activity (`app/lib/dashboard/server.ts`, `revalidate: 60`) |
| **User list** | Responsive table (desktop) + list (mobile), `ConfigurableTable` / `UsersPageClient` |
| **Search** | Debounced query via `useTableControls` (table + mobile list) |
| **Filter** | Role and status filters |
| **Pagination** | Table pagination controls |
| **Add / edit user** | `UserForm` in `UsersFormDialog` (modal); `POST /api/users` and `PUT /api/users/[id]`; Firestore via `app/lib/users/user-repository.ts`; listing merges via `useUsers` |
| **User detail** | Dynamic `app/(app)/users/[id]/` with `generateMetadata` |
| **API** | Route handlers under `app/api/auth/` and `app/api/users/` (same-origin `/api/...`; browser code uses `app/lib/app-api.ts` helpers) |
| **States** | Loading UI, error/empty components, `not-found`, `error.tsx`, `global-error.tsx` |
| **Tailwind theme** | CSS variables + `@theme` in `app/globals.css` — primary/secondary, surfaces, radius, shadow, typography tokens; dark via `.dark` |
| **Performance** | `next/image` where avatars apply; dynamic import for post-login handoff overlay; `optimizePackageImports`; dashboard loads user data once server-side; login form stays in the main bundle so LCP is not blocked by a lazy chunk |
| **Web Vitals** | Dev logging: `WebVitalsReporter` + `useReportWebVitals`. Lab: `npm run lighthouse:ci` (writes `lighthouse-reports/`) |
| **SEO** | Root + per-route `metadata` (title, description, canonical, Open Graph, Twitter); `robots.ts`, `sitemap.ts`; semantic sections and one **h1** per page pattern |

## Stack

- **Next.js** 16 · **React** 19 · **TypeScript**
- **Tailwind** 4 (`@import "tailwindcss"`, `@theme inline`)
- **react-hook-form** + **Zod** + **@hookform/resolvers**

## Troubleshooting

- If the dev server shows stale routes or types after big refactors: `rm -rf .next && npm run dev`.

## Environment

Create **`.env.local`** at the project root. See **`.env.example`** for the full list. In short:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public site URL for metadata, sitemap, and robots. |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase **web** app config (client Auth SDK). |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Service account JSON (one line) for **firebase-admin** on the server (session cookies, Firestore from API routes). |

There is **no** `app/api/user-mutations/` route (and no separate “mutations” folder)—create/update/delete users are handled by **`app/api/users/route.ts`** and **`app/api/users/[id]/route.ts`**.

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
3. Under **Environment Variables**, add for **Production** (and **Preview** if needed), matching **`.env.example`**: all `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_SITE_URL` (your Vercel URL), and `FIREBASE_SERVICE_ACCOUNT_JSON` (mark as sensitive).

4. Click **Deploy**. When the build finishes, add the deployment host under **Firebase Console → Authentication → Authorized domains**.

5. Open the site, sign in at **`/login`**, then confirm **`/dashboard`**, **`/users`**, and a user detail page.

If you add a custom domain later, update **`NEXT_PUBLIC_SITE_URL`** to that domain and trigger **Redeploy**.

### Option B — Vercel CLI (from your laptop)

```bash
cd /path/to/user-dashboard
npm exec vercel@latest login    # browser / device flow once
npm exec vercel@latest --prod   # follow prompts; link env vars in the dashboard to match Option A
```

`npm run build` succeeds when env vars required by the app are set (see **`.env.example`**); `next.config.ts` does not require `API_BASE_URL`.

## Project layout (high level)

```
app/
  (app)/           # Authenticated shell: dashboard, users, user [id]
  (auth)/login/    # Login (post-submit handoff overlay lazy-loaded)
  api/auth/        # login, logout, session
  api/users/       # list (GET), create (POST); [id] = get / update / delete
  components/      # UI, layout, tables, forms
  context/         # Theme provider
  lib/             # hooks, validation, Firebase + user persistence helpers, metadata defaults
proxy.ts           # Auth redirects (Next.js proxy convention)
```

## Submission checklists (mark in your report)

After `npm run lighthouse:ci`, set **Yes** where the lab numbers meet your course thresholds. **Web Vitals:** LCP, CLS, INP, FCP, TTFB appear in Lighthouse JSON (`audits` keys) and in `lighthouse-reports/summary.json`. **SEO:** titles, descriptions, OG/Twitter, canonicals, and dynamic user metadata are implemented in code — confirm scores in the same Lighthouse run. **Tailwind:** see `app/globals.css` and shared components `Button`, `Input`, `Card`, `Badge`, `PanelCard`.

## License

Private coursework (`"private": true` in `package.json`).
