"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { navigation, siteConfig } from "@/lib/config";
import styles from "./Header.module.css";
import dynamic from "next/dynamic";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, Search, ChevronDown, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Header() {
  const AdvancedSearch = dynamic(
    () => import("@/components/search/AdvancedSearch"),
    { ssr: false }
  );
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = useTranslations("Common");
  const tNav = useTranslations("Navigation");

  // Scroll detection for header elevation effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        {/* Top accent bar */}
        <div className={styles.accentBar} />

        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.brand} aria-label="Karpol Home">
            <Image
              src="/karpol_logo.png"
              alt={siteConfig.name}
              width={300}
              height={112}
              className={styles.logo}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Primary" ref={dropdownRef}>
            {navigation.main.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const hasChildren = "children" in item && item.children;
              const isOpen = activeDropdown === item.href;
              const labelKey =
                "key" in item && item.key ? item.key : item.label.toLowerCase();

              if (hasChildren) {
                return (
                  <div
                    key={item.href}
                    className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
                  >
                    <button
                      className={`${styles.dropdownTrigger} ${isActive ? styles.active : ""}`}
                      onClick={() => setActiveDropdown(isOpen ? null : item.href)}
                      onMouseEnter={() => setActiveDropdown(item.href)}
                      aria-expanded={isOpen}
                    >
                      <span>{tNav(labelKey)}</span>
                      <ChevronDown
                        size={13}
                        strokeWidth={2.5}
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                      />
                    </button>

                    <div
                      className={styles.dropdownMenu}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className={styles.dropdownInner}>
                        {item.children!.map((child, idx) => (
                          <Link
                            key={child.href}
                            href={child.href as any}
                            className={styles.dropdownItem}
                            style={{ animationDelay: `${idx * 40}ms` }}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className={styles.dropdownItemText}>{child.label}</span>
                            <ArrowRight size={12} className={styles.dropdownArrow} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                  <span>{tNav(labelKey)}</span>
                  <span className={styles.navLinkUnderline} />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search */}
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Search (⌘K)"
              title="Search (⌘K)"
            >
              <Search size={18} strokeWidth={2} />
              <span className={styles.iconBtnHint}>⌘K</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Divider */}
            <div className={styles.divider} aria-hidden="true" />

            {/* CTA Button */}
            <Link href="/contact" className={styles.ctaBtn}>
              <span>{t("request_quote")}</span>
              <ArrowRight size={14} className={styles.ctaArrow} strokeWidth={2.5} />
            </Link>

            {/* Mobile Toggle */}
            <button
              className={`${styles.mobileToggle} ${open ? styles.mobileToggleOpen : ""}`}
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={styles.toggleBar} />
              <span className={styles.toggleBar} />
              <span className={styles.toggleBar} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`${styles.mobileOverlay} ${open ? styles.mobileOverlayOpen : ""}`}
        aria-hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile Navigation">
          <div className={styles.mobileNavInner}>
            {navigation.main.map((item, idx) => (
              <div
                key={item.href}
                className={styles.mobileNavGroup}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <Link
                  href={item.href as any}
                  className={`${styles.mobileLink} ${pathname.startsWith(item.href) ? styles.mobileLinkActive : ""}`}
                >
                  {tNav("key" in item && item.key ? item.key : item.label.toLowerCase())}
                </Link>

                {"children" in item && item.children && (
                  <div className={styles.mobileSubLinks}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href as any}
                        className={styles.mobileSubLink}
                      >
                        <ArrowRight size={11} strokeWidth={2} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.mobileCta}>
            <Link href="/contact" className={styles.mobileCtaBtn}>
              {t("request_quote")}
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <AdvancedSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}