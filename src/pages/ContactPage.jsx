import ContactSection from '../components/ContactSection';
import { COPY } from '../content';
import { useLang } from '../hooks/useLang';
import { buildMeta } from '../seo';

export default function ContactPage() {
  const lang = useLang();
  return (
    <main role="main">
      <ContactSection copy={COPY[lang]} lang={lang} />
    </main>
  );
}

export const meta = buildMeta('contact');
