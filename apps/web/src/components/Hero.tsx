import Image from "next/image";
import type { SiteBanner } from "@repo/supabase";

const DEFAULTS = {
  eyebrow: "New Arrivals",
  title: "Crafted to Shine",
  subtitle:
    "Our latest arrivals in solid gold and ethically sourced gemstones. Timeless pieces, crafted to be worn every day.",
  cta_label: "Explore Collection",
  cta_href: "/products",
  image_url: "/images/hero.png",
};

export default function Hero({ banner }: { banner?: SiteBanner | null }) {
  const eyebrow = banner?.eyebrow?.trim() || DEFAULTS.eyebrow;
  const title = banner?.title?.trim() || DEFAULTS.title;
  const subtitle = banner?.subtitle?.trim() || DEFAULTS.subtitle;
  const ctaLabel = banner?.cta_label?.trim() || DEFAULTS.cta_label;
  const ctaHref = banner?.cta_href?.trim() || DEFAULTS.cta_href;
  const image = banner?.image_url?.trim() || DEFAULTS.image_url;

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative h-[560px] w-full sm:h-[620px] lg:h-[680px]">
        <Image
          src={image}
          alt="Model wearing Guhas Gems and Jewelleries fine jewelry"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        {/* Legibility scrim — warm fade from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/70 to-transparent lg:via-cream/40" />

        <div className="container-x relative flex h-full items-center">
          <div className="max-w-xl animate-fade-up">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
                {eyebrow}
              </span>
              <span className="h-px w-10 bg-burgundy/50" />
            </div>
            <h1 className="font-serif text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
              {subtitle}
            </p>
            <a href={ctaHref} className="btn-primary mt-8">
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
