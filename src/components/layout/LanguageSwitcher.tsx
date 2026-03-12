"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import styles from "./Header.module.css"; // Reuse existing styles

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onSelectChange = (nextLocale: "en" | "tr") => {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className={styles.dropdown} style={{ marginLeft: "16px", borderLeft: "1px solid #e2e8f0", paddingLeft: "16px" }}>
      <button
        className={styles.dropdownTrigger}
        onClick={() => setOpen((prev) => !prev)}
        disabled={isPending}
        aria-label="Select Language"
      >
        {locale === "tr" ? "🇹🇷 TR" : "🇺🇸 EN"}
        <span style={{ fontSize: "10px", marginLeft: "2px" }}>▼</span>
      </button>
      
      {open && (
        <div className={styles.dropdownMenu} style={{ minWidth: "120px", right: 0, left: "auto" }}>
          <button
            className={styles.dropdownItem}
            onClick={() => onSelectChange("en")}
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
          >
            🇺🇸 English
          </button>
          <button
            className={styles.dropdownItem}
            onClick={() => onSelectChange("tr")}
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
          >
            🇹🇷 Türkçe
          </button>
        </div>
      )}
    </div>
  );
}
