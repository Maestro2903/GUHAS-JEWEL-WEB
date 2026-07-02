import Image from "next/image";
import type { Product } from "@repo/supabase";
import { formatPrice } from "@/lib/format";

const PLACEHOLDER = "/images/product-makers-slice.png";

export default function ProductListItem({ product }: { product: Product }) {
  const price = formatPrice(product.price);

  return (
    <div className="group flex items-center gap-4 py-4 sm:gap-6">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-black/5 bg-white sm:h-28 sm:w-28">
        <Image
          src={product.image_url || PLACEHOLDER}
          alt={product.name}
          fill
          sizes="112px"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        {product.category?.name && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[11px]">
            {product.category.name}
          </p>
        )}
        <h3 className="mt-0.5 truncate font-serif text-base text-ink transition-colors group-hover:text-burgundy sm:text-lg">
          {product.name}
        </h3>
        {product.metal && (
          <span className="mt-1 inline-block rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-medium text-burgundy">
            {product.metal}
          </span>
        )}
      </div>

      <div className="shrink-0 pl-2 text-right">
        {price ? (
          <p className="text-sm font-semibold text-burgundy sm:text-base">{price}</p>
        ) : (
          <p className="text-xs italic text-muted sm:text-sm">On request</p>
        )}
      </div>
    </div>
  );
}
