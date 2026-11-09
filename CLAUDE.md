# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Textile Trace LATAM's Digital Product Passport (DPP) front end — a Next.js 16 (App Router) site that displays a swipeable, localized product passport (supply chain, composition, certifications, environmental impact, garment care, material innovation, post-consumption plan, social impact) plus an admin form for creating passports. Statically exported and deployed to Cloudflare (see `wrangler.jsonc`).

## Commands

Package manager is **bun** (`bun.lock` is the lockfile — use `bun install`/`bun add`, not npm/yarn).

- `bun run dev` — start the dev server (Turbopack)
- `bun run build` — static export build (`next build`, `output: "export"` in `next.config.ts`; emits to `./out`)
- `bun run start` — serve the production build
- `bun run lint` — ESLint (flat config, `eslint-config-next`)

There is no test suite/framework configured in this repo.

## Architecture

### Routing & locale

All routes live under `app/[locale]/...` (next-intl, locales defined in `i18n.ts`: `en`/`es`, default `en`, prefix always present in URLs, e.g. `/en/...`). Every `page.tsx` under `[locale]` must call `setRequestLocale(params.locale)` and export `generateStaticParams()` returning `locales.map(locale => ({ locale }))` — this is required for the static export build. Use `Link`/`useRouter`/`usePathname` from `navigation.ts` (a `next-intl` wrapper), not `next/navigation`, whenever locale-aware routing is needed.

Translation strings live in `messages/en.json` and `messages/es.json`, loaded via `i18n/request.ts`.

### The page-swiper pattern (important, non-obvious)

The product passport pages are NOT independent routes rendered on navigation — they are all mounted simultaneously inside a single horizontal Embla carousel (`app/components/PageSwiper.tsx`), and swiping/URL navigation are kept in sync:

- `app/pages.ts` is the registry of swipeable pages (`pages: PageDef[]`), each with a `slug`, `name`, and `content` component. **Adding a new product-detail page means adding it to this array**, not just creating a route.
- Each real route's `page.tsx` (e.g. `app/[locale]/product-details/supply-chain/page.tsx`) is a thin static-param wrapper that renders `<PageSwiper initialSlide={N} />`, where `N` is the page's index in the `pages` array.
- `PageSwiper` renders every page's `content` component side-by-side in the carousel and pushes a route change (`pagePath(id, page)`) when the user swipes to a different slide, using `slugFromPathname`/`pagePath` from `pages.ts` to keep the URL's slug and query `id` in sync with the active slide.
- The actual UI for the a given passport section lives in a `*Content.tsx` component (e.g. `SupplyChainContent.tsx`) colocated with its `page.tsx`, and is also the component registered in `app/pages.ts`.

### Data fetching

There is no shared API client — every data hook independently `fetch()`s `${appConfig.ttlApiHost}/api/v1/...` in a `useEffect` and stores the result in local state (see `app/hooks/use*.ts`, e.g. `useSupplyChain.ts`). `appConfig.ttlApiHost` (`app/config.tsx`) comes from `NEXT_PUBLIC_TTL_API_HOST`, defaulting to `http://localhost:9090` locally and set to `https://apidev.textiletracelatam.com` in `wrangler.jsonc` for the deployed build.

The current product id is read from the `?id=` query param via `useProductId()` (`app/hooks/useProductId.ts`), not from a route param — this is what lets `PageSwiper` preserve the product id across slides.

`app/context/ProductContext.tsx` fetches the top-level `Product` (name, images, list of `ProductDetail` cards with completion/impact metadata) and exposes it via `useProduct()`; each detail page additionally has its own dedicated hook (`useComposition`, `useCertifications`, etc.) for that section's full data.

### Component conventions

- Client components that use hooks, state, or browser APIs are marked `"use client"` (most of `app/components` and `app/hooks`); `page.tsx` files stay server components so `generateStaticParams`/`setRequestLocale` work.
- Detail pages wrap their content in `DetailPageLayout` (`app/components/DetailPageLayout.tsx`) for the consistent back-button + title header.
- Map rendering (`app/components/SupplyChainMap.tsx`, Leaflet-based) is loaded via `next/dynamic` with `ssr: false` since Leaflet requires `window`.
- Path alias `@/*` maps to the repo root (see `tsconfig.json`).
