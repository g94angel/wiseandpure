import ResultsSection from '../components/ResultsSection';
import { COPY, RESULTS } from '../content';
import { useLang } from '../hooks/useLang';
import { buildMeta } from '../seo';

export default function ResultsPage() {
  const lang = useLang();
  return (
    <main role="main">
      <ResultsSection copy={COPY[lang]} results={RESULTS[lang]} />
    </main>
  );
}

export const meta = buildMeta('results');
