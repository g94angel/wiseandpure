const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ORIGIN = 'https://wiseandpure.com';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// -------------------- Utilities --------------------

function escapeHTML(str = '') {
  return String(str).replace(
    /[&<>"']/g,
    (m) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[m],
  );
}

function encodeQuery(str = '') {
  return encodeURIComponent(String(str));
}

function digitsOnly(str = '') {
  return String(str).replace(/\D/g, '');
}

function formatPhone10(digits10) {
  if (digits10?.length !== 10) return null;
  return digits10.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    },
    body: JSON.stringify(payload),
  };
}

function validateEnvironment() {
  const receiver = process.env.RECEIVER_EMAIL;
  if (!receiver || !EMAIL_REGEX.test(receiver)) return 'Invalid RECEIVER_EMAIL';
  if (!process.env.BREVO_API_KEY) return 'Missing BREVO_API_KEY';
  return null;
}

async function sendBrevoEmail(payload) {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Brevo ${response.status}: ${text}`);
  }
}

function buildEmailHtml({
  safeName,
  safeEmail,
  dialerPhone,
  formattedPhone,
  safeMessage,
  lang,
}) {
  const isEs = lang === 'es';
  const mailtoSubject = isEs
    ? 'Re: Tu consulta de Wise and Pure'
    : 'Re: Your message from Wise and Pure';
  const replyText = isEs ? 'Responder' : 'Reply';

  // Extract labels to avoid nested ternaries inside the template literal
  const nameLabel = isEs ? 'Nombre' : 'Name';
  const emailLabel = isEs ? 'Correo' : 'Email';
  const phoneLabel = isEs ? 'Teléfono' : 'Phone';
  const messageLabel = isEs ? 'Mensaje' : 'Message';
  const messageTitle = isEs
    ? 'Nueva Consulta de Cliente'
    : 'New Client Message';

  const emailBlock = safeEmail
    ? `<p style="margin:0 0 8px;"><strong>${emailLabel}:</strong> <a href="mailto:${safeEmail}" style="color: #007bff;">${safeEmail}</a></p>`
    : '';

  const phoneBlock = formattedPhone
    ? `<p style="margin:0 0 8px;">
          <strong>${phoneLabel}:</strong>
          <a href="tel:${dialerPhone}" style="color: #007bff; text-decoration: underline;">${formattedPhone}</a>
        </p>`
    : '';

  const replyBlock = safeEmail
    ? `<div style="margin-top: 25px;">
          <a href="mailto:${safeEmail}?subject=${encodeQuery(mailtoSubject)}"
             style="background:#333; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px; font-weight:700; display:inline-block;">
             ${replyText}
          </a>
        </div>`
    : '';

  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; line-height:1.6; color:#333; max-width: 600px;">
      <h2 style="border-bottom:1px solid #eee; padding-bottom:10px; margin:0 0 14px;">${messageTitle}</h2>
      <p style="margin:0 0 8px;"><strong>${nameLabel}:</strong> ${safeName}</p>
      ${emailBlock}
      ${phoneBlock}
      <hr style="border:0; border-top:1px solid #eee; margin:14px 0;" />
      <p style="margin:0 0 8px;"><strong>${messageLabel}:</strong></p>
      <div style="background:#f9f9f9; padding:12px; border-radius:8px; white-space:pre-wrap; border:1px solid #eee;">${safeMessage}</div>
      ${replyBlock}
    </div>
  `;
}

function buildAutoReplyPayload(safeName, safeEmail, isEs) {
  const subject = isEs
    ? `He recibido tu solicitud, ${safeName}`
    : `I've received your request, ${safeName}`;

  const htmlContent = isEs
    ? `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 500px;">
        <p>Hola ${safeName},</p>
        <p>Gracias por contactarme. He recibido tu mensaje y revisaré los detalles pronto.</p>
        <p>Me comunicaré contigo dentro de tres días para hablar sobre los siguientes pasos.</p>
        <p>Hablamos pronto,</p><p>Angel<br />Wise and Pure</p>
        <hr style="border:0; border-top:1px solid #eee; margin:20px 0;" />
        <p style="font-size: 11px; color: #999;">Esta es una confirmación automática para informarte que tu mensaje fue entregado con éxito.</p>
      </div>`
    : `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 500px;">
        <p>Hi ${safeName},</p>
        <p>Thank you for reaching out. I've received your message and will review the details shortly.</p>
        <p>I'll contact you within the next three days to discuss the next steps.</p>
        <p>Talk soon,</p><p>Angel<br />Wise and Pure</p>
        <hr style="border:0; border-top:1px solid #eee; margin:20px 0;" />
        <p style="font-size: 11px; color: #999;">This is an automated confirmation to let you know your message was delivered successfully.</p>
      </div>`;

  return {
    sender: { email: 'angel@wiseandpure.com', name: 'Angel Giron' },
    to: [{ email: safeEmail, name: safeName }],
    subject,
    htmlContent,
  };
}

// -------------------- Handler --------------------

export async function handler(event) {
  if (event.httpMethod !== 'POST')
    return jsonResponse(405, { success: false, error: 'Method Not Allowed' });

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return jsonResponse(400, {
      success: false,
      error: 'Invalid JSON payload.',
    });
  }

  const name = body?.name?.trim() || '';
  const email = body?.email?.trim() || '';
  const phoneRaw = body?.phone?.trim() || '';
  const message = body?.message?.trim() || '';
  const lang = body?.lang === 'es' ? 'es' : 'en';

  if (!name || !message || (!email && !phoneRaw)) {
    return jsonResponse(400, {
      success: false,
      error: 'Missing required fields.',
    });
  }

  const envError = validateEnvironment();
  if (envError) {
    console.error('send-email environment error:', envError);
    return jsonResponse(500, { success: false, error: 'Server error.' });
  }

  const dialerPhone = phoneRaw ? digitsOnly(phoneRaw) : '';
  const safeName = escapeHTML(name);
  const safeEmail = email ? escapeHTML(email) : null;
  const safeMessage = escapeHTML(message);
  const formattedPhone = dialerPhone ? formatPhone10(dialerPhone) : null;
  const isEs = lang === 'es';

  const notificationSubject = isEs
    ? `${safeName} envió un mensaje`
    : `${safeName} sent a message`;

  const htmlContentAngel = buildEmailHtml({
    safeName,
    safeEmail,
    dialerPhone: dialerPhone || null,
    formattedPhone,
    safeMessage,
    lang,
  });

  try {
    await sendBrevoEmail({
      sender: { email: 'noreply@wiseandpure.com', name: 'Wise and Pure' },
      to: [{ email: process.env.RECEIVER_EMAIL }],
      subject: notificationSubject,
      htmlContent: htmlContentAngel,
      ...(safeEmail ? { replyTo: { email: safeEmail, name: safeName } } : {}),
    });

    if (safeEmail) {
      await sendBrevoEmail(buildAutoReplyPayload(safeName, safeEmail, isEs));
    }

    return jsonResponse(200, { success: true });
  } catch (error) {
    console.error('send-email handler error', error);
    return jsonResponse(500, { success: false, error: 'Failed to send.' });
  }
}
