import { memo } from 'react';
import { InlineWidget } from 'react-calendly';

const CALENDLY_URL = 'https://calendly.com/angelgiron/30min';

// InlineWidget renders a plain, correctly-parameterized <iframe> -- it does
// not load Calendly's external widget.js -- so there's nothing to guard
// against during the static prerender pass; it's a safe no-op there and
// hydrates normally in the browser.
export default memo(function CalendlyEmbed({ lang }) {
  const url = lang === 'es' ? `${CALENDLY_URL}?locale=es` : CALENDLY_URL;

  return (
    <InlineWidget
      url={url}
      styles={{ height: '700px', width: '100%' }}
      iframeTitle="Wise and Pure Scheduling"
    />
  );
});
