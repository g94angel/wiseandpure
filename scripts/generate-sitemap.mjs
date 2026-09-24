// Writes build/client/sitemap.xml after `react-router build`. Reads PAGES
// from src/config/site.js so the sitemap can never drift from the actual
// route table -- add a page there and it appears here automatically.
import { writeFile } from 'node:fs/promises';
import { PAGES, SITE_URL, LANGS, urlFor } from '../src/config/site.js';

function xhtmlLinks(pageKey) {
  return LANGS.map(
    (lang) =>
      `    <xhtml:link rel="alternate" hreflang="${lang}" href="${urlFor(pageKey, lang)}" />`,
  ).join('\n');
}

function urlEntry(pageKey, lang) {
  return [
    '  <url>',
    `    <loc>${urlFor(pageKey, lang)}</loc>`,
    xhtmlLinks(pageKey),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(pageKey, 'en')}" />`,
    '  </url>',
  ].join('\n');
}

const body = PAGES.flatMap((page) =>
  LANGS.map((lang) => urlEntry(page.key, lang)),
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

const outPath = new URL('../build/client/sitemap.xml', import.meta.url);
await writeFile(outPath, xml, 'utf8');
console.log(`Wrote sitemap.xml with ${PAGES.length * LANGS.length} URLs to ${outPath.pathname}`);
