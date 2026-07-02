import Image from "next/image";
import type { Product } from "@repo/supabase";
import { formatPrice } from "@/lib/format";

const PLACEHOLDER = "/images/product-makers-slice.png";

export default function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price);

  return (
    <div className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-md border border-black/5 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        {product.is_featured && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-burgundy px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={product.image_url || PLACEHOLDER}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        {product.category?.name && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {product.category.name}
          </p>
        )}
        <h3 className="mt-1 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-burgundy">
          {product.name}
        </h3>
        {price ? (
          <p className="mt-1 text-sm font-semibold text-burgundy">{price}</p>
        ) : (
          <p className="mt-1 text-sm italic text-muted">Price on request</p>
        )}
      </div>
    </div>
  );
}
