import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { ToolChrome } from "@/components/tools/ToolChrome";
import { LegacyToolEmbed } from "@/components/tools/LegacyToolEmbed";
import { getTool } from "@/lib/tools";

type Props = { params: Promise<{ locale: string }> };

const TOOL_ID = "silim-lastigi" as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "toolSilim");
}

export default async function SilimLastigiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tool = getTool(TOOL_ID);
  if (!tool?.legacySrc) notFound();

  const t = await getTranslations("tools.silimLastigi");
  const tCommon = await getTranslations("toolsCommon");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden touch-none">
      <ToolChrome
        title={t("title")}
        backLabel={tCommon("backToHub")}
        backHref="/tools"
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden touch-none">
        <LegacyToolEmbed title={t("title")} src={tool.legacySrc} />
      </div>
    </div>
  );
}
