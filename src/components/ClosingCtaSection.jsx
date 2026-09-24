import { memo } from 'react';
import { Link } from 'react-router';
import { pathFor } from '../config/site';
import { useLang } from '../hooks/useLang';

export default memo(function ClosingCtaSection({ copy }) {
  const lang = useLang();

  return (
    <section className="lang-section text-center">
      <h2 className="mb-3">{copy.closingCta.title}</h2>
      <p className="lead mb-4">{copy.closingCta.body}</p>
      <Link to={pathFor('contact', lang)} className="btn btn-primary btn-lg">
        {copy.heroCta}
      </Link>
    </section>
  );
});
