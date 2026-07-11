import { Link } from "@/i18n/routing";
import type { ProductPublicView } from "@/types/product";
import { resolveProductFileUrl } from "@/lib/product-image";
import { PageHeader } from "@/components/organisms/PageHeader";
import { SpecRow } from "@/components/molecules/SpecRow";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { ProductMediaFrame } from "@/components/molecules/ProductMediaFrame";
import { ProductImageGallery } from "@/components/molecules/ProductImageGallery";
import {
  getTechnicalDrawingPdfUrl,
  TechnicalDrawingContent,
  TechnicalDrawingPdfFooter,
} from "@/components/molecules/TechnicalDrawingContent";
import { TechnicalTablesSection } from "@/components/molecules/TechnicalTablesSection";

export interface ProductDetailViewProps {
  product: ProductPublicView;
  labels: {
    productImageTitle: string;
    productGalleryLabel: string;
    specTitle: string;
    technicalDrawingTitle: string;
    technicalTableTitle: string;
    technicalTablesTitle: string;
    technicalTablePage: string;
    technicalTablePrevious: string;
    technicalTableNext: string;
    openTool: string;
    downloadCad: string;
    downloadPdf: string;
    backToProducts: string;
  };
}

export function ProductDetailView({ product, labels }: ProductDetailViewProps) {
  const galleryPaths =
    product.assets.images && product.assets.images.length > 0
      ? product.assets.images
      : product.assets.image
        ? [product.assets.image]
        : [];
  const cadUrl = resolveProductFileUrl(product.assets?.cad);
  const pdfUrl = resolveProductFileUrl(product.assets?.pdf);
  const hasSpecs = product.specs.length > 0;
  const hasDownloads = Boolean(cadUrl || pdfUrl);
  const hasTechnicalDrawing = Boolean(product.technicalDrawing);
  const hasTechnicalTables = product.technicalTables.length > 0;
  const showProductImage = galleryPaths.length > 0;
  const showTechnicalDrawing = hasTechnicalDrawing && product.technicalDrawing;
  const hasMultipleImages = galleryPaths.length > 1;
  const showTablesBesideGallery =
    showProductImage &&
    hasMultipleImages &&
    !showTechnicalDrawing &&
    hasTechnicalTables;
  const showTablesInBody = hasTechnicalTables && !showTablesBesideGallery;
  const showMediaRow =
    showProductImage || showTechnicalDrawing || showTablesBesideGallery;
  const mediaPair =
    (showProductImage && Boolean(showTechnicalDrawing)) ||
    showTablesBesideGallery;

  const technicalTableLabels = {
    technicalTableTitle: labels.technicalTableTitle,
    technicalTablesTitle: labels.technicalTablesTitle,
    technicalTablePage: labels.technicalTablePage,
    technicalTablePrevious: labels.technicalTablePrevious,
    technicalTableNext: labels.technicalTableNext,
  };

  const drawingPdfUrl = product.technicalDrawing
    ? getTechnicalDrawingPdfUrl(product.technicalDrawing.image)
    : null;

  const mediaClassName = mediaPair
    ? "col-span-12"
    : showMediaRow
      ? "col-span-12 lg:col-span-7"
      : "col-span-12";

  const asideClassName = mediaPair
    ? "col-span-12 lg:col-span-5 md:sticky md:top-24 md:self-start"
    : showMediaRow
      ? "col-span-12 lg:col-span-5 md:sticky md:top-24 md:self-start"
      : "col-span-12 md:col-span-4 md:sticky md:top-24 md:self-start";

  const bodyClassName = mediaPair
    ? "col-span-12 space-y-6 lg:col-span-7"
    : showMediaRow
      ? "col-span-12 space-y-6 lg:col-span-7"
      : "col-span-12 space-y-6 md:col-span-8";

  return (
    <>
      <div className="col-span-12 space-y-4">
        {product.category ? (
          <Link href="/urunler">
            <Badge
              variant="secondary"
              className="font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-secondary/80"
            >
              {product.category.name}
            </Badge>
          </Link>
        ) : null}
        <PageHeader title={product.title} subtitle={product.description} />
      </div>

      {showMediaRow ? (
        <Reveal className={mediaClassName}>
          <div
            className={`grid items-start gap-4 md:gap-6 ${
              mediaPair ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {showProductImage ? (
              <ProductImageGallery
                title={labels.productImageTitle}
                frameTitle={labels.productImageTitle}
                galleryLabel={labels.productGalleryLabel}
                imagePaths={galleryPaths}
                alt={product.title}
              />
            ) : null}

            {showTechnicalDrawing && product.technicalDrawing ? (
              <ProductMediaFrame
                title={labels.technicalDrawingTitle}
                caption={product.technicalDrawing.caption}
                footer={
                  drawingPdfUrl ? (
                    <TechnicalDrawingPdfFooter href={drawingPdfUrl} />
                  ) : undefined
                }
              >
                <TechnicalDrawingContent
                  image={product.technicalDrawing.image}
                  alt={
                    product.technicalDrawing.caption ??
                    labels.technicalDrawingTitle
                  }
                />
              </ProductMediaFrame>
            ) : null}

            {showTablesBesideGallery ? (
              <TechnicalTablesSection
                tables={product.technicalTables}
                labels={technicalTableLabels}
                compact
              />
            ) : null}
          </div>
        </Reveal>
      ) : null}

      {/* When mediaPair: body then specs on next row (DOM order). Specs sticky. */}
      {mediaPair ? (
        <>
          <Reveal className={bodyClassName}>
            <p className="font-sans text-lg leading-relaxed text-navy-800">
              {product.body}
            </p>

            {showTablesInBody && product.technicalTables.length === 1 ? (
              <TechnicalTablesSection
                tables={product.technicalTables}
                labels={technicalTableLabels}
              />
            ) : null}

            {showTablesInBody && product.technicalTables.length > 1 ? null : (
              <Link
                href="/urunler"
                className="inline-block font-mono text-xs uppercase tracking-widest text-navy-800 underline decoration-gold-500 underline-offset-4"
              >
                ← {labels.backToProducts}
              </Link>
            )}
          </Reveal>

          <aside className={asideClassName}>
            <ProductSpecsAside
              labels={labels}
              hasSpecs={hasSpecs}
              hasDownloads={hasDownloads}
              specs={product.specs}
              cadUrl={cadUrl}
              pdfUrl={pdfUrl}
              toolHref={product.toolHref}
            />
          </aside>
        </>
      ) : (
        <>
          <aside className={asideClassName}>
            <ProductSpecsAside
              labels={labels}
              hasSpecs={hasSpecs}
              hasDownloads={hasDownloads}
              specs={product.specs}
              cadUrl={cadUrl}
              pdfUrl={pdfUrl}
              toolHref={product.toolHref}
            />
          </aside>

          <Reveal className={bodyClassName}>
            <p className="font-sans text-lg leading-relaxed text-navy-800">
              {product.body}
            </p>

            {showTablesInBody && product.technicalTables.length === 1 ? (
              <TechnicalTablesSection
                tables={product.technicalTables}
                labels={technicalTableLabels}
              />
            ) : null}

            {showTablesInBody && product.technicalTables.length > 1 ? null : (
              <Link
                href="/urunler"
                className="inline-block font-mono text-xs uppercase tracking-widest text-navy-800 underline decoration-gold-500 underline-offset-4"
              >
                ← {labels.backToProducts}
              </Link>
            )}
          </Reveal>
        </>
      )}

      {showTablesInBody && product.technicalTables.length > 1 ? (
        <Reveal className="col-span-12 space-y-6">
          <TechnicalTablesSection
            tables={product.technicalTables}
            labels={technicalTableLabels}
          />
          <Link
            href="/urunler"
            className="inline-block font-mono text-xs uppercase tracking-widest text-navy-800 underline decoration-gold-500 underline-offset-4"
          >
            ← {labels.backToProducts}
          </Link>
        </Reveal>
      ) : null}
    </>
  );
}

function ProductSpecsAside({
  labels,
  hasSpecs,
  hasDownloads,
  specs,
  cadUrl,
  pdfUrl,
  toolHref,
}: {
  labels: ProductDetailViewProps["labels"];
  hasSpecs: boolean;
  hasDownloads: boolean;
  specs: ProductPublicView["specs"];
  cadUrl: string | null;
  pdfUrl: string | null;
  toolHref?: string | null;
}) {
  if (!hasSpecs && !toolHref && !hasDownloads) return null;

  return (
    <div className="border border-navy-800 bg-navy-950 p-6 text-ivory-50">
      {hasSpecs ? (
        <>
          <p className="font-mono text-xs uppercase tracking-widest text-gold-300">
            {labels.specTitle}
          </p>
          <dl className="mt-4">
            {specs.map((spec, index) => (
              <SpecRow
                key={`${spec.label}-${index}`}
                label={spec.label}
                value={spec.value}
              />
            ))}
          </dl>
        </>
      ) : null}

      {hasDownloads ? (
        <div
          className={`flex flex-wrap gap-3 ${hasSpecs ? "mt-6 border-t border-ivory-50/10 pt-6" : ""}`}
        >
          {cadUrl ? (
            <a
              href={cadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold-500/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950"
            >
              {labels.downloadCad} ↓
            </a>
          ) : null}
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold-500/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950"
            >
              {labels.downloadPdf} ↓
            </a>
          ) : null}
        </div>
      ) : null}

      {toolHref ? (
        <Link
          href={toolHref}
          className={`block border border-gold-500 px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950 ${
            hasSpecs || hasDownloads ? "mt-6" : ""
          }`}
        >
          {labels.openTool} →
        </Link>
      ) : null}
    </div>
  );
}
