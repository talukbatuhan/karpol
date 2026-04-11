import type { ComponentProps } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { siteConfig, productCategories } from "@/lib/config";
import styles from "./Footer.module.css";
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import { getTranslations } from "next-intl/server";

type LinkHref = ComponentProps<typeof Link>["href"];

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const telHref = siteConfig.contact.phone.replace(/[^\d+]/g, "");
  const t = await getTranslations("Footer");

  return (
    <footer className={styles.footer}>
      {/* Top accent */}
      <div className={styles.accentBar} />

      <div className={styles.inner}>
        {/* ── Brand Column ─────────────────────────── */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand}>
            <Image
              src="/karpol_logo.png"
              alt={siteConfig.name}
              width={240}
              height={72}
              className={styles.logo}
            />
          </Link>
          <p className={styles.description}>{t("description")}</p>

          {/* Social */}
          <div className={styles.socials}>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className={styles.socialBtn}
              aria-label="LinkedIn"
            >
              <Linkedin size={16} strokeWidth={1.75} />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className={styles.socialBtn}
              aria-label="Instagram"
            >
              <Instagram size={16} strokeWidth={1.75} />
            </a>
          </div>

          {/* Cert badge */}
          <div className={styles.certBadge}>
            <span className={styles.certDot} />
            ISO 9001 Certified
          </div>
        </div>

        {/* ── Company Links ─────────────────────────── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t("company")}</h4>
          <nav className={styles.linkList}>
            {[
              { href: "/about", label: t("about") },
              { href: "/contact", label: t("contactLink") },
              { href: "/catalog", label: t("catalogs") },
              { href: "/knowledge", label: t("knowledge") },
            ].map(({ href, label }) => (
              <Link key={href} href={href as LinkHref} className={styles.link}>
                <ArrowRight size={11} className={styles.linkArrow} />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Products ─────────────────────────────── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t("products")}</h4>
          <nav className={styles.linkList}>
            {productCategories.slice(0, 5).map((cat) => (
              <Link
                key={cat.slug}
                href={{ pathname: "/products/[category]", params: { category: cat.slug } }}
                className={styles.link}
              >
                <ArrowRight size={11} className={styles.linkArrow} />
                {cat.name}
              </Link>
            ))}
            <Link href="/products" className={`${styles.link} ${styles.linkAll}`}>
              {t("viewAllProducts")}
              <ArrowRight size={12} />
            </Link>
          </nav>
        </div>

        {/* ── Contact ──────────────────────────────── */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t("contact")}</h4>
          <div className={styles.contactList}>
            <a href={`mailto:${siteConfig.contact.email}`} className={styles.contactItem}>
              <div className={styles.contactIcon}><Mail size={14} strokeWidth={1.75} /></div>
              <span>{siteConfig.contact.email}</span>
            </a>
            <a href={`tel:${telHref}`} className={styles.contactItem}>
              <div className={styles.contactIcon}><Phone size={14} strokeWidth={1.75} /></div>
              <span>{siteConfig.contact.phone}</span>
            </a>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><MapPin size={14} strokeWidth={1.75} /></div>
              <span className={styles.addressLines}>
                <span className={styles.addressLine}>{siteConfig.legalName}</span>
                <span className={styles.addressLine}>{siteConfig.contact.address.street}</span>
                <span className={styles.addressLine}>{siteConfig.contact.address.city}</span>
                <span className={styles.addressLine}>{siteConfig.contact.address.country}</span>
              </span>
            </div>
          </div>

          <Link href="/contact" className={styles.quoteBtn}>
            {t("requestQuote")}
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {currentYear} {siteConfig.name}. {t("rights")}
          </p>
          <div className={styles.bottomLinks}>
            <NextLink href="/privacy" className={styles.bottomLink}>{t("privacy")}</NextLink>
            <span className={styles.bottomDot} />
            <NextLink href="/terms" className={styles.bottomLink}>{t("terms")}</NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
