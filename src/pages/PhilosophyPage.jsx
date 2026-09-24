import PhilosophyDetailSection from '../components/PhilosophyDetailSection';
import { COPY } from '../content';
import { useLang } from '../hooks/useLang';
import { buildMeta } from '../seo';

export default function PhilosophyPage() {
  const lang = useLang();
  return (
    <main role="main">
      <PhilosophyDetailSection copy={COPY[lang]} />
    </main>
  );
}

export const meta = buildMeta('philosophy');
