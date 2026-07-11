import { Link } from "@/i18n/routing";
import type { ProductPublicView } from "@/types/product";
import {
  resolveProductFileUrl,
  resolveProductImageUrl,
} from "@/lib/product-image";
import { PageHeader } from "@/components/organisms/PageHeader";
import { SpecRow } from "@/components/molecules/SpecRow";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { ProductMediaFrame } from "@/components/molecules/ProductMediaFrame";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { TechnicalDrawingContent } from "@/components/molecules/TechnicalDrawingContent";
import { TechnicalTablesSection } from "@/components/molecules/TechnicalTablesSection";

export interface ProductDetailViewProps {
  product: ProductPublicView;
  labels: {
    productImageTitle: string;
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
  const imageUrl = resolveProductImageUrl(product.assets?.image);
  const cadUrl = resolveProductFileUrl(product.assets?.cad);
  const pdfUrl = resolveProductFileUrl(product.assets?.pdf);
  const hasSpecs = product.specs.length > 0;
  const hasDownloads = Boolean(cadUrl || pdfUrl);
  const hasTechnicalDrawing = Boolean(product.technicalDrawing);
  const hasTechnicalTables = product.technicalTables.length > 0;
  const showProductImage = Boolean(imageUrl);
  const showTechnicalDrawing = hasTechnicalDrawing && product.technicalDrawing;
  const showMediaRow = showProductImage || showTechnicalDrawing;

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
        <Reveal className="col-span-12 lg:col-span-7">
          <div
            className={`grid items-start gap-4 md:gap-6 ${
              showProductImage && showTechnicalDrawing
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {showProductImage && imageUrl ? (
              <ProductMediaFrame title={labels.productImageTitle}>
                <ProportionalProductImage
                  src={imageUrl}
                  alt={product.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </ProductMediaFrame>
            ) : null}

            {showTechnicalDrawing && product.technicalDrawing ? (
              <ProductMediaFrame
                title={labels.technicalDrawingTitle}
                caption={product.technicalDrawing.caption}
              >
                <TechnicalDrawingContent
                  image={product.technicalDrawing.image}
                  alt={
                    product.technicalDrawing.caption ?? labels.technicalDrawingTitle
                  }
                />
              </ProductMediaFrame>
            ) : null}
          </div>
        </Reveal>
      ) : null}

      <aside
        className={`col-span-12 md:sticky md:top-24 md:self-start ${
          showMediaRow ? "lg:col-span-5" : "md:col-span-4"
        }`}
      >
        {hasSpecs || product.toolHref || hasDownloads ? (
          <div className="border border-navy-800 bg-navy-950 p-6 text-ivory-50">
            {hasSpecs ? (
              <>
                <p className="font-mono text-xs uppercase tracking-widest text-gold-300">
                  {labels.specTitle}
                </p>
                <dl className="mt-4">
                  {product.specs.map((spec, index) => (
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

            {product.toolHref ? (
              <Link
                href={product.toolHref}
                className={`block border border-gold-500 px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950 ${
                  hasSpecs || hasDownloads ? "mt-6" : ""
                }`}
              >
                {labels.openTool} →
              </Link>
            ) : null}
          </div>
        ) : null}
      </aside>

      <Reveal
        className={`col-span-12 space-y-6 ${
          showMediaRow ? "lg:col-span-7" : "md:col-span-8"
        }`}
      >
        <p className="font-sans text-lg leading-relaxed text-navy-800">
          {product.body}
        </p>

        {hasTechnicalTables && product.technicalTables.length === 1 ? (
          <TechnicalTablesSection
            tables={product.technicalTables}
            labels={{
              technicalTableTitle: labels.technicalTableTitle,
              technicalTablesTitle: labels.technicalTablesTitle,
              technicalTablePage: labels.technicalTablePage,
              technicalTablePrevious: labels.technicalTablePrevious,
              technicalTableNext: labels.technicalTableNext,
            }}
          />
        ) : null}

        {product.technicalTables.length <= 1 ? (
          <Link
            href="/urunler"
            className="inline-block font-mono text-xs uppercase tracking-widest text-navy-800 underline decoration-gold-500 underline-offset-4"
          >
            ← {labels.backToProducts}
          </Link>
        ) : null}
      </Reveal>

      {hasTechnicalTables && product.technicalTables.length > 1 ? (
        <Reveal className="col-span-12 space-y-6">
          <TechnicalTablesSection
            tables={product.technicalTables}
            labels={{
              technicalTableTitle: labels.technicalTableTitle,
              technicalTablesTitle: labels.technicalTablesTitle,
              technicalTablePage: labels.technicalTablePage,
              technicalTablePrevious: labels.technicalTablePrevious,
              technicalTableNext: labels.technicalTableNext,
            }}
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
