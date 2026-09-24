import { memo } from 'react';
import { useNavigate } from 'react-router';
import { pathFor } from '../config/site';
import { useLang } from '../hooks/useLang';

export default memo(function ProcessSection({ copy, processSteps }) {
  const navigate = useNavigate();
  const lang = useLang();

  return (
    <section className="lang-section text-center">
      <div className="container">
        <h2 className="mb-4">{copy.process.title}</h2>
        <p className="lead">{copy.process.body}</p>

        <div className="getting-started-container">
          {processSteps.map((step) => (
            <div className="getting-started-card" key={step.title}>
              <h5>{step.title}</h5>
              <p>{step.text}</p>
              {step.price && (
                <h4 className={`mt-3 fw-bold ${step.priceClass}`}>
                  {step.price}
                </h4>
              )}
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary btn-lg mt-4"
          onClick={() => navigate(pathFor('results', lang))}
        >
          {copy.process.cta}
        </button>
      </div>
    </section>
  );
});
