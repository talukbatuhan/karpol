"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import styles from "./Header.module.css";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (nextLocale: "en" | "tr") => {
    startTransition(() => {
      // @ts-expect-error - next-intl types are too strict for generic pathname
      router.replace(pathname, { locale: nextLocale });
      setIsOpen(false);
    });
  };

  return (
    <div className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.iconBtn} ${isOpen ? styles.active : ""}`}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe size={18} strokeWidth={2} />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: 2, marginRight: 2 }}>
          {locale.toUpperCase()}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      <div className={styles.dropdownMenuRight}>
        <div className={styles.dropdownInner}>
          <button
            className={styles.dropdownItem}
            onClick={() => switchLocale("en")}
            disabled={isPending}
            style={{ width: "100%", border: "none", background: locale === "en" ? "rgba(255, 255, 255, 0.05)" : "transparent", cursor: "pointer", fontFamily: "inherit" }}
          >
            <span className={styles.dropdownItemText} style={{ color: locale === "en" ? "var(--h-accent)" : "inherit", textAlign: "left" }}>
              English (EN)
            </span>
          </button>
          <button
            className={styles.dropdownItem}
            onClick={() => switchLocale("tr")}
            disabled={isPending}
            style={{ width: "100%", border: "none", background: locale === "tr" ? "rgba(255, 255, 255, 0.05)" : "transparent", cursor: "pointer", fontFamily: "inherit" }}
          >
            <span className={styles.dropdownItemText} style={{ color: locale === "tr" ? "var(--h-accent)" : "inherit", textAlign: "left" }}>
              Türkçe (TR)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
