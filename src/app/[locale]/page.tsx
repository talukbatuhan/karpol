import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig, productCategories } from "@/lib/config";
import styles from "./page.module.css";
import {
  ShieldCheck,
  Globe,
  Factory,
  DraftingCompass,
  Truck,
  ArrowRight,
  ChevronRight,
  Zap,
  Award,
} from "lucide-react";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Hero");
  const tNav = await getTranslations("Navigation");
  const tHome = await getTranslations("Home");

  return (
    <div className={styles.page}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Background layers */}
        <div className={styles.heroBg}>
          <div className={styles.heroNoise} />
          <div className={styles.heroGrid} />
          <div className={styles.heroGradient} />
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            {/* Badge */}
            <div className={styles.heroBadge}>
              <Zap size={11} />
              <span>{t("badge")}</span>
            </div>

            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>{t("headline")}</span>
            </h1>

            <p className={styles.heroSubtitle}>{t("subheadline")}</p>

            <div className={styles.heroActions}>
              <Link href="/products" className={styles.heroPrimaryBtn}>
                <span>{t("primaryBtn")}</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link href="/custom-manufacturing" className={styles.heroSecondaryBtn}>
                {t("secondaryBtn")}
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Partners */}
            <div className={styles.heroPartners}>
              <span className={styles.heroPartnersLabel}>{t("partnersLabel")}</span>
              <div className={styles.heroPartnerBadges}>
                <span className={styles.partnerBadge}>COVESTRO</span>
                <span className={styles.partnerDot} />
                <span className={styles.partnerBadge}>LANXESS</span>
                <span className={styles.partnerDot} />
                <span className={styles.partnerBadge}>SIMEC</span>
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className={styles.heroStats}>
            {[
              { value: "25+", label: t("stats.years") },
              { value: "50+", label: t("stats.countries") },
              { value: "10K+", label: t("stats.parts") },
              { value: "ISO", label: t("stats.iso") },
            ].map((s, i) => (
              <div
                key={s.label}
                className={styles.statCard}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span>{t("scrollLabel")}</span>
        </div>
      </section>

      {/* ─── TRUST STRIP ─────────────────────────────────── */}
      <div className={styles.trustStrip}>
        <div className={styles.trustStripInner}>
          {[
            { icon: ShieldCheck, label: t("trust1"), sub: tHome("trustStrip.item1Sub") },
            { icon: Globe, label: t("trust2"), sub: tHome("trustStrip.item2Sub") },
            { icon: Factory, label: t("trust3"), sub: tHome("trustStrip.item3Sub") },
            { icon: Award, label: t("trust4"), sub: tHome("trustStrip.item4Sub") },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={sub} className={styles.trustItem}>
              <div className={styles.trustIcon}><Icon size={20} strokeWidth={1.5} /></div>
              <div>
                <div className={styles.trustLabel}>{label}</div>
                <div className={styles.trustSub}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MATERIALS / PRODUCTS ────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionEyebrow}>
              <span className={styles.eyebrowLine} />
              {tHome("materialsTitle")}
            </div>
            <h2 className={styles.sectionTitle}>{tHome("materialsSubtitle")}</h2>
            <p className={styles.sectionDesc}>{tHome("materialsDescription")}</p>
          </div>

          <div className={styles.productsGrid}>
            {[
              { href: "/products/polyurethane-components", category: "polyurethane-components", titleKey: "products.polyurethane.title", descKey: "products.polyurethane.desc", accent: "#c8a85a", num: "01" },
              { href: "/products/vulkollan-components",    category: "vulkollan-components",    titleKey: "products.vulkollan.title",    descKey: "products.vulkollan.desc",    accent: "#e07b3c", num: "02" },
              { href: "/products/rubber-components",       category: "rubber-components",       titleKey: "products.rubber.title",       descKey: "products.rubber.desc",       accent: "#5b9bd5", num: "03" },
              { href: "/products/silicone-components",     category: "silicone-components",     titleKey: "products.silicone.title",     descKey: "products.silicone.desc",     accent: "#6ec6a0", num: "04" },
              { href: "/products/aluminum-machined-parts", category: "aluminum-machined-parts", titleKey: "products.cnc.title",          descKey: "products.cnc.desc",          accent: "#a78bfa", num: "05" },
              { href: "/custom-manufacturing",             category: null,                      titleKey: "products.custom.title",       descKey: "products.custom.desc",       accent: "#f43f5e", num: "06", featured: true },
            ].map(({ href, category, titleKey, descKey, accent, num, featured }) => (
              <Link
                key={href}
                href={category ? { pathname: "/products/[category]", params: { category } } : "/custom-manufacturing"}
                className={`${styles.productCard} ${featured ? styles.productCardFeatured : ""}`}
                style={{ "--card-accent": accent } as React.CSSProperties}
              >
                <span className={styles.productNum}>{num}</span>
                <div className={styles.productCardBody}>
                  <h3 className={styles.productCardTitle}>{tHome(titleKey as any)}</h3>
                  <p className={styles.productCardDesc}>{tHome(descKey as any)}</p>
                </div>
                <div className={styles.productCardFooter}>
                  <span className={styles.productCardLink}>
                    {tHome("products.viewLink")} <ArrowRight size={13} />
                  </span>
                </div>
                <div className={styles.productCardBar} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY KARPOL ──────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div className={styles.whyLeft}>
              <div className={styles.sectionEyebrow}>
                <span className={styles.eyebrowLine} />
                {tHome("why.eyebrow")}
              </div>
              <h2 className={styles.sectionTitle}>
                {tHome("why.title").split("\n").map((line, idx) => (
                  <span key={idx}>
                    {idx > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h2>
              <p className={styles.sectionDesc}>{tHome("why.description")}</p>
              <Link href="/about" className={styles.outlineBtn}>
                {tHome("why.learnMoreCta")}
                <ArrowRight size={15} />
              </Link>

              {/* Visual block */}
              <div className={styles.whyVisual}>
                <div className={styles.whyVisualInner}>
                  <div className={styles.whyVisualStat}>
                    <span>99.8%</span>
                    <small>{tHome("why.visual.qualityRate")}</small>
                  </div>
                  <div className={styles.whyVisualBar} />
                  <div className={styles.whyVisualStat}>
                    <span>48h</span>
                    <small>{tHome("why.visual.quoteTime")}</small>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.whyRight}>
              {[
                {
                  icon: ShieldCheck,
                  title: tHome("why.cards.materialsTitle"),
                  desc: tHome("why.cards.materialsDesc"),
                },
                {
                  icon: DraftingCompass,
                  title: tHome("why.cards.engineeringTitle"),
                  desc: tHome("why.cards.engineeringDesc"),
                },
                {
                  icon: Truck,
                  title: tHome("why.cards.logisticsTitle"),
                  desc: tHome("why.cards.logisticsDesc"),
                },
                {
                  icon: Zap,
                  title: tHome("why.cards.speedTitle"),
                  desc: tHome("why.cards.speedDesc"),
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={styles.featureCard} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={styles.featureIconWrap}><Icon size={22} strokeWidth={1.5} /></div>
                  <div>
                    <h3 className={styles.featureTitle}>{title}</h3>
                    <p className={styles.featureDesc}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaBg}>
          <div className={styles.ctaGlow} />
          <div className={styles.ctaNoise} />
        </div>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaEyebrow}>
              <span className={styles.eyebrowLine} />
                {tHome("cta.eyebrow")}
            </div>
              <h2 className={styles.ctaTitle}>
                {tHome("cta.title").split("\n").map((line, idx) => (
                  <span key={idx}>
                    {idx > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h2>
              <p className={styles.ctaDesc}>{tHome("cta.description")}</p>
            <div className={styles.ctaActions}>
              <Link href="/contact" className={styles.ctaPrimaryBtn}>
                  {tHome("cta.primaryCta")}
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link href="/products" className={styles.ctaSecondaryBtn}>
                  {tHome("cta.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
