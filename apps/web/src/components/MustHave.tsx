import Image from "next/image";
import SectionHeading from "./SectionHeading";

export default function MustHave() {
  return (
    <section className="container-x py-16 lg:py-24">
      <SectionHeading className="mb-12">Must Have</SectionHeading>

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="group relative overflow-hidden rounded-lg">
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[5/5.5]">
            <Image
              src="/images/musthave-bracelet.png"
              alt="Model wearing an 18k gold bracelet"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="font-serif text-2xl sm:text-3xl">18k Gold Bracelets</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
              Sale Up To 30% Off
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
            Sale Up To 30% Off
          </p>
          <h3 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            18k Gold Bracelets
          </h3>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
            Layer-ready bracelets handcrafted in solid 18k gold. Designed to be
            stacked, mixed and worn together — pieces you will reach for every
            day.
          </p>
          <a href="/products" className="btn-primary mt-8">
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
}
