import { memo } from 'react';

export default memo(function PhilosophyDetailSection({ copy }) {
  return (
    <section className="lang-section philosophy-section">
      <div className="container">
        <h1 className="text-center mb-4">{copy.philosophy.title}</h1>

        <blockquote className="philosophy-verse">
          <p>&ldquo;{copy.philosophy.verseText}&rdquo;</p>
          <cite>{copy.philosophy.verseReference}</cite>
        </blockquote>

        <div className="philosophy-body">
          {copy.philosophy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
});
