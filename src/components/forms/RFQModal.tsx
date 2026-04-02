"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./RFQModal.module.css";
import { useTranslations } from "next-intl";

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
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      quantity: formData.get("quantity"),
      notes: formData.get("notes"),
      productName,
      sku,
    };

    // Simulate API call
    console.log("RFQ Payload:", payload);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);
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
