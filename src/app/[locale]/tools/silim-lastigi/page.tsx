import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { ToolChrome } from "@/components/tools/ToolChrome";
import { DesignStudioLoader } from "@/components/design-studio/DesignStudioLoader";
import { getDesignModule } from "@/features/design-engine/modules/registry";
import { buildDesignStudioLabels } from "@/lib/design-studio-labels";
import { getTool } from "@/lib/tools";

type Props = { params: Promise<{ locale: string }> };

const TOOL_ID = "silim-lastigi" as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const metadata = buildStaticPageMetadata(locale, "toolSilim");

  return {
    ...metadata,
    manifest: "/manifest-silim.json",
    appleWebApp: {
      capable: true,
      title: "Karpol Silim",
      statusBarStyle: "black-translucent",
    },
    icons: {
      apple: "/icons/silim-icon-192.png",
    },
  };
}

export default async function SilimLastigiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tool = getTool(TOOL_ID);
  if (!tool?.moduleId) notFound();

  const module = getDesignModule(tool.moduleId);
  if (!module || module.status !== "active") notFound();

  const t = await getTranslations("tools.silimLastigi");
  const tCommon = await getTranslations("toolsCommon");
  const tStudio = await getTranslations("designStudio");
  const tParams = await getTranslations("designStudio.grindingRubber.params");
  const tDerived = await getTranslations("designStudio.grindingRubber.derived");
  const tGroups = await getTranslations("designStudio.grindingRubber.groups");
  const tErrors = await getTranslations("designStudio.errors");
  const tExport = await getTranslations("designStudio.export");

  const labels = buildDesignStudioLabels(
    tStudio,
    tParams,
    tDerived,
    tGroups,
    tErrors,
    tExport,
    module,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden touch-none">
      <ToolChrome
        title={t("title")}
        backLabel={tCommon("backToHub")}
        backHref="/tools"
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden touch-none">
        <DesignStudioLoader
          moduleId="grinding-rubber"
          labels={labels}
          drawingTitle={t("drawingTitle")}
        />
      </div>
    </div>
  );
}
