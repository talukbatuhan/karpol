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

  const locales = [
    { code: "en", label: "English" },
    { code: "tr", label: "Turkce" },
    { code: "de", label: "Deutsch" },
    { code: "ar", label: "Arabic" },
  ] as const;

  const switchLocale = (nextLocale: (typeof locales)[number]["code"]) => {
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
        className={`${styles.iconBtn} ${styles.langTrigger} ${isOpen ? styles.active : ""}`}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe size={18} strokeWidth={2} />
        <span className={styles.langCode}>
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
          {locales.map((item) => (
            <button
              key={item.code}
              className={`${styles.dropdownItem} ${styles.langDropdownItem} ${locale === item.code ? styles.langDropdownItemActive : ""}`}
              onClick={() => switchLocale(item.code)}
              disabled={isPending}
            >
              <span
                className={`${styles.dropdownItemText} ${styles.langDropdownItemTextDefault} ${locale === item.code ? styles.langDropdownItemTextActive : ""}`}
              >
                {item.label} ({item.code.toUpperCase()})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
