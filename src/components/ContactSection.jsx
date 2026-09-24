import { memo } from 'react';
import { Link } from 'react-router';
import { FORM_MESSAGES } from '../content';
import { useContactForm } from '../hooks/useContactForm';
// Calendly is disabled in favor of the form/text-me flow below -- Angel's
// calendar can get overbooked, and a lead who self-schedules on a busy
// calendar gets missed. Kept here (not deleted) in case Calendly comes back;
// uncomment this import and the JSX block further down to restore it.
// import CalendlyEmbed from './CalendlyEmbed';

export default memo(function ContactSection({
  copy,
  lang,
  sectionKey = 'contact',
  headingLevel = 'h1',
  backLink,
}) {
  const section = copy[sectionKey];
  const { form, isSending, formMessage, handleInputChange, handleSubmit } =
    useContactForm(lang);

  const isFormComplete =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.message.trim();

  const submitText = isSending ? FORM_MESSAGES.sending[lang] : section.submit;

  // The page's own <h1> lives outside this component when it's embedded
  // rather than standalone (see headingLevel usage below) -- bump every
  // heading here down a level so the doc outline stays sane either way.
  const TitleTag = headingLevel;
  const TextMeTag = headingLevel === 'h1' ? 'h2' : 'h3';

  return (
    <section className="text-center lang-section">
      <div className="position-relative mb-3">
        {backLink && (
          <Link
            to={backLink.to}
            className="back-arrow-link position-absolute start-0 top-50 translate-middle-y"
            aria-label={backLink.label}
          >
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
          </Link>
        )}
        <TitleTag className="mb-0">{section.title}</TitleTag>
      </div>
      <p className="lead mb-4">{section.body}</p>

      {/*
      <div className="mx-auto mb-5" style={{ maxWidth: '700px' }}>
        <CalendlyEmbed lang={lang} />
      </div>
      */}
      <TextMeTag className="mb-3">{section.textMeHeading}</TextMeTag>
      <div className="mb-4">
        <a href="sms:+12086141648" className="btn btn-outline-primary btn-md">
          {section.textMe}
        </a>
      </div>
      <p className="text-muted mb-4">{section.or}</p>
      <form
        className="mx-auto contact-form"
        style={{
          maxWidth: '500px',
        }}
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          id="name"
          name="name"
          required
          className="form-control mb-3"
          placeholder={section.placeholders.name}
          value={form.name}
          onChange={handleInputChange}
        />

        <input
          type="email"
          id="email"
          name="email"
          required
          className="form-control mb-3"
          placeholder={section.placeholders.email}
          value={form.email}
          onChange={handleInputChange}
        />

        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{3}-?[0-9]{3}-?[0-9]{4}"
          id="phone"
          name="phone"
          required
          maxLength="12"
          className="form-control mb-3"
          placeholder={section.placeholders.phone}
          value={form.phone}
          onChange={handleInputChange}
        />

        <textarea
          id="message"
          name="message"
          required
          className="form-control mb-4"
          rows="4"
          placeholder={section.placeholders.message}
          value={form.message}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={isSending || !isFormComplete}
        >
          {submitText}
        </button>
      </form>

      {formMessage.text && (
        <p
          id="form-response"
          className={`mt-3 text-sm ${formMessage.type}`}
          aria-live="polite"
          role="status"
        >
          {formMessage.text}
        </p>
      )}

      {/* Education-not-advice notice. Sits with the form because this is the
          point where someone actually engages -- it has to be visible on the
          page, not just present in content.js. */}
      <p className="contact-disclaimer">{section.disclaimer}</p>
    </section>
  );
});
