# User Dashboard

Next.js App Router project used for day-wise frontend tasks, reusable UI primitives, configurable tables, forms, and theme management.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- React Hook Form + Zod

## Project Structure

- `app/(app)` - authenticated/main task routes (`day1` to `day8`, `dashboard`, `testing`)
- `app/(auth)` - auth route group (`/login`)
- `app/components` - UI primitives, shared components, layout, and feature-level components
- `app/lib` - hooks, config, utilities, and validation schemas
- `app/context` - app-wide React contexts (theme)

## Theme System

- Theme mode is managed by `app/context/theme-context.tsx` (`light`, `dark`, `system`).
- Root initialization script runs in `app/layout.tsx` before hydration to avoid flashes/mismatches.
- Shared tokens are defined in `app/globals.css` and consumed through utility classes (`bg-panel`, `border-stroke`, `text-subtle`).

## API Routing

- Browser calls use `/api/*`.
- `next.config.ts` rewrites `/api/:path*` to `API_BASE_URL/:path*`.
- Set `API_BASE_URL` in environment variables. In local development, fallback is `http://localhost:3001`.

## SEO

- Global metadata is in `app/layout.tsx`.
- Route-level metadata lives in each route `page.tsx`.
- Crawl metadata routes:
  - `app/robots.ts`
  - `app/sitemap.ts`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
