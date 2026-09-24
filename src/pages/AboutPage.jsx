import AboutSection from '../components/AboutSection';
import { COPY } from '../content';
import { useLang } from '../hooks/useLang';
import { buildMeta } from '../seo';

export default function AboutPage() {
  const lang = useLang();
  return (
    <main role="main">
      <AboutSection copy={COPY[lang]} />
    </main>
  );
}

export const meta = buildMeta('about');
