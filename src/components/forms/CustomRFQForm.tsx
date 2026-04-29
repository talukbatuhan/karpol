"use client";

import { useState, useCallback } from "react";
import styles from "./CustomRFQForm.module.css";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { toast } from "@/components/ui";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  Send,
  ChevronDown,
} from "lucide-react";
import {
  FormField,
  Label,
  Input,
  Textarea,
  Select,
  Button,
  Spinner,
} from "@/components/ui";

const MAX_ATTACHMENTS = 8;

export default function CustomRFQForm() {
  const t = useTranslations("CustomRFQ");
  const locale = useLocale();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      setFiles((prev) => {
        const next = [...prev, ...Array.from(e.dataTransfer.files)];
        if (next.length > MAX_ATTACHMENTS) {
          toast.error(t("toast.tooManyFiles", { max: MAX_ATTACHMENTS }));
        }
        return next.slice(0, MAX_ATTACHMENTS);
      });
    }
  }, [t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => {
        const next = [...prev, ...Array.from(e.target.files!)];
        if (next.length > MAX_ATTACHMENTS) {
          toast.error(t("toast.tooManyFiles", { max: MAX_ATTACHMENTS }));
        }
        return next.slice(0, MAX_ATTACHMENTS);
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const material = String(formData.get("material") || "").trim();
    const hardness = String(formData.get("hardness") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    const fileUrls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/rfq/attachments", { method: "POST", body: fd });
      if (!up.ok) {
        const err = await up.json().catch(() => ({}));
        setIsSubmitting(false);
        toast.error(
          typeof err.error === "string" ? err.error : t("toast.uploadFailed"),
        );
        return;
      }
      const data: { url?: string } = await up.json();
      if (data.url) fileUrls.push(data.url);
    }

    const lineParts = [
      notes,
      material ? `Material: ${material}` : "",
      hardness ? `Hardness: ${hardness}` : "",
    ].filter(Boolean);
    const messageBody =
      lineParts.length > 0
        ? lineParts.join("\n\n")
        : t("defaultMessageBody");

    const payload = {
      name: fullName,
      email,
      phone: phone || undefined,
      company: company || undefined,
      product_interest: "Custom manufacturing (CAD / technical files)",
      quantity: undefined,
      material_preference: material || undefined,
      hardness_requirement: hardness || undefined,
      message: messageBody,
      urgency: "standard" as const,
      file_urls: fileUrls,
      line_items: [],
      source_page: pathname,
      locale,
    };

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data.error || t("toast.submitFailed"));
      }
      toast.success(t("toast.success"));
      setIsSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("toast.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.successIconWrap}>
          <CheckCircle size={34} strokeWidth={1.5} />
        </div>
        <h3 className={styles.successTitle}>{t("successTitle")}</h3>
        <p className={styles.successText}>{t("successMessage")}</p>
        <Button
          type="button"
          className={styles.resetBtn}
          onClick={() => {
            setIsSuccess(false);
            setFiles([]);
          }}
        >
          Yeni Teklif Talebi
        </Button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>

      {/* ── Upload Zone ─────────────────────────────────── */}
      <div
        className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          accept=".pdf,.dwg,.dxf,.step,.stp,.jpg,.png"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className={styles.uploadIconWrap}>
          <Upload size={22} strokeWidth={1.5} />
        </div>
        <p className={styles.uploadText}>{t("uploadText")}</p>
        <p className={styles.uploadSub}>{t("uploadSubtext")}</p>
        <span className={styles.uploadBtn}>Dosya Seç</span>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((file, i) => (
            <div key={i} className={styles.fileItem}>
              <div className={styles.fileItemIcon}><FileText size={14} strokeWidth={1.75} /></div>
              <div className={styles.fileItemBody}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                className={styles.fileRemove}
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                aria-label="Dosyayı kaldır"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Contact Info ─────────────────────────────────── */}
      <div className={styles.sectionLabel}>İletişim Bilgileri</div>
      <div className={styles.grid2}>
        <FormField className={styles.field}>
          <Label htmlFor="fullName" className={styles.label}>
            {t("fullName")}
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            required
            className={styles.input}
            placeholder="Ad Soyad"
          />
        </FormField>
        <FormField className={styles.field}>
          <Label htmlFor="company" className={styles.label}>
            {t("company")}
          </Label>
          <Input
            id="company"
            name="company"
            type="text"
            required
            className={styles.input}
            placeholder="Şirket Adı"
          />
        </FormField>
        <FormField className={styles.field}>
          <Label htmlFor="email" className={styles.label}>
            {t("email")}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className={styles.input}
            placeholder="ornek@sirket.com"
          />
        </FormField>
        <FormField className={styles.field}>
          <Label htmlFor="phone" className={styles.label}>
            {t("phone")}
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            className={styles.input}
            placeholder="+90 555 000 00 00"
          />
        </FormField>
      </div>

      {/* ── Technical Specs ───────────────────────────────── */}
      <div className={styles.sectionLabel}>Teknik Özellikler</div>
      <div className={styles.grid2}>
        <FormField className={styles.field}>
          <Label htmlFor="material" className={styles.label}>
            {t("material")}
          </Label>
          <div className={styles.selectWrap}>
            <Select id="material" name="material" className={styles.select}>
              <option value="polyurethane">{t("materials.polyurethane")}</option>
              <option value="vulkollan">{t("materials.vulkollan")}</option>
              <option value="rubber">{t("materials.rubber")}</option>
              <option value="plastic">{t("materials.plastic")}</option>
              <option value="metal">{t("materials.metal")}</option>
              <option value="other">{t("materials.other")}</option>
            </Select>
            <ChevronDown size={14} className={styles.selectChevron} strokeWidth={2} />
          </div>
        </FormField>
        <FormField className={styles.field}>
          <Label htmlFor="hardness" className={styles.label}>
            {t("hardness")}
          </Label>
          <Input
            id="hardness"
            name="hardness"
            type="text"
            className={styles.input}
            placeholder="örn: 90 Shore A"
          />
        </FormField>
      </div>

      {/* ── Notes ─────────────────────────────────────────── */}
      <FormField className={styles.field}>
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

      {/* ── Submit ────────────────────────────────────────── */}
      <Button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? (
          <span className={styles.btnLoading}>
            <Spinner />
            Gönderiliyor...
          </span>
        ) : (
          <>
            <Send size={15} strokeWidth={2} />
            {t("submit")}
          </>
        )}
      </Button>
    </form>
  );
}