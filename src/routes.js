import { index, route } from '@react-router/dev/routes';
import { PAGES } from './config/site.js';

// Route paths are relative to the app root ('/'), which root.jsx supplies as
// the persistent layout (header, nav, language popup, <Outlet />). Each entry
// in PAGES (src/config/site.js) becomes two routes here -- one per language,
// sharing the same page component -- so adding a page means editing one file
// (site.js), not this one.
function stripLeadingSlash(path) {
  return path.startsWith('/') ? path.slice(1) : path;
}

function routesForPage(page) {
  const enPath = stripLeadingSlash(page.en);
  const esPath = stripLeadingSlash(page.es);

  const enRoute =
    enPath === ''
      ? index(page.file, { id: `${page.key}-en` })
      : route(enPath, page.file, { id: `${page.key}-en` });

  const esRoute = route(esPath, page.file, { id: `${page.key}-es` });

  return [enRoute, esRoute];
}

export default [
  ...PAGES.flatMap(routesForPage),
  route('*', 'pages/NotFoundPage.jsx', { id: 'not-found' }),
];
