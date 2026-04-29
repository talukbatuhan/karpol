"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { toast } from "@/components/ui";
import styles from "./GatedDatasheetDownload.module.css";

type GatedDatasheetDownloadProps = {
  title: string;
  fileUrl: string;
  /** Stored as catalog_name for the lead row */
  catalogLabel: string;
};

export default function GatedDatasheetDownload({
  title,
  fileUrl,
  catalogLabel,
}: GatedDatasheetDownloadProps) {
  const t = useTranslations("ProductDetail");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!consent) {
      setError(t("gatedDownload.privacyError"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead/datasheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          company: company.trim() || undefined,
          catalog_name: catalogLabel,
          file_url: fileUrl,
          locale,
          marketing_opt_in: marketing,
          privacy_consent: consent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : t("gatedDownload.submitError");
        throw new Error(msg);
      }
      toast.success(t("gatedDownload.toastSuccess"));
      setOpen(false);
      const url = typeof data.download_url === "string" ? data.download_url : fileUrl;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("gatedDownload.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.card}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <div className={styles.meta}>
          <div className={styles.icon}>
            <FileText size={18} strokeWidth={1.6} />
          </div>
          <span className={styles.title}>{title}</span>
        </div>
        <span className={styles.action}>
          <Download size={11} strokeWidth={1.6} aria-hidden />
          PDF
        </span>
      </button>

      {open && (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gated-dl-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="gated-dl-title" className={styles.panelTitle}>
              {t("gatedDownload.title")}
            </h2>
            <p className={styles.panelSub}>
              {t("gatedDownload.subtitle", { title, path: pathname })}
            </p>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="gated-email">
                {t("gatedDownload.email")}
              </label>
              <input
                id="gated-email"
                type="email"
                autoComplete="email"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="gated-company">
                {t("gatedDownload.company")}
              </label>
              <input
                id="gated-company"
                type="text"
                autoComplete="organization"
                className={styles.input}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>{t("gatedDownload.privacyConsent")}</span>
            </label>
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>{t("gatedDownload.marketingOptIn")}</span>
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                disabled={submitting || !email.trim()}
                onClick={submit}
              >
                {submitting ? t("gatedDownload.sending") : t("gatedDownload.continue")}
              </button>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setOpen(false)}
              >
                {t("gatedDownload.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
