import Image from "next/image";
import { promos as defaultPromos } from "@/lib/data";
import type { SiteBanner } from "@repo/supabase";

type PromoItem = {
  id: string;
  eyebrow: string;
  title: string;
  image: string;
  href: string;
};

export default function PromoBanners({ banners }: { banners?: SiteBanner[] }) {
  const items: PromoItem[] =
    banners && banners.length
      ? banners
          .filter((b) => b.image_url)
          .map((b) => ({
            id: b.id,
            eyebrow: b.eyebrow ?? "",
            title: b.title ?? "",
            image: b.image_url as string,
            href: b.cta_href?.trim() || "#",
          }))
      : defaultPromos.map((p) => ({ ...p, href: "#" }));

  if (!items.length) return null;

  return (
    <section className="container-x py-16 lg:py-20">
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {items.map((promo) => (
          <div
            key={promo.id}
            className="group flex items-center gap-6 overflow-hidden rounded-lg bg-cream p-6 sm:p-8"
          >
            <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-md sm:h-56 sm:w-44 lg:h-64 lg:w-52">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-burgundy">
                {promo.eyebrow}
              </p>
              <h3 className="mt-3 max-w-[12ch] font-serif text-2xl leading-tight text-ink sm:text-3xl">
                {promo.title}
              </h3>
              <a
                href={promo.href}
                className="group/link mt-5 inline-flex flex-col text-xs font-semibold uppercase tracking-[0.14em] text-burgundy"
              >
                Shop Now
                <span className="mt-1 h-[2px] w-12 bg-burgundy transition-all duration-300 group-hover:w-20" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
