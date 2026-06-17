import {
  isContactEmailConfigured,
  sendContactEmail,
} from "@/lib/email/send-contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactFormInput = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

export type ContactSubmitResult =
  | { ok: true }
  | { error: string };

function trimField(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function parseContactFormData(
  formData: FormData,
): ContactSubmitResult | ContactFormInput {
  if (trimField(formData.get("website"), 200)) {
    return { ok: true };
  }

  const name = trimField(formData.get("name"), 120);
  const email = trimField(formData.get("email"), 254);
  const message = trimField(formData.get("message"), 5000);

  if (name.length < 2) return { error: "NAME_TOO_SHORT" };
  if (!EMAIL_RE.test(email)) return { error: "INVALID_EMAIL" };
  if (message.length < 10) return { error: "MESSAGE_TOO_SHORT" };

  return { name, email, message };
}

export function parseContactJson(
  body: unknown,
): ContactSubmitResult | ContactFormInput {
  if (!body || typeof body !== "object") {
    return { error: "INVALID_BODY" };
  }

  const record = body as Record<string, unknown>;

  if (trimField(record.website, 200)) {
    return { ok: true };
  }

  const name = trimField(record.name, 120);
  const email = trimField(record.email, 254);
  const message = trimField(record.message, 5000);

  if (name.length < 2) return { error: "NAME_TOO_SHORT" };
  if (!EMAIL_RE.test(email)) return { error: "INVALID_EMAIL" };
  if (message.length < 10) return { error: "MESSAGE_TOO_SHORT" };

  return { name, email, message };
}

export async function submitContact(
  input: ContactFormInput,
): Promise<ContactSubmitResult> {
  if (!isContactEmailConfigured()) {
    return { error: "EMAIL_NOT_CONFIGURED" };
  }

  try {
    await sendContactEmail(input);
    return { ok: true };
  } catch (err) {
    console.error("[contact]", err);
    return { error: "SEND_FAILED" };
  }
}
