import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildStaticPageMetadata } from "@/lib/seo/page-metadata";
import { PageShell } from "@/components/organisms/PageShell";
import { ContactForm } from "@/components/organisms/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildStaticPageMetadata(locale, "contact");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const channels = [
    { label: t("emailLabel"), value: t("email"), href: `mailto:${t("email")}` },
    { label: t("phoneLabel"), value: t("phone"), href: `tel:+905496652560` },
  ];

  return (
    <PageShell>
      <section
        aria-label={t("title")}
        className="col-span-12 mt-0 flex w-full flex-col items-start gap-10 md:flex-row md:items-start"
      >
        <aside className="mt-0 min-w-0 flex-1 self-start">
          <header className="mt-0 border-l-4 border-gold-500 pl-4 md:pl-6">
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight tracking-tight text-navy-950">
              {t("title")}
            </h1>
            <p className="mt-3 font-sans text-base leading-relaxed text-navy-800/80 md:text-lg">
              {t("subtitle")}
            </p>
          </header>

          <div className="mt-8 space-y-6">
            {channels.map((ch) => (
              <div key={ch.label} className="border-l-4 border-gold-500 pl-4">
                <p className="font-mono text-xs uppercase tracking-widest text-navy-800/70">
                  {ch.label}
                </p>
                <a
                  href={ch.href}
                  className="mt-1 block font-sans text-lg text-navy-950 hover:text-gold-500"
                >
                  {ch.value}
                </a>
              </div>
            ))}

            <div className="border-l-4 border-gold-500 pl-4">
              <p className="font-mono text-xs uppercase tracking-widest text-navy-800/70">
                {t("addressLabel")}
              </p>
              <p className="mt-1 font-sans text-lg text-navy-950">
                {t("addressLine1")}
              </p>
              <p className="mt-1 font-sans text-lg text-navy-950/85">
                {t("addressLine2")}
              </p>
            </div>
          </div>
        </aside>

        <div className="mt-0 min-w-0 w-full flex-1 self-start">
          <ContactForm
            labels={{
              name: t("formName"),
              email: t("formEmail"),
              message: t("formMessage"),
              submit: t("formSubmit"),
              sending: t("formSending"),
              sendingDetail: t("formSendingDetail"),
              successTitle: t("formSuccessTitle"),
              successDetail: t("formSuccessDetail"),
              sendAgain: t("formSendAgain"),
              errorGeneric: t("formErrorGeneric"),
              errorValidation: t("formErrorValidation"),
              errorConfig: t("formErrorConfig"),
            }}
          />
        </div>
      </section>
    </PageShell>
  );
}
