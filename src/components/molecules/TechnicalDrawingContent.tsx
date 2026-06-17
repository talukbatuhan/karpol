import {
  resolveProductFileUrl,
  resolveProductImageUrl,
} from "@/lib/product-image";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";

export interface TechnicalDrawingContentProps {
  image: string;
  alt: string;
}

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
      <div className="flex flex-col">
        <iframe
          src={src}
          title={alt}
          className="aspect-[3/4] w-full min-h-[280px] border-0 bg-white"
        />
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="border-t border-navy-800/20 bg-ivory-50 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-gold-600 underline"
        >
          PDF — tam ekran
        </a>
      </div>
    );
  }

  return (
    <ProportionalProductImage
      src={src}
      alt={alt}
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  );
}
