"use client";
"use no memo";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";

type WhatsAppChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  sku?: string;
};

/** Sayısal olmayan karakterleri temizler (wa.me yalnızca rakam ister). */
function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

/** Ortam değişkeni veya site fallback'i — istisnasız bir numara döner. */
function resolveTargetNumber(): string {
  const candidate =
    siteConfig.whatsapp ||
    siteConfig.contact.phone ||
    "";
  return normalizeWhatsAppNumber(candidate);
}

export default function WhatsAppChatModal({
  isOpen,
  onClose,
  productName,
  sku,
}: WhatsAppChatModalProps) {
  const t = useTranslations("WhatsAppChat");
  const locale = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsSending(false);
      setErrorMsg(null);
      setOpened(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetNumber = resolveTargetNumber();
  const productLabel = productName
    ? sku
      ? `${productName} (${sku})`
      : productName
    : "";

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

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
      // Loglama / Cloud API forward başarısız olsa bile kullanıcıyı
      // wa.me ile yönlendiriyoruz; yalnızca konsola not düşelim.
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
        // Pop-up engellenmişse aynı sekmede aç
        window.location.href = url;
      } else {
        setOpened(true);
      }
      setIsSending(false);
    }
  };

  return (
    <div className="wac-overlay" onClick={handleOverlayClick}>
      <div className="wac-modal" ref={modalRef} role="dialog" aria-modal="true">
        <div className="wac-header">
          <div className="wac-header-left">
            <span className="wac-avatar" aria-hidden="true">
              {/* Inline WhatsApp ikon — bağımlılık eklemiyoruz */}
              <svg viewBox="0 0 32 32" width="22" height="22">
                <path
                  fill="currentColor"
                  d="M16.001 4C9.376 4 4 9.376 4 16c0 2.117.555 4.166 1.609 5.97L4 28l6.21-1.625A11.94 11.94 0 0 0 16 28c6.624 0 12-5.376 12-12S22.625 4 16.001 4Zm0 21.84a9.83 9.83 0 0 1-5.014-1.378l-.36-.214-3.685.964.987-3.59-.235-.37A9.834 9.834 0 0 1 6.16 16c0-5.42 4.42-9.84 9.841-9.84S25.842 10.58 25.842 16s-4.42 9.84-9.841 9.84Zm5.395-7.358c-.296-.148-1.752-.866-2.024-.965-.272-.099-.469-.148-.667.148-.197.296-.766.965-.94 1.162-.173.197-.346.222-.642.074-.296-.148-1.249-.46-2.379-1.466-.879-.784-1.473-1.751-1.646-2.047-.173-.296-.018-.456.13-.604.133-.132.296-.346.444-.519.149-.173.198-.296.297-.494.099-.197.05-.37-.025-.519-.074-.148-.667-1.609-.914-2.205-.241-.578-.486-.498-.668-.508l-.568-.01c-.197 0-.519.074-.79.37-.272.296-1.04 1.014-1.04 2.476 0 1.461 1.066 2.873 1.214 3.07.148.197 2.097 3.197 5.078 4.486.71.307 1.262.49 1.694.628.711.227 1.358.195 1.87.118.57-.085 1.752-.716 1.999-1.408.247-.692.247-1.286.173-1.408-.074-.123-.272-.197-.568-.346Z"
                />
              </svg>
            </span>
            <div>
              <div className="wac-title">{t("title")}</div>
              <div className="wac-sub">{t("subtitle")}</div>
            </div>
          </div>
          <button className="wac-close" onClick={onClose} aria-label={t("close")}>
            ×
          </button>
        </div>

        {opened ? (
          <div className="wac-body wac-success">
            <div className="wac-success-icon" aria-hidden="true">✓</div>
            <h4>{t("openedTitle")}</h4>
            <p>{t("openedText")}</p>
            <button
              type="button"
              className="wac-btn-primary"
              onClick={onClose}
              style={{ marginTop: 12 }}
            >
              {t("close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="wac-body">
              {productLabel && (
                <div className="wac-product-pill">
                  <span>{t("aboutLabel")}</span>
                  {productLabel}
                </div>
              )}

              <label className="wac-label" htmlFor="wac-name">
                {t("nameLabel")}
              </label>
              <input
                id="wac-name"
                className="wac-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                autoComplete="name"
              />

              <label className="wac-label" htmlFor="wac-phone">
                {t("phoneLabel")}
              </label>
              <input
                id="wac-phone"
                className="wac-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                autoComplete="tel"
              />

              <label className="wac-label" htmlFor="wac-msg">
                {t("messageLabel")} <span className="wac-required">*</span>
              </label>
              <textarea
                id="wac-msg"
                className="wac-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                rows={4}
                required
              />

              {errorMsg && (
                <div className="wac-error" role="alert">
                  {errorMsg}
                </div>
              )}

              <p className="wac-disclaimer">{t("disclaimer")}</p>
            </div>

            <div className="wac-footer">
              <button
                type="button"
                className="wac-btn-ghost"
                onClick={onClose}
                disabled={isSending}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="wac-btn-primary"
                disabled={isSending}
              >
                <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M16.001 4C9.376 4 4 9.376 4 16c0 2.117.555 4.166 1.609 5.97L4 28l6.21-1.625A11.94 11.94 0 0 0 16 28c6.624 0 12-5.376 12-12S22.625 4 16.001 4Z"
                  />
                </svg>
                {isSending ? t("sending") : t("send")}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .wac-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 11, 18, 0.62);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
          animation: wac-fade-in 0.18s ease-out;
        }
        @keyframes wac-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .wac-modal {
          width: 100%;
          max-width: 460px;
          background: var(--bg-secondary, #ffffff);
          color: var(--text-main, #0f1729);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
          border: 1px solid var(--border-color, rgba(15, 23, 41, 0.08));
          animation: wac-slide-up 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes wac-slide-up {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .wac-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          background: linear-gradient(135deg, #128C7E 0%, #25D366 100%);
          color: #ffffff;
        }
        .wac-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wac-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }
        .wac-title {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .wac-sub {
          font-size: 12px;
          opacity: 0.86;
          margin-top: 2px;
        }
        .wac-close {
          background: rgba(255, 255, 255, 0.16);
          border: none;
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .wac-close:hover { background: rgba(255, 255, 255, 0.28); }

        .wac-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .wac-product-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          margin-bottom: 4px;
          font-size: 12px;
          background: rgba(37, 211, 102, 0.10);
          border: 1px solid rgba(37, 211, 102, 0.30);
          color: #128C7E;
          border-radius: 10px;
          align-self: flex-start;
          max-width: 100%;
        }
        .wac-product-pill span {
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .wac-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-body, #475569);
          margin-top: 4px;
        }
        .wac-required { color: #DC2626; }
        .wac-input,
        .wac-textarea {
          width: 100%;
          font: inherit;
          font-size: 14px;
          padding: 10px 12px;
          border: 1px solid var(--border-color, rgba(15, 23, 41, 0.16));
          border-radius: 10px;
          background: var(--bg-main, #ffffff);
          color: var(--text-main, #0f1729);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .wac-textarea {
          resize: vertical;
          min-height: 96px;
          line-height: 1.5;
        }
        .wac-input:focus,
        .wac-textarea:focus {
          border-color: #25D366;
          box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.18);
        }
        .wac-error {
          margin-top: 6px;
          padding: 10px 12px;
          font-size: 13px;
          color: #DC2626;
          background: rgba(220, 38, 38, 0.08);
          border: 1px solid rgba(220, 38, 38, 0.32);
          border-radius: 10px;
        }
        .wac-disclaimer {
          margin-top: 4px;
          font-size: 11px;
          color: var(--text-muted, #64748B);
          line-height: 1.5;
        }

        .wac-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding: 14px 18px 18px;
          border-top: 1px solid var(--border-color, rgba(15, 23, 41, 0.06));
        }
        .wac-btn-ghost,
        .wac-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 10px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .wac-btn-ghost {
          background: transparent;
          color: var(--text-body, #475569);
          border: 1px solid var(--border-color, rgba(15, 23, 41, 0.18));
        }
        .wac-btn-ghost:hover {
          color: var(--text-main, #0f1729);
          border-color: var(--border-hover, rgba(15, 23, 41, 0.32));
        }
        .wac-btn-primary {
          background: #25D366;
          color: #0a3a25;
          border: 1px solid #25D366;
        }
        .wac-btn-primary:hover {
          background: #1ebd57;
          border-color: #1ebd57;
        }
        .wac-btn-primary:disabled,
        .wac-btn-ghost:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wac-success {
          align-items: center;
          text-align: center;
          padding: 28px 24px 24px;
        }
        .wac-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.16);
          color: #25D366;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 12px;
        }
        .wac-success h4 {
          margin: 0 0 6px;
          font-size: 18px;
          color: var(--text-main, #0f1729);
        }
        .wac-success p {
          margin: 0;
          font-size: 13px;
          color: var(--text-body, #475569);
          line-height: 1.5;
          max-width: 320px;
        }
      `}</style>
    </div>
  );
}
