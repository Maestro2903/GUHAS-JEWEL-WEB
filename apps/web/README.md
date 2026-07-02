# ella — Fine Jewelry Storefront

A pixel-faithful, fully responsive build of the **ella** jewelry store homepage,
translated from the Figma design into a production-ready Next.js app.

> Figma source: *jewelry-store-ELLA* · Static / visual homepage (no backend).

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS 3** with a custom theme (brand tokens below)
- **next/font** — `Lato` (body/UI) + `Libre Baskerville` (serif display)
- Inline SVG icon set (no icon dependency)

## Design tokens (from Figma)

| Token            | Value     | Usage                                   |
| ---------------- | --------- | --------------------------------------- |
| `burgundy`       | `#9c1137` | Brand color — bars, buttons, headings   |
| `cream`          | `#f6f3ee` | Alternating section bands / cards        |
| `ink`            | `#383434` | Body & product text                      |
| `muted`          | `#958f86` | Secondary text, strikethrough prices     |
| Display font     | Baskerville → `Libre Baskerville` | Headings        |
| Body font        | `Lato`    | Everything else                          |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Sections (top → bottom)

Announcement bar → Header (logo, search, nav, account/wishlist/cart) → Hero
"Milancélos" → Top Product (category tabs) → New Arrivals → Promo banners
(Birthday / Summer) → Featured Products → Must Have (18k Gold Bracelets) +
trust badges → Image Gallery → Newsletter → Footer.

## Project structure

```
src/
  app/
    layout.tsx        # fonts + metadata
    page.tsx          # composes all sections
    globals.css       # Tailwind layers + component classes
  components/         # one file per section + shared UI
  lib/data.ts         # products, nav, footer content
public/images/        # photography exported from the Figma file
```

Content (products, prices, copy) lives in `src/lib/data.ts` — edit there to
restyle the catalog without touching markup.

## Notes

- This is a **visual / static** build: buttons, search, cart and newsletter are
  styled and interactive where it makes sense (tabs, mobile menu, hover states)
  but are not wired to a backend.
- Imagery is exported directly from the Figma file into `public/images/`.
