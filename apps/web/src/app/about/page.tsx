import Image from "next/image";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { TruckIcon, ShieldIcon, ReturnIcon } from "@/components/Icons";

export const metadata = {
  title: "About — GUHAS GEMS AND JEWELLERIES",
  description:
    "The Guhas Gems and Jewelleries story — a modern fine-jewelry house crafting timeless pieces in 18k gold, platinum and ethically sourced gemstones.",
};

const values = [
  {
    icon: ShieldIcon,
    title: "Ethically Sourced",
    text: "Conflict-free diamonds and responsibly mined gold, traceable to the source.",
  },
  {
    icon: ReturnIcon,
    title: "Master Craftsmanship",
    text: "Each piece is hand-finished by artisans with decades of bench experience.",
  },
  {
    icon: TruckIcon,
    title: "Made to Last",
    text: "Solid metals and secure settings, designed to be worn and loved for generations.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="Our Story"
        subtitle="A modern fine-jewelry house with a love for timeless design."
      />

      {/* Story */}
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          <Image
            src="/images/gallery-3.png"
            alt="Guhas Gems and Jewelleries craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
            Est. in Karur, 1978
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
            Jewelry made to be treasured
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/75">
            <p>
              Guhas Gems and Jewelleries began with a simple belief — that fine jewelry should feel
              personal. Every ring, bracelet and pendant we make starts as a
              sketch and is brought to life by hand, one detail at a time.
            </p>
            <p>
              We work only with ethically sourced gemstones and recycled
              precious metals, pairing traditional craftsmanship with clean,
              contemporary design. The result is jewelry that feels effortless
              today and just as beautiful decades from now.
            </p>
            <p>
              Whether you are marking a milestone or simply treating yourself,
              we would love to help you find a piece that is unmistakably yours.
            </p>
          </div>
          <Link href="/contact" className="btn-primary mt-8">
            Visit Our Atelier
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="container-x grid gap-10 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center">
              <Icon className="mx-auto h-12 w-12 text-burgundy" />
              <h3 className="mt-5 font-serif text-xl text-ink">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
