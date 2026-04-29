import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import {
  ConditionalBreadcrumbs,
  ConditionalFooter,
  ConditionalHeader,
} from "@/components/layout/ConditionalLocaleChrome";
import AksanFooter from "@/components/layout/AksanFooter";
import ViewTransitionsProvider from "@/components/layout/ViewTransitionsProvider";
import ClientProviders from "@/components/providers/ClientProviders";
import { APP_LOCALES } from "@/i18n/config";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export function generateStaticParams() {
  return APP_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const tFaq = await getTranslations({ locale, namespace: "SiteFaq" });

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
      siteConfig.social.youtube,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "sales",
      areaServed: "World",
    },
  };

  const faqPairs = [
    { q: tFaq("q1"), a: tFaq("a1") },
    { q: tFaq("q2"), a: tFaq("a2") },
    { q: tFaq("q3"), a: tFaq("a3") },
  ] as const;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPairs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <NextIntlClientProvider messages={messages}>
      {/*
        Shell (lang/dir) stays in the RSC tree under NextIntl, not as the only
        child of ClientProviders, to avoid RSC+client boundary hydration issues
        (e.g. styled-jsx / first-node mismatches with QuoteListProvider).
      */}
      <div lang={locale} dir="ltr" suppressHydrationWarning>
        <ClientProviders>
          <Script
            id="org-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          />
          <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
          <ViewTransitionsProvider />
          <ConditionalHeader />
          <ConditionalBreadcrumbs />
          {children}
          <ConditionalFooter footer={<AksanFooter />} />
        </ClientProviders>
      </div>
    </NextIntlClientProvider>
  );
}
