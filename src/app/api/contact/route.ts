import { NextResponse } from "next/server";
import {
  parseContactJson,
  submitContact,
} from "@/services/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = parseContactJson(body);
  if ("error" in parsed) {
    const status =
      parsed.error === "EMAIL_NOT_CONFIGURED"
        ? 503
        : parsed.error === "INVALID_BODY"
          ? 400
          : 400;
    return NextResponse.json({ error: parsed.error }, { status });
  }

  if ("ok" in parsed) {
    return NextResponse.json({ ok: true });
  }

  const result = await submitContact(parsed);
  if ("error" in result) {
    const status = result.error === "EMAIL_NOT_CONFIGURED" ? 503 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
