"use client";
"use no memo";

import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/cn";
import {
  Modal,
  Label,
  Input,
  Textarea,
  FormAlert,
  Button,
} from "@/components/ui";

type WhatsAppChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  sku?: string;
};

function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

function resolveTargetNumber(): string {
  const candidate =
    siteConfig.whatsapp ||
    siteConfig.contact.phone ||
    "";
  return normalizeWhatsAppNumber(candidate);
}

const overlayClass =
  "fixed inset-0 z-modal flex items-center justify-center bg-[rgba(8,11,18,0.62)] p-5 backdrop-blur-[6px] [-webkit-backdrop-filter:blur(6px)]";

const panelClass =
  "w-full max-w-[460px] overflow-hidden rounded-[18px] border border-[var(--border-color,rgba(15,23,41,0.08))] bg-[var(--bg-secondary,#ffffff)] text-[var(--text-main,#0f1729)] shadow-modal";

const headerClass =
  "flex items-center justify-between gap-3 bg-gradient-to-br from-[#128C7E] to-[#25D366] px-[18px] py-4 text-white";

const bodyClass =
  "flex flex-col gap-2.5 px-[18px] py-[18px]";

const inputClass =
  "w-full rounded-[10px] border border-[var(--border-color,rgba(15,23,41,0.16))] bg-[var(--bg-main,#ffffff)] px-3 py-2.5 text-sm text-[var(--text-main,#0f1729)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-muted,#64748b)] focus:border-[#25D366] focus:shadow-[0_0_0_3px_rgba(37,211,102,0.18)]";

const textareaClass = cn(inputClass, "min-h-[96px] resize-y leading-relaxed");

const footerClass =
  "flex justify-end gap-2.5 border-t border-[var(--border-color,rgba(15,23,41,0.06))] px-[18px] pb-[18px] pt-3.5";

const btnGhost =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--border-color,rgba(15,23,41,0.18))] bg-transparent px-4 py-2.5 text-[13px] font-semibold tracking-wide text-[var(--text-body,#475569)] transition-colors hover:border-[var(--border-hover,rgba(15,23,41,0.32))] hover:text-[var(--text-main,#0f1729)] disabled:cursor-not-allowed disabled:opacity-60";

const btnPrimary =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#25D366] bg-[#25D366] px-4 py-2.5 text-[13px] font-semibold tracking-wide text-[#0a3a25] transition-colors hover:border-[#1ebd57] hover:bg-[#1ebd57] disabled:cursor-not-allowed disabled:opacity-60";

export default function WhatsAppChatModal({
  isOpen,
  onClose,
  productName,
  sku,
}: WhatsAppChatModalProps) {
  const t = useTranslations("WhatsAppChat");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      setIsSending(false);
      setErrorMsg(null);
      setOpened(false);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  const targetNumber = resolveTargetNumber();
  const productLabel = productName
    ? sku
      ? `${productName} (${sku})`
      : productName
    : "";

  const buildWhatsAppUrl = (msg: string) => {
    const text = encodeURIComponent(msg);
    return `https://wa.me/${targetNumber}?text=${text}`;
  };

  const composeMessage = () => {
    const lines: string[] = [];
    lines.push(`Merhaba KARPOL,`);
    if (productLabel) lines.push(`Ürün: ${productLabel}`);
    if (typeof window !== "undefined") {
      lines.push(`Sayfa: ${window.location.href}`);
    }
    lines.push("");
    if (message.trim()) lines.push(message.trim());
    else lines.push("Bu ürün için bilgi almak istiyorum.");
    lines.push("");
    if (name.trim()) lines.push(`İletişim: ${name.trim()}`);
    if (phone.trim()) lines.push(`Telefon: ${phone.trim()}`);
    return lines.join("\n");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!targetNumber) {
      setErrorMsg(
        "WhatsApp hattı henüz yapılandırılmamış. Lütfen iletişim sayfasını kullanın.",
      );
      return;
    }
    if (!message.trim() && !productLabel) {
      setErrorMsg("Lütfen kısa bir mesaj yazın.");
      return;
    }

    setIsSending(true);
    setErrorMsg(null);

    const payload = {
      name: name.trim() || null,
      phone: phone.trim() || null,
      message: message.trim() || `Bilgi talebi: ${productLabel || "genel"}`,
      product_name: productName || null,
      sku: sku || null,
      source_page:
        typeof window !== "undefined" ? window.location.pathname : null,
      locale,
    };

    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn("WhatsApp log endpoint failed:", data);
      }
    } catch (err) {
      console.warn("WhatsApp log endpoint network error:", err);
    } finally {
      const url = buildWhatsAppUrl(composeMessage());
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) {
        window.location.href = url;
      } else {
        setOpened(true);
      }
      setIsSending(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      overlayClassName={overlayClass}
      contentClassName={panelClass}
      contentProps={{ role: "dialog", "aria-modal": true }}
    >
      <div className={headerClass}>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white"
            aria-hidden
          >
            <svg viewBox="0 0 32 32" width="22" height="22">
              <path
                fill="currentColor"
                d="M16.001 4C9.376 4 4 9.376 4 16c0 2.117.555 4.166 1.609 5.97L4 28l6.21-1.625A11.94 11.94 0 0 0 16 28c6.624 0 12-5.376 12-12S22.625 4 16.001 4Zm0 21.84a9.83 9.83 0 0 1-5.014-1.378l-.36-.214-3.685.964.987-3.59-.235-.37A9.834 9.834 0 0 1 6.16 16c0-5.42 4.42-9.84 9.841-9.84S25.842 10.58 25.842 16s-4.42 9.84-9.841 9.84Zm5.395-7.358c-.296-.148-1.752-.866-2.024-.965-.272-.099-.469-.148-.667.148-.197.296-.766.965-.94 1.162-.173.197-.346.222-.642.074-.296-.148-1.249-.46-2.379-1.466-.879-.784-1.473-1.751-1.646-2.047-.173-.296-.018-.456.13-.604.133-.132.296-.346.444-.519.149-.173.198-.296.297-.494.099-.197.05-.37-.025-.519-.074-.148-.667-1.609-.914-2.205-.241-.578-.486-.498-.668-.508l-.568-.01c-.197 0-.519.074-.79.37-.272.296-1.04 1.014-1.04 2.476 0 1.461 1.066 2.873 1.214 3.07.148.197 2.097 3.197 5.078 4.486.71.307 1.262.49 1.694.628.711.227 1.358.195 1.87.118.57-.085 1.752-.716 1.999-1.408.247-.692.247-1.286.173-1.408-.074-.123-.272-.197-.568-.346Z"
              />
            </svg>
          </span>
          <div>
            <div className="text-[15px] font-bold tracking-wide">{t("title")}</div>
            <div className="mt-0.5 text-xs opacity-[0.86]">{t("subtitle")}</div>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 text-[22px] leading-none text-white transition-colors hover:bg-white/30"
          onClick={onClose}
          aria-label={t("close")}
        >
          ×
        </button>
      </div>

      {opened ? (
        <div className="flex flex-col items-center px-6 pb-6 pt-7 text-center">
          <div
            className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(37,211,102,0.16)] text-[28px] text-[#25D366]"
            aria-hidden
          >
            ✓
          </div>
          <h4 className="mb-1.5 text-lg text-[var(--text-main,#0f1729)]">
            {t("openedTitle")}
          </h4>
          <p className="max-w-[320px] text-[13px] leading-relaxed text-[var(--text-body,#475569)]">
            {t("openedText")}
          </p>
          <Button
            type="button"
            className={cn(btnPrimary, "mt-3 justify-center")}
            onClick={onClose}
          >
            {t("close")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={bodyClass}>
            {productLabel && (
              <div className="mb-1 inline-flex max-w-full items-center gap-2 self-start rounded-[10px] border border-[rgba(37,211,102,0.3)] bg-[rgba(37,211,102,0.1)] px-3 py-2 text-xs text-[#128C7E]">
                <span className="font-bold uppercase tracking-wider opacity-85">
                  {t("aboutLabel")}
                </span>
                {productLabel}
              </div>
            )}

            <Label
              htmlFor="wac-name"
              className="mt-1 text-xs font-semibold text-[var(--text-body,#475569)]"
            >
              {t("nameLabel")}
            </Label>
            <Input
              id="wac-name"
              className={inputClass}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
            />

            <Label
              htmlFor="wac-phone"
              className="mt-1 text-xs font-semibold text-[var(--text-body,#475569)]"
            >
              {t("phoneLabel")}
            </Label>
            <Input
              id="wac-phone"
              className={inputClass}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+90 5XX XXX XX XX"
              autoComplete="tel"
            />

            <Label htmlFor="wac-msg" className="mt-1 text-xs font-semibold text-[var(--text-body,#475569)]">
              {t("messageLabel")}{" "}
              <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="wac-msg"
              className={textareaClass}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              rows={4}
              required
            />

            {errorMsg && (
              <FormAlert className="mt-1.5 rounded-[10px]">{errorMsg}</FormAlert>
            )}

            <p className="mt-1 text-[11px] leading-snug text-[var(--text-muted,#64748B)]">
              {t("disclaimer")}
            </p>
          </div>

          <div className={footerClass}>
            <Button
              type="button"
              className={btnGhost}
              onClick={onClose}
              disabled={isSending}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className={btnPrimary}
              disabled={isSending}
            >
              <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden>
                <path
                  fill="currentColor"
                  d="M16.001 4C9.376 4 4 9.376 4 16c0 2.117.555 4.166 1.609 5.97L4 28l6.21-1.625A11.94 11.94 0 0 0 16 28c6.624 0 12-5.376 12-12S22.625 4 16.001 4Z"
                />
              </svg>
              {isSending ? t("sending") : t("send")}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
