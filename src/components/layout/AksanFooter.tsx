import type { ComponentProps } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { siteConfig, productCategories } from "@/lib/config";

type LinkHref = ComponentProps<typeof Link>["href"];

export default async function AksanFooter() {
  const t = await getTranslations("Footer");

  const companyLinks: { href: LinkHref; label: string }[] = [
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contactLink") },
    { href: "/catalog", label: t("catalogs") },
    { href: "/knowledge", label: t("knowledge") },
  ];

  const industryLinks: { href: LinkHref; label: string }[] = [
    { href: "/industries", label: t("footerIndustryAll") },
    { href: "/factory-technology", label: t("footerIndustryFactory") },
    { href: "/custom-manufacturing", label: t("footerIndustryCustom") },
    { href: "/products", label: t("footerIndustryProducts") },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ft-root {
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Dark theme (matches homepage hero) ── */
        .ft-theme-scope[data-theme="dark"] .ft-root {
          background: linear-gradient(180deg, #121018 0%, #0b0a0f 48%, #08070c 100%);
          color: rgba(235, 230, 220, 0.88);
          border-top: 1px solid rgba(200, 185, 160, 0.1);
        }
        .ft-theme-scope[data-theme="dark"] .ft-brand-name { color: rgba(250, 248, 242, 0.95); }
        .ft-theme-scope[data-theme="dark"] .ft-brand-desc { color: rgba(190, 180, 165, 0.55); }
        .ft-theme-scope[data-theme="dark"] .ft-cta {
          color: rgba(235, 228, 215, 0.92);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(200, 185, 160, 0.28);
        }
        .ft-theme-scope[data-theme="dark"] .ft-cta:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(200, 185, 160, 0.48);
        }
        .ft-theme-scope[data-theme="dark"] .ft-col-title { color: rgba(160, 145, 120, 0.45); }
        .ft-theme-scope[data-theme="dark"] .ft-col-link { color: rgba(195, 185, 168, 0.58); }
        .ft-theme-scope[data-theme="dark"] .ft-col-link:hover { color: rgba(230, 220, 200, 0.95); }
        .ft-theme-scope[data-theme="dark"] .ft-rule {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(200, 185, 160, 0.12) 15%,
            rgba(200, 185, 160, 0.12) 85%,
            transparent
          );
        }
        .ft-theme-scope[data-theme="dark"] .ft-copy { color: rgba(140, 128, 108, 0.42); }
        .ft-theme-scope[data-theme="dark"] .ft-social-btn {
          border: 1px solid rgba(200, 185, 160, 0.12);
          color: rgba(185, 172, 150, 0.5);
          background: rgba(255, 255, 255, 0.03);
        }
        .ft-theme-scope[data-theme="dark"] .ft-social-btn:hover {
          border-color: rgba(200, 185, 160, 0.28);
          color: rgba(240, 232, 218, 0.9);
          background: rgba(255, 255, 255, 0.06);
        }
        .ft-theme-scope[data-theme="dark"] .ft-divider-v { background: rgba(200, 185, 160, 0.1); }
        .ft-theme-scope[data-theme="dark"] .ft-legal-link { color: rgba(140, 128, 108, 0.38); }
        .ft-theme-scope[data-theme="dark"] .ft-legal-link:hover { color: rgba(200, 190, 170, 0.75); }

        /* ── Light theme (Ivory & Navy — matches public pages) ── */
        .ft-theme-scope[data-theme="light"] .ft-root {
          background: linear-gradient(180deg, #FBF8F2 0%, #F4F1EA 100%);
          color: rgba(15, 23, 41, 0.85);
          border-top: 1px solid rgba(15, 23, 41, 0.08);
        }
        .ft-theme-scope[data-theme="light"] .ft-brand-name { color: #0F1729; }
        .ft-theme-scope[data-theme="light"] .ft-brand-desc { color: rgba(71, 85, 105, 0.85); }
        .ft-theme-scope[data-theme="light"] .ft-cta {
          color: #0F1729;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(15, 23, 41, 0.14);
        }
        .ft-theme-scope[data-theme="light"] .ft-cta:hover {
          background: #C8A85A;
          border-color: #C8A85A;
          color: #0F1729;
        }
        .ft-theme-scope[data-theme="light"] .ft-col-title { color: rgba(176, 147, 71, 0.95); }
        .ft-theme-scope[data-theme="light"] .ft-col-link { color: rgba(71, 85, 105, 0.85); }
        .ft-theme-scope[data-theme="light"] .ft-col-link:hover { color: #B09347; }
        .ft-theme-scope[data-theme="light"] .ft-rule {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(15, 23, 41, 0.10) 15%,
            rgba(15, 23, 41, 0.10) 85%,
            transparent
          );
        }
        .ft-theme-scope[data-theme="light"] .ft-copy { color: rgba(100, 116, 139, 0.85); }
        .ft-theme-scope[data-theme="light"] .ft-social-btn {
          border: 1px solid rgba(15, 23, 41, 0.12);
          color: rgba(71, 85, 105, 0.85);
          background: rgba(255, 255, 255, 0.7);
        }
        .ft-theme-scope[data-theme="light"] .ft-social-btn:hover {
          border-color: rgba(200, 168, 90, 0.6);
          color: #B09347;
          background: rgba(200, 168, 90, 0.10);
        }
        .ft-theme-scope[data-theme="light"] .ft-divider-v { background: rgba(15, 23, 41, 0.12); }
        .ft-theme-scope[data-theme="light"] .ft-legal-link { color: rgba(100, 116, 139, 0.78); }
        .ft-theme-scope[data-theme="light"] .ft-legal-link:hover { color: #B09347; }

        .ft-main {
          max-width: 1440px;
          margin: 0 auto;
          padding: 3rem 2rem 2.25rem;
        }
        @media (min-width: 768px) {
          .ft-main { padding: 3.5rem 3rem 2.5rem; }
        }
        @media (min-width: 1280px) {
          .ft-main { padding: 4rem 5rem 2.75rem; }
        }

        .ft-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.25rem 2rem;
        }
        @media (min-width: 640px) {
          .ft-grid { grid-template-columns: minmax(200px, 1.35fr) 1fr 1fr 1fr; gap: 2.5rem 2.5rem; }
        }

        .ft-brand-name {
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          margin-bottom: 0.85rem;
        }

        .ft-brand-desc {
          font-size: 0.8rem;
          font-weight: 300;
          line-height: 1.75;
          max-width: 22rem;
          margin-bottom: 1.35rem;
        }

        .ft-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.65rem 1.4rem;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 100px;
          text-decoration: none;
          transition: all 0.28s ease;
          backdrop-filter: blur(8px);
        }
        .ft-cta:hover { transform: translateY(-1px); }

        .ft-col-title {
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .ft-col-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .ft-col-link {
          font-size: 0.81rem;
          font-weight: 400;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
        }

        .ft-rule {
          height: 1px;
          margin: 2rem 0 1.5rem;
        }
        @media (min-width: 768px) {
          .ft-rule { margin: 2.25rem 0 1.5rem; }
        }

        .ft-bottom {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .ft-bottom { padding: 0 3rem 2.25rem; }
        }
        @media (min-width: 1280px) {
          .ft-bottom { padding: 0 5rem 2.5rem; }
        }

        .ft-copy {
          font-size: 0.7rem;
          letter-spacing: 0.06em;
        }

        .ft-meta {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          flex-wrap: wrap;
        }

        .ft-socials {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .ft-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .ft-divider-v {
          width: 1px;
          height: 16px;
        }

        .ft-legal {
          display: flex;
          gap: 1.25rem;
        }

        .ft-legal-link {
          font-size: 0.68rem;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s ease;
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-main">
          <div className="ft-grid">
            <div className="ft-col-brand">
              <p className="ft-brand-name">{siteConfig.name}</p>
              <p className="ft-brand-desc">{t("description")}</p>
              <Link href="/contact" className="ft-cta">
                {t("requestQuote")}
                <ArrowUpRight size={14} strokeWidth={2} />
              </Link>
            </div>

            <div>
              <p className="ft-col-title">{t("products")}</p>
              <ul className="ft-col-links">
                {productCategories.slice(0, 4).map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={{ pathname: "/products/[category]", params: { category: cat.slug } }}
                      className="ft-col-link"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products" className="ft-col-link">
                    {t("viewAllProducts")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="ft-col-title">{t("company")}</p>
              <ul className="ft-col-links">
                {companyLinks.map((item) => (
                  <li key={String(item.href)}>
                    <Link href={item.href} className="ft-col-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="ft-col-title">{t("footerIndustriesColumn")}</p>
              <ul className="ft-col-links">
                {industryLinks.map((item) => (
                  <li key={String(item.href)}>
                    <Link href={item.href} className="ft-col-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ft-rule" aria-hidden="true" />
        </div>

        <div className="ft-bottom">
          <span className="ft-copy">
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </span>

          <div className="ft-meta">
            <div className="ft-socials">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="ft-social-btn"
                aria-label="LinkedIn"
              >
                <Linkedin size={13} strokeWidth={1.5} />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="ft-social-btn"
                aria-label="Instagram"
              >
                <Instagram size={13} strokeWidth={1.5} />
              </a>
            </div>
            <div className="ft-divider-v" aria-hidden="true" />
            <div className="ft-legal">
              <NextLink href="/privacy" className="ft-legal-link">
                {t("privacy")}
              </NextLink>
              <NextLink href="/terms" className="ft-legal-link">
                {t("terms")}
              </NextLink>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
