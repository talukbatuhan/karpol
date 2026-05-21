import { getTranslations } from "next-intl/server";
import { SiteStatusScreen } from "@/components/organisms/SiteStatusScreen";

export default async function ProductNotFound() {
  const t = await getTranslations("status");
  const tProducts = await getTranslations("productsPage");

  return (
    <SiteStatusScreen
      code={t("notFoundCode")}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      actionLabel={tProducts("title")}
      actionHref="/products"
    />
  );
}
