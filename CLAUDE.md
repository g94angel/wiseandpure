# Wise and Pure

## What This Is

A bilingual (English/Spanish) marketing site for **Wise and Pure**, a second storefront for [The Wealth Code, LLC](https://thewealthcode.dev) (Angel Giron's financial coaching business) aimed specifically at Christians, coaching financial stewardship from a biblical perspective. Same legal entity as The Wealth Code, just a different brand/domain and different audience — not a separate company. Built by cloning thewealthcode's codebase into its own repo. Every page is prerendered to static HTML at build time, with English and Spanish each getting their own crawlable URLs — this is what makes the site (and the Spanish content specifically) indexable by search engines. Deployed on Netlify at `wiseandpure.com`.

This repo is intentionally independent from thewealthcode's — no shared package, no synced deploys. Architectural patterns (routing, SSG, forms, email) are meant to evolve the same way in both, but each brand's actual copy, design, and business details are only ever edited here.

## Tech Stack

- **React 18 + React Router 7 (framework mode)** — static site generation via `ssr: false` + `prerender` in `react-router.config.js`. Not a client-only SPA: every route ships as a real HTML file.
- **Vite** (via `@react-router/dev`'s Vite plugin; dev server on port 5174)
- **Bootstrap 5 + Bootstrap Icons** (styling and icon font)
- **Netlify** (static hosting + serverless functions)
- **Brevo** (transactional email in the Netlify function, called directly via `fetch`)

## URL structure

Language is part of the URL, not app state. Spanish slugs are translated (not mirrored) so the URL itself carries a Spanish keyword signal — see `src/config/site.js`, the single source of truth for routing:

| EN         | ES                         |
| ---------- | -------------------------- |
| `/`        | `/es`                      |
| `/about`   | `/es/acerca-de`            |
| `/results` | `/es/resultados`           |
| `/faq`     | `/es/preguntas-frecuentes` |
| `/contact` | `/es/contacto`             |

To add a page: add one row to `PAGES` in `src/config/site.js`. `src/routes.js`, the nav (`src/components/SiteHeader.jsx` / `FloatingMobileNav.jsx`), the sitemap generator, and the `meta`/hreflang helper all derive from that one array automatically. You'll still need to add the page's own content and nav label — a `PAGE_META` entry and page-specific copy in `src/content.js`, a nav label in `COPY[lang].nav` (order must match `NAV_ITEMS` in `config/site.js` if the page is in the nav), and the actual page component in `src/pages/`.

`/services`, `/testimonials`, and `/process` don't exist as pages; they're anchors (`#who-i-help`, `#testimonials`, `#getting-started`) on the long-scroll homepage. There is no web-development side-offering here (unlike thewealthcode.dev) — Wise and Pure is scoped to Christian financial coaching only.

## Project Structure

```
src/
  root.jsx             # Document shell (<html>/<head>/<Meta/>/<Links/>) + persistent
                        # layout (language popup, header, floating nav, <Outlet/>)
  routes.js             # Route table — 2 routes (en/es) per entry in config/site.js PAGES
  config/site.js         # PAGES manifest, nav config, lang<->path helpers (pathFor,
                        # urlFor, getCounterpartPath, langFromPath)
  seo.js                # buildMeta(pageKey) -> per-route title/description/canonical/
                        # hreflang; JSON-LD helpers
  content.js            # All copy: COPY, SERVICES, TESTIMONIALS, RESULTS, PROCESS_STEPS,
                        # APPROACH_STEPS, FAQ, PAGE_META, FORM_MESSAGES (en + es)
  utils.js              # formatPhoneInputValue
  hooks/
    useLang.js           # Derives 'en'|'es' from the current URL
    useContactForm.js     # Form state + submit (used by ContactSection)
    useTestimonialCarousel.js  # Carousel state (used by TestimonialsSection)
  pages/                # One file per PAGES entry; each computes its own lang via
                        # useLang() and exports `meta` from src/seo.js
    HomePage.jsx          # Long-scroll: hero, who-i-help, testimonials, getting-started,
                        # results preview, closing CTA
    AboutPage.jsx / ResultsPage.jsx / FaqPage.jsx / ContactPage.jsx
    NotFoundPage.jsx      # Catch-all '*' route, language-agnostic
  components/           # Presentational; take `copy` (+ page-specific data) as props
netlify/
  functions/
    send-email.js       # POST handler: validates, sends notification to Angel + auto-reply
scripts/
  generate-sitemap.mjs   # Reads PAGES, writes build/client/sitemap.xml (postbuild)
```

## Key Design Decisions

- **Language comes from the URL**, derived via `useLang()` (`useLocation().pathname` + `langFromPath`). There is no `lang` state anywhere — this is what makes a prerendered `/es/...` page Spanish on first paint with no client-side flip.
- **The language toggle navigates** to `getCounterpartPath(pathname)` rather than flipping state, so both languages stay independently linkable and crawlable.
- **No component reads `localStorage` or `document` at render time.** The prerender step runs outside a browser; anything that touches browser globals during initial render breaks the static build. `localStorage` is only read/written inside `useEffect`/event handlers in `root.jsx` (first-visit language popup).
- **Per-page SEO** comes from each page module's `meta` export, built with `buildMeta(pageKey)` from `src/seo.js`. It reads the matched language from `location.pathname` (both the EN and ES route for a page share one component) and emits title, description, OG/Twitter tags, a self-canonical, and reciprocal hreflang links.
- **Form validation** is client-side in `isFormValid()` (`useContactForm.js`). Phone must be exactly 10 digits.
- **Dev mode bypass**: form submit under `import.meta.env.DEV` just waits 1.5s and shows success — no real email sent. Use `netlify dev` to exercise the real function locally.
- **Email**: the Netlify function sends two emails via Brevo's HTTP API directly (no SDK) — one notification to Angel, one auto-reply to the client.
- **`TESTIMONIALS`** in `src/content.js` reuses the same client testimonials as thewealthcode.dev — real clients Angel has coached who are also Christians, so the quotes carry over rather than needing to be collected fresh for this brand.

## Environment Variables (Netlify)

- `BREVO_API_KEY` — Brevo transactional email API key. **Needs its own Brevo
  sender-domain verification for `wiseandpure.com`** (`noreply@wiseandpure.com`,
  `angel@wiseandpure.com`) — this is a separate setup step from thewealthcode's
  Brevo account/senders.
- `RECEIVER_EMAIL` — Angel's email for incoming lead notifications
- `VITE_CF_BEACON_TOKEN` — Cloudflare Web Analytics beacon token, for a
  **separate** Cloudflare Web Analytics site registered against
  `wiseandpure.com`. Client-side, so it must keep the `VITE_` prefix to be
  inlined at build time. Not a secret (it ships in the HTML), but unset by
  default so dev builds and forks never report into the live site's stats.
  See `.env.example`.

Analytics is Cloudflare Web Analytics — cookieless, so the site needs no
consent banner. The beacon is rendered in `src/root.jsx` under
`import.meta.env.PROD`, and tracks React Router's client-side navigations by
following History API changes rather than only the initial page load.

## Common Tasks

- `npm run dev` — start local dev server (port 5174)
- `npm run build` — production build: prerenders every route to `build/client/`, then generates `build/client/sitemap.xml`
- `npm run preview` — preview the production build locally
- `netlify dev` — exercise the real contact-form email path (bypasses the dev-mode stub)

## Content Updates

All website copy lives in `src/content.js`. To update text (prices, testimonials, service descriptions, bio paragraphs, FAQ, per-page titles/descriptions in `PAGE_META`), edit that file only — no component changes needed.

## Outstanding before launch

- **Brevo senders & Cloudflare Analytics** need their own setup for
  `wiseandpure.com` (see Environment Variables above) — they don't
  automatically carry over from thewealthcode's accounts, even though it's
  the same legal entity.
- **Netlify site + DNS**: `wiseandpure.com` isn't pointed at a Netlify site
  yet — needs a new site created in the Netlify dashboard (or `netlify init`)
  and the domain's DNS updated to it.

Resolved on purpose, not by default, so noting the reasoning: no new legal
entity (Wise and Pure is a second brand of The Wealth Code, LLC, reflected in
`content.js`'s `contact.disclaimer` / `footer.rights`); brand assets
(favicon, OG image, logo) intentionally carried over unchanged from
thewealthcode.dev; the Calendly link and "Text Me" number intentionally stay
Angel's existing ones; testimonials intentionally reuse thewealthcode's real
client quotes since those clients are Christians too.
