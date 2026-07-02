import Image from "next/image";
import type { SiteBanner } from "@repo/supabase";

type TileProps = {
  src: string;
  alt: string;
  position?: string;
  className?: string;
};

function Tile({ src, alt, position = "object-center", className = "" }: TileProps) {
  return (
    <div className={`group relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className={`object-cover ${position} transition-transform duration-700 ease-out group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-burgundy/0 transition-colors duration-300 group-hover:bg-burgundy/10" />
    </div>
  );
}

// Position 1–5 map to the fixed collage slots below. Only the image + alt come
// from the DB (slot="gallery", sort_order = position); the layout stays fixed.
const DEFAULT_TILES = [
  { src: "/images/gallery-4.jpg", alt: "Woman in a printed headscarf wearing Guhas Gems and Jewelleries drop earrings", position: "object-[60%_center]" },
  { src: "/images/gallery-1.png", alt: "Stacked rings worn with a knit cardigan", position: "object-[center_35%]" },
  { src: "/images/gallery-hands.jpg", alt: "Hands styled with delicate Guhas Gems and Jewelleries rings", position: "object-center" },
  { src: "/images/gallery-wrist.png", alt: "Wrist layered with a gold chain bracelet", position: "object-center" },
  { src: "/images/gallery-3.png", alt: "Model wearing a Guhas Gems and Jewelleries earring and beaded bracelet", position: "object-[40%_center]" },
];

export default function ImageGallery({ items }: { items?: SiteBanner[] }) {
  const tileFor = (pos: number): TileProps => {
    const def = DEFAULT_TILES[pos - 1];
    const row = items?.find((i) => i.sort_order === pos);
    return {
      src: row?.image_url?.trim() || def.src,
      alt: row?.title?.trim() || def.alt,
      position: def.position,
    };
  };

  const left = tileFor(1);
  const topWide = tileFor(2);
  const hands = tileFor(3);
  const wrist = tileFor(4);
  const right = tileFor(5);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-x">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <h2 className="font-serif text-[32px] leading-tight text-burgundy sm:text-[40px]">
            Image Gallery
          </h2>
          <p className="mt-3 text-base text-muted">
            Everyday moments, styled in Guhas Gems and Jewelleries fine jewelry.
          </p>
        </div>

        {/* Desktop / tablet: exact 3-column Figma collage */}
        <div className="hidden grid-cols-3 gap-3 md:grid lg:gap-[11px]">
          <Tile {...left} className="h-full" />

          <div className="flex flex-col gap-3 lg:gap-[11px]">
            <Tile {...topWide} className="aspect-[407/325]" />
            <div className="grid grid-cols-2 gap-3 lg:gap-[9px]">
              <Tile {...hands} className="aspect-[199/277]" />
              <Tile {...wrist} className="aspect-[199/277]" />
            </div>
          </div>

          <Tile {...right} className="h-full" />
        </div>

        {/* Mobile: reflowed 2-column grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <Tile {...left} className="aspect-[3/4]" />
          <Tile {...right} className="aspect-[3/4]" />
          <Tile {...topWide} className="col-span-2 aspect-[16/9]" />
          <Tile {...hands} className="aspect-square" />
          <Tile {...wrist} className="aspect-square" />
        </div>
      </div>
    </section>
  );
}
