import { memo } from 'react';
import { Link, NavLink } from 'react-router';
import { NAV_ITEMS, hrefForNavItem, pathFor } from '../config/site';

export default memo(function SiteHeader({ copy, lang, onToggleLanguage }) {
  return (
    // sticky lives on the <header>, not the <nav>: a sticky element can only
    // travel inside its parent's box, and the <header> is only as tall as the
    // nav itself, so sticking the nav pinned it to nothing and it scrolled away.
    <header role="banner" className="site-header">
      <nav
        role="navigation"
        className="navbar navbar-expand-custom navbar-dark shadow-sm bg-dark desktop-only"
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to={pathFor('home', lang)}>
            <span className="navbar-brand-text">{copy.siteName}</span>
          </Link>

          <div className="navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-wrapper">
              <ul className="navbar-nav" aria-label={copy.navAria}>
                {NAV_ITEMS.map((item, index) => {
                  const href = hrefForNavItem(item, lang);
                  return (
                    <li className="nav-item" key={href}>
                      {item.type === 'page' ? (
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link${isActive ? ' active' : ''}`
                          }
                          to={href}
                        >
                          {copy.nav[index]}
                        </NavLink>
                      ) : (
                        <Link className="nav-link" to={href}>
                          {copy.nav[index]}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="language-toggle">
                <button
                  id="navbar-lang-toggle"
                  className="nav-link"
                  type="button"
                  aria-label={copy.toggleLanguage}
                  onClick={onToggleLanguage}
                >
                  <i className="bi bi-globe"></i>{' '}
                  <span>{lang === 'en' ? 'ES' : 'EN'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
});
