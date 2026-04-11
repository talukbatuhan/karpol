import { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ShieldCheck,
  Globe,
  MapPin,
  Gauge,
  DraftingCompass,
  Factory,
  ArrowRight,
  Award,
  Zap,
} from "lucide-react";
import styles from "./about.module.css";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

const MILESTONES = [
  { year: "1999", label: "Company Founded", desc: "Established in İzmir, Turkey" },
  { year: "2005", label: "ISO Certified", desc: "ISO 9001 quality standard achieved" },
  { year: "2012", label: "Global Expansion", desc: "Export operations to 20+ countries" },
  { year: "2020", label: "New Facility", desc: "Modern production campus opened" },
  { year: "2024", label: "50+ Markets", desc: "Worldwide distribution network" },
];

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  type AboutMsg = Parameters<typeof t>[0];

  return (
    <main className={styles.page}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroNoise} />
          <div className={styles.heroGrid} />
          <div className={styles.heroGradient} />
          <div className={styles.heroOrb} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Zap size={11} />
              <span>{t("hero.kicker")}</span>
            </div>

            <h1 className={styles.heroTitle}>{t("hero.title")}</h1>
            <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>

            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.primaryBtn}>
                {t("hero.primaryCta")}
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link href="/products" className={styles.secondaryBtn}>
                {t("hero.secondaryCta")}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Trust stats */}
          <div className={styles.heroTrust}>
            {[
              { icon: Gauge,  title: t("trust.yearsTitle"),    meta: t("trust.yearsMeta") },
              { icon: MapPin, title: t("trust.locationTitle"), meta: t("trust.locationMeta") },
              { icon: Globe,  title: t("trust.exportTitle"),   meta: t("trust.exportMeta") },
            ].map(({ icon: Icon, title, meta }, i) => (
              <div key={i} className={styles.trustCard}>
                <div className={styles.trustIcon}><Icon size={20} strokeWidth={1.5} /></div>
                <div>
                  <div className={styles.trustTitle}>{title}</div>
                  <div className={styles.trustMeta}>{meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ─── STORY ────────────────────────────────────────── */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>

            {/* Image */}
            <div className={styles.storyMedia}>
              <div className={styles.storyImageWrap}>
                <Image
                  src="/karpol_exterior_facade.png"
                  alt={`${siteConfig.name} ${t("story.imageAlt")}`}
                  fill
                  className={styles.storyImage}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  priority
                />
                <div className={styles.storyImageOverlay} />
              </div>

              {/* Floating badge on image */}
              <div className={styles.storyBadge}>
                <Award size={18} />
                <div>
                  <strong>ISO 9001</strong>
                  <span>Certified</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={styles.storyContent}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine} />
                {t("story.eyebrow")}
              </div>
              <h2 className={styles.sectionTitle}>{t("story.title")}</h2>
              <p className={styles.bodyText}>{t("story.p1")}</p>
              <p className={styles.bodyText}>{t("story.p2")}</p>

              <div className={styles.factGrid}>
                {[
                  { icon: Factory,        label: t("story.facilityLabel"), value: t("story.facilityValue") },
                  { icon: DraftingCompass, label: t("story.techLabel"),     value: t("story.techValue") },
                  { icon: ShieldCheck,    label: t("story.qualityLabel"),  value: t("story.qualityValue") },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className={styles.factItem}>
                    <div className={styles.factIcon}><Icon size={16} strokeWidth={1.75} /></div>
                    <div>
                      <div className={styles.factLabel}>{label}</div>
                      <div className={styles.factValue}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.addressBlock}>
                <MapPin size={13} className={styles.addressPin} />
                <div>
                  <div className={styles.addressLabel}>{t("story.addressLabel")}</div>
                  <div className={styles.addressValue}>{t("story.addressValue")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─────────────────────────────────────── */}
      <section className={styles.timeline}>
        <div className={styles.timelineBg} />
        <div className={styles.container}>
          <div className={styles.timelineHead}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Our Journey
            </div>
            <h2 className={styles.sectionTitle}>
              25 Years of Excellence
            </h2>
          </div>

          <div className={styles.timelineTrack}>
            <div className={styles.timelineRail} />
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={styles.milestone} style={{ animationDelay: `${i * 100}ms` }}>
                <div className={styles.milestoneDot} />
                <div className={styles.milestoneCard}>
                  <span className={styles.milestoneYear}>{m.year}</span>
                  <strong className={styles.milestoneLabel}>{m.label}</strong>
                  <p className={styles.milestoneDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUES ───────────────────────────────────────── */}
      <section className={styles.values}>
        <div className={styles.container}>
          <div className={styles.valuesHead}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              {t("values.eyebrow")}
            </div>
            <h2 className={styles.sectionTitle}>{t("values.title")}</h2>
            <p className={styles.lead}>{t("values.lead")}</p>
          </div>

          <div className={styles.valuesGrid}>
            {[
              { icon: ShieldCheck,     titleKey: "values.cards.quality.title",   textKey: "values.cards.quality.text",   num: "01" },
              { icon: Gauge,           titleKey: "values.cards.material.title",  textKey: "values.cards.material.text",  num: "02" },
              { icon: DraftingCompass, titleKey: "values.cards.prototype.title", textKey: "values.cards.prototype.text", num: "03" },
              { icon: Globe,           titleKey: "values.cards.delivery.title",  textKey: "values.cards.delivery.text",  num: "04" },
            ].map(({ icon: Icon, titleKey, textKey, num }) => (
              <div key={num} className={styles.valueCard}>
                <div className={styles.valueCardTop}>
                  <span className={styles.valueNum}>{num}</span>
                  <div className={styles.valueIcon}><Icon size={20} strokeWidth={1.5} /></div>
                </div>
                <h3 className={styles.valueTitle}>{t(titleKey as AboutMsg)}</h3>
                <p className={styles.valueText}>{t(textKey as AboutMsg)}</p>
                <div className={styles.valueBar} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaBg}>
          <div className={styles.ctaGlow} />
          <div className={styles.ctaNoise} />
        </div>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaLeft}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine} />
                {t("cta.title")}
              </div>
              <h2 className={styles.ctaTitle}>{t("cta.title")}</h2>
              <p className={styles.ctaText}>{t("cta.text")}</p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/contact" className={styles.primaryBtn}>
                {t("cta.primaryCta")}
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link href="/products" className={styles.secondaryBtn}>
                {t("cta.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}