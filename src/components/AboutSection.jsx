import { memo } from 'react';

function parseText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={part}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default memo(function AboutSection({ copy }) {
  return (
    <section className="lang-section">
      <div>
        <h1 className="text-center mb-4">{copy.about.title}</h1>

        <img
          src="/assets/giron.jpg"
          alt={copy.about.imageAlt}
          className="img-fluid float-start mt-1 me-3 profile-img"
          loading="lazy"
        />

        <div className="authority-strip">
          <span className="authority-title">{copy.about.authorityTitle}</span>
        </div>

        {copy.about.paragraphs.map((paragraph, index) => {
          const isLast = index === copy.about.paragraphs.length - 1;

          if (typeof paragraph === 'object') {
            return (
              <blockquote className="pull-quote" key={paragraph.quote}>
                {parseText(paragraph.quote)}
              </blockquote>
            );
          }

          return (
            <p className={isLast ? 'mb-0' : ''} key={paragraph}>
              {parseText(paragraph)}
            </p>
          );
        })}
      </div>
    </section>
  );
});
