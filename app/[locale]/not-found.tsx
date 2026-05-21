import { getTranslations } from "next-intl/server";
import { SiteStatusScreen } from "@/components/organisms/SiteStatusScreen";

export default async function NotFound() {
  const t = await getTranslations("status");

  return (
    <SiteStatusScreen
      code={t("notFoundCode")}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      actionLabel={t("notFoundAction")}
      actionHref="/"
    />
  );
}
