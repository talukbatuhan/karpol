import { Metadata } from "next";
import CatalogViewer from "@/components/catalog/CatalogViewer";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getCatalogManifest,
  type CatalogManifest,
} from "@/lib/data/catalog-storage";

type CatalogDetailPageProps = {
  params: Promise<{ locale: string; catalogId: string }>;
};

export async function generateMetadata({
  params,
}: CatalogDetailPageProps): Promise<Metadata> {
  const { locale, catalogId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Catalog");

  try {
    const manifest = await getCatalogManifest(catalogId);
    return {
      title: manifest.title || `${t("title")} ${catalogId.toUpperCase()}`,
      description: manifest.title || t("title"),
    };
  } catch {
    return {
      title: t("title"),
      description: t("title"),
    };
  }
}

export default async function CatalogDetailPage({
  params,
}: CatalogDetailPageProps) {
  const { locale, catalogId } = await params;
  setRequestLocale(locale);

  let catalog: CatalogManifest;
  try {
    catalog = await getCatalogManifest(catalogId);
  } catch {
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

  return (
    <main style={{ paddingTop: 0 }}>
      <CatalogViewer catalog={catalog} />
    </main>
  );
}
