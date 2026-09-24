import { memo, useState } from 'react';

export default memo(function FaqSection({ title, faq, headingLevel = 'h1' }) {
  // One panel open at a time; null means all collapsed, which is also the
  // state the prerendered HTML ships in. Answers stay in the DOM either way
  // (toggled with `hidden`) so the static build remains fully crawlable.
  const [openIndex, setOpenIndex] = useState(null);
  const Heading = headingLevel;

  return (
    <section className="lang-section">
      <div className="container">
        <Heading className="text-center mb-4">{title}</Heading>
        <div className="faq-list">
          {faq.map((item, index) => {
            const isOpen = index === openIndex;
            const buttonId = `faq-trigger-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div
                className={`faq-item${isOpen ? ' is-open' : ''}`}
                key={item.question}
              >
                <h2 className="faq-question">
                  <button
                    id={buttonId}
                    className="faq-trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <i
                      className="bi bi-chevron-down faq-chevron"
                      aria-hidden="true"
                    ></i>
                  </button>
                </h2>
                <div
                  id={panelId}
                  className="faq-answer"
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
