# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Turborepo monorepo for **ella**, a fine-jewelry showroom. Two independently
deployable Next.js 14 (App Router, TS) apps share one Supabase backend, a brand
design system, and TypeScript types:

- `apps/web` — public marketing site (Home, Collections, About, Contact, Reviews). **Read-only** content showcase, no e-commerce/cart.
- `apps/admin` — private, login-gated dashboard to manage Products, Categories, Reviews and contact Messages.
- `packages/supabase` (`@repo/supabase`) — Supabase clients, hand-written types, and query helpers.
- `packages/tailwind-config` (`@repo/tailwind-config`) — shared ella Tailwind brand preset.
- `supabase/` — `migrations/0001_init.sql` (schema + RLS + storage buckets) and `seed.sql`.

## Commands

Run from the repo root unless noted. npm workspaces + Turborepo.

```bash
npm install              # install all workspaces
npm run dev              # both apps (web → :3000, admin → :3001)
npm run dev:web          # web only
npm run dev:admin        # admin only
npm run build            # build both apps (turbo)
npm run lint             # lint both apps
```

Per-app (e.g. faster single-app build/typecheck):

```bash
cd apps/web   && npm run build      # `next build` also runs `tsc` typecheck
cd apps/admin && npx tsc --noEmit   # typecheck only
```

There is no test suite. "Verification" = `npm run build` for the affected app(s)
(it typechecks) plus a runtime check of the relevant routes.

## Data flow & the `@repo/supabase` package

Pick the entrypoint by context — this is the most important convention:

- `@repo/supabase` (index) → `types.ts` + `queries.ts`. **Public site reads.**
  `queries.ts` (`getCategories`, `getPublishedProducts`, `getFeaturedProducts`,
  `getNewArrivals`, `getPublishedReviews`) internally use `public.ts`, an
  anonymous client (publishable key, no cookies). RLS limits anon to *published*
  rows. Queries **swallow errors and return `[]`**, so the site renders empty
  states instead of crashing when the DB/tables are absent.
- `@repo/supabase/server` → cookie-bound server client. **Admin** Server
  Components / Server Actions; respects the logged-in session (RLS `authenticated`).
- `@repo/supabase/client` → browser client. Used only for `signInWithPassword`
  (login) and `signOut`.
- `@repo/supabase/middleware` → `updateSession()`; the admin `middleware.ts`
  uses it to refresh tokens and gate routes. **It must live at
  `apps/admin/src/middleware.ts`** (this app uses the `src/` dir, so Next.js
  ignores a root-level `middleware.ts` — putting it at the root silently
  disables the auth gate *and* session refresh). `updateSession()` also
  forwards the validated email via the `x-user-email` request header so the
  dashboard layout can render the signed-in user without a second `getUser()`.

The Supabase client is **untyped** (no generated `Database` generic); query
results are cast to the hand-written types in `packages/supabase/src/types.ts`.
Keep those types in sync with `supabase/migrations/*.sql` by hand.

## apps/web (public site)

- Shared chrome (`AnnouncementBar`, `Header`, `Footer`) lives in
  `src/app/layout.tsx`; pages render only their own sections.
- Homepage (`src/app/page.tsx`) and `/products` are `export const dynamic = "force-dynamic"`
  so content reflects Supabase on every request (no redeploy needed after admin edits).
  About/Contact are static.
- Product sections **hide themselves when their data array is empty**
  (`ProductSection` returns `null`; `TopProducts` too). Don't assume data exists.
- Contact form posts to a Server Action (`src/app/contact/actions.ts`) that inserts
  into `contact_messages` via the anon client (RLS allows anon INSERT only).
- Static marketing data (`navLinks`, `footerColumns`, `promos`) is in `src/lib/data.ts`.
  Product/Review/Category types come from `@repo/supabase`, not here.

## apps/admin (dashboard)

- **Auth is double-guarded**: `src/middleware.ts` runs the authoritative
  `getUser()` and redirects unauthenticated requests to `/login`; the
  `(dashboard)/layout.tsx` server component then reads the middleware-set
  `x-user-email` header (no extra `getUser()` round-trip) and redirects to
  `/login` if it is absent. Invite-only — there is no signup UI; admin users
  are created in Supabase Auth.
- All mutations are **Server Actions** colocated as `actions.ts` next to each
  route group (`products/`, `categories/`, `reviews/`, `messages/`), using the
  server client. Forms call them directly via `<form action={serverAction}>`.
- **Image upload** happens inside the create/update Server Actions: read the
  `File` from `FormData` → `Buffer.from(await file.arrayBuffer())` →
  `storage.from(bucket).upload(...)` → save the public URL + storage path. On
  update/delete, the old object is removed via the stored `image_path`. Buckets:
  `product-images`, `review-avatars` (constants exported from `@repo/supabase`).
- `next/font` (Lato + Libre Baskerville) is declared per-app in each `layout.tsx`
  — keep it there, not in a shared package.

## Supabase schema & RLS model

- Tables: `categories`, `products`, `reviews`, `contact_messages`. `products.price`
  is **nullable** (optional price → shown as "Price on request"); `is_featured`
  drives homepage sections; `is_published` controls public visibility.
- RLS roles: **anon** = the public site (publishable key); **authenticated** = a
  logged-in admin. Policy shape: anon SELECT on published rows; authenticated
  ALL; `contact_messages` allows anon INSERT but no anon SELECT.
- **No Supabase MCP / CLI link in this repo.** Schema changes = edit
  `supabase/migrations/*.sql` and run it in the Supabase SQL Editor, or via the
  Management API (`POST https://api.supabase.com/v1/projects/{ref}/database/query`
  with an `sbp_` personal access token — the publishable and `service_role` keys
  **cannot** run DDL).

## Monorepo conventions / gotchas

- Path alias `@/*` → `./src/*` is **per app**. Cross-package imports use the
  workspace name (`@repo/supabase`, `@repo/tailwind-config`).
- Each app's `next.config.mjs` must keep `transpilePackages: ["@repo/supabase"]`
  and `images.remotePatterns` for the Supabase Storage hostname
  (`*.supabase.co/storage/v1/object/public/**`). Add new image hosts there.
- The Tailwind preset is **CommonJS** (`packages/tailwind-config/index.js` +
  `index.d.ts`); apps consume it via `presets: [preset]`. Brand tokens
  (`burgundy`, `cream`, `ink`, `muted`) and fonts live only there.
- Cookie handlers in `@repo/supabase/{server,middleware}.ts` annotate
  `cookiesToSet` with an explicit `CookieToSet` type — required under the apps'
  strict tsconfig (implicit-any otherwise).
- Price currency is a one-line constant: `CURRENCY_SYMBOL` in
  `apps/web/src/lib/format.ts` and `apps/admin/src/lib/format.ts` (default `₹`).
- Env: each app needs `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`). The publishable
  key is public/RLS-safe; never add a `service_role`/secret key to any app or
  `NEXT_PUBLIC_` var.

## Deployment

Two Vercel projects from this one repo, with Root Directory set to `apps/web`
and `apps/admin` respectively; each gets the two `NEXT_PUBLIC_SUPABASE_*` vars.
See `README.md` for the full first-time Supabase setup checklist.
