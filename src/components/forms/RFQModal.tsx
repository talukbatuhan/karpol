"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./RFQModal.module.css";
import { useLocale, useTranslations } from "next-intl";

type RFQModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  sku?: string;
};

export default function RFQModal({
  isOpen,
  onClose,
  productName,
  sku,
}: RFQModalProps) {
  const t = useTranslations("RFQModal");
  const locale = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const quantity = String(formData.get("quantity") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    const productLabel = sku ? `${productName} (${sku})` : productName;
    const messageBody =
      notes ||
      `Bu ürün için teklif talebim var: ${productLabel}` +
        (quantity ? ` — Adet: ${quantity}` : "");

    const payload = {
      name: fullName,
      email,
      phone: phone || undefined,
      company: company || undefined,
      product_interest: productLabel,
      quantity: quantity || undefined,
      message: messageBody,
      urgency: "standard" as const,
      file_urls: [],
      source_page:
        typeof window !== "undefined" ? window.location.pathname : undefined,
      locale,
    };

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data: { error?: string; details?: Record<string, string[]> } =
          await res.json().catch(() => ({}));
        const fieldErrors = data.details
          ? Object.values(data.details).flat().filter(Boolean).join(" · ")
          : null;
        throw new Error(
          fieldErrors || data.error || `Sunucu hatası (${res.status})`,
        );
      }

      setIsSuccess(true);
    } catch (err) {
      const fallback =
        "Talep gönderilemedi. Lütfen birkaç saniye sonra tekrar deneyin veya doğrudan iletişim sayfasını kullanın.";
      setErrorMsg(err instanceof Error ? err.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} ref={modalRef}>
        {isSuccess ? (
          <div className={styles.successContainer}>
            <span className={styles.successIcon}>✓</span>
            <h3 className={styles.successTitle}>{t("successTitle")}</h3>
            <p className={styles.successText}>
              {t("successMessage")}
            </p>
            <button className={styles.primaryBtn} onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
              {t("close")}
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div>
                <h3 className={styles.title}>{t("title")}</h3>
                <div className={styles.productContext}>
                  {productName} {sku && `(${sku})`}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.body}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullName" className={styles.label}>
                    {t("fullName")}
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="John Doe"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="company" className={styles.label}>
                    {t("company")}
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className={styles.input}
                    placeholder="Company Ltd."
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      {t("email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={styles.input}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      {t("phone")}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className={styles.input}
                      placeholder="+90 555..."
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="quantity" className={styles.label}>
                    {t("quantity")}
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    required
                    className={styles.input}
                    placeholder="100"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="notes" className={styles.label}>
                    {t("notes")}
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    className={styles.textarea}
                    placeholder={t("notesPlaceholder")}
                  />
                </div>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  style={{
                    margin: "0 24px 12px",
                    padding: "10px 14px",
                    border: "1px solid rgba(220, 38, 38, 0.35)",
                    background: "rgba(220, 38, 38, 0.10)",
                    color: "#DC2626",
                    borderRadius: 8,
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("sending") : t("submit")}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
