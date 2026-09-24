import { useCallback, useEffect, useState } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles.css';
import LanguagePopup from './components/LanguagePopup';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import FloatingMobileNav from './components/FloatingMobileNav';
import { COPY } from './content';
import { SITE_URL, getCounterpartPath, langFromPath } from './config/site';

// Cloudflare Web Analytics. Cookieless, so no consent banner is required.
// The token is not a secret (it ships in the HTML). Set VITE_CF_BEACON_TOKEN
// in Netlify; see .env.example.
const CF_BEACON_TOKEN = import.meta.env.VITE_CF_BEACON_TOKEN;

// Netlify serves the same build on deploy permalinks
// (<deploy-id>--wiseandpure.netlify.app) as on the real domain, so a
// build-time flag cannot tell them apart -- the host check has to happen in
// the browser. Without it, every preview link clicked from the Netlify
// dashboard lands in the production stats.
const ANALYTICS_HOST = new URL(SITE_URL).hostname;

// Static <head> tags that never change per-route (fonts, icons, charset,
// viewport). Per-route <title>/description/canonical/hreflang come from each
// page module's `meta` export via <Meta />, which React Router renders above
// this in document order.
export function Layout({ children }) {
  const location = useLocation();
  const lang = langFromPath(location.pathname);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Angel Giron" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/favicon_io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/favicon_io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/favicon_io/favicon-16x16.png"
        />
        <link rel="manifest" href="/assets/favicon_io/site.webmanifest" />
        <link rel="shortcut icon" href="/assets/favicon_io/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Persistent app chrome: language popup, header, floating mobile nav, and the
// routed page in <Outlet />. Language is derived from the URL (langFromPath)
// rather than kept in state, so a prerendered /es/... page is Spanish on
// first paint -- no client-side flip required.
export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = langFromPath(location.pathname);
  const copy = COPY[lang];

  // Starts false so the first client render matches the prerendered HTML
  // exactly (no hydration mismatch); the effect below flips it on for a
  // genuine first-time visitor once localStorage is actually readable.
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  // Runs once, before the persist effect below, so it still sees whatever
  // was in localStorage prior to this visit.
  useEffect(() => {
    if (!window.localStorage.getItem('lang')) {
      setShowLanguagePopup(true);
    }
  }, []);

  // Persists whichever language the current URL implies -- covers a visitor
  // arriving directly at a /es/... link (search result, shared link) who
  // never touches the popup or toggle.
  useEffect(() => {
    window.localStorage.setItem('lang', lang);
  }, [lang]);

  // Loads the Cloudflare beacon only on the real domain, so deploy previews
  // and local builds stay out of the production numbers. Injecting it after
  // hydration rather than inlining it in <head> still records the first
  // pageview -- the beacon reports whatever URL is current when it loads,
  // then follows History API changes for React Router's client-side moves.
  useEffect(() => {
    if (!CF_BEACON_TOKEN) return;
    if (window.location.hostname !== ANALYTICS_HOST) return;
    if (document.querySelector('script[data-cf-beacon]')) return;

    const beacon = document.createElement('script');
    beacon.defer = true;
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    beacon.setAttribute(
      'data-cf-beacon',
      JSON.stringify({ token: CF_BEACON_TOKEN }),
    );
    document.head.appendChild(beacon);
  }, []);

  const selectLanguage = useCallback(
    (nextLang) => {
      setShowLanguagePopup(false);
      if (nextLang !== lang) {
        navigate(getCounterpartPath(location.pathname));
      }
    },
    [lang, location.pathname, navigate],
  );

  const toggleLanguage = useCallback(() => {
    navigate(getCounterpartPath(location.pathname));
  }, [lang, location.pathname, navigate]);

  return (
    <>
      <LanguagePopup
        show={showLanguagePopup}
        copy={copy}
        onSelectLanguage={selectLanguage}
      />

      <SiteHeader copy={copy} lang={lang} onToggleLanguage={toggleLanguage} />

      <FloatingMobileNav
        copy={copy}
        lang={lang}
        onToggleLanguage={toggleLanguage}
      />

      <Outlet />

      <SiteFooter copy={copy} lang={lang} />
    </>
  );
}

export function ErrorBoundary({ error }) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong.';
  return (
    <main role="main" className="lang-section text-center">
      <h1>{message}</h1>
    </main>
  );
}
