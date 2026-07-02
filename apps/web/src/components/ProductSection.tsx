import Link from "next/link";
import type { Product } from "@repo/supabase";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";

type Props = {
  id?: string;
  title: string;
  products: Product[];
  band?: boolean;
  viewAllHref?: string;
};

export default function ProductSection({
  id,
  title,
  products,
  band,
  viewAllHref = "/products",
}: Props) {
  if (!products.length) return null;

  return (
    <section
      id={id}
      className={`py-16 lg:py-24 ${band ? "bg-cream" : "bg-white"}`}
    >
      <div className="container-x">
        <SectionHeading className="mb-12">{title}</SectionHeading>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href={viewAllHref} className="btn-outline">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
