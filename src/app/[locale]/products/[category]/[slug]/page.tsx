import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import styles from "./detail.module.css";
import ProductVisualsWrapper from "@/components/product/ProductVisualsWrapper";
import RFQModalWrapper from "@/components/product/RFQModalWrapper";
import { getProductByCategoryAndSlug, getProductsByCategorySlug } from "@/lib/data/public-data";
import { getRichProductContent } from "@/lib/product-content";
import { 
  uniqueByUrl, 
  isImageUrl, 
  getSupabaseJsonGallery, 
  normalizeSizeTableRows 
} from "@/lib/product-utils";

type ProductDetailPageProps = {
  params: Promise<{ category: string; slug: string; locale: string }>;
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
    "KARPOL Industrial Engineering Solutions & High-Performance Components.";

  const ogImage =
    product?.images?.[0] ?? richContent?.imageGallery?.[0]?.url ?? null;

  return {
    title: `${title} | KARPOL Engineering`,
    description,
    openGraph: {
      title: `${title} | KARPOL`,
      description,
      type: "website",
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { category, slug, locale } = await params;
  const t = await getTranslations("ProductDetail");
  
  // Data Fetching
  const richContent = getRichProductContent(category, slug);
  const { data: product, error } = await getProductByCategoryAndSlug(category, slug);
  
  if (!product && !richContent) {
    if (error) console.error("Product fetch error:", error);
    notFound();
  }

  // Derived Data
  const pageTitle = product?.name ?? richContent?.name ?? slug.replace(/-/g, " ");
  const pageDescription = product?.description ?? richContent?.shortDescription ?? "High-performance industrial component engineered for precision and durability.";
  const material = product?.material ?? richContent?.specs.find((item) => item.label === "Malzeme" || item.label === "Material")?.value;
  const hardness = product?.hardness ?? richContent?.specs.find((item) => item.label === "Sertlik" || item.label === "Hardness")?.value;
  const hardnessUnit = product?.hardness_unit ?? "Shore A";
  
  // Gallery Logic
  const supabaseJsonGallery = getSupabaseJsonGallery(product);
  const rawGallery =
    supabaseJsonGallery.length > 0
      ? supabaseJsonGallery
      : product?.images?.length
        ? uniqueByUrl(
            product.images.map((url, index) => ({
              title: `Product View ${index + 1}`,
              url,
            })),
          )
        : (richContent?.imageGallery ?? []);

  const galleryImages = rawGallery.filter((asset) => isImageUrl(asset.url));
  const model3dUrl = product?.model_3d_url ?? richContent?.modelEmbedUrl;

  // Documents
  const drawingLinks = uniqueByUrl([
    ...(product?.technical_drawing_url
      ? [{ title: "Technical Drawing", url: product.technical_drawing_url }]
      : []),
    ...(richContent?.technicalDrawings ?? []),
  ]);
  
  const documentLinks = uniqueByUrl([
    ...(product?.datasheet_url
      ? [{ title: "Technical Datasheet", url: product.datasheet_url }]
      : []),
    ...(richContent?.documents ?? []),
  ]);

  // Applications & Advantages
  const applications = product?.applications?.length
    ? product.applications
    : (richContent?.applications ?? [
        "Marble Polishing Machines",
        "Industrial Conveyor Systems",
        "Heavy Duty Transport",
        "Precision Cutting Lines"
      ]);
      
  const advantages = richContent?.highlights ?? [
    "High abrasion resistance for extended service life",
    "Precision engineered for perfect machine fit",
    "Custom hardness options available on request",
    "Resistant to industrial oils and chemicals"
  ];

  // Compatible Machines
  const compatibleMachines = product?.compatible_machines?.length
    ? product.compatible_machines
    : (richContent?.compatibleMachines ?? []);

  // Specs Construction
  const specs = [
    { label: "Material", value: material || "Custom Compound" },
    { label: "Hardness", value: hardness ? `${hardness} ${hardnessUnit}` : "Various Available" },
    { label: "Working Temp", value: product?.temperature_min && product?.temperature_max ? `${product.temperature_min}°C to ${product.temperature_max}°C` : "-30°C to +80°C" },
    { label: "Load Capacity", value: "Heavy Duty Industrial" },
    { label: "Dimensions", value: "See Size Table" },
  ];

  // Size Table
  const sizeTableSource = product?.size_table && product.size_table.length > 0
      ? product.size_table
      : (richContent?.sizeTable ?? []);
  const sizeTableRows = normalizeSizeTableRows(sizeTableSource);

  // Related Products
  const { data: categoryProducts } = await getProductsByCategorySlug(category);
  
  // Create a copy to avoid mutating read-only array
  let relatedProducts = [...(categoryProducts || [])]
    .filter((p) => p.slug !== slug);

  // Smart Internal Linking: Boost products with same machine compatibility
  if (compatibleMachines.length > 0) {
    relatedProducts.sort((a, b) => {
      // Safely access compatible_machines, defaulting to empty array
      const aMachines = a.compatible_machines || [];
      const bMachines = b.compatible_machines || [];
      
      const aMatches = aMachines.filter(m => compatibleMachines.includes(m)).length;
      const bMatches = bMachines.filter(m => compatibleMachines.includes(m)).length;
      return bMatches - aMatches; // Higher matches first
    });
  }

  relatedProducts = relatedProducts.slice(0, 4);

  // JSON-LD Schema Construction
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pageTitle,
    description: pageDescription,
    sku: product?.sku ?? slug,
    image: galleryImages.map((img) => img.url),
    brand: { "@type": "Brand", name: "KARPOL" },
    manufacturer: { 
      "@type": "Organization", 
      "name": "KARPOL Industrial Components",
      "url": "https://karpol.net"
    },
    category: category,
    material: material,
    color: product?.color,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        "name": "Hardness",
        "value": hardness ? `${hardness} ${hardnessUnit}` : undefined
      },
      {
        "@type": "PropertyValue",
        "name": "3D Model Available",
        "value": !!model3dUrl
      }
    ].filter(p => p.value !== undefined),
    isSimilarTo: compatibleMachines.map(machine => ({
      "@type": "Product",
      "name": `Spare part for ${machine}`,
      "description": `Compatible industrial component for ${machine} marble processing machinery.`
    })),
    offers: {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "url": `https://karpol.net/${locale}/products/${category}/${slug}`
    }
  };

  return (
    <main className={styles.main}>
      {/* SECTION 1: Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href={`/${locale}/products`} className={styles.breadcrumbLink}>Products</Link>
            <span>/</span>
            <Link href={`/${locale}/products/${category}`} className={styles.breadcrumbLink}>{category}</Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{slug}</span>
          </div>
          
          <div className={styles.titleWrapper}>
            <div>
              {material && <span className={styles.categoryBadge}>{material}</span>}
              <h1 className={styles.productTitle}>{pageTitle}</h1>
              <p className={styles.shortDesc}>{pageDescription}</p>
            </div>
            
            <RFQModalWrapper 
              productName={pageTitle}
              sku={product?.sku}
              contactLink={`/${locale}/contact`}
              buttonText={t("cta_button")} // Passing translated button text
            />
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.contentGrid}>
          {/* Left Column: Visuals & Applications */}
          <div>
            {/* SECTION 2: Visuals */}
            <ProductVisualsWrapper 
              images={galleryImages} 
              productName={pageTitle}
              model3dUrl={model3dUrl}
            />

            {/* SECTION 4: Applications */}
            <div style={{ marginTop: "64px" }}>
              <h2 className={styles.sectionTitle}>{t("applications")}</h2>
              <div className={styles.applicationsGrid}>
                {applications.map((app, i) => (
                  <div key={i} className={styles.appCard}>
                    <span className={styles.appIcon}>⚙️</span>
                    <span className={styles.appText}>{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Machine Compatibility */}
            {compatibleMachines.length > 0 && (
              <div style={{ marginTop: "48px" }}>
                <h2 className={styles.sectionTitle}>{t("compatibility")}</h2>
                <div className={styles.machineTagContainer}>
                  {compatibleMachines.map((machine, i) => (
                    <span key={i} className={styles.machineTag}>{machine}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Size Table if available */}
            {sizeTableRows.length > 0 && (
              <div style={{ marginTop: "48px" }}>
                <h2 className={styles.sectionTitle}>{t("sizes")}</h2>
                <div className={styles.sizeTableContainer}>
                  <table className={styles.sizeTable}>
                    <thead>
                      <tr>
                        <th>Model/Size</th>
                        <th>Wing</th>
                        <th>Width (mm)</th>
                        <th>ID (mm)</th>
                        <th>OD (mm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeTableRows.map((row, i) => (
                        <tr key={i}>
                          <td>{row.size}</td>
                          <td>{row.wing}</td>
                          <td>{row.width}</td>
                          <td>{row.innerDiameter}</td>
                          <td>{row.outerDiameter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Specs & Advantages */}
          <div>
            {/* SECTION 3: Technical Specs */}
            <h2 className={styles.sectionTitle}>{t("specs")}</h2>
            <table className={styles.specsTable}>
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={i}>
                    <th>{spec.label}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
                {product?.sku && (
                  <tr>
                    <th>Product Code (SKU)</th>
                    <td>{product.sku}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* SECTION 5: Engineering Advantages */}
            <div style={{ marginTop: "48px" }}>
              <h2 className={styles.sectionTitle}>{t("advantages")}</h2>
              <div className={styles.advantagesList}>
                {advantages.map((adv, i) => (
                  <div key={i} className={styles.advantageItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <p className={styles.advantageText}>{adv}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Resources (Downloads) */}
            {(drawingLinks.length > 0 || documentLinks.length > 0) && (
              <div className={styles.downloadsPanel}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: "16px", fontSize: "20px" }}>{t("downloads")}</h2>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
                  Login required for 3D CAD files.
                </p>
                <div className={styles.downloadGrid}>
                  {drawingLinks.map((d, i) => (
                    <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
                      <div className={styles.downloadMeta}>
                        <span className={styles.downloadIcon}>📐</span>
                        <span>{d.title}</span>
                      </div>
                      <span className={styles.downloadAction}>PDF</span>
                    </a>
                  ))}
                  {documentLinks.map((d, i) => (
                    <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
                      <div className={styles.downloadMeta}>
                        <span className={styles.downloadIcon}>📊</span>
                        <span>{d.title}</span>
                      </div>
                      <span className={styles.downloadAction}>Download</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 7: CTA Box */}
            <div className={styles.ctaSection}>
              <h3 className={styles.ctaTitle}>{t("cta_title")}</h3>
              <p className={styles.ctaText}>
                {t("cta_text")}
              </p>
              <div className={styles.ctaButtons}>
                <Link href={`/${locale}/contact`} className={styles.primaryBtn} style={{ background: "white", color: "#0f172a", border: "none" }}>
                  {t("cta_button")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>{t("related")}</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/products/${category}/${p.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImageWrapper}>
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className={styles.relatedImage}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#f1f5f9" }} />
                    )}
                  </div>
                  <div className={styles.relatedContent}>
                    <h4 className={styles.relatedTitle}>{p.name}</h4>
                    <span className={styles.relatedMeta}>View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Structured Data */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
    </main>
  );
}
