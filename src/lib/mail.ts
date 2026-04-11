import nodemailer from 'nodemailer'
import { siteConfig } from '@/lib/config'

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS !== undefined &&
      process.env.SMTP_PASS !== ''
  )
}

export type ContactMailPayload = {
  name: string
  email: string
  phone?: string
  company?: string
  country?: string
  subject: string
  message: string
  submissionId?: string
}

/** Sends staff notification for a contact form submission. Best-effort; throws on SMTP send failure. */
export async function sendContactNotificationEmail(
  payload: ContactMailPayload
): Promise<void> {
  if (!isSmtpConfigured()) {
    console.warn(
      '[mail] SMTP_HOST / SMTP_USER / SMTP_PASS not set; contact notification email skipped'
    )
    return
  }

  const port = Number(process.env.SMTP_PORT) || 587
  const host = process.env.SMTP_HOST!.trim()
  const user = process.env.SMTP_USER!.trim()
  const pass = process.env.SMTP_PASS!

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  const to =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() || siteConfig.contact.email
  const fromName = process.env.SMTP_FROM_NAME?.trim() || siteConfig.name
  const from =
    process.env.SMTP_FROM?.trim() || `"${fromName}" <${user}>`

  const lines = [
    `Yeni iletişim formu — ${siteConfig.name}`,
    '',
    `Konu: ${payload.subject}`,
    payload.submissionId ? `Kayıt ID: ${payload.submissionId}` : null,
    '',
    `Ad: ${payload.name}`,
    `E-posta: ${payload.email}`,
    payload.phone ? `Telefon: ${payload.phone}` : null,
    payload.company ? `Şirket: ${payload.company}` : null,
    payload.country ? `Ülke: ${payload.country}` : null,
    '',
    'Mesaj:',
    payload.message,
  ].filter(Boolean) as string[]

  const text = lines.join('\n')

  const html = `
  <p><strong>Yeni iletişim formu</strong> — ${escapeHtml(siteConfig.name)}</p>
  <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
    <tr><td style="padding:4px 12px 4px 0;color:#666;">Konu</td><td>${escapeHtml(payload.subject)}</td></tr>
    ${payload.submissionId ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Kayıt ID</td><td>${escapeHtml(payload.submissionId)}</td></tr>` : ''}
    <tr><td style="padding:4px 12px 4px 0;color:#666;">Ad</td><td>${escapeHtml(payload.name)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666;">E-posta</td><td><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
    ${payload.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Telefon</td><td>${escapeHtml(payload.phone)}</td></tr>` : ''}
    ${payload.company ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Şirket</td><td>${escapeHtml(payload.company)}</td></tr>` : ''}
    ${payload.country ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Ülke</td><td>${escapeHtml(payload.country)}</td></tr>` : ''}
  </table>
  <p style="margin-top:16px;"><strong>Mesaj</strong></p>
  <pre style="white-space:pre-wrap;font-family:inherit;background:#f5f5f5;padding:12px;border-radius:8px;">${escapeHtml(payload.message)}</pre>
  `

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `[${siteConfig.name} İletişim] ${payload.subject}`,
    text,
    html,
  })
}
