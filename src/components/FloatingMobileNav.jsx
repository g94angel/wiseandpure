import { memo, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { NAV_ITEMS, hrefForNavItem } from '../config/site';

export default memo(function FloatingMobileNav({ copy, lang, onToggleLanguage }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleLanguageToggle = () => {
    onToggleLanguage();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="floating-mobile-nav-container" ref={containerRef}>
      <button
        className="floating-mobile-nav"
        type="button"
        aria-label="Toggle navigation menu"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <i className="bi bi-list"></i>
      </button>

      {isOpen && (
        <div className="floating-nav-menu">
          {NAV_ITEMS.map((item, index) => {
            const href = hrefForNavItem(item, lang);
            return (
              <Link
                key={href}
                to={href}
                className="floating-nav-link"
                onClick={handleNavClick}
              >
                {copy.nav[index]}
              </Link>
            );
          })}
          <button
            className="floating-nav-link lang-toggle"
            type="button"
            aria-label={copy?.toggleLanguage}
            onClick={handleLanguageToggle}
          >
            <i className="bi bi-globe"></i> {lang === 'en' ? 'ES' : 'EN'}
          </button>
        </div>
      )}
    </div>
  );
});
