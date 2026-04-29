import { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProductDetailView from "@/components/product/ProductDetailView";
import {
  getProductByLocalizedSlug,
  getProductCategoryByLocalizedSlug,
  getRelatedProductsByCategory,
  getIndustriesForProduct,
} from "@/lib/data/public-data";
import { getRichProductContent } from "@/lib/product-content";
import {
  getLocalizedField,
  getLocalizedArray,
  getLocalizedSlug,
} from "@/lib/i18n-helpers";
import {
  uniqueByUrl,
  isImageUrl,
  getSupabaseJsonGallery,
  normalizeProductSpecificationTables,
  normalizeProductSizeTables,
} from "@/lib/product-utils";
import { DEFAULT_PRODUCT_MODULES } from "@/types/database";
import type { AppLocale } from "@/i18n/config";
import {
  buildAlternatesLanguages,
  productsPathSegment,
} from "@/lib/seo/alternates";

type ProductDetailPageProps = {
  params: Promise<{ category: string; slug: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { category, slug, locale } = await params;
  const richContent = getRichProductContent(category, slug);
  const { data: product } = await getProductByLocalizedSlug(category, slug, locale);
  const { data: categoryData } = await getProductCategoryByLocalizedSlug(
    category,
    locale,
  );

  const title = product
    ? getLocalizedField(product.name, locale || "en")
    : (richContent?.name ?? slug);
  const desc = product
    ? getLocalizedField(product.description, locale || "en")
    : (richContent?.shortDescription ??
        "KARPOL Industrial Engineering Solutions & High-Performance Components.");

  const ogImage =
    product?.images?.[0] ?? richContent?.imageGallery?.[0]?.url ?? null;

  // Locale-aware alternate URLs: enables hreflang SEO + works as a source of
  // truth for the navbar's locale switcher on dynamic product pages.
  const buildLocaleHref = (target: string) => {
    const catSlug = categoryData
      ? getLocalizedSlug(categoryData.slugs, target, categoryData.slug)
      : category;
    const prodSlug = product
      ? getLocalizedSlug(product.slugs, target, product.slug)
      : slug;
    const productsSegment = productsPathSegment(target);
    return `/${target}/${productsSegment}/${catSlug}/${prodSlug}`;
  };

  return {
    title: `${title} | KARPOL Engineering`,
    description: desc,
    alternates: {
      canonical: buildLocaleHref(locale),
      languages: buildAlternatesLanguages((loc) =>
        buildLocaleHref(loc as AppLocale),
      ),
    },
    openGraph: {
      title: `${title} | KARPOL`,
      description: desc,
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

  const richContent = getRichProductContent(category, slug);
  const { data: product } = await getProductByLocalizedSlug(category, slug, locale);
  const { data: categoryData } = await getProductCategoryByLocalizedSlug(
    category,
    locale,
  );

  if (!product && !richContent) notFound();

  const modules = { ...DEFAULT_PRODUCT_MODULES, ...(product?.modules ?? {}) };

  const productTitle = product
    ? getLocalizedField(product.name, locale)
    : (richContent?.name ?? slug.replace(/-/g, " "));
  const shortDesc = product
    ? getLocalizedField(product.short_description, locale) ||
      getLocalizedField(product.description, locale)
    : (richContent?.shortDescription ?? "");
  const longDesc = product
    ? getLocalizedField(product.description, locale)
    : (richContent?.intro ?? "");

  const categoryName = categoryData
    ? getLocalizedField(categoryData.name, locale)
    : category.replace(/-/g, " ");
  const localeCategorySlug = categoryData
    ? getLocalizedSlug(categoryData.slugs, locale, categoryData.slug)
    : category;

  // Gallery
  const supabaseJsonGallery = getSupabaseJsonGallery(product);
  const gallery =
    product?.gallery && product.gallery.length > 0
      ? product.gallery
          .filter((g) => g && g.url && isImageUrl(g.url))
          .map((g) => ({
            url: g.url,
            title: getLocalizedField(g.alt, locale) || productTitle,
            type: g.type,
          }))
      : supabaseJsonGallery.length > 0
        ? supabaseJsonGallery.map((g) => ({ url: g.url, title: g.title }))
        : product?.images && product.images.length > 0
          ? uniqueByUrl(
              product.images.map((url, i) => ({
                title: `${productTitle} ${i + 1}`,
                url,
              })),
            ).filter((g) => isImageUrl(g.url))
          : (richContent?.imageGallery ?? []).filter((g) => isImageUrl(g.url));

  // 3D Model
  const has3DModule =
    modules.model_3d &&
    !!(product?.model_3d?.glb_url || product?.model_3d?.stp_url);
  const model3dEmbed =
    product?.model_3d_url ?? richContent?.modelEmbedUrl ?? null;
  const model3dSource =
    has3DModule && product?.model_3d?.glb_url
      ? {
          glbUrl: product.model_3d.glb_url,
          posterUrl: product.model_3d.preview_image_url ?? null,
        }
      : model3dEmbed
        ? { embedUrl: model3dEmbed }
        : null;

  // Specs
  const specTablesFromProduct = modules.specifications
    ? normalizeProductSpecificationTables(product?.specifications ?? null)
    : [];
  const fallbackSpecs = [
    {
      label: t("spec.material"),
      value: product?.material ?? richContent?.specs.find((s) => /malzeme|material/i.test(s.label))?.value ?? "",
    },
    {
      label: t("spec.hardness"),
      value:
        product?.hardness && product?.hardness_unit
          ? `${product.hardness} ${product.hardness_unit}`
          : richContent?.specs.find((s) => /sertlik|hardness/i.test(s.label))?.value ?? "",
    },
    {
      label: t("spec.temperature"),
      value:
        product?.temperature_min != null && product?.temperature_max != null
          ? `${product.temperature_min}°C / +${product.temperature_max}°C`
          : richContent?.specs.find((s) => /sıcaklık|temp/i.test(s.label))?.value ?? "",
    },
    { label: t("spec.color"), value: product?.color ?? "" },
    { label: t("spec.weight"), value: product?.weight ?? "" },
    { label: t("spec.sku"), value: product?.sku ?? "" },
  ].filter((s) => s.value);

  const hasCustomSpecRows = specTablesFromProduct.some((tab) => tab.rows.length > 0);
  const specificationTables = hasCustomSpecRows
    ? specTablesFromProduct
    : fallbackSpecs.length > 0
      ? [{ rows: fallbackSpecs }]
      : richContent?.specs?.length
        ? [{ rows: richContent.specs.map((s) => ({ label: s.label, value: s.value })) }]
        : [];

  // Size table — esnek sütunlar (yeni format) + eski formattan otomatik dönüşüm
  const sizeTableSource = modules.size_table
    ? (product?.size_table as unknown) ??
      (richContent?.sizeTable as unknown) ??
      null
    : null;
  const sizeTables = sizeTableSource ? normalizeProductSizeTables(sizeTableSource) : [];

  // Applications
  const applications = modules.applications
    ? product?.applications
      ? getLocalizedArray(product.applications, locale)
      : (richContent?.applications ?? [])
    : [];

  // Compatible Machines
  const compatibleMachines = product?.compatible_machines?.length
    ? product.compatible_machines
    : (richContent?.compatibleMachines ?? []);

  // Technical Drawings
  const technicalDrawings = modules.technical_drawing
    ? product?.technical_drawings && product.technical_drawings.length > 0
      ? product.technical_drawings.map((d) => ({
          url: d.url,
          title: getLocalizedField(d.caption, locale) || t("drawing"),
        }))
      : product?.technical_drawing_url
        ? [{ url: product.technical_drawing_url, title: t("drawing") }]
        : (richContent?.technicalDrawings ?? [])
    : [];

  // Datasheets
  const datasheets = modules.datasheet
    ? product?.datasheets && product.datasheets.length > 0
      ? product.datasheets.map((d) => ({
          url: d.url,
          title: getLocalizedField(d.label, locale) || t("datasheet"),
        }))
      : product?.datasheet_url
        ? [{ url: product.datasheet_url, title: t("datasheet") }]
        : (richContent?.documents ?? [])
    : [];

  // Highlights
  const highlights = richContent?.highlights ?? [];

  // Related (locale-aware slugs)
  const related: { id: string; name: string; slug: string; image?: string }[] = [];
  let linkedIndustries: { slug: string; name: string }[] = [];
  if (product) {
    const { data: rel } = await getRelatedProductsByCategory(
      product.category_id,
      product.slug,
      4,
    );
    for (const p of rel) {
      related.push({
        id: p.id,
        name: getLocalizedField(p.name, locale),
        slug: getLocalizedSlug(p.slugs, locale, p.slug),
        image: p.images?.[0],
      });
    }
    const { data: inds } = await getIndustriesForProduct(product.id);
    linkedIndustries = (inds ?? []).map((i) => ({
      slug: i.slug,
      name: getLocalizedField(i.name, locale),
    }));
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productTitle,
    description: shortDesc || longDesc,
    sku: product?.sku ?? slug,
    image: gallery.map((img) => img.url),
    brand: { "@type": "Brand", name: "KARPOL" },
    manufacturer: {
      "@type": "Organization",
      name: "KARPOL Industrial Components",
      url: "https://karpol.net",
    },
    category: categoryName,
    material: product?.material,
    color: product?.color,
  };

  return (
    <>
      <ProductDetailView
        locale={locale}
        productId={product?.id}
        productTitle={productTitle}
        shortDesc={shortDesc}
        longDesc={longDesc}
        sku={product?.sku}
        category={{ name: categoryName, slug: localeCategorySlug }}
        meta={{
          material: product?.material,
          hardness: product?.hardness,
          hardnessUnit: product?.hardness_unit,
          color: product?.color,
        }}
        modules={modules}
        gallery={gallery}
        model3d={model3dSource}
        specificationTables={specificationTables}
        sizeTables={sizeTables}
        applications={applications}
        highlights={highlights}
        compatibleMachines={compatibleMachines}
        linkedIndustries={linkedIndustries}
        technicalDrawings={technicalDrawings}
        datasheets={datasheets}
        related={related}
      />
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </>
  );
}
