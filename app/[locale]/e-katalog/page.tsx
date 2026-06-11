import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { CatalogCard } from "@/components/molecules/CatalogCard";
import { Reveal } from "@/components/motion/Reveal";
import { catalogs } from "@/lib/catalogs";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "catalog");
}

export default async function CatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tPage = await getTranslations("catalogPage");
  const tCatalogs = await getTranslations("catalogs");

  return (
    <PageShell>
      <PageHeader title={tPage("title")} subtitle={tPage("subtitle")} />

      <Reveal className="col-span-12 md:col-span-8">
        <p className="font-sans text-base leading-relaxed text-navy-800/90 md:text-lg">
          {tPage("intro")}
        </p>
      </Reveal>

      <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-4">
        {catalogs.map((catalog) => (
          <Reveal key={catalog.id} className="min-w-0">
            <CatalogCard
              title={tCatalogs(`${catalog.messageKey}.title`)}
              description={tCatalogs(`${catalog.messageKey}.description`)}
              year={tCatalogs(`${catalog.messageKey}.year`)}
              pdfHref={catalog.pdfHref}
              viewLabel={tPage("viewPdf")}
              downloadLabel={tPage("downloadPdf")}
              soonLabel={tPage("pdfSoon")}
              compact
            />
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
