import type { PublicCategoryTab } from "@/services/categories";

export type CategoryCatalogMaps = {
  bySlug: Map<string, PublicCategoryTab>;
  byId: Map<string, PublicCategoryTab>;
  childrenByParentId: Map<string, PublicCategoryTab[]>;
  slugsWithProducts: Set<string>;
  productCountBySlug: Map<string, number>;
};

export function buildCategoryCatalogMaps(
  categoryTabs: PublicCategoryTab[],
  productCategorySlugs: string[],
): CategoryCatalogMaps {
  const bySlug = new Map(categoryTabs.map((tab) => [tab.slug, tab]));
  const byId = new Map(categoryTabs.map((tab) => [tab.id, tab]));
  const childrenByParentId = new Map<string, PublicCategoryTab[]>();
  const slugsWithProducts = new Set(productCategorySlugs);
  const productCountBySlug = new Map<string, number>();

  for (const slug of productCategorySlugs) {
    productCountBySlug.set(slug, (productCountBySlug.get(slug) ?? 0) + 1);
  }

  for (const tab of categoryTabs) {
    if (!tab.parentId) continue;
    const siblings = childrenByParentId.get(tab.parentId) ?? [];
    siblings.push(tab);
    childrenByParentId.set(tab.parentId, siblings);
  }

  for (const [, children] of childrenByParentId) {
    children.sort(
      (a, b) =>
        a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "tr"),
    );
  }

  return {
    bySlug,
    byId,
    childrenByParentId,
    slugsWithProducts,
    productCountBySlug,
  };
}

export function subtreeHasProducts(
  categoryId: string,
  maps: CategoryCatalogMaps,
): boolean {
  const category = maps.byId.get(categoryId);
  if (!category) return false;
  if (maps.slugsWithProducts.has(category.slug)) return true;

  const children = maps.childrenByParentId.get(categoryId) ?? [];
  return children.some((child) => subtreeHasProducts(child.id, maps));
}

export function getRootCategories(
  categoryTabs: PublicCategoryTab[],
  maps: CategoryCatalogMaps,
): PublicCategoryTab[] {
  return categoryTabs
    .filter((tab) => !tab.parentId && subtreeHasProducts(tab.id, maps))
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "tr"),
    );
}

export function getActiveRootCategory(
  activeSlug: string,
  maps: CategoryCatalogMaps,
): PublicCategoryTab | null {
  const active = maps.bySlug.get(activeSlug);
  if (!active) return null;
  if (!active.parentId) return active;
  return maps.byId.get(active.parentId) ?? null;
}

export function getChildCategories(
  parentId: string,
  maps: CategoryCatalogMaps,
): PublicCategoryTab[] {
  return (maps.childrenByParentId.get(parentId) ?? []).filter((child) =>
    subtreeHasProducts(child.id, maps),
  );
}

/** Alt kategori sekmeleri; üst kategoride doğrudan ürün varsa kendini de listeler. */
export function getBrowsableSubcategories(
  parent: PublicCategoryTab,
  maps: CategoryCatalogMaps,
): PublicCategoryTab[] {
  const children = getChildCategories(parent.id, maps);
  const hasDirectProducts = maps.slugsWithProducts.has(parent.slug);

  if (hasDirectProducts && children.length > 0) {
    return [parent, ...children];
  }

  return children;
}

export function isParentCategorySelection(
  activeSlug: string,
  maps: CategoryCatalogMaps,
): boolean {
  const active = maps.bySlug.get(activeSlug);
  if (!active || active.parentId) return false;
  return getChildCategories(active.id, maps).length > 0;
}

export function categoryHasDirectProducts(
  slug: string,
  maps: CategoryCatalogMaps,
): boolean {
  return maps.slugsWithProducts.has(slug);
}
