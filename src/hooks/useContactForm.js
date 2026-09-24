import { useCallback, useEffect, useState } from 'react';
import { FORM_MESSAGES } from '../content';
import { formatPhoneInputValue } from '../utils';

const INITIAL_FORM = { name: '', email: '', phone: '', message: '' };

function isFormValid(payload) {
  const hasCore = payload.name.length > 0 && payload.message.length > 0;
  const hasValidEmail =
    payload.email.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
  const hasValidPhone = payload.phone.length > 0 && payload.phone.length === 10;
  return hasCore && hasValidEmail && hasValidPhone;
}

export function useContactForm(lang) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSending, setIsSending] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    setFormMessage({ type: '', text: '' });
  }, [lang]);

  useEffect(() => {
    if (formMessage.type === 'success') {
      const timer = setTimeout(() => setFormMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [formMessage.type]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === 'phone' ? formatPhoneInputValue(value) : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replaceAll(/\D/g, ''),
        message: form.message.trim(),
        lang,
      };

      if (!isFormValid(payload)) {
        setFormMessage({ type: 'error', text: FORM_MESSAGES.incomplete[lang] });
        return;
      }

      setIsSending(true);
      setFormMessage({ type: 'sending', text: FORM_MESSAGES.sending[lang] });

      try {
        if (import.meta.env.DEV) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setForm(INITIAL_FORM);
          setFormMessage({ type: 'success', text: FORM_MESSAGES.success[lang] });
          return;
        }

        const response = await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));
        if (response.ok && result?.success) {
          setForm(INITIAL_FORM);
          setFormMessage({ type: 'success', text: FORM_MESSAGES.success[lang] });
        } else {
          setFormMessage({ type: 'failure', text: FORM_MESSAGES.failure[lang] });
        }
      } catch {
        setFormMessage({ type: 'error', text: FORM_MESSAGES.error[lang] });
      } finally {
        setIsSending(false);
      }
    },
    [form, lang],
  );

  return { form, isSending, formMessage, handleInputChange, handleSubmit };
}
