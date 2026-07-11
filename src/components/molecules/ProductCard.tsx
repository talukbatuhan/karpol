"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { lineDrawVariants } from "@/lib/motion/variants";
import { resolveProductImageUrl } from "@/lib/product-image";
import { ProportionalProductImage } from "@/components/molecules/ProportionalProductImage";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ProductCardProps {
  title: string;
  description: string;
  slug: string;
  viewLabel: string;
  categoryName?: string | null;
  imagePath?: string;
  compact?: boolean;
}

export function ProductCard({
  title,
  description,
  slug,
  viewLabel,
  categoryName,
  imagePath,
  compact = false,
}: ProductCardProps) {
  const imageUrl = resolveProductImageUrl(imagePath);

  return (
    <motion.article
      className="h-full"
      initial="rest"
      whileHover="hover"
    >
      <Card
        className={`relative flex h-full flex-col border-navy-800/30 bg-ivory-50 py-0 ring-0 ${
          compact ? "gap-0" : ""
        }`}
      >
        <motion.span
          variants={lineDrawVariants}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left bg-gold-500"
          aria-hidden
        />
        {imageUrl ? (
          <div className="border-b border-navy-800/20 bg-navy-950/5">
            <ProportionalProductImage
              src={imageUrl}
              alt={title}
              sizes={
                compact
                  ? "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
            />
          </div>
        ) : (
          <div
            className={`w-full border-b border-navy-800/20 bg-navy-950/5 ${
              compact ? "min-h-[5rem]" : "min-h-[10rem]"
            }`}
            aria-hidden
          />
        )}
        <CardHeader className={compact ? "gap-1.5 px-3 pt-3 pb-0" : "gap-3 pb-0"}>
          {categoryName ? (
            <Badge
              variant="secondary"
              className={`w-fit font-mono uppercase tracking-widest ${
                compact ? "text-[9px]" : "text-[10px]"
              }`}
            >
              {categoryName}
            </Badge>
          ) : null}
          <CardTitle
            className={`font-display font-bold tracking-tight text-navy-950 ${
              compact ? "text-base leading-snug" : "text-2xl"
            }`}
          >
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className={`flex-1 ${compact ? "px-3 py-2" : ""}`}>
          <p
            className={`font-sans leading-relaxed text-navy-800/80 ${
              compact
                ? "line-clamp-2 text-xs"
                : "text-sm"
            }`}
          >
            {description}
          </p>
        </CardContent>
        <CardFooter
          className={`border-t border-navy-800/10 bg-transparent ${
            compact ? "px-3 py-2.5" : ""
          }`}
        >
          <Link
            href={`/urunler/${slug}`}
            className={`inline-flex items-center justify-center border border-input bg-background font-mono uppercase tracking-widest transition-colors hover:bg-muted ${
              compact
                ? "h-7 px-2 text-[10px]"
                : "h-8 px-3 text-xs"
            }`}
          >
            {viewLabel} →
          </Link>
        </CardFooter>
      </Card>
    </motion.article>
  );
}
