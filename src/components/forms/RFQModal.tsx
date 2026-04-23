"use client";

import { useState, useEffect } from "react";
import styles from "./RFQModal.module.css";
import { useLocale, useTranslations } from "next-intl";
import {
  Modal,
  FormField,
  Label,
  Input,
  Textarea,
  FormAlert,
  Button,
} from "@/components/ui";
import { useQuoteList } from "@/contexts/QuoteListContext";

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
  const { toRfqLineItems, clear } = useQuoteList();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

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
    const fromList = toRfqLineItems();
    const line_items =
      fromList.length > 0
        ? fromList
        : [
            {
              product_sku: sku,
              product_name: productName,
              quantity: quantity || undefined,
            },
          ];
    const messageBody =
      notes ||
      (fromList.length
        ? `Teklif listesi (${fromList.length} kalem) üzerinden talep. İlk referans: ${productLabel}.`
        : `Bu ürün için teklif talebim var: ${productLabel}`) +
        (quantity && !fromList.length ? ` — Adet: ${quantity}` : "");

    const payload = {
      name: fullName,
      email,
      phone: phone || undefined,
      company: company || undefined,
      product_interest:
        fromList.length > 0
          ? `Quote list (${fromList.length} items)`
          : productLabel,
      quantity: fromList.length ? String(fromList.length) : quantity || undefined,
      message: messageBody,
      urgency: "standard" as const,
      file_urls: [],
      line_items,
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
      clear();
    } catch (err) {
      const fallback =
        "Talep gönderilemedi. Lütfen birkaç saniye sonra tekrar deneyin veya doğrudan iletişim sayfasını kullanın.";
      setErrorMsg(err instanceof Error ? err.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      overlayClassName={styles.overlay}
      contentClassName={styles.modal}
    >
      {isSuccess ? (
        <div className={styles.successContainer}>
          <span className={styles.successIcon}>✓</span>
          <h3 className={styles.successTitle}>{t("successTitle")}</h3>
          <p className={styles.successText}>{t("successMessage")}</p>
          <Button
            type="button"
            className={styles.primaryBtn}
            onClick={onClose}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {t("close")}
          </Button>
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
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.body}>
              <FormField className={styles.formGroup}>
                <Label htmlFor="fullName" className={styles.label}>
                  {t("fullName")}
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="John Doe"
                />
              </FormField>

              <FormField className={styles.formGroup}>
                <Label htmlFor="company" className={styles.label}>
                  {t("company")}
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Company Ltd."
                />
              </FormField>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <FormField className={styles.formGroup}>
                  <Label htmlFor="email" className={styles.label}>
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={styles.input}
                    placeholder="john@company.com"
                  />
                </FormField>
                <FormField className={styles.formGroup}>
                  <Label htmlFor="phone" className={styles.label}>
                    {t("phone")}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className={styles.input}
                    placeholder="+90 555..."
                  />
                </FormField>
              </div>

              <FormField className={styles.formGroup}>
                <Label htmlFor="quantity" className={styles.label}>
                  {t("quantity")}
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  required
                  className={styles.input}
                  placeholder="100"
                />
              </FormField>

              <FormField className={styles.formGroup}>
                <Label htmlFor="notes" className={styles.label}>
                  {t("notes")}
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  className={styles.textarea}
                  placeholder={t("notesPlaceholder")}
                />
              </FormField>
            </div>

            {errorMsg && (
              <FormAlert className="mx-6 mb-3">{errorMsg}</FormAlert>
            )}

            <div className={styles.footer}>
              <Button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("sending") : t("submit")}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
