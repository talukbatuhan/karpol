import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { buildAlternatesLanguages } from "@/lib/seo/alternates";

type ShowcasePageProps = {
  params: Promise<{ locale: string }>;
};

const SHOWCASE_IMAGES = [
  { id: "clampYellow", src: "/images/showcase/block-clamp-vertical-yellow.png" },
  { id: "krpSet", src: "/images/showcase/lifting-clamps-krp-set.png" },
  { id: "diaphragm", src: "/images/showcase/polyurethane-diaphragm.png" },
  { id: "rollers", src: "/images/showcase/polyurethane-rollers.png" },
  { id: "flanges", src: "/images/showcase/polyurethane-flanges-yellow.png" },
] as const;

function localeShowcasePath(locale: string): string {
  return locale === "tr" ? "/urun-gorselleri" : "/showcase";
}

export async function generateMetadata({ params }: ShowcasePageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProductShowcase");
  const path = localeShowcasePath(locale);

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}${path}`,
      languages: buildAlternatesLanguages((loc) => {
        const l = loc as string;
        return `${siteConfig.url}/${l}${localeShowcasePath(l)}`;
      }),
    },
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      url: `${siteConfig.url}/${locale}${path}`,
      images: [{ url: `${siteConfig.url}${SHOWCASE_IMAGES[0].src}` }],
    },
  };
}

export default async function ProductShowcasePage({ params }: ShowcasePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProductShowcase");
  const base = siteConfig.url.replace(/\/$/, "");

  return (
    <main className="section" style={{ background: "var(--ivory-canvas)" }}>
      <div className="container">
        <header style={{ marginBottom: "40px" }}>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-text">{t("description")}</p>
          <p className="section-text" style={{ marginTop: "12px", fontSize: "15px" }}>
            <strong style={{ fontWeight: 600 }}>{t("pageUrlLabel")}</strong>{" "}
            <a
              href={`/${locale}${localeShowcasePath(locale)}`}
              style={{ color: "var(--color-accent)", textDecoration: "underline" }}
            >
              {`${base}/${locale}${localeShowcasePath(locale)}`}
            </a>
          </p>
        </header>

        <ul
          style={{
            listStyle: "none",
            display: "grid",
            gap: "48px",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
          }}
        >
          {SHOWCASE_IMAGES.map((item) => {
            const imageUrl = `${base}${item.src}`;
            return (
              <li key={item.id}>
                <figure
                  style={{
                    margin: 0,
                    background: "var(--color-white)",
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                    boxShadow: "0 8px 28px rgba(15, 23, 41, 0.06)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      background: "#fafafa",
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={t(`items.${item.id}.alt`)}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <figcaption style={{ padding: "16px 18px 18px" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "17px",
                        color: "var(--color-primary)",
                        marginBottom: "8px",
                      }}
                    >
                      {t(`items.${item.id}.title`)}
                    </div>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "14px", marginBottom: "10px" }}>
                      {t(`items.${item.id}.caption`)}
                    </p>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-dim)",
                        wordBreak: "break-all",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "var(--steel-600)" }}>{t("directUrlLabel")} </span>
                      <a href={imageUrl} style={{ color: "var(--color-accent)" }}>
                        {imageUrl}
                      </a>
                    </div>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
