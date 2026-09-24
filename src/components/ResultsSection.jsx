import { memo } from 'react';
import { useNavigate } from 'react-router';
import { pathFor } from '../config/site';
import { useLang } from '../hooks/useLang';

export default memo(function ResultsSection({ copy, results }) {
  const navigate = useNavigate();
  const lang = useLang();

  return (
    <section className="lang-section">
      <div className="container">
        <div className="text-center">
          <h1 className="mb-3">{copy.results.title}</h1>
          <p className="lead">{copy.results.body}</p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card mx-auto">
            <div className="pricing-card-header">
              <h3>{copy.results.rateLabel}</h3>
            </div>

            <p className="pricing-card-description">
              {copy.results.rateDescription}
            </p>

            <div className="pricing-card-amount">
              <h4 className="fw-bold text-custom-cedar">
                {copy.results.rate}
              </h4>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={() => navigate(pathFor('contact', lang))}
            >
              {copy.results.bookConsultation}
            </button>
          </div>
        </div>

        <div className="text-center mt-5">
          <h2 className="mb-4">{copy.results.resultsHeading}</h2>
          <div className="services-grid">
            {results.map((result) => (
              <div className="services-card" key={result.text}>
                <i
                  className={`bi ${result.icon} fs-1 text-primary mb-3`}
                  aria-hidden="true"
                ></i>
                <p className="mb-0">{result.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
