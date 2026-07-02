import PageBanner from "@/components/PageBanner";
import ProductCard from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import ProductFilters from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";
import { getCategories, getPublishedProducts, getPriceRanges } from "@repo/supabase";
import type { PriceRange, Product } from "@repo/supabase";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export const metadata = {
  title: "Collections — GUHAS GEMS AND JEWELLERIES",
  description:
    "Browse the Guhas Gems and Jewelleries collection of handcrafted rings, bracelets, pendants and earrings.",
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

function priceOf(p: Product): number | null {
  return p.price == null ? null : Number(p.price);
}

function bounds(r: PriceRange): { min: number; max: number } {
  return {
    min: Number(r.min_value),
    max: r.max_value == null ? Infinity : Number(r.max_value),
  };
}

function inRange(price: number, r: PriceRange): boolean {
  const { min, max } = bounds(r);
  return price >= min && price < max;
}

function sortProducts(list: Product[], sort: string): Product[] {
  const arr = [...list];
  const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
    const pa = priceOf(a);
    const pb = priceOf(b);
    if (pa == null && pb == null) return 0;
    if (pa == null) return 1;
    if (pb == null) return -1;
    return (pa - pb) * dir;
  };
  switch (sort) {
    case "price-asc":
      return arr.sort(byPrice(1));
    case "price-desc":
      return arr.sort(byPrice(-1));
    case "newest":
      return arr.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    default:
      return arr;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    metal?: string;
    price?: string;
    sort?: string;
    view?: string;
    page?: string;
  };
}) {
  const [categories, allProducts, priceRanges] = await Promise.all([
    getCategories(),
    getPublishedProducts(),
    getPriceRanges(),
  ]);

  const activeCategory = searchParams.category ?? "";
  const activeMetal = searchParams.metal ?? "";
  const activeSort = searchParams.sort || "featured";
  const view = searchParams.view === "list" ? "list" : "grid";

  // Only surface categories / metals / price bands that actually have products.
  const usedSlugs = new Set(
    allProducts.map((p) => p.category?.slug).filter(Boolean) as string[]
  );
  const availableCategories = categories.filter((c) => usedSlugs.has(c.slug));
  const availableMetals = Array.from(
    new Set(allProducts.map((p) => p.metal).filter(Boolean) as string[])
  ).sort();
  const availablePriceRanges = priceRanges.filter((r) =>
    allProducts.some((p) => {
      const price = priceOf(p);
      return price != null && inRange(price, r);
    })
  );
  const activeRange = availablePriceRanges.find((r) => r.id === searchParams.price);

  // The price band each product falls into (for counts + the filter panel).
  const rangeIdOf = (p: Product): string => {
    const price = priceOf(p);
    if (price == null) return "";
    return availablePriceRanges.find((r) => inRange(price, r))?.id ?? "";
  };
  const countBy = <T,>(list: T[], key: (t: T) => string): Map<string, number> => {
    const m = new Map<string, number>();
    for (const t of list) {
      const k = key(t);
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  };
  const catCounts = countBy(allProducts, (p) => p.category?.slug ?? "");
  const metalCounts = countBy(allProducts, (p) => p.metal ?? "");
  const priceCounts = countBy(allProducts, rangeIdOf);
  const items = allProducts.map((p) => ({
    category: p.category?.slug ?? "",
    metal: p.metal ?? "",
    price: rangeIdOf(p),
  }));

  let filtered = allProducts;
  if (activeCategory)
    filtered = filtered.filter((p) => p.category?.slug === activeCategory);
  if (activeMetal) filtered = filtered.filter((p) => p.metal === activeMetal);
  if (activeRange)
    filtered = filtered.filter((p) => {
      const price = priceOf(p);
      return price != null && inRange(price, activeRange);
    });
  filtered = sortProducts(filtered, activeSort);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(Number(searchParams.page) || 1, 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const makeHref = (p: number): string => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (activeMetal) params.set("metal", activeMetal);
    if (activeRange) params.set("price", activeRange.id);
    if (activeSort !== "featured") params.set("sort", activeSort);
    if (view !== "grid") params.set("view", view);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <>
      <PageBanner
        title="Our Collections"
        subtitle="Handcrafted pieces designed to be treasured for a lifetime."
      />

      <section className="container-x py-10 lg:py-16">
        <ProductFilters
          categories={availableCategories.map((c) => ({
            value: c.slug,
            label: c.name,
            count: catCounts.get(c.slug) ?? 0,
          }))}
          metals={availableMetals.map((m) => ({
            value: m,
            label: m,
            count: metalCounts.get(m) ?? 0,
          }))}
          priceRanges={availablePriceRanges.map((r) => ({
            value: r.id,
            label: r.label,
            count: priceCounts.get(r.id) ?? 0,
          }))}
          items={items}
          sorts={SORTS}
          current={{
            category: activeCategory,
            metal: activeMetal,
            price: activeRange?.id ?? "",
            sort: activeSort,
            view,
          }}
        />

        {total ? (
          <>
            <p className="mb-6 text-sm text-muted">
              Showing {start + 1}–{start + pageItems.length} of {total}{" "}
              {total === 1 ? "piece" : "pieces"}
            </p>

            {view === "list" ? (
              <div className="divide-y divide-black/5 border-y border-black/5">
                {pageItems.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {pageItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} makeHref={makeHref} />
          </>
        ) : (
          <p className="py-16 text-center text-muted">
            No pieces match these filters. Try clearing them.
          </p>
        )}
      </section>
    </>
  );
}
