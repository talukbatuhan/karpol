import Image from "next/image";

export interface ProportionalProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ProportionalProductImage({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  className = "",
}: ProportionalProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={sizes}
      priority={priority}
      className={`block h-auto w-full max-w-full ${className}`}
      style={{ width: "100%", height: "auto" }}
    />
  );
}
