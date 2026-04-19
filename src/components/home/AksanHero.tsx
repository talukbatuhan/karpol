"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { siteConfig } from "@/lib/config";


const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "products", href: "/products" },
  { key: "solutions", href: "/industries" },
  { key: "contact", href: "/contact" },
] as const;

function HeroLocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const locales = ["en", "tr"] as const;
  return (
    <div className="hero-locale">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          className={
            locale === l ? "hero-locale-btn hero-locale-active" : "hero-locale-btn"
          }
          onClick={() => {
            // @ts-expect-error next-intl pathname typing
            router.replace(pathname, { locale: l });
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function AksanHero() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("HomeHero");
  const navLinks = NAV_ITEMS.map((item) => ({
    href: item.href,
    label: tNav(item.key),
  }));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .aksan-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0a0a0a;
        }

        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          background-color: #0a0a0a;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bg { animation: none !important; }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(8, 7, 12, 0.72) 0%,
            rgba(8, 7, 12, 0.45) 50%,
            rgba(8, 7, 12, 0.18) 100%
          );
          z-index: 1;
        }

        .hero-overlay-bottom {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8, 7, 12, 0.55) 0%,
            transparent 50%
          );
          z-index: 2;
        }

        .hero-overlay-top {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(8, 7, 12, 0.3) 0%,
            transparent 30%
          );
          z-index: 2;
        }

        .hero-content-wrapper {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          z-index: 10;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        @media (min-width: 768px) {
          .hero-content-wrapper { padding: 0 3rem; }
        }
        @media (min-width: 1280px) {
          .hero-content-wrapper { padding: 0 5rem; }
        }

        /* NAV */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.75rem 0;
          transition: all 0.4s ease;
        }

        .nav-brand {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #fff;
          text-decoration: none;
          position: relative;
        }

        .nav-brand::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(200, 185, 160, 0.6);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .nav-brand:hover::after { transform: scaleX(1); }

        .nav-links {
          display: none;
          list-style: none;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hero-locale {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }

        .hero-locale-btn {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(220, 215, 205, 0.75);
          padding: 0.25rem 0.45rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hero-locale-btn:hover {
          border-color: rgba(200, 185, 160, 0.5);
          color: #fff;
        }

        .hero-locale-active {
          border-color: rgba(200, 185, 160, 0.7);
          color: rgba(200, 185, 160, 1);
        }

        .nav-link {
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(220, 215, 205, 0.8);
          text-decoration: none;
          position: relative;
          transition: color 0.25s;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: rgba(200, 185, 160, 0.8);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: rgba(220, 215, 205, 1);
        }
        .nav-link:hover::after { width: 100%; }

        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          padding: 0.45rem;
          color: #fff;
          cursor: pointer;
          transition: all 0.25s;
        }
        .hamburger-btn:hover {
          border-color: rgba(200, 185, 160, 0.5);
          background: rgba(255,255,255,0.05);
        }
        @media (min-width: 768px) { .hamburger-btn { display: none; } }

        /* Mobile menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 1.5rem;
          right: 1.5rem;
          background: rgba(10, 9, 14, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(200, 185, 160, 0.1);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 50;
          animation: slideDown 0.25s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-link {
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(220, 215, 205, 0.85);
          text-decoration: none;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(200, 185, 160, 0.08);
          transition: color 0.2s;
        }
        .mobile-link:last-child { border-bottom: none; }
        .mobile-link:hover { color: #fff; }

        /* HERO CONTENT */
        .hero-main {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .hero-text-block {
          max-width: 680px;
          animation: contentReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(24px);
        }

        @keyframes contentReveal {
          to { opacity: 1; transform: translateY(0); }
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }

        .eyebrow-line {
          width: 32px;
          height: 1px;
          background: rgba(200, 185, 160, 0.7);
        }

        .eyebrow-text {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: rgba(200, 185, 160, 0.85);
        }

        .hero-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          line-height: 0.92;
          letter-spacing: -0.02em;
          margin-bottom: 2rem;
        }

        .heading-line1 {
          display: block;
          font-size: clamp(4rem, 10vw, 9rem);
          color: rgba(235, 230, 220, 0.92);
        }

        .heading-line2 {
          display: block;
          font-size: clamp(4rem, 10vw, 9rem);
          color: #fff;
          font-weight: 500;
          font-style: italic;
          margin-top: -0.08em;
        }

        .hero-subtitle {
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          font-weight: 300;
          line-height: 1.75;
          color: rgba(200, 195, 185, 0.75);
          max-width: 480px;
          margin-bottom: 2.5rem;
          letter-spacing: 0.01em;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0a0909;
          background: rgba(215, 205, 188, 0.95);
          border: 1px solid rgba(215, 205, 188, 0.4);
          border-radius: 100px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-primary:hover {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(215, 205, 188, 0.9);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(200, 185, 160, 0.25);
          border-radius: 100px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(200, 185, 160, 0.5);
          transform: translateY(-2px);
        }

        /* FOOTER BAR */
        .hero-footer {
          padding: 1.75rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(200, 185, 160, 0.08);
        }

        .hero-footer-stat {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(220, 210, 195, 0.9);
          letter-spacing: -0.01em;
        }

        .stat-label {
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(180, 170, 155, 0.6);
        }

        .hero-footer-divider {
          width: 1px;
          height: 32px;
          background: rgba(200, 185, 160, 0.12);
        }

        .hero-footer-stats {
          display: none;
          align-items: center;
          gap: 2rem;
        }
        @media (min-width: 768px) { .hero-footer-stats { display: flex; } }

        .scroll-indicator {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: rgba(180, 170, 155, 0.6);
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .scroll-line {
          width: 24px;
          height: 1px;
          background: rgba(200, 185, 160, 0.4);
          animation: scrollPulse 2s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="aksan-root">
        <section className="hero-section">
          <video
            className="hero-bg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-poster.jpg"
            aria-label={t("imageAlt")}
          >
            <source src="/videos/hero-loop.webm" type="video/webm" />
            <source src="/videos/hero-loop.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-overlay-top" />
          <div className="hero-overlay-bottom" />

          <div className="hero-content-wrapper">
            {/* NAV */}
            <nav className="nav" style={{ position: "relative" }}>
              <Link href="/" className="nav-brand">{siteConfig.name}</Link>

              <div className="nav-right">
                <ul className="nav-links">
                  {navLinks.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="nav-link">{item.label}</Link>
                    </li>
                  ))}
                </ul>

                <HeroLocaleSwitcher />

                <button
                  className="hamburger-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {menuOpen && (
                  <div className="mobile-menu">
                    {navLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="mobile-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* MAIN HERO CONTENT */}
            <div className="hero-main">
              <div className="hero-text-block">
                <div className="eyebrow">
                  <div className="eyebrow-line" />
                  <span className="eyebrow-text">{t("eyebrow")}</span>
                </div>

                <h1 className="hero-heading">
                  <span className="heading-line1">{t("titleLine1")}</span>
                  <span className="heading-line2">{t("titleLine2")}</span>
                </h1>

                <p className="hero-subtitle">{t("subtitle")}</p>

                <div className="hero-cta-group">
                  <Link href="/products" className="btn-primary">
                    {t("primaryCta")}
                    <ArrowUpRight size={14} strokeWidth={2} />
                  </Link>
                  <Link href="/contact" className="btn-secondary">
                    {t("secondaryCta")}
                  </Link>
                </div>
              </div>
            </div>

            {/* FOOTER BAR */}
            <div className="hero-footer">
              <div className="hero-footer-stats">
                <div className="hero-footer-stat">
                  <span className="stat-number">{t("stat1Number")}</span>
                  <span className="stat-label">{t("stat1Label")}</span>
                </div>
                <div className="hero-footer-divider" />
                <div className="hero-footer-stat">
                  <span className="stat-number">{t("stat2Number")}</span>
                  <span className="stat-label">{t("stat2Label")}</span>
                </div>
                <div className="hero-footer-divider" />
                <div className="hero-footer-stat">
                  <span className="stat-number">{t("stat3Number")}</span>
                  <span className="stat-label">{t("stat3Label")}</span>
                </div>
              </div>

              <div className="scroll-indicator">
                <div className="scroll-line" />
                <span>{t("scrollLabel")}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
