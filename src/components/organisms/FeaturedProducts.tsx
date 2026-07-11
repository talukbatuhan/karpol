import { Link } from "@/i18n/routing";
import type { ProductPublicView } from "@/types/product";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export interface FeaturedProductsProps {
  products: ProductPublicView[];
  labels: {
    title: string;
    viewAll: string;
    viewDetail: string;
  };
}

export function FeaturedProducts({ products, labels }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="col-span-12 py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-navy-800">
          {labels.title}
        </h2>
        <Link
          href="/urunler"
          className="font-mono text-xs uppercase tracking-widest text-gold-500 hover:text-navy-950"
        >
          {labels.viewAll} →
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8">
        {products.map((product) => (
          <Reveal
            key={product.slug}
            className="col-span-12 md:col-span-6 lg:col-span-4"
          >
            <ProductCard
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
    </section>
  );
}
