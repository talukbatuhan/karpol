import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase-admin";
import { renderWhatsAppEmail, sendNotificationMail } from "@/lib/mailer";

/**
 * POST /api/whatsapp
 *
 * Site üzerindeki WhatsApp chat modal'ından gelen mesajları kayıt altına alır.
 * İki davranış vardır:
 *
 * 1) Loglama (her zaman çalışır):
 *    Mesaj `whatsapp_chats` tablosuna yazılır. Supabase SQL şeması için
 *    `docs/development/supabase_whatsapp_chats.sql` dosyasına bakın.
 *
 * 2) Sunucu-tarafı WhatsApp Cloud API forward (opsiyonel):
 *    Aşağıdaki ENV değişkenlerinin tamamı tanımlıysa mesaj Meta Cloud API
 *    ile sizin iş telefonunuza gönderilir:
 *      WHATSAPP_CLOUD_API_TOKEN  - Meta Business System User access token
 *      WHATSAPP_PHONE_NUMBER_ID  - Bir WhatsApp Business numarasının
 *                                  Cloud API'deki PhoneNumber ID'si
 *      WHATSAPP_TARGET_NUMBER    - Mesajın gideceği numara (rakam, ülke
 *                                  kodu dahil, ör. 905426652560).
 *      WHATSAPP_GRAPH_API_VERSION - opsiyonel, varsayılan v20.0
 *
 *    Eksikse forward atlanır; modal yine kullanıcıyı `wa.me` deep-link'i
 *    ile WhatsApp Web'e/uygulamasına yönlendirdiği için iletişim hâlâ
 *    sağlanır.
 */

const schema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  message: z.string().min(1, "message is required"),
  product_name: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  source_page: z.string().nullable().optional(),
  locale: z.string().nullable().optional(),
});

type Payload = z.infer<typeof schema>;

function buildOutgoingText(p: Payload): string {
  const parts: string[] = [];
  parts.push("📩 Yeni siteden mesaj — KARPOL");
  if (p.product_name) {
    parts.push(`Ürün: ${p.product_name}${p.sku ? ` (${p.sku})` : ""}`);
  }
  if (p.source_page) parts.push(`Sayfa: ${p.source_page}`);
  if (p.locale) parts.push(`Dil: ${p.locale}`);
  parts.push("");
  parts.push(p.message.trim());
  parts.push("");
  if (p.name) parts.push(`Ad: ${p.name}`);
  if (p.phone) parts.push(`Telefon: ${p.phone}`);
  return parts.join("\n");
}

async function forwardToCloudApi(
  payload: Payload,
): Promise<{ ok: boolean; reason?: string; messageId?: string }> {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const target = process.env.WHATSAPP_TARGET_NUMBER;
  const version = process.env.WHATSAPP_GRAPH_API_VERSION || "v20.0";

  if (!token || !phoneId || !target) {
    return { ok: false, reason: "cloud_api_not_configured" };
  }

  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to: target,
    type: "text",
    text: { body: buildOutgoingText(payload) },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        reason: `cloud_api_error_${res.status}: ${JSON.stringify(data)}`,
      };
    }
    const messageId =
      Array.isArray(data?.messages) && data.messages[0]?.id
        ? String(data.messages[0].id)
        : undefined;
    return { ok: true, messageId };
  } catch (err) {
    return {
      ok: false,
      reason: `cloud_api_exception: ${err instanceof Error ? err.message : "unknown"}`,
    };
  }
}

export async function POST(request: NextRequest) {
  let parsed: Payload;
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    parsed = result.data;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const forwarded = await forwardToCloudApi(parsed);

  // Supabase log — service role yoksa veya tablo eksikse build'i kırmıyoruz.
  let logId: string | null = null;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("whatsapp_chats")
      .insert({
        name: parsed.name,
        phone: parsed.phone,
        message: parsed.message,
        product_name: parsed.product_name,
        sku: parsed.sku,
        source_page: parsed.source_page,
        locale: parsed.locale,
        forwarded: forwarded.ok,
        forward_error: forwarded.ok ? null : forwarded.reason || null,
        cloud_message_id: forwarded.messageId || null,
      })
      .select("id")
      .single();

    if (error) {
      console.warn("WhatsApp chat log insert failed:", error.message);
    } else if (data) {
      logId = data.id as string;
    }
  } catch (err) {
    console.warn(
      "WhatsApp chat log skipped:",
      err instanceof Error ? err.message : err,
    );
  }

  // Admin bildirim e-postası — kullanıcı wa.me'ye yönlendirilse de
  // mesajın bir kopyası kayıt amacıyla mailbox'a düşer.
  const mail = renderWhatsAppEmail(parsed);
  const mailResult = await sendNotificationMail({
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (!mailResult.ok) {
    console.warn("WhatsApp notification email skipped:", mailResult.reason);
  }

  return NextResponse.json({
    success: true,
    id: logId,
    forwarded: forwarded.ok,
    forward_status: forwarded.ok
      ? "cloud_api_sent"
      : forwarded.reason || "skipped",
    notified: mailResult.ok,
    notify_status: mailResult.ok ? "mail_sent" : mailResult.reason,
  });
}
