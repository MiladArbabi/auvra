# Auvra Storefront – Technical Handbook (README)

> Headless Shopify + Next.js storefront for Auvra (beauty & skincare). This doc explains the stack, environment, analytics/SEO, markets/payments, redirects, experiments, deployment, and troubleshooting.

---

## 1) Architecture Overview

* **Framework:** Next.js (App Router)
* **Hosting/CDN:** Vercel (Edge + Functions)
* **E‑commerce backend:** Shopify Storefront API
* **Styling:** TailwindCSS
* **Analytics & Consent:** GA4 (Consent Mode v2), GSC, Meta Pixel, TikTok Pixel via a lightweight CMP
* **A/B testing:** Cookie-based assignment in `src/middleware.ts` + client gates
* **i18n:** `/en`, `/sv` routes, `hreflang` alternates
* **SEO primitives:** sitemap, robots, JSON‑LD, canonical/alternates

```
./src
  app/                    # App Router pages & API routes
  components/             # UI + analytics/consent utilities
  lib/                    # Shopify, market/currency, analytics helpers
  messages/               # i18n message bundles (en, sv)
  middleware.ts           # Redirects, domain aliases, AB assignment
```

---

## 2) Local Development

```bash
npm i
npm run dev   # http://localhost:3000
```

### Required env (local: `.env.local`, prod: Vercel env)

```ini
# Shopify Storefront
SHOPIFY_STORE_DOMAIN=1k1wkr-tt.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<public_storefront_token>
# Optional Private token (prefer public in dev; see shopify.js)
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=
SHOPIFY_API_VERSION=2025-07

# Admin token (future sync worker)
SHOPIFY_ADMIN_ACCESS_TOKEN=

# Public analytics (safe to expose via NEXT_PUBLIC_*)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=

# Site
NEXT_PUBLIC_SITE_URL=https://auvra.shop
```

> **Secrets:** never commit real tokens. Use `vercel env add` to set Production/Preview/Development values.

---

## 3) Shopify Integration

### 3.1 `src/lib/shopify.js`

* Picks headers based on available token.
* In **dev**, prefers **PUBLIC** Storefront token to avoid misuse of Admin/private tokens.
* Endpoint: `https://<SHOPIFY_STORE_DOMAIN>/api/<API_VERSION>/graphql.json`.
* Throws on non‑200 or GraphQL errors with helpful messages.

### 3.2 Product Page (PDP)

* Route: `/[locale]/product/[handle]`
* Query: `ProductByHandle` with `@inContext(country, language)`
* Currency/formatting via `src/lib/market.js` (`localeTag`, `currencyForCountry`, `formatMoney`).
* VAT note and shipping note via `VatNote`.
* **Checkout:** Currently use Shopify’s hosted checkout via the standard Server Action `checkout` (and you removed the experimental `/api/checkout`).

### 3.3 Markets, VAT, Shipping (SE)

* **Primary market:** Sweden
* **Taxes:** “Include tax in prices” (ON), VAT number present.
* **Shipping (SE):** Standard 49 kr; Free ≥ 499 kr.
* `MARKET.SE` defines `SEK`, threshold, and standard rate for UI messaging.

> Test cards: `4242 4242 4242 4242` succeeds in Test Mode; `4000 0000 0000 0002` is a deliberate decline.

---

## 4) International Domains & Redirects

### 4.1 Vercel Aliases & Certs

* All aliases (`auvra.se`, `auvra.online`, `auvra.info`, `www.*`) point to the current deployment; certs issued.

### 4.2 Redirect Rules (in `src/middleware.ts`)

* `www.auvra.shop → https://auvra.shop/:path*` (**308**)
* `auvra.se` / `www.auvra.se` → `https://auvra.shop/sv/:path*` (**308**)
* `auvra.online` / `auvra.info` (and `www.*`) → `https://auvra.shop/:path*` (**308**)
* `.se` *keeps* `/sitemap.xml` and `/robots.txt` at root **on canonical** (handled by middleware/Next routes as appropriate).

> Confirmed via `curl -sI` tests; all return **308** with expected `Location` headers.

---

## 5) SEO & Indexation

* **Sitemap:** `/sitemap.xml` (200) – submitted in GSC and accepted.
* **Robots:** `/robots.txt` (200).
* **Verification:** `meta name="google-site-verification"` emitted from `app/layout.js` `metadata.other`.
* **Alternates:** `hreflang` links for `en` and `sv` present on top pages.
* **Structured data:** Product JSON‑LD on PDP via `<script type="application/ld+json">`.
* **No `noindex`:** Headers and meta robots are clean (verified with curl/grep).

> After submitting the sitemap, indexing may take time. Use GSC “URL inspection → Request indexing” for key pages.

---

## 6) Consent, Analytics & Pixels

### 6.1 CMP

* Consent state stored in our lightweight context.
* Dispatches a custom `consentchange` event that `AnalyticsLoader` listens to.

### 6.2 GA4 (Consent Mode v2)

* **Defaults:** Denied for ad & analytics storage until user grants.
* On grant, `AnalyticsLoader` calls `gtag('consent','update',…)` accordingly.
* Pageviews are sent manually on route changes (`send_page_view: false`).
* **Events instrumented:** `begin_checkout`, `purchase` (via `/api/ga/purchase`), `scroll`, `session_start`, `user_engagement`, plus standard page\_view.

### 6.3 Meta Pixel / TikTok Pixel

* Loaded **only** if Marketing consent granted **and** the pixel IDs are present.
* TikTok warnings about invalid IDs will surface in console if ID is wrong.
* Shop‑thank‑you conversion should be set up via **Shopify Customer Events** (recommended) rather than hard‑wiring to templates.

### 6.4 Quick Tests

* Console: `!!window.gtag, !!window.fbq, !!window.ttq` should show `true` only after consent.
* Network: look for GA `collect` requests with `tid=G-…`.
* Realtime (GA4): verify `page_view` & `begin_checkout` after consenting.

---

## 7) Experiments (A/B)

* Assignment in `src/middleware.ts` using Edge‑safe random/VUID + SHA‑1 hashing → stable variant per experiment key.
* Cookies set: `vuid` and `exp_<key>` (A|B).
* Dev override: query string `?exp_plp_filters=A|B` (non‑production only).
* `ExperimentGate` component reads cookies client‑side to conditionally render.

---

## 8) Deployment (Vercel)

### 8.1 Pipelines

* **Preview:** every PR gets a preview deployment.
* **Production:** `vercel --prod` from `main`.

### 8.2 Common Commands

```bash
# Env vars
vercel env ls
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID
vercel env rm NEXT_PUBLIC_TIKTOK_PIXEL_ID

# Aliases, certs
vercel alias ls
vercel certs ls

# Deploy
vercel --prod
```

### 8.3 Smoke Tests

```bash
# Redirects
curl -sI https://auvra.se            | egrep -i '^(HTTP/|location:)'
curl -sI https://www.auvra.online/x  | egrep -i '^(HTTP/|location:)'

# SEO
curl -sI https://auvra.shop/sitemap.xml | egrep -i '^(HTTP/|content-type:)'
curl -sI https://auvra.shop/robots.txt  | egrep -i '^(HTTP/|content-type:)'

# GA tag rendered (after consent)
# (use browser DevTools → Network → filter for `collect` or `gtag/js`)
```

---

## 9) CLI Cheat‑Sheet (terms)

* **PDP** – Product Detail Page
* **PLP** – Product Listing Page
* **CTA** – Call To Action
* **GA4** – Google Analytics 4
* **GSC** – Google Search Console
* **CMP/TCF** – Consent Management Platform / IAB framework
* **JSON‑LD** – SEO structured data format
* **LCP/CLS/INP** – Core Web Vitals
* **i18n/hreflang** – Internationalization / language hints
* **3DS** – 3‑D Secure (card auth)
* **GID** – Shopify GraphQL global ID

---

## 10) Roadmap (selected)

* **#23 Market rollout:** extend from SE → Nordics/EU; currencies, duties, shipping tables.
* **#22 Performance:** hit ≥90 CWV mobile (optimize images, fonts, JS).
* **#21 Lifecycle emails:** Welcome, Abandoned Cart, Post‑purchase (Klaviyo/Mailchimp).
* **#19 Ingredient glossary:** 12 entries (SV/EN) with SEO.
* **#18 Reviews/UGC:** integrate provider + schema markup.
* **#17 Faceted filters:** PLP filters + `exp_plp_filters` experiment.
* **#5 SEO primitives:** canonical, advanced JSON‑LD, breadcrumbs.

---

## 11) Troubleshooting

**Storefront 403/Forbidden**

* Check domain, API version, and token header type in `src/lib/shopify.js`.
* In dev, ensure **public** Storefront token is used (console logs indicate which header is active).

**TikTok “Invalid pixel ID”**

* Verify ID in Vercel env; reload after deploy.

**Shop Pay / Telemetry 401 or CORS warnings**

* Benign during Test Mode or when Shop Pay toggled; not a blocker for standard card tests.

**GSC “URL not on Google”**

* New site; submit sitemap and request indexing for key pages. Ensure no `noindex` and 200 status.

---

## 12) Contributing & Conventions

* **Branching:** `feature/<slug>` (use `dev/feature.sh` if helpful)
* **Commits:** Conventional style (`feat:`, `fix:`, `chore:`)
* **Lint:** ESLint + Next.js rules; exceptions documented inline (e.g., Meta Pixel `<noscript>` image)

Scripts:

```bash
node scripts/list-products.mjs     # quick Storefront sanity check
node scripts/list-collections.mjs
```

## Admin docs
- Affiliate products via External URL: docs/affiliate-metafields.md

---

## 13) License

Proprietary © Auvra. All rights reserved.