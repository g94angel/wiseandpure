import { memo } from 'react';
import { Link } from 'react-router';
import { NAV_ITEMS, hrefForNavItem, pathFor } from '../config/site';

export default memo(function SiteFooter({ copy, lang }) {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <Link className="site-footer-brand" to={pathFor('home', lang)}>
          {copy.siteName}
        </Link>

        <nav className="site-footer-nav" aria-label={copy.footer.navAria}>
          {NAV_ITEMS.map((item, index) => {
            const href = hrefForNavItem(item, lang);
            return (
              <Link key={href} to={href}>
                {copy.nav[index]}
              </Link>
            );
          })}
        </nav>

        <p className="site-footer-legal">
          {/* The year is baked in at prerender and recomputed on hydration, so
              the two disagree for anyone loading a stale build after Jan 1. */}
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} {copy.footer.rights}
          </span>{' '}
          · {copy.footer.education}
        </p>
      </div>
    </footer>
  );
});
