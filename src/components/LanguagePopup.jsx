export default function LanguagePopup({ show, copy, onSelectLanguage }) {
  if (!show) return null;

  return (
    <div id="language-popup" className="language-popup">
      <div className="popup-content card shadow-sm bg-white">
        <h2 className="text-center mb-4">{copy.languagePrompt}</h2>
        <button
          id="lang-en"
          className="btn btn-primary m-2"
          aria-label={copy.selectEnglish}
          type="button"
          onClick={() => onSelectLanguage('en')}
        >
          English
        </button>
        <button
          id="lang-es"
          className="btn btn-primary m-2"
          aria-label={copy.selectSpanish}
          type="button"
          onClick={() => onSelectLanguage('es')}
        >
          Español
        </button>
      </div>
    </div>
  );
}
