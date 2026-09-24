# Wise and Pure

Bilingual (English/Spanish) marketing site for Wise and Pure, Angel Giron's Christian financial coaching business. React Router 7 (framework mode) with `ssr: false` + `prerender`, so every route ships as a real, crawlable HTML file in both languages. See `CLAUDE.md` for the full architecture writeup.

## Development

```sh
npm install
npm run dev       # dev server on port 5174
npm run build     # prerenders every route to build/client/, then writes sitemap.xml
npm run preview   # preview the production build locally
netlify dev       # exercise the real contact-form email path (Brevo), instead of the dev-mode stub
```

## Deployment (Netlify)

### 1. Environment variables

Site configuration → Environment variables:

| Variable               | Value                                       |
| ----------------------- | -------------------------------------------- |
| `BREVO_API_KEY`         | Brevo API v3 key                            |
| `RECEIVER_EMAIL`        | Inbox where coaching inquiries are delivered |
| `VITE_CF_BEACON_TOKEN`  | Cloudflare Web Analytics beacon token        |

### 2. Verified Brevo senders

- `noreply@wiseandpure.com` — system notifications
- `angel@wiseandpure.com` — client auto-reply

### 3. Domain

Once deployed on `wiseandpure.com`, `netlify/functions/send-email.js`'s
`ALLOWED_ORIGIN` and the Cloudflare Analytics host check in `src/root.jsx`
both key off that hostname.

## Content updates

All copy — hero text, bio, FAQ, results, pricing, SEO titles/descriptions —
lives in `src/content.js`. Edit that file only; no component changes needed
for a text change. See `CLAUDE.md` → "Outstanding before launch" for the
handful of business details (legal entity name, brand assets) still left as
placeholders from cloning thewealthcode.dev's codebase.
