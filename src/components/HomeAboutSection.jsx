import { memo } from 'react';
import { Link } from 'react-router';
import { pathFor } from '../config/site';

export default memo(function HomeAboutSection({ copy, lang }) {
  return (
    <section className="home-about">
      <div className="container home-about-inner">
        <img
          src="/assets/giron.jpg"
          alt={copy.about.imageAlt}
          className="home-about-img"
          loading="lazy"
          width="140"
          height="140"
        />
        <div className="home-about-text">
          <h2>{copy.homeAbout.title}</h2>
          <p>{copy.homeAbout.body}</p>
          <Link to={pathFor('about', lang)}>{copy.homeAbout.cta}</Link>
        </div>
      </div>
    </section>
  );
});
