import { Metadata } from "next";
import CatalogViewer from "@/components/catalog/CatalogViewer";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getCatalogManifest } from "@/lib/data/catalog-storage";

type CatalogPageProps = {
  params: Promise<{ locale: string }>;
  // Next.js provides `searchParams` as a Promise in dynamic server contexts.
  // We must `await` it before accessing properties.
  searchParams?: Promise<{ catalogId?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Catalog");

  return {
    title: t("title"),
    description: t("title"),
  };
}

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  // #region agent log: catalogId resolution (post-await only)
  let catalogIdRaw: string | undefined;
  try {
    const raw = (resolvedSearchParams as any)?.catalogId;
    catalogIdRaw = Array.isArray(raw) ? raw[0] : raw;
  } catch {
    // Ignore; we'll fall back to env/default.
  }

  try {
    await fetch("http://127.0.0.1:7299/ingest/874762ef-d8f5-4d18-b1ce-0f847995ef26", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "9d589d",
      },
      body: JSON.stringify({
        sessionId: "9d589d",
        runId: "post-fix",
        hypothesisId: "A2",
        location: "src/app/[locale]/catalog/page.tsx:CatalogPage(catalogId post-await)",
        message: "Resolved searchParams without pre-await property access",
        data: {
          hasResolvedSearchParams: Boolean(resolvedSearchParams),
          catalogIdRaw: catalogIdRaw ?? null,
        },
        timestamp: Date.now(),
      }),
    });
  } catch {
    // Ignore logging failures.
  }
  // #endregion

  const catalogId =
    catalogIdRaw ||
    process.env.ECATALOG_DEFAULT_ID ||
    "main";

  // #region agent log: catalogId + manifest fetch
  try {
    await fetch("http://127.0.0.1:7299/ingest/874762ef-d8f5-4d18-b1ce-0f847995ef26", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "9d589d",
      },
      body: JSON.stringify({
        sessionId: "9d589d",
        runId: "post-fix-2",
        hypothesisId: "A3",
        location: "src/app/[locale]/catalog/page.tsx:CatalogPage(catalogId before manifest)",
        message: "About to fetch catalog manifest",
        data: { catalogId },
        timestamp: Date.now(),
      }),
    });
  } catch {
    // Ignore logging failures.
  }
  // #endregion

  try {
    const catalog = await getCatalogManifest(catalogId);

    // #region agent log: manifest fetch success
    try {
      await fetch("http://127.0.0.1:7299/ingest/874762ef-d8f5-4d18-b1ce-0f847995ef26", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "9d589d",
        },
        body: JSON.stringify({
          sessionId: "9d589d",
          runId: "post-fix-2",
          hypothesisId: "B2",
          location:
            "src/app/[locale]/catalog/page.tsx:CatalogPage(manifest fetch success)",
          message: "Catalog manifest fetched",
          data: { totalPages: catalog?.totalPages ?? null },
          timestamp: Date.now(),
        }),
      });
    } catch {
      // Ignore logging failures.
    }
    // #endregion

    return (
      <main style={{ paddingTop: 0 }}>
        <CatalogViewer catalog={catalog} />
      </main>
    );
  } catch (err) {
    // #region agent log: manifest fetch failure
    try {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as any).message)
          : "Unknown catalog manifest error";
      await fetch("http://127.0.0.1:7299/ingest/874762ef-d8f5-4d18-b1ce-0f847995ef26", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "9d589d",
        },
        body: JSON.stringify({
          sessionId: "9d589d",
          runId: "post-fix-2",
          hypothesisId: "B1",
          location:
            "src/app/[locale]/catalog/page.tsx:CatalogPage(manifest fetch catch)",
          message: "Catalog manifest fetch failed (caught)",
          data: { catalogId, errorMessage: message },
          timestamp: Date.now(),
        }),
      });
    } catch {
      // Ignore logging failures.
    }
    // #endregion

    const t = await getTranslations("Catalog");
    return (
      <main style={{ paddingTop: 0 }}>
        <div style={{ padding: "64px 16px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
            {t("title")}
          </h1>
          <p style={{ color: "#64748b", maxWidth: 720 }}>
            {t("error")}
          </p>
        </div>
      </main>
    );
  }
}

