import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ToolChrome } from "@/components/tools/ToolChrome";
import { MakaraToolLoader } from "@/components/tools/MakaraToolLoader";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.makara" });
  return { title: `${t("title")} | Karpol` };
}

export default async function MakaraToolPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tools.makara");
  const tM = await getTranslations("toolsMakara");
  const tCommon = await getTranslations("toolsCommon");

  const options = [
    tM("options.0"),
    tM("options.1"),
    tM("options.2"),
    tM("options.3"),
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden touch-none">
      <ToolChrome
        title={t("title")}
        backLabel={tCommon("backToHub")}
        backHref="/tools"
      />
      <div className="relative min-h-0 flex-1 overflow-hidden touch-none">
        <MakaraToolLoader
          labels={{
            selectTitle: tM("selectTitle"),
            dataTitle: tM("dataTitle"),
            weightLabel: tM("weightLabel"),
            netVolLabel: tM("netVolLabel"),
            boxVolLabel: tM("boxVolLabel"),
            allDataTitle: tM("allDataTitle"),
            allWeightLabel: tM("allWeightLabel"),
            allNetVolLabel: tM("allNetVolLabel"),
            allBoxVolLabel: tM("allBoxVolLabel"),
            hint: tM("hint"),
            options,
            watermark: tM("watermark"),
          }}
        />
      </div>
    </div>
  );
}
