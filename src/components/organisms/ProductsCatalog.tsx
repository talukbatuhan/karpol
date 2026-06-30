"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ProductPublicView } from "@/types/product";
import type { PublicCategoryTab } from "@/services/categories";
import {
  buildCategoryCatalogMaps,
  getActiveRootCategory,
  getBrowsableSubcategories,
  getChildCategories,
  getRootCategories,
  isParentCategorySelection,
} from "@/lib/category-catalog";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    browseSubcategories: string;
  };
}

export function ProductsCatalog({
  products,
  categoryTabs,
  initialCategory = "all",
  labels,
}: ProductsCatalogProps) {
  const tPage = useTranslations("productsPage");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const maps = useMemo(() => {
    const productCategorySlugs = products
      .map((product) => product.category?.slug)
      .filter((slug): slug is string => Boolean(slug));

    return buildCategoryCatalogMaps(categoryTabs, productCategorySlugs);
  }, [products, categoryTabs]);

  const categoryParam = searchParams.get("category");
  const activeCategory =
    categoryParam && maps.bySlug.has(categoryParam) ? categoryParam : initialCategory;

  const rootCategories = useMemo(
    () => getRootCategories(categoryTabs, maps),
    [categoryTabs, maps],
  );

  const activeRoot = useMemo(() => {
    if (activeCategory === "all") return null;
    return getActiveRootCategory(activeCategory, maps);
  }, [activeCategory, maps]);

  const childCategories = useMemo(() => {
    if (!activeRoot) return [];
    return getBrowsableSubcategories(activeRoot, maps);
  }, [activeRoot, maps]);

  const subcategoryOnlyChildren = useMemo(() => {
    if (!activeRoot) return [];
    return getChildCategories(activeRoot.id, maps);
  }, [activeRoot, maps]);

  const showSubcategoryBrowser = useMemo(
    () => isParentCategorySelection(activeCategory, maps),
    [activeCategory, maps],
  );

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => product.category?.slug === activeCategory);
  }, [products, activeCategory]);

  function selectCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function isRootTabActive(slug: string) {
    if (activeCategory === "all") return false;
    if (activeCategory === slug) return true;
    return activeRoot?.slug === slug;
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
      {rootCategories.length > 0 ? (
        <div className="col-span-12 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => selectCategory("all")}
              className="font-mono text-xs uppercase tracking-widest"
            >
              {labels.allCategories}
            </Button>
            {rootCategories.map((category) => (
              <Button
                key={category.slug}
                type="button"
                size="sm"
                variant={isRootTabActive(category.slug) ? "default" : "outline"}
                onClick={() => selectCategory(category.slug)}
                className="font-mono text-xs uppercase tracking-widest"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {childCategories.length > 0 && activeRoot ? (
            <div className="flex flex-wrap gap-2 border-l-2 border-gold-500/40 pl-3">
              {childCategories.map((category) => (
                <Button
                  key={category.slug}
                  type="button"
                  size="sm"
                  variant={
                    activeCategory === category.slug ? "default" : "outline"
                  }
                  onClick={() => selectCategory(category.slug)}
                  className="font-mono text-[10px] uppercase tracking-widest"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {showSubcategoryBrowser ? (
        <div className="col-span-12 space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-navy-800/70">
            {labels.browseSubcategories}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {childCategories.map((category) => {
              const count = maps.productCountBySlug.get(category.slug) ?? 0;
              return (
                <Reveal key={category.slug}>
                  <button
                    type="button"
                    onClick={() => selectCategory(category.slug)}
                    className="h-full w-full text-left"
                  >
                    <Card
                      className={`h-full border-navy-800/30 bg-ivory-50 transition-colors hover:border-gold-500/50 hover:bg-ivory-100 ${
                        activeCategory === category.slug
                          ? "border-gold-500 ring-1 ring-gold-500/30"
                          : ""
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="font-display text-lg text-navy-950">
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-navy-800/60">
                          {tPage("productCount", { count })}
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div
          className={`col-span-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 ${
            showSubcategoryBrowser ? "mt-2" : ""
          }`}
        >
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
      ) : !showSubcategoryBrowser ? (
        <div className="col-span-12 border border-navy-800/20 bg-ivory-100 px-8 py-12 text-center">
          <p className="font-display text-lg font-bold text-navy-950">
            {labels.emptyFilterTitle}
          </p>
          <p className="mt-2 text-sm text-navy-800/75">
            {labels.emptyFilterDescription}
          </p>
        </div>
      ) : subcategoryOnlyChildren.length > 0 ? null : (
        <div className="col-span-12 border border-navy-800/20 bg-ivory-100 px-8 py-12 text-center">
          <p className="font-display text-lg font-bold text-navy-950">
            {labels.emptyFilterTitle}
          </p>
          <p className="mt-2 text-sm text-navy-800/75">
            {labels.emptyFilterDescription}
          </p>
        </div>
      )}
    </>
  );
}
