# MistriHub Market

Modern Next.js frontend for a hyperlocal India marketplace covering workers, buy/sell listings, urgent jobs, local places, offers, trust scores, dashboards, and admin management.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful Commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Structure

- `app/` - App Router pages and route-level layouts.
- `app/api/` - Supabase-backed API route handlers for profiles, workers, listings, businesses, reviews, reports, notifications, referrals, trust score, and admin.
- `components/` - Reusable UI and feature components.
- `components/auth/` - Client-side authentication components.
- `lib/auth/` - Role-based access helpers and server session utilities.
- `lib/api/` - API auth and response helpers.
- `lib/supabase/` - Supabase clients, env helpers, and database types.
- `lib/firebase/` - Lightweight Firebase Cloud Messaging client bootstrap.
- `components/radar/` - Live worker radar map, instant booking UI, and worker online/offline controls.
- `lib/data.ts` - Typed demo data for workers, products, businesses, reviews, categories, and feeds.
- `lib/business-selectors.ts` - Reusable business filtering helpers for homepage and nearby places.
- `app/globals.css` - Tailwind base styles, shared shell classes, and animations.
- `supabase/schema.sql` - Production database schema, RLS policies, auth trigger, and admin audit structure.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
5. Restart the Next.js server.

## Live Worker Radar MVP

- `/radar` shows a mobile-first OpenStreetMap + Leaflet worker radar.
- Workers can go online/offline from `/dashboard`.
- Live location updates are designed for 30-second intervals to keep server cost low.
- Booking APIs are scaffolded under `/api/radar/*`.
- Firebase Cloud Messaging env vars are optional until push credentials are configured.
