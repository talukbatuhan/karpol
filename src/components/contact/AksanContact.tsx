"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Menu, X, ArrowUpRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteConfig } from "@/lib/config";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/industries" },
  { label: "Contact", href: "/contact" },
] as const;

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.235751464937!2d29.071552975844394!3d37.83136640889817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c71514b0e52a19%3A0x89fe5a9197d356c2!2sKarpol%20Poli%C3%BCretan%20-%20Denizli%20Poli%C3%BCretan%20-%20Vulkalon%20-%20Kau%C3%A7uk!5e0!3m2!1str!2str!4v1773314126432!5m2!1str!2str&maptype=roadmap";

function ContactLocaleSwitcher({ variant }: { variant: "desktop" | "mobile" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const locales = ["en", "tr"] as const;
  const wrapClass = variant === "desktop" ? "ak-locale" : "ak-nav-mobile-locale";
  return (
    <div className={wrapClass}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          className={locale === l ? "ak-locale-btn ak-locale-active" : "ak-locale-btn"}
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

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

function AksanContactInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const subjectFromQuery = searchParams.get("subject") || "";

  const phoneDisplay = siteConfig.contact.phone;
  const phoneTel = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
  const emailDisplay = siteConfig.contact.email;
  const mailtoHref = `mailto:${siteConfig.contact.email}`;
  const addressLines = [
    siteConfig.legalName,
    siteConfig.contact.address.street,
    `${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`,
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => ({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: subjectFromQuery,
    message: "",
  }));
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !form.subject) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error || "Bir hata oluştu.");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Mesaj gönderilemedi, lütfen tekrar deneyin.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ak-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5f2ee;
          color: #1a1814;
        }

        /* ── NAV ── */
        .ak-nav-wrap {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(245, 242, 238, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(160, 145, 120, 0.12);
        }

        .ak-nav {
          max-width: 1440px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 768px) { .ak-nav { padding: 1.5rem 3rem; } }
        @media (min-width: 1280px) { .ak-nav { padding: 1.5rem 5rem; } }

        .ak-brand {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #1a1814;
          text-decoration: none;
        }

        .ak-nav-links {
          display: none;
          list-style: none;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 768px) { .ak-nav-links { display: flex; } }

        .ak-nav-link {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(40, 35, 28, 0.6);
          text-decoration: none;
          transition: color 0.25s;
          position: relative;
        }
        .ak-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: #8b7355;
          transition: width 0.3s ease;
        }
        .ak-nav-link:hover { color: #1a1814; }
        .ak-nav-link:hover::after { width: 100%; }
        .ak-nav-link.active { color: #1a1814; }
        .ak-nav-link.active::after { width: 100%; }

        .ak-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid rgba(40, 35, 28, 0.2);
          border-radius: 4px;
          padding: 0.4rem;
          color: #1a1814;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ak-hamburger:hover { border-color: rgba(40, 35, 28, 0.4); }
        @media (min-width: 768px) { .ak-hamburger { display: none; } }

        .ak-nav-right {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }
        @media (min-width: 768px) { .ak-nav-right { display: flex; } }

        .ak-locale {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }

        .ak-locale-btn {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          background: transparent;
          border: 1px solid rgba(40, 35, 28, 0.2);
          color: rgba(40, 35, 28, 0.55);
          padding: 0.25rem 0.45rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ak-locale-btn:hover {
          border-color: rgba(139, 115, 85, 0.45);
          color: #1a1814;
        }
        .ak-locale-active {
          border-color: rgba(139, 115, 85, 0.55);
          color: #8b7355;
        }

        .ak-nav-mobile-locale {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem;
          padding: 0.75rem 0 0;
          border-top: 1px solid rgba(160, 145, 120, 0.12);
          margin-top: 0.5rem;
        }
        @media (min-width: 768px) { .ak-nav-mobile-locale { display: none; } }

        .ak-mobile-menu {
          position: absolute;
          top: 100%; left: 1rem; right: 1rem;
          background: rgba(245, 242, 238, 0.97);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(160, 145, 120, 0.15);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: slideDown 0.25s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ak-mobile-link {
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(40, 35, 28, 0.7);
          text-decoration: none;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(160, 145, 120, 0.1);
        }
        .ak-mobile-link:last-child { border-bottom: none; }
        .ak-mobile-link:hover { color: #1a1814; }

        /* ── PAGE LAYOUT ── */
        .ak-page {
          padding-top: 90px;
        }

        /* ── HERO STRIP ── */
        .ak-hero-strip {
          background: #1a1814;
          padding: 5rem 2rem 4rem;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) { .ak-hero-strip { padding: 6rem 3rem 5rem; } }
        @media (min-width: 1280px) { .ak-hero-strip { padding: 7rem 5rem 6rem; } }

        .ak-hero-strip::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 40%; height: 100%;
          background: radial-gradient(ellipse at top right, rgba(139, 115, 85, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .ak-hero-inner {
          max-width: 1440px;
          margin: 0 auto;
          position: relative;
        }

        .ak-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .ak-eyebrow-line {
          width: 28px; height: 1px;
          background: rgba(200, 185, 160, 0.5);
        }
        .ak-eyebrow-text {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(200, 185, 160, 0.7);
        }

        .ak-page-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(3.5rem, 8vw, 7.5rem);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: rgba(235, 230, 220, 0.95);
          margin-bottom: 1.5rem;
        }
        .ak-page-heading em {
          font-style: italic;
          color: #fff;
          font-weight: 400;
        }

        .ak-page-sub {
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          font-weight: 300;
          line-height: 1.8;
          color: rgba(190, 180, 165, 0.7);
          max-width: 480px;
          letter-spacing: 0.01em;
        }

        /* ── MAIN GRID ── */
        .ak-grid {
          max-width: 1440px;
          margin: 0 auto;
          padding: 5rem 2rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 768px) { .ak-grid { padding: 5rem 3rem; } }
        @media (min-width: 1024px) {
          .ak-grid {
            grid-template-columns: 1fr 1.6fr;
            gap: 5rem;
            padding: 6rem 5rem;
          }
        }

        /* ── LEFT PANEL ── */
        .ak-left { display: flex; flex-direction: column; gap: 2.5rem; }

        .ak-section-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(100, 85, 60, 0.6);
          margin-bottom: 1.5rem;
        }

        .ak-contact-card {
          padding: 1.75rem 0;
          border-top: 1px solid rgba(160, 145, 120, 0.15);
        }
        .ak-contact-card:first-child { border-top: none; padding-top: 0; }

        .ak-contact-icon-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .ak-icon-wrap {
          width: 36px; height: 36px;
          border: 1px solid rgba(139, 115, 85, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          background: rgba(139, 115, 85, 0.04);
        }

        .ak-contact-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(100, 85, 60, 0.55);
          margin-bottom: 0.35rem;
        }

        .ak-contact-value {
          font-size: 0.92rem;
          font-weight: 400;
          line-height: 1.6;
          color: #2a2520;
        }

        .ak-map {
          border: 1px solid rgba(160, 145, 120, 0.15);
          border-radius: 8px;
          overflow: hidden;
          height: 220px;
          position: relative;
          background: #e8e3dc;
        }
        .ak-map-frame {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        /* Work hours */
        .ak-hours-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem 1.5rem;
        }
        .ak-hour-row {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(160, 145, 120, 0.1);
          font-size: 0.82rem;
        }
        .ak-hour-day { color: rgba(50, 44, 35, 0.6); }
        .ak-hour-time { color: #2a2520; font-weight: 500; }

        /* ── RIGHT PANEL – FORM ── */
        .ak-form-panel {
          background: #fff;
          border: 1px solid rgba(160, 145, 120, 0.12);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 40px rgba(0,0,0,0.04);
        }
        @media (min-width: 768px) { .ak-form-panel { padding: 3rem; } }

        .ak-form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 400;
          line-height: 1.15;
          color: #1a1814;
          margin-bottom: 0.5rem;
        }
        .ak-form-heading em { font-style: italic; color: #8b7355; }

        .ak-form-desc {
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(50, 44, 35, 0.55);
          margin-bottom: 2.5rem;
        }

        .ak-field-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 640px) {
          .ak-field-row.two-col { grid-template-columns: 1fr 1fr; }
        }

        .ak-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .ak-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(50, 44, 35, 0.5);
          transition: color 0.2s;
        }
        .ak-label.focused { color: #8b7355; }

        .ak-input, .ak-textarea, .ak-select {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: #1a1814;
          background: #f8f6f3;
          border: 1px solid rgba(160, 145, 120, 0.18);
          border-radius: 8px;
          padding: 0.85rem 1rem;
          outline: none;
          transition: all 0.25s;
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
        }
        .ak-input::placeholder,
        .ak-textarea::placeholder { color: rgba(80, 70, 55, 0.3); }

        .ak-input:focus, .ak-textarea:focus, .ak-select:focus {
          border-color: rgba(139, 115, 85, 0.45);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.06);
        }

        .ak-textarea {
          resize: vertical;
          min-height: 130px;
          line-height: 1.65;
        }

        .ak-select-wrap {
          position: relative;
        }
        .ak-select-wrap::after {
          content: '';
          position: absolute;
          right: 1rem; top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 6px; height: 6px;
          border-right: 1.5px solid rgba(80, 70, 55, 0.4);
          border-bottom: 1.5px solid rgba(80, 70, 55, 0.4);
          pointer-events: none;
        }

        .ak-submit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .ak-required-note {
          font-size: 0.7rem;
          color: rgba(80, 70, 55, 0.4);
          letter-spacing: 0.04em;
        }

        .ak-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.9rem 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f5f2ee;
          background: #1a1814;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .ak-submit-btn:hover {
          background: #2d2820;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(26, 24, 20, 0.2);
        }
        .ak-submit-btn:active { transform: translateY(0); }
        .ak-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .ak-form-error {
          font-size: 0.82rem;
          color: #b42318;
          margin-top: 0.5rem;
        }

        .ak-reset-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          padding: 0.65rem 1.25rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8b7355;
          background: transparent;
          border: 1px solid rgba(139, 115, 85, 0.35);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ak-reset-btn:hover {
          background: rgba(139, 115, 85, 0.08);
        }

        /* Success state */
        .ak-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 2rem;
          gap: 1.5rem;
          min-height: 400px;
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ak-success-icon {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(139, 115, 85, 0.1);
          border: 1px solid rgba(139, 115, 85, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ak-success-tick {
          width: 22px; height: 22px;
          stroke: #8b7355;
          stroke-width: 1.5;
          fill: none;
        }
        .ak-success-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #1a1814;
          line-height: 1.2;
        }
        .ak-success-text {
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(50, 44, 35, 0.55);
          max-width: 320px;
        }
      `}</style>

      <div className="ak-root">

        {/* NAV */}
        <div className="ak-nav-wrap">
          <nav className="ak-nav" style={{ position: "relative" }}>
            <Link href="/" className="ak-brand">
              {siteConfig.name}
            </Link>
            <ul className="ak-nav-links">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`ak-nav-link${pathname === item.href ? " active" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="ak-nav-right">
              <ContactLocaleSwitcher variant="desktop" />
            </div>
            <button
              type="button"
              className="ak-hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            {menuOpen && (
              <div className="ak-mobile-menu">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="ak-mobile-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <ContactLocaleSwitcher variant="mobile" />
              </div>
            )}
          </nav>
        </div>

        <div className="ak-page">

          {/* HERO STRIP */}
          <div className="ak-hero-strip">
            <div className="ak-hero-inner">
              <div className="ak-eyebrow">
                <div className="ak-eyebrow-line" />
                <span className="ak-eyebrow-text">Get in Touch</span>
              </div>
              <h1 className="ak-page-heading">
                Let's Build<br /><em>Together.</em>
              </h1>
              <p className="ak-page-sub">
                Whether you need spare parts, custom polyurethane components, or heavy-duty transport solutions — our team is ready to support your operation.
              </p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="ak-grid">

            {/* LEFT: Contact Info */}
            <div className="ak-left">
              <div>
                <p className="ak-section-label">Contact Information</p>

                <div className="ak-contact-card">
                  <div className="ak-contact-icon-row">
                    <div className="ak-icon-wrap">
                      <MapPin size={15} color="#8b7355" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="ak-contact-label">Headquarters</p>
                      <p className="ak-contact-value">
                        {addressLines.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ak-contact-card">
                  <div className="ak-contact-icon-row">
                    <div className="ak-icon-wrap">
                      <Phone size={15} color="#8b7355" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="ak-contact-label">Phone</p>
                      <p className="ak-contact-value">
                        <a href={phoneTel} style={{ color: "inherit", textDecoration: "none" }}>
                          {phoneDisplay}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ak-contact-card">
                  <div className="ak-contact-icon-row">
                    <div className="ak-icon-wrap">
                      <Mail size={15} color="#8b7355" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="ak-contact-label">Email</p>
                      <p className="ak-contact-value">
                        <a href={mailtoHref} style={{ color: "inherit", textDecoration: "underline" }}>
                          {emailDisplay}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ak-contact-card">
                  <div className="ak-contact-icon-row">
                    <div className="ak-icon-wrap">
                      <Clock size={15} color="#8b7355" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="ak-contact-label">Working Hours</p>
                      <div style={{ marginTop: "0.5rem" }} className="ak-hours-grid">
                        {[
                          ["Mon – Fri", "08:00 – 18:00"],
                          ["Saturday", "08:00 – 13:00"],
                          ["Sunday", "Closed"],
                        ].map(([day, time]) => (
                          <div key={day} className="ak-hour-row" style={{ gridColumn: "1 / -1" }}>
                            <span className="ak-hour-day">{day}</span>
                            <span className="ak-hour-time">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ak-map">
                <iframe
                  className="ak-map-frame"
                  src={MAP_EMBED_SRC}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Karpol location"
                />
              </div>
            </div>

            {/* RIGHT: Form */}
            <div className="ak-form-panel">
              {submitted ? (
                <div className="ak-success">
                  <div className="ak-success-icon">
                    <svg className="ak-success-tick" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="ak-success-heading">Mesajınız İletildi</h2>
                  <p className="ak-success-text">
                    En kısa sürede size dönüş yapacağız. Ortalama yanıt süremiz 48 saattir.
                  </p>
                  <button
                    type="button"
                    className="ak-reset-btn"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        company: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Yeni Mesaj Gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="ak-form-heading">
                    Send a <em>Message</em>
                  </h2>
                  <p className="ak-form-desc">
                    Fill in your details and describe your needs. We&apos;ll get back to you with the right solution.
                  </p>

                  <div className="ak-field-row two-col">
                    <div className="ak-field">
                      <label className={`ak-label${focused === "name" ? " focused" : ""}`}>Full Name *</label>
                      <input
                        className="ak-input"
                        name="name"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        required
                      />
                    </div>
                    <div className="ak-field">
                      <label className={`ak-label${focused === "company" ? " focused" : ""}`}>Company</label>
                      <input
                        className="ak-input"
                        name="company"
                        placeholder="Your Company Ltd."
                        value={form.company}
                        onChange={handleChange}
                        onFocus={() => setFocused("company")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>

                  <div className="ak-field-row two-col">
                    <div className="ak-field">
                      <label className={`ak-label${focused === "email" ? " focused" : ""}`}>Email Address *</label>
                      <input
                        className="ak-input"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        required
                      />
                    </div>
                    <div className="ak-field">
                      <label className={`ak-label${focused === "phone" ? " focused" : ""}`}>Phone</label>
                      <input
                        className="ak-input"
                        name="phone"
                        placeholder="+1 (000) 000 0000"
                        value={form.phone}
                        onChange={handleChange}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>

                  <div className="ak-field-row">
                    <div className="ak-field">
                      <label className={`ak-label${focused === "subject" ? " focused" : ""}`}>Subject *</label>
                      <div className="ak-select-wrap">
                        <select
                          className="ak-select"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          onFocus={() => setFocused("subject")}
                          onBlur={() => setFocused(null)}
                          required
                        >
                          <option value="">Select a topic…</option>
                          <option value="Spare Parts Inquiry">Spare Parts Inquiry</option>
                          <option value="Polyurethane Components">Polyurethane Components</option>
                          <option value="Slab Factory Tools">Slab Factory Tools</option>
                          <option value="Heavy-Duty Transport Solutions">Heavy-Duty Transport Solutions</option>
                          <option value="Custom Order / OEM">Custom Order / OEM</option>
                          <option value="Partnership & Distribution">Partnership & Distribution</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="ak-field-row">
                    <div className="ak-field">
                      <label className={`ak-label${focused === "message" ? " focused" : ""}`}>Message *</label>
                      <textarea
                        className="ak-textarea"
                        name="message"
                        placeholder="Describe your requirements, machinery models, quantities, or any other relevant details…"
                        value={form.message}
                        onChange={handleChange}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        required
                      />
                    </div>
                  </div>

                  {error ? <p className="ak-form-error">{error}</p> : null}

                  <div className="ak-submit-row">
                    <span className="ak-required-note">* Required fields</span>
                    <button className="ak-submit-btn" type="submit" disabled={loading}>
                      {loading ? "Gönderiliyor…" : "Send Message"}
                      {!loading ? <ArrowUpRight size={14} strokeWidth={2} /> : null}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AksanContact() {
  return (
    <Suspense
      fallback={
        <div className="ak-root" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
          <span style={{ fontFamily: "DM Sans, sans-serif", color: "#1a1814" }}>Yükleniyor…</span>
        </div>
      }
    >
      <AksanContactInner />
    </Suspense>
  );
}
