import { Metadata } from "next";
import CatalogViewer from "@/components/catalog/CatalogViewer";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getCatalogManifest } from "@/lib/data/catalog-storage";

type CatalogPageProps = {
  params: Promise<{ locale: string }>;
  // Next.js provides `searchParams` as a Promise in dynamic server contexts.
  // We must `await` it before accessing properties.
  searchParams?: Promise<{ catalogId?: string | string[] }>;
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

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const raw = resolvedSearchParams?.catalogId;
  const catalogIdRaw = Array.isArray(raw) ? raw[0] : raw;

  const catalogId =
    catalogIdRaw ||
    process.env.ECATALOG_DEFAULT_ID ||
    "main";

  try {
    const catalog = await getCatalogManifest(catalogId);

    return (
      <main style={{ paddingTop: 0 }}>
        <CatalogViewer catalog={catalog} />
      </main>
    );
  } catch (err) {
    const t = await getTranslations("Catalog");
    return (
      <main style={{ paddingTop: 0 }}>
        <div style={{ padding: "64px 16px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
            {t("title")}
          </h1>
          <p style={{ color: "#64748b", maxWidth: 720 }}>
            {t("error")}
          </p>
        </div>
      </main>
    );
  }
}

