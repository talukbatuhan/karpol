import nodemailer from "nodemailer";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/[\s-]/g, "");
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? user;

  if (!host || !user || !pass || !to || !from) {
    return null;
  }

  return { host, port, user, pass, to, from };
}

export function isContactEmailConfigured(): boolean {
  return getSmtpConfig() !== null;
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port === 587,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const subject = `[Karpol İletişim] ${payload.name}`;
  const text = [
    `Ad Soyad: ${payload.name}`,
    `E-posta: ${payload.email}`,
    "",
    "Mesaj:",
    payload.message,
  ].join("\n");

  const html = `
    <p><strong>Ad Soyad:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>E-posta:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
    <hr />
    <p><strong>Mesaj:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
  `.trim();

  const info = await transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });

  if (process.env.NODE_ENV === "development") {
    console.info("[contact] sent", info.messageId);
  }
}
