import FaqSection from '../components/FaqSection';
import { FAQ } from '../content';
import { langFromPath } from '../config/site';
import { useLang } from '../hooks/useLang';
import { buildMeta, faqJsonLd } from '../seo';

const FAQ_TITLE = { en: 'Frequently Asked Questions', es: 'Preguntas Frecuentes' };

export default function FaqPage() {
  const lang = useLang();
  return (
    <main role="main">
      <FaqSection title={FAQ_TITLE[lang]} faq={FAQ[lang]} />
    </main>
  );
}

const baseMeta = buildMeta('faq');

export function meta(args) {
  const lang = langFromPath(args.location.pathname);
  return [...baseMeta(args), faqJsonLd(FAQ[lang])];
}
