import nodemailer, { type Transporter } from "nodemailer";

/**
 * Tek noktadan SMTP transport.
 *
 * ENV:
 *   SMTP_HOST              (zorunlu)
 *   SMTP_PORT              (zorunlu, sayı)
 *   SMTP_USER              (opsiyonel — auth gereken çoğu durumda zorunlu)
 *   SMTP_PASS              (opsiyonel — app password)
 *   SMTP_SECURE            (opsiyonel: "true" => 465 / TLS, default false)
 *   SMTP_FROM              (opsiyonel — gönderici, varsayılan SMTP_USER)
 *   CONTACT_NOTIFY_EMAIL   (zorunlu — bildirimlerin gideceği yer)
 */

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  if (!host || !portRaw) return null;

  const port = Number(portRaw);
  if (!Number.isFinite(port)) return null;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = (process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  return cachedTransporter;
}

export interface SendMailInput {
  subject: string;
  html: string;
  text?: string;
  to?: string; // override
  replyTo?: string;
}

export interface SendMailResult {
  ok: boolean;
  reason?: string;
  messageId?: string;
}

export async function sendNotificationMail(
  input: SendMailInput,
): Promise<SendMailResult> {
  const transporter = getTransporter();
  if (!transporter) return { ok: false, reason: "smtp_not_configured" };

  const to = input.to || process.env.CONTACT_NOTIFY_EMAIL;
  if (!to) return { ok: false, reason: "no_recipient" };

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    "no-reply@karpol.net";

  try {
    const info = await transporter.sendMail({
      from: `"KARPOL Bildirim" <${from}>`,
      to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "smtp_send_error",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                              Mail HTML helpers                              */
/* -------------------------------------------------------------------------- */

const ESC: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function esc(value: string | null | undefined): string {
  if (value == null) return "";
  return String(value).replace(/[&<>"']/g, (c) => ESC[c] || c);
}

export interface RfqMailInput {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  product_interest?: string | null;
  quantity?: string | null;
  message: string;
  source_page?: string | null;
  locale?: string | null;
}

export function renderRfqEmail(p: RfqMailInput): { subject: string; html: string; text: string } {
  const subject = `Yeni teklif talebi — ${p.product_interest || "Genel"}`;

  const rows: Array<[string, string | null | undefined]> = [
    ["Ad Soyad", p.name],
    ["E-posta", p.email],
    ["Telefon", p.phone],
    ["Firma", p.company],
    ["İlgilenilen Ürün", p.product_interest],
    ["Miktar", p.quantity],
    ["Sayfa", p.source_page],
    ["Dil", p.locale],
  ];

  const tableRows = rows
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#64748B;width:160px;">${esc(label)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#0F1729;">${esc(String(value))}</td>
      </tr>`,
    )
    .join("");

  const html = `
<!doctype html>
<html lang="tr">
<head><meta charset="utf-8" /></head>
<body style="margin:0;background:#F4F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F1729;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,41,0.10);border:1px solid rgba(15,23,41,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,#0F1729 0%,#1B2540 100%);padding:24px 28px;color:#ffffff;">
            <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C8A85A;">KARPOL · Yeni Bildirim</div>
            <div style="font-size:22px;margin-top:6px;font-weight:600;">${esc(subject)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${tableRows}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px;">
            <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#64748B;margin-bottom:8px;">Mesaj</div>
            <div style="font-size:15px;line-height:1.6;color:#0F1729;background:#F8FAFC;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;white-space:pre-wrap;">${esc(p.message)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 28px 24px;color:#94A3B8;font-size:11px;letter-spacing:0.04em;">
            Bu bildirim, web sitesinden gelen "Özel Teklif Alın" formundan otomatik gönderildi.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  const text = [
    subject,
    ...rows
      .filter(([, v]) => v != null && String(v).trim() !== "")
      .map(([k, v]) => `${k}: ${v}`),
    "",
    "Mesaj:",
    p.message,
  ].join("\n");

  return { subject, html, text };
}

export interface WhatsAppMailInput {
  name?: string | null;
  phone?: string | null;
  message: string;
  product_name?: string | null;
  sku?: string | null;
  source_page?: string | null;
  locale?: string | null;
}

export function renderWhatsAppEmail(p: WhatsAppMailInput): { subject: string; html: string; text: string } {
  const productLabel = p.product_name
    ? p.sku
      ? `${p.product_name} (${p.sku})`
      : p.product_name
    : null;
  const subject = `Siteden WhatsApp mesajı — ${productLabel || "Genel"}`;

  const rows: Array<[string, string | null | undefined]> = [
    ["Ad", p.name],
    ["Telefon", p.phone],
    ["Ürün", productLabel],
    ["Sayfa", p.source_page],
    ["Dil", p.locale],
  ];

  const tableRows = rows
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#64748B;width:140px;">${esc(label)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#0F1729;">${esc(String(value))}</td>
      </tr>`,
    )
    .join("");

  const html = `
<!doctype html>
<html lang="tr">
<head><meta charset="utf-8" /></head>
<body style="margin:0;background:#F4F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F1729;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,41,0.10);border:1px solid rgba(15,23,41,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,#128C7E 0%,#25D366 100%);padding:22px 28px;color:#ffffff;">
            <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;opacity:0.85;">WhatsApp · Site Mesajı</div>
            <div style="font-size:20px;margin-top:6px;font-weight:600;">${esc(subject)}</div>
          </td>
        </tr>
        <tr><td style="padding:8px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tableRows}</table></td></tr>
        <tr>
          <td style="padding:18px 28px;">
            <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#64748B;margin-bottom:8px;">Mesaj</div>
            <div style="font-size:15px;line-height:1.6;color:#0F1729;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px 16px;white-space:pre-wrap;">${esc(p.message)}</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  const text = [subject, ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), "", "Mesaj:", p.message].join(
    "\n",
  );

  return { subject, html, text };
}
