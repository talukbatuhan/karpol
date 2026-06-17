"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductPublicView } from "@/types/product";
import type { PublicCategoryTab } from "@/services/categories";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

export type ProductCatalogItem = ProductPublicView;

export interface ProductsCatalogProps {
  products: ProductCatalogItem[];
  categoryTabs: PublicCategoryTab[];
  initialCategory?: string;
  labels: {
    viewDetail: string;
    allCategories: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyFilterTitle: string;
    emptyFilterDescription: string;
  };
}

export function ProductsCatalog({
  products,
  categoryTabs,
  initialCategory = "all",
  labels,
}: ProductsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const categories = useMemo(() => {
    const slugsWithProducts = new Set(
      products
        .map((product) => product.category?.slug)
        .filter((slug): slug is string => Boolean(slug)),
    );

    const ordered = categoryTabs.filter((tab) => slugsWithProducts.has(tab.slug));

    if (ordered.length > 0) return ordered;

    const map = new Map<string, string>();
    for (const product of products) {
      if (product.category) {
        map.set(product.category.slug, product.category.name);
      }
    }
    return [...map.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }, [products, categoryTabs]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category?.slug === activeCategory);
  }, [products, activeCategory]);

  function selectCategory(slug: string) {
    setActiveCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  if (products.length === 0) {
    return (
      <div className="col-span-12 border border-navy-800/20 bg-ivory-100 px-8 py-16 text-center">
        <p className="font-display text-xl font-bold text-navy-950">
          {labels.emptyTitle}
        </p>
        <p className="mt-3 text-sm text-navy-800/75">{labels.emptyDescription}</p>
      </div>
    );
  }

  return (
    <>
      {categories.length > 1 ? (
        <div className="col-span-12 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => selectCategory("all")}
            className="font-mono text-xs uppercase tracking-widest"
          >
            {labels.allCategories}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.slug}
              type="button"
              size="sm"
              variant={
                activeCategory === category.slug ? "default" : "outline"
              }
              onClick={() => selectCategory(category.slug)}
              className="font-mono text-xs uppercase tracking-widest"
            >
              {category.name}
            </Button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="col-span-12 border border-navy-800/20 bg-ivory-100 px-8 py-12 text-center">
          <p className="font-display text-lg font-bold text-navy-950">
            {labels.emptyFilterTitle}
          </p>
          <p className="mt-2 text-sm text-navy-800/75">
            {labels.emptyFilterDescription}
          </p>
        </div>
      ) : (
        <div className="col-span-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
          {filtered.map((product) => (
            <Reveal key={product.slug} className="min-w-0">
              <ProductCard
                compact
                slug={product.slug}
                title={product.title}
                description={product.description}
                viewLabel={labels.viewDetail}
                categoryName={product.category?.name}
                imagePath={product.assets?.image}
              />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
