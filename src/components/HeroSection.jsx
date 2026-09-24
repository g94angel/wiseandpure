import { memo } from 'react';
import { useNavigate } from 'react-router';
import { pathFor } from '../config/site';
import { useLang } from '../hooks/useLang';

export default memo(function HeroSection({ copy }) {
  const navigate = useNavigate();
  const lang = useLang();

  return (
    <section className="lang-section text-center">
      <h1 className="mb-4">{copy.heroTitle}</h1>
      <p className="lead hero-recognition">{copy.heroLead}</p>
      <button
        className="btn btn-primary btn-lg"
        onClick={() => navigate(pathFor('contact', lang))}
      >
        {copy.heroCta}
      </button>

      <ul className="hero-trust">
        {copy.heroTrust.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
});
