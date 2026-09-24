import { PAGE_META, SITE_KEYWORDS } from './content';
import { LANGS, SITE_URL, langFromPath, urlFor } from './config/site';

/**
 * Social share card. Must be an absolute URL -- scrapers (LinkedIn, Facebook,
 * iMessage) do not resolve relative paths. 1200x630 is the size every major
 * platform crops from, and it is what `twitter:card: summary_large_image`
 * promises; without it, shared links render as a blank card.
 */
const OG_IMAGE = `${SITE_URL}/assets/og-image.png`;

/**
 * Returns a React Router `meta` export for a given page key. Every page
 * module does `export const meta = buildMeta('about')` -- the function
 * itself derives which language matched from `location.pathname`, since
 * the EN and ES routes for a page share the same component and page key
 * (see src/routes.js).
 *
 * Produces: title, description, OG/Twitter tags, a self-referencing
 * canonical, and reciprocal hreflang links (each language points at both
 * itself and its twin, plus x-default -> English). Getting hreflang
 * reciprocal is what tells Google these are translations of one page
 * rather than two unrelated pages competing for the same query.
 */
export function buildMeta(pageKey) {
  return ({ location }) => {
    const lang = langFromPath(location.pathname);
    const meta = PAGE_META[lang][pageKey];

    const hreflangLinks = LANGS.map((altLang) => ({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: altLang,
      href: urlFor(pageKey, altLang),
    }));

    return [
      { title: meta.title },
      { name: 'description', content: meta.description },
      { name: 'keywords', content: SITE_KEYWORDS[lang] },
      { property: 'og:title', content: meta.ogTitle },
      { property: 'og:description', content: meta.ogDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: urlFor(pageKey, lang) },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: meta.ogTitle },
      { property: 'og:locale', content: lang === 'es' ? 'es_US' : 'en_US' },
      { property: 'og:site_name', content: 'Wise and Pure' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: meta.ogTitle },
      { name: 'twitter:description', content: meta.ogDescription },
      { name: 'twitter:image', content: OG_IMAGE },
      { tagName: 'link', rel: 'canonical', href: urlFor(pageKey, lang) },
      ...hreflangLinks,
      {
        tagName: 'link',
        rel: 'alternate',
        hrefLang: 'x-default',
        href: urlFor(pageKey, 'en'),
      },
    ];
  };
}

/** JSON-LD for the business, rendered once on the homepage. */
export function professionalServiceJsonLd(lang) {
  return {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Wise and Pure',
      description: PAGE_META[lang].home.description,
      url: urlFor('home', lang),
      founder: {
        '@type': 'Person',
        name: 'Angel Giron',
      },
      areaServed: 'US',
      availableLanguage: ['English', 'Spanish'],
    },
  };
}

/** JSON-LD for the FAQ page -- eligible for Google's FAQ rich result. */
export function faqJsonLd(faqItems) {
  return {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  };
}
