import HeroSection from '../components/HeroSection';
import PhilosophySection from '../components/PhilosophySection';
import PositioningSection from '../components/PositioningSection';
import HomeAboutSection from '../components/HomeAboutSection';
import ApproachSection from '../components/ApproachSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ProcessSection from '../components/ProcessSection';
import ClosingCtaSection from '../components/ClosingCtaSection';
import {
  APPROACH_STEPS,
  COPY,
  PROCESS_STEPS,
  SERVICES,
  TESTIMONIALS,
} from '../content';
import { HOME_ANCHORS, langFromPath } from '../config/site';
import { useLang } from '../hooks/useLang';
import { buildMeta, professionalServiceJsonLd } from '../seo';

export default function HomePage() {
  const lang = useLang();
  const copy = COPY[lang];

  return (
    <main role="main">
      <HeroSection copy={copy} />

      <PhilosophySection copy={copy} />

      <PositioningSection copy={copy} />

      <ApproachSection copy={copy} steps={APPROACH_STEPS[lang]} />

      <div id={HOME_ANCHORS.whoIHelp[lang]}>
        <ServicesSection copy={copy} services={SERVICES[lang]} />
      </div>

      <HomeAboutSection copy={copy} lang={lang} />

      <div id={HOME_ANCHORS.testimonials[lang]}>
        <TestimonialsSection copy={copy} testimonials={TESTIMONIALS[lang]} />
      </div>

      <div id={HOME_ANCHORS.gettingStarted[lang]}>
        <ProcessSection copy={copy} processSteps={PROCESS_STEPS[lang]} />
      </div>

      <ClosingCtaSection copy={copy} />
    </main>
  );
}

const baseMeta = buildMeta('home');

export function meta(args) {
  const lang = langFromPath(args.location.pathname);
  return [...baseMeta(args), professionalServiceJsonLd(lang)];
}
