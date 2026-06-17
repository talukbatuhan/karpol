import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { PageShell } from "@/components/organisms/PageShell";
import { PageHeader } from "@/components/organisms/PageHeader";
import { ToolCard } from "@/components/molecules/ToolCard";
import { tools } from "@/lib/tools";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "tools");
}

export default async function ToolsHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHub = await getTranslations("toolsHub");
  const tTools = await getTranslations("tools");
  const tCommon = await getTranslations("toolsCommon");

  return (
    <PageShell>
      <PageHeader title={tHub("title")} subtitle={tHub("subtitle")} />

      {tools.map((tool) => (
        <div key={tool.id} className="col-span-12 md:col-span-6 lg:col-span-4">
          <ToolCard
            tool={tool}
            title={tTools(`${tool.messageKey}.title`)}
            description={tTools(`${tool.messageKey}.description`)}
            openLabel={tCommon("open")}
            badge={
              tool.kind === "legacy-html"
                ? tCommon("badgeLegacy")
                : tCommon("badge3d")
            }
          />
        </div>
      ))}
    </PageShell>
  );
}
