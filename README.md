# ella Jewelry — Monorepo

A Supabase-backed marketing site for a fine-jewelry showroom, plus a private
admin dashboard to manage its content. Two independently deployable Next.js apps
sharing one Supabase backend, brand design system, and types.

```
apps/
  web/        Public website  — Home, Collections, About, Contact, Reviews (read-only)
  admin/      Admin dashboard — login + manage Products, Categories, Reviews, Messages
packages/
  supabase/         @repo/supabase       — Supabase clients, types, query helpers
  tailwind-config/  @repo/tailwind-config — shared ella brand Tailwind preset
supabase/
  migrations/0001_init.sql   schema + RLS + storage buckets/policies
  seed.sql                   optional sample data
```

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · Supabase
  (Postgres + Storage + Auth) · Turborepo.
- **Public site** reads only *published* products/reviews via the public
  (publishable) key, protected by Row Level Security.
- **Admin** writes go through a logged-in session + `authenticated` RLS policies.

---

## 1. Prerequisites

- Node.js 18+ and npm 10+
- A Supabase project (already provisioned for this build)

## 2. Install

```bash
npm install        # from the repo root — installs all workspaces
```

## 3. Configure Supabase (one-time)

In the **Supabase Dashboard**:

1. **SQL Editor → New query** → paste & run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   This creates the tables, Row Level Security policies, and the two public
   Storage buckets (`product-images`, `review-avatars`).
2. *(Optional)* Run [`supabase/seed.sql`](supabase/seed.sql) to populate sample
   categories, products and reviews so the site isn't empty.
3. **Authentication → Users → Add user** → create the shop owner's account
   (email + password). There is **no public sign-up** — this is the only way to
   create a dashboard login.

## 4. Environment variables

Each app reads two public variables. Copy the examples (already filled in for
this project's `.env.local` files):

```
NEXT_PUBLIC_SUPABASE_URL=https://icgptwqdrexxsxzakspq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- `apps/web/.env.local` and `apps/admin/.env.local` (git-ignored).
- The `sb_publishable_…` key is **public-safe** (RLS-protected) — never add a
  Supabase `service_role`/secret key here or to any `NEXT_PUBLIC_` variable.

## 5. Run locally

```bash
npm run dev          # both apps via Turborepo
# or individually:
npm run dev:web      # http://localhost:3000
npm run dev:admin    # http://localhost:3001
```

Sign in to the dashboard at `http://localhost:3001/login` with the user you
created in step 3.

## 6. Build

```bash
npm run build        # builds web + admin
```

---

## Deploying to Vercel (two projects, one repo)

Create **two** Vercel projects pointing at this same repository:

| Project | Root Directory | URL |
| ------- | -------------- | --- |
| Public site | `apps/web`   | e.g. `ellajewelry.com` |
| Admin       | `apps/admin` | e.g. `admin.ellajewelry.com` |

For each project:

- Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables.
- Vercel auto-detects Next.js + the Turborepo workspace; no extra config needed.
- In **Supabase → Authentication → URL Configuration**, add the admin project's
  production URL to the allowed redirect/site URLs.

---

## How the owner manages content

All from the **admin dashboard** (`/login`):

- **Products** — add a piece with an image, optional price (leave blank to hide
  it), category, and a *Featured* toggle (featured items show on the homepage).
  *Published* toggle controls visibility on the site.
- **Categories** — add / rename / reorder / delete collections; these become the
  filter tabs on the public Collections page automatically.
- **Reviews** — add customer testimonials (name, rating, text, optional photo)
  shown on the homepage.
- **Messages** — read enquiries submitted through the website's Contact form.

The public site re-reads Supabase on every request, so changes appear
immediately — no redeploy required.

## Customizing

- **Brand colors / fonts** — `packages/tailwind-config/index.js` (shared by both apps).
- **Price currency** — `apps/web/src/lib/format.ts` and `apps/admin/src/lib/format.ts`
  (`CURRENCY_SYMBOL`, default `₹`).
- **Static copy** (About page, contact details, hero) — in `apps/web/src`.
# GUHAS-JEWEL-WEB
