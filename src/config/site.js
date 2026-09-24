/**
 * Single source of truth for the site's URL structure.
 *
 * Everything downstream derives from PAGES: the React Router route table
 * (src/routes.js), the prerender list (react-router.config.js), the header
 * nav, the language toggle, the canonical/hreflang tags (src/seo.js), and
 * the generated sitemap (scripts/generate-sitemap.mjs).
 *
 * Adding a page means adding one row here.
 */

export const SITE_URL = 'https://wiseandpure.com';

export const DEFAULT_LANG = 'en';
export const LANGS = ['en', 'es'];

/**
 * Spanish slugs are translated rather than mirrored so the URL itself carries
 * a Spanish keyword signal (/es/resultados, not /es/results).
 */
export const PAGES = [
  {
    key: 'home',
    file: 'pages/HomePage.jsx',
    inNav: false,
    en: '/',
    es: '/es',
  },
  {
    key: 'about',
    file: 'pages/AboutPage.jsx',
    inNav: true,
    en: '/about',
    es: '/es/acerca-de',
  },
  {
    key: 'results',
    file: 'pages/ResultsPage.jsx',
    inNav: true,
    en: '/results',
    es: '/es/resultados',
  },
  {
    key: 'faq',
    file: 'pages/FaqPage.jsx',
    inNav: true,
    en: '/faq',
    es: '/es/preguntas-frecuentes',
  },
  {
    key: 'contact',
    file: 'pages/ContactPage.jsx',
    inNav: true,
    en: '/contact',
    es: '/es/contacto',
  },
];

export const NAV_PAGES = PAGES.filter((page) => page.inNav);

/**
 * Anchor sections on the long-scroll homepage, linked from nav and CTAs.
 * Translated per language for the same reason the page slugs are: the whole
 * URL should read Spanish on /es. Unlike the slugs this buys no SEO — a
 * fragment never reaches the server and Google strips it before indexing —
 * so it is purely for the reader looking at the address bar.
 *
 * Kept unaccented on purpose: 'cómo-empezar' percent-encodes to
 * 'c%C3%B3mo-empezar' the moment anyone copies the link.
 */
export const HOME_ANCHORS = {
  whoIHelp: { en: 'who-i-help', es: 'a-quien-ayudo' },
  testimonials: { en: 'testimonials', es: 'testimonios' },
  gettingStarted: { en: 'getting-started', es: 'como-empezar' },
};

/**
 * Header/nav order. Mixes real pages with anchors on the long-scroll
 * homepage; index position here lines up 1:1 with the `nav` label array in
 * content.js (COPY[lang].nav), so relabeling the nav means editing that
 * array, not this one.
 */
export const NAV_ITEMS = [
  { type: 'page', key: 'about' },
  { type: 'anchor', anchor: HOME_ANCHORS.whoIHelp },
  { type: 'anchor', anchor: HOME_ANCHORS.testimonials },
  { type: 'anchor', anchor: HOME_ANCHORS.gettingStarted },
  { type: 'page', key: 'results' },
  { type: 'page', key: 'faq' },
  { type: 'page', key: 'contact' },
];

/** Every path that must be prerendered to static HTML. */
export const ALL_PATHS = PAGES.flatMap((page) => [page.en, page.es]);

export function pageFor(key) {
  return PAGES.find((page) => page.key === key);
}

/** Absolute path for a page in a given language. */
export function pathFor(key, lang) {
  const page = pageFor(key);
  if (!page) throw new Error(`Unknown page key: ${key}`);
  return page[lang] ?? page[DEFAULT_LANG];
}

/** Href for a NAV_ITEMS entry: a real page path, or a home-page anchor link. */
export function hrefForNavItem(item, lang) {
  if (item.type === 'page') return pathFor(item.key, lang);
  return `${pathFor('home', lang)}#${item.anchor[lang]}`;
}

/** Fully-qualified URL, used for canonical and hreflang tags. */
export function urlFor(key, lang) {
  const path = pathFor(key, lang);
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function langFromPath(pathname) {
  return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';
}

/** Reverse lookup: which page does this URL render? Null for unknown paths. */
export function pageFromPath(pathname) {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  const lang = langFromPath(normalized);
  const page = PAGES.find((candidate) => candidate[lang] === normalized);
  return page ? { page, lang } : null;
}

/**
 * The same page in the other language. Powers the language toggle, which is a
 * real navigation now rather than a state flip -- that is what makes both
 * languages crawlable and shareable.
 */
export function getCounterpartPath(pathname) {
  const match = pageFromPath(pathname);
  if (!match) return pathname.startsWith('/es') ? '/' : '/es';
  const otherLang = match.lang === 'en' ? 'es' : 'en';
  return match.page[otherLang];
}
