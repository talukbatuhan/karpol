"use client";
"use no memo";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { siteConfig } from "@/lib/config";
import ThemeToggleButton from "@/components/layout/ThemeToggleButton";
import { useThemePreference } from "@/components/layout/ThemePreferenceProvider";
import { autoThemeFor } from "@/components/layout/ConditionalLocaleChrome";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "products", href: "/products" },
  { key: "solutions", href: "/industries" },
  { key: "catalog", href: "/catalog" },
  { key: "contact", href: "/contact" },
] as const;

function PremiumLocaleSwitcher({
  variant,
  children,
}: {
  variant: "desktop" | "mobile";
  children?: React.ReactNode;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const rawParams = useParams();
  const locales = ["en", "tr"] as const;
  const wrapClass = variant === "desktop" ? "pn-locale" : "pn-nav-mobile-locale";

  // Dynamic segments (category, slug, catalogId, ...) are LOCALIZED in our DB.
  // Strategy:
  //  1) Static localized pages → use next-intl router (proper SPA navigation)
  //  2) Dynamic pages → look up <link rel="alternate" hreflang="..."> emitted
  //     by the page's generateMetadata (canonical source of truth)
  //  3) Fallback → strip dynamic segments and navigate to the parent
  const handleSwitch = (target: (typeof locales)[number]) => {
    if (target === locale) return;
    const hasDynamic = pathname.includes("[") && pathname.includes("]");

    if (!hasDynamic) {
      // @ts-expect-error next-intl pathname template typing
      router.replace(pathname, { locale: target });
      return;
    }

    if (typeof document !== "undefined") {
      const altLink = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${target}"]`,
      );
      const href = altLink?.getAttribute("href");
      if (href) {
        // Full navigation — different dynamic slug → outside next-intl router
        window.location.assign(href);
        return;
      }
    }

    // Last-resort fallback: drop trailing dynamic segments
    const fallbackTemplate = pathname.replace(/\/\[[^/]+\](?:\/\[[^/]+\])*$/, "") || "/";
    try {
      const params = (rawParams ?? {}) as Record<string, string | string[]>;
      const filteredParams: Record<string, string | string[]> = {};
      for (const key of Object.keys(params)) {
        if (key === "locale") continue;
        filteredParams[key] = params[key];
      }
      router.replace(
        // @ts-expect-error next-intl dynamic pathname object typing
        { pathname, params: filteredParams },
        { locale: target },
      );
    } catch {
      // @ts-expect-error next-intl pathname template typing
      router.replace(fallbackTemplate, { locale: target });
    }
  };

  return (
    <div className={wrapClass}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          className={locale === l ? "pn-locale-btn pn-locale-active" : "pn-locale-btn"}
          onClick={() => handleSwitch(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
      {children}
    </div>
  );
}

export default function PremiumNav() {
  const tNav = useTranslations("Navigation");
  const pathname = usePathname();
  const { effective } = useThemePreference({
    autoEffective: autoThemeFor(pathname),
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = NAV_ITEMS.map((item) => ({
    href: item.href,
    label: tNav(item.key),
  }));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <style>{`
        .pn-root { font-family: 'DM Sans', var(--font-inter), system-ui, sans-serif; }

        .pn-nav-wrap {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(15, 23, 41, 0.08);
          box-shadow: 0 1px 0 rgba(15, 23, 41, 0.02);
        }
        .pn-nav {
          max-width: 1440px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        @media (min-width: 768px) { .pn-nav { padding: 1.25rem 2rem; } }
        @media (min-width: 1280px) { .pn-nav { padding: 1.25rem 3rem; } }

        .pn-brand {
          font-family: 'DM Sans', var(--font-inter), system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #0F1729;
          text-decoration: none;
          flex-shrink: 0;
        }
        .pn-brand:hover { color: #B09347; }

        .pn-nav-links {
          display: none;
          list-style: none;
          gap: 1.75rem;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        @media (min-width: 768px) { .pn-nav-links { display: flex; } }

        .pn-nav-link {
          font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(71, 85, 105, 0.85);
          text-decoration: none;
          transition: color 0.25s;
          position: relative;
        }
        .pn-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: #C8A85A;
          transition: width 0.3s ease;
        }
        .pn-nav-link:hover { color: #0F1729; }
        .pn-nav-link:hover::after { width: 100%; }
        .pn-nav-link.active { color: #0F1729; font-weight: 600; }
        .pn-nav-link.active::after { width: 100%; }

        .pn-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 41, 0.04);
          border: 1px solid rgba(15, 23, 41, 0.10);
          border-radius: 6px;
          padding: 0.45rem;
          color: #0F1729;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pn-hamburger:hover {
          border-color: rgba(200, 168, 90, 0.55);
          background: rgba(200, 168, 90, 0.10);
        }
        @media (min-width: 768px) { .pn-hamburger { display: none; } }

        .pn-nav-right {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }
        @media (min-width: 768px) { .pn-nav-right { display: flex; } }

        .pn-locale {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }
        .pn-locale-btn {
          font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          background: transparent;
          border: 1px solid rgba(15, 23, 41, 0.14);
          color: rgba(71, 85, 105, 0.85);
          padding: 0.25rem 0.4rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pn-locale-btn:hover {
          border-color: rgba(200, 168, 90, 0.55);
          color: #0F1729;
        }
        .pn-locale-active {
          border-color: #C8A85A;
          color: #B09347;
          background: rgba(200, 168, 90, 0.08);
        }

        .pn-nav-mobile-locale {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem;
          padding: 0.75rem 0 0;
          border-top: 1px solid rgba(15, 23, 41, 0.08);
          margin-top: 0.5rem;
        }
        @media (min-width: 768px) { .pn-nav-mobile-locale { display: none; } }

        .pn-mobile-menu {
          position: absolute;
          top: 100%; left: 1rem; right: 1rem;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(15, 23, 41, 0.08);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          animation: pnSlideDown 0.25s ease;
          box-shadow: 0 20px 40px rgba(15, 23, 41, 0.12);
        }
        @keyframes pnSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pn-mobile-link {
          font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(71, 85, 105, 0.85);
          text-decoration: none;
          padding: 0.65rem 0;
          border-bottom: 1px solid rgba(15, 23, 41, 0.06);
        }
        .pn-mobile-link:last-child { border-bottom: none; }
        .pn-mobile-link:hover { color: #B09347; }
        .pn-mobile-link.active { color: #0F1729; font-weight: 700; }

        .pn-theme-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(15, 23, 41, 0.14);
          color: rgba(71, 85, 105, 0.85);
          padding: 0.3rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s;
          width: 28px; height: 28px;
        }
        .pn-theme-btn:hover {
          border-color: rgba(200, 168, 90, 0.55);
          color: #B09347;
          background: rgba(200, 168, 90, 0.08);
        }
        .pn-theme-btn[data-pref="dark"] { color: #B09347; border-color: rgba(200, 168, 90, 0.45); }
        .pn-theme-btn[data-pref="light"] { color: #B09347; border-color: rgba(200, 168, 90, 0.45); }

        /* ── Dark theme variant (when user forces dark or homepage forced) ── */
        .pn-nav-wrap[data-theme="dark"] {
          background: rgba(8, 11, 18, 0.82);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-brand { color: #F1F5F9; }
        .pn-nav-wrap[data-theme="dark"] .pn-brand:hover { color: #C8A85A; }
        .pn-nav-wrap[data-theme="dark"] .pn-nav-link { color: rgba(203, 213, 225, 0.78); }
        .pn-nav-wrap[data-theme="dark"] .pn-nav-link:hover { color: #F1F5F9; }
        .pn-nav-wrap[data-theme="dark"] .pn-nav-link.active { color: #F1F5F9; }
        .pn-nav-wrap[data-theme="dark"] .pn-hamburger {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.10);
          color: #F1F5F9;
        }
        .pn-nav-wrap[data-theme="dark"] .pn-hamburger:hover {
          background: rgba(200, 168, 90, 0.14);
          border-color: rgba(200, 168, 90, 0.55);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-locale-btn {
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: rgba(203, 213, 225, 0.85);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-locale-btn:hover {
          border-color: rgba(200, 168, 90, 0.55);
          color: #F1F5F9;
        }
        .pn-nav-wrap[data-theme="dark"] .pn-locale-active {
          border-color: #C8A85A;
          color: #C8A85A;
          background: rgba(200, 168, 90, 0.12);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-theme-btn {
          border-color: rgba(255, 255, 255, 0.18);
          color: rgba(203, 213, 225, 0.85);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-theme-btn:hover {
          border-color: rgba(200, 168, 90, 0.55);
          color: #C8A85A;
          background: rgba(200, 168, 90, 0.12);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-theme-btn[data-pref="dark"],
        .pn-nav-wrap[data-theme="dark"] .pn-theme-btn[data-pref="light"] {
          color: #C8A85A;
        }
        .pn-nav-wrap[data-theme="dark"] .pn-mobile-menu {
          background: rgba(13, 18, 32, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.40);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-mobile-link {
          color: rgba(203, 213, 225, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .pn-nav-wrap[data-theme="dark"] .pn-mobile-link.active { color: #F1F5F9; }
        .pn-nav-wrap[data-theme="dark"] .pn-nav-mobile-locale {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <div className="pn-root">
        <div className="pn-nav-wrap" data-theme={effective}>
          <nav className="pn-nav" aria-label="Primary">
            <Link href="/" className="pn-brand">
              {siteConfig.name}
            </Link>
            <ul className="pn-nav-links">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`pn-nav-link${isActive(item.href) ? " active" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pn-nav-right">
              <PremiumLocaleSwitcher variant="desktop" />
              <ThemeToggleButton className="pn-theme-btn" />
            </div>
            <button
              type="button"
              className="pn-hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            {menuOpen && (
              <div className="pn-mobile-menu">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`pn-mobile-link${isActive(item.href) ? " active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <PremiumLocaleSwitcher variant="mobile">
                  <ThemeToggleButton className="pn-theme-btn" />
                </PremiumLocaleSwitcher>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
