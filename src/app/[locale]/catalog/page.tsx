import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import AksanCatalog from "@/components/catalog/AksanCatalog";
import {
  getCatalogManifest,
  listCatalogIds,
  type CatalogManifest,
} from "@/lib/data/catalog-storage";

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
    description: t("pageSubtitle"),
  };
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  let manifests: CatalogManifest[];
  let loadError = false;

  try {
    const ids = await listCatalogIds();
    const defaultId = process.env.ECATALOG_DEFAULT_ID || "main";
    const sortedIds = Array.from(new Set([defaultId, ...ids]));
    manifests = await Promise.all(sortedIds.map((id) => getCatalogManifest(id)));
  } catch {
    manifests = [];
    loadError = true;
  }

  return <AksanCatalog manifests={manifests} loadError={loadError} />;
}
