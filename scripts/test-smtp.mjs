import nodemailer from "nodemailer";

function getConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/[\s-]/g, "");
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? user;

  const missing = [];
  if (!host) missing.push("SMTP_HOST");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (!to) missing.push("CONTACT_TO");
  if (!from) missing.push("CONTACT_FROM");

  if (missing.length > 0) {
    console.error("SMTP_NOT_CONFIGURED — eksik:", missing.join(", "));
    console.error("Bkz. docs/SMTP_SETUP.md");
    process.exit(1);
  }

  return { host, port, user, pass, to, from };
}

const config = getConfig();

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

try {
  await transporter.verify();
  console.log("SMTP verify OK");
} catch (err) {
  console.error("SMTP verify failed:", err.message);
  process.exit(1);
}

const info = await transporter.sendMail({
  from: config.from,
  to: config.to,
  subject: "[Karpol Test] SMTP bağlantı testi",
  text: [
    "Bu mesaj npm run contact:test ile gönderildi.",
    `Zaman: ${new Date().toISOString()}`,
    `Host: ${config.host}:${config.port}`,
  ].join("\n"),
});

console.log("Test email sent:", info.messageId);
