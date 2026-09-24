import { Link } from 'react-router';
import { pathFor } from '../config/site';
import { useLang } from '../hooks/useLang';

const COPY_404 = {
  en: {
    title: 'Page not found',
    body: "The page you're looking for doesn't exist or has moved.",
    cta: 'Back to home',
  },
  es: {
    title: 'Página no encontrada',
    body: 'La página que busca no existe o fue movida.',
    cta: 'Volver al inicio',
  },
};

// langFromPath works on any pathname, matched or not (it's a string-prefix
// check), so an unmatched /es/... URL still renders in Spanish -- the header
// wrapping this page is already language-aware via the same helper.
export default function NotFoundPage() {
  const lang = useLang();
  const copy = COPY_404[lang];

  return (
    <main role="main" className="lang-section text-center">
      <h1 className="mb-3">{copy.title}</h1>
      <p className="lead mb-4">{copy.body}</p>
      <Link to={pathFor('home', lang)} className="btn btn-primary btn-lg">
        {copy.cta}
      </Link>
    </main>
  );
}

export function meta() {
  return [{ title: 'Page Not Found | Wise and Pure' }];
}
