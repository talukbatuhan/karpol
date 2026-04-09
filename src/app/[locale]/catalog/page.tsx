import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getCatalogManifest, listCatalogIds } from "@/lib/data/catalog-storage";
import styles from "./catalog.module.css";

type CatalogPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Catalog");

  return {
    title: t("title"),
    description: t("title"),
  };
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Catalog");

  try {
    const ids = await listCatalogIds();
    const defaultId = process.env.ECATALOG_DEFAULT_ID || "main";
    const sortedIds = Array.from(new Set([defaultId, ...ids]));
    const manifests = await Promise.all(sortedIds.map((id) => getCatalogManifest(id)));

    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>{t("browseTitle")}</h1>
          <p className={styles.subtitle}>{t("browseSubtitle")}</p>
        </section>

        {manifests.length === 0 ? (
          <section className={styles.empty}>
            <h2>{t("emptyTitle")}</h2>
            <p>{t("emptySub")}</p>
          </section>
        ) : (
          <section className={styles.grid}>
            {manifests.map((catalog) => {
              const cover = catalog.pages[0]?.thumbUrl || catalog.pages[0]?.url || null;
              const title = catalog.title || catalog.catalogId.toUpperCase();
              return (
                <article key={catalog.catalogId} className={styles.card}>
                  {cover ? (
                    <img src={cover} alt={title} className={styles.cover} loading="lazy" />
                  ) : (
                    <div className={styles.coverFallback}>{title}</div>
                  )}

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <p className={styles.cardMeta}>
                      {catalog.totalPages} {t("toolbar.page")}
                    </p>
                    <Link
                      href={{
                        pathname: "/catalog/[catalogId]",
                        params: { catalogId: catalog.catalogId },
                      }}
                      className={styles.cardBtn}
                    >
                      {t("openCatalog")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    );
  } catch (err) {
    return (
      <main className={styles.page}>
        <section className={styles.empty}>
          <h2>{t("title")}</h2>
          <p>{t("error")}</p>
        </section>
      </main>
    );
  }
}
