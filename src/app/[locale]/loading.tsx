import { getTranslations } from "next-intl/server";
import { SiteStatusScreen } from "@/components/organisms/SiteStatusScreen";

export default async function Loading() {
  const t = await getTranslations("status");

  return (
    <SiteStatusScreen
      code={t("loadingCode")}
      title={t("loadingTitle")}
      description={t("loadingDescription")}
      loading
    />
  );
}
