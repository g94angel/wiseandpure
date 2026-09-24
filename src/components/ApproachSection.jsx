import { memo } from 'react';

export default memo(function ApproachSection({ copy, steps }) {
  return (
    <section className="lang-section text-center">
      <div className="container">
        <h2 className="mb-4">{copy.approach.title}</h2>
        <div className="approach-intro">
          {copy.approach.paragraphs.map((paragraph) => (
            <p className="lead" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="getting-started-container">
          {steps.map((step, index) => (
            <div className="getting-started-card" key={step.title}>
              <h5>
                {index + 1}. {step.title}
              </h5>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <p className="approach-proof">{copy.approach.proof}</p>
      </div>
    </section>
  );
});
