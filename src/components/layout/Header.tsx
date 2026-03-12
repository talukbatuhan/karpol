"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { navigation, siteConfig } from "@/lib/config";
import styles from "./Header.module.css";
import AdvancedSearch from "@/components/search/AdvancedSearch";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
            {siteConfig.name}
          </Link>

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {open ? "Close" : "Menu"}
          </button>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Primary">
            {navigation.main.map((item) => {
              if (item.children) {
                return (
                  <div key={item.href} className={styles.dropdown}>
                    <Link href={item.href} className={styles.dropdownTrigger}>
                      {item.label}
                      <span style={{ fontSize: "10px", marginLeft: "2px" }}>▼</span>
                    </Link>
                    <div className={styles.dropdownMenu}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={styles.dropdownItem}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Search & Language */}
          <div className={styles.desktopNav} style={{ marginLeft: "16px", borderLeft: "1px solid #e2e8f0", paddingLeft: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              className={styles.dropdownTrigger}
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              style={{ color: "#64748b" }}
            >
              🔍 <span style={{ fontSize: "12px", marginLeft: "4px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>⌘K</span>
            </button>

            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        {open ? (
          <nav id="mobile-menu" className={styles.mobileNav} aria-label="Mobile">
            <div className={styles.mobileInner}>
              <button 
                className={styles.mobileLink}
                onClick={() => { setSearchOpen(true); setOpen(false); }}
                style={{ textAlign: "left", color: "#ea580c" }}
              >
                🔍 Search Products...
              </button>
              {navigation.main.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.href}>
                      <div className={styles.mobileGroupLabel}>{item.label}</div>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={styles.mobileSubLink}
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.mobileLink}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </header>
      
      <AdvancedSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
