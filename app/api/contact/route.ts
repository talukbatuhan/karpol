import { NextResponse } from "next/server";
import {
  isContactEmailConfigured,
  sendContactEmail,
} from "@/lib/email/send-contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimField(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  if (!isContactEmailConfigured()) {
    return NextResponse.json(
      { error: "EMAIL_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  if (trimField(record.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = trimField(record.name, 120);
  const email = trimField(record.email, 254);
  const message = trimField(record.message, 5000);

  if (name.length < 2) {
    return NextResponse.json({ error: "NAME_TOO_SHORT" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "MESSAGE_TOO_SHORT" }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
  }
}
