import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";

export default async function EcardNotFound() {
  setRequestLocale(routing.defaultLocale);
  const t = await getTranslations("ecard");

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-navy-950 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-gold-500">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-ivory-50">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-2 max-w-sm font-sans text-base text-ivory-100/80">
        {t("notFoundDescription")}
      </p>
      <Link
        href="/"
        className="mt-8 border-2 border-gold-500 px-6 py-3 font-sans text-sm font-semibold text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950"
      >
        {t("notFoundAction")}
      </Link>
    </div>
  );
}
