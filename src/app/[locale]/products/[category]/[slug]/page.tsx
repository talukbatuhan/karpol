import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import styles from "@/app/product-detail.module.css";
import ProductInteractivePanel from "@/components/product/ProductInteractivePanel";
import { getProductByCategoryAndSlug } from "@/lib/data/public-data";
import { getRichProductContent } from "@/lib/product-content";
import type { Product, ProductSizeRow } from "@/types/database";

type ProductDetailPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const richContent = getRichProductContent(category, slug);
  const { data: product } = await getProductByCategoryAndSlug(category, slug);

  const title = product?.name ?? richContent?.name ?? slug;
  const description =
    product?.description ??
    richContent?.shortDescription ??
    "KARPOL endüstriyel mühendislik çözümleri ve ürün detayları.";

  return {
    title: `${title} | KARPOL`,
    description,
    openGraph: {
      title: `${title} | KARPOL`,
      description,
      type: "website",
    },
  };
}

// ... helper functions (uniqueByUrl, sanitizeAssetUrl, isImageUrl, normalizeVariantCode, normalizeGalleryItems, getSupabaseJsonGallery, normalizeSizeTableRows) reused from previous file ...
function uniqueByUrl<T extends { url: string }>(items: T[]) {
  const map = new Map<string, T>();
  for (const item of items) {
    const normalizedUrl = sanitizeAssetUrl(item.url);
    if (!normalizedUrl) {
      continue;
    }
    if (!map.has(normalizedUrl)) {
      map.set(normalizedUrl, { ...item, url: normalizedUrl });
    }
  }
  return Array.from(map.values());
}

function sanitizeAssetUrl(url: string) {
  const trimmed = url.trim().replace(/[`"'<>]/g, "");
  const withoutTrailingParen = trimmed.replace(/\)+$/, "");
  if (!withoutTrailingParen) {
    return null;
  }
  try {
    return new URL(withoutTrailingParen).toString();
  } catch {
    return null;
  }
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(url);
}

function normalizeVariantCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeGalleryItems(input: unknown) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          title: `Ürün Görseli ${index + 1}`,
          url: item,
        };
      }

      if (item && typeof item === "object") {
        const entry = item as Record<string, unknown>;
        const rawUrl = entry.url ?? entry.src ?? entry.image_url;
        if (typeof rawUrl === "string") {
          const rawTitle = entry.title ?? entry.alt;
          const rawCode = entry.code ?? entry.sku ?? entry.size ?? rawTitle;
          const rawSpecs = entry.specs;
          const specs =
            Array.isArray(rawSpecs) && rawSpecs.length > 0
              ? rawSpecs
                  .map((spec) => {
                    if (!spec || typeof spec !== "object") {
                      return null;
                    }
                    const item = spec as Record<string, unknown>;
                    return {
                      label:
                        typeof item.label === "string" ? item.label : undefined,
                      value:
                        typeof item.value === "string" ? item.value : undefined,
                    };
                  })
                  .filter(
                    (spec): spec is { label: string; value: string } =>
                      Boolean(spec?.label) && Boolean(spec?.value),
                  )
              : [];
          return {
            title:
              typeof rawTitle === "string" && rawTitle.trim().length > 0
                ? rawTitle
                : `Ürün Görseli ${index + 1}`,
            url: rawUrl,
            code:
              typeof rawCode === "string" && rawCode.trim().length > 0
                ? normalizeVariantCode(rawCode)
                : undefined,
            specs,
          };
        }
      }

      return null;
    })
    .filter((item): item is { title: string; url: string } => item !== null);
}

function getSupabaseJsonGallery(product: Product | null) {
  if (!product) {
    return [];
  }

  const extendedProduct = product as Product & Record<string, unknown>;
  const candidates: unknown[] = [
    product.gallery_json,
    product.gallery_images,
    product.product_gallery,
    extendedProduct.gallery,
    extendedProduct.images_json,
    extendedProduct.media_gallery,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeGalleryItems(candidate);
    if (normalized.length > 0) {
      return uniqueByUrl(normalized);
    }
  }

  return [];
}

function normalizeSizeTableRows(input: unknown): ProductSizeRow[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const rows = input
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const row = item as Record<string, unknown>;
      const size = typeof row.size === "string" ? row.size : "";
      const width = typeof row.width === "string" ? row.width : "";
      const innerDiameter =
        typeof row.innerDiameter === "string" ? row.innerDiameter : "";
      const outerDiameter =
        typeof row.outerDiameter === "string" ? row.outerDiameter : "";
      const wing = typeof row.wing === "string" ? row.wing : "-";

      if (!size || !width || !innerDiameter || !outerDiameter) {
        return null;
      }

      return {
        size,
        wing,
        width,
        innerDiameter,
        outerDiameter,
      };
    })
    .filter(
      (row): row is NonNullable<typeof row> =>
        row !== null,
    );

  return rows;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { category, slug } = await params;
  const richContent = getRichProductContent(category, slug);
  const { data: product, error } = await getProductByCategoryAndSlug(
    category,
    slug,
  );
  const errorMessage =
    !product && !richContent && error ? error : error === "Ürün bulunamadı." ? null : error;
  const pageTitle = product?.name ?? richContent?.name ?? slug;
  const pageDescription =
    product?.description ??
    richContent?.shortDescription ??
    "Ürün kaydı bulunursa teknik detaylar burada gösterilir.";
  const material = product?.material ?? richContent?.specs.find((item) => item.label === "Malzeme")?.value;
  const hardness =
    product?.hardness ??
    richContent?.specs.find((item) => item.label === "Sertlik")?.value;
  const hardnesUnit = product?.hardness_unit ?? "";
  const supabaseJsonGallery = getSupabaseJsonGallery(product);
  const gallery =
    supabaseJsonGallery.length > 0
      ? supabaseJsonGallery
      : product?.images?.length
        ? uniqueByUrl(
            product.images.map((url, index) => ({
              title: `Ürün Görseli ${index + 1}`,
              url,
            })),
          )
        : (richContent?.imageGallery ?? []);
  const drawingLinks = uniqueByUrl([
    ...(product?.technical_drawing_url
      ? [{ title: "Teknik Resim", url: product.technical_drawing_url }]
      : []),
    ...(richContent?.technicalDrawings ?? []),
  ]);
  const documentLinks = uniqueByUrl([
    ...(product?.datasheet_url
      ? [{ title: "Datasheet", url: product.datasheet_url }]
      : []),
    ...(richContent?.documents ?? []),
  ]);
  const applications = product?.applications?.length
    ? product.applications
    : (richContent?.applications ?? []);
  const sizeTableSource =
    product?.size_table && product.size_table.length > 0
      ? product.size_table
      : (richContent?.sizeTable ?? []);
  const sizeTableRows = normalizeSizeTableRows(sizeTableSource);
  const galleryImages = gallery.filter((asset) => isImageUrl(asset.url));
  const baseSpecs = richContent?.specs ?? [];

  return (
    <main>
      {/* Product Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.breadcrumb}>
            <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
            <span>/</span>
            <Link href={`/products/${category}`} className={styles.breadcrumbLink}>{category}</Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{slug}</span>
          </div>
          <h1 className={styles.productTitle}>{pageTitle}</h1>
          <div className={styles.productMeta}>
            {product?.sku && <span className={styles.metaBadge}>SKU: {product.sku}</span>}
            {material && <span className={`${styles.metaBadge} ${styles.metaMaterial}`}>{material}</span>}
            {hardness && <span className={styles.metaBadge}>{hardness} {hardnesUnit}</span>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.container}>
          {errorMessage ? <p className={styles.status}>{errorMessage}</p> : null}

          {(product || richContent) && (
            <div className={styles.mainGrid}>
              {/* Left Column: Visuals & Table */}
              <div className={styles.visuals}>
                <ProductInteractivePanel
                  productName={pageTitle}
                  galleryImages={galleryImages}
                  specs={baseSpecs}
                  sizeTableRows={sizeTableRows}
                />
              </div>

              {/* Right Column: Engineering Details */}
              <div className={styles.details}>
                {/* Technical Specs Table */}
                <h2 className={styles.sectionTitle}>Technical Specifications</h2>
                <table className={styles.specsTable}>
                  <tbody>
                    <tr>
                      <th>Material</th>
                      <td>{material || "-"}</td>
                    </tr>
                    <tr>
                      <th>Hardness</th>
                      <td>{hardness ? `${hardness} ${hardnesUnit}` : "-"}</td>
                    </tr>
                    <tr>
                      <th>Working Temp.</th>
                      <td>{product?.temperature_min && product?.temperature_max ? `${product.temperature_min}°C to ${product.temperature_max}°C` : "-"}</td>
                    </tr>
                    <tr>
                      <th>Color</th>
                      <td>{product?.color || "-"}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Engineering Advantages */}
                <div className={styles.advantages}>
                  <h2 className={styles.sectionTitle}>Engineering Advantages</h2>
                  <div className={styles.advantageList}>
                    {richContent?.highlights?.map((highlight) => (
                      <div key={highlight} className={styles.advantageItem}>
                        <span className={styles.checkIcon}>✓</span>
                        <p className={styles.advantageText}>{highlight}</p>
                      </div>
                    ))}
                    {!richContent?.highlights?.length && (
                      <p style={{ color: "#64748b" }}>Engineering highlights coming soon.</p>
                    )}
                  </div>
                </div>

                {/* Applications */}
                <div className={styles.advantages}>
                  <h2 className={styles.sectionTitle}>Applications</h2>
                  <div className={styles.advantageList}>
                    {applications.map((app) => (
                      <div key={app} className={styles.advantageItem}>
                        <span style={{ color: "#1e293b", fontSize: "18px" }}>⚙️</span>
                        <p className={styles.advantageText}>{app}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Downloads */}
                {(drawingLinks.length > 0 || documentLinks.length > 0) && (
                  <div className={styles.advantages}>
                    <h2 className={styles.sectionTitle}>Technical Documentation</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {drawingLinks.map((drawing) => (
                        <a key={drawing.url} href={drawing.url} className={styles.breadcrumbLink} target="_blank" rel="noreferrer">
                          📄 {drawing.title} (PDF)
                        </a>
                      ))}
                      {documentLinks.map((doc) => (
                        <a key={doc.url} href={doc.url} className={styles.breadcrumbLink} target="_blank" rel="noreferrer">
                          📊 {doc.title} (Datasheet)
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Box */}
                <div className={styles.ctaBox}>
                  <h3 className={styles.ctaTitle}>Ready to Order?</h3>
                  <p className={styles.ctaText}>
                    Request a quote for this specific part or consult with our engineering team for custom requirements.
                  </p>
                  <div className={styles.ctaButtons}>
                    <Link 
                      href={`/contact?subject=Quote: ${pageTitle} (${product?.sku || slug})`}
                      className={styles.primaryBtn}
                    >
                      Request Quote
                    </Link>
                    <Link 
                      href="/contact"
                      className={styles.secondaryBtn}
                    >
                      Contact Engineer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Schema Script */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: pageTitle,
            description: pageDescription,
            sku: product?.sku ?? slug,
            image: galleryImages.length > 0 ? galleryImages.map((img) => img.url) : undefined,
            brand: { "@type": "Brand", name: "KARPOL" },
            manufacturer: { "@type": "Organization", name: "KARPOL" },
            category: category,
            material: material,
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: "0",
              availability: "https://schema.org/InStock",
              url: `https://karpol.net/products/${category}/${slug}`,
            },
          }),
        }}
      />
    </main>
  );
}
