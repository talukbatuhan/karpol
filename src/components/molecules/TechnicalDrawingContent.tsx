import {
  resolveProductFileUrl,
  resolveProductImageUrl,
} from "@/lib/product-image";
import { PRODUCT_MEDIA_ASPECT_CLASS } from "@/lib/product-media";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { cn } from "@/lib/utils";

export interface TechnicalDrawingContentProps {
  image: string;
  alt: string;
}

export function getTechnicalDrawingPdfUrl(image: string): string | null {
  if (!image.toLowerCase().endsWith(".pdf")) return null;
  return resolveProductFileUrl(image);
}

/** 4/3 media only — PDF open link belongs in ProductMediaFrame footer. */
export function TechnicalDrawingContent({
  image,
  alt,
}: TechnicalDrawingContentProps) {
  const isPdf = image.toLowerCase().endsWith(".pdf");
  const imageUrl = resolveProductImageUrl(image);
  const fileUrl = resolveProductFileUrl(image);
  const src = isPdf ? fileUrl : imageUrl;

  if (!src) return null;

  if (isPdf) {
    return (
      <div className={cn("relative w-full", PRODUCT_MEDIA_ASPECT_CLASS)}>
        <iframe
          src={src}
          title={alt}
          className="absolute inset-0 h-full w-full border-0 bg-white"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", PRODUCT_MEDIA_ASPECT_CLASS)}>
      <ProportionalProductImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 40vw"
      />
    </div>
  );
}

export function TechnicalDrawingPdfFooter({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-navy-800/20 bg-ivory-50 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-gold-600 underline"
    >
      PDF — tam ekran
    </a>
  );
}
