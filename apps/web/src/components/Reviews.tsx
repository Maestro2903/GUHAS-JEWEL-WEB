import Image from "next/image";
import type { Review } from "@repo/supabase";
import SectionHeading from "./SectionHeading";
import StarRating from "./StarRating";

function ReviewCard({
  review,
  ariaHidden = false,
}: {
  review: Review;
  ariaHidden?: boolean;
}) {
  return (
    <figure
      aria-hidden={ariaHidden}
      className="mr-6 flex w-[300px] shrink-0 flex-col rounded-lg bg-white p-7 shadow-sm sm:w-[360px]"
    >
      <StarRating rating={review.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/80">
        &ldquo;{review.content}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {review.avatar_url ? (
          <span className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image
              src={review.avatar_url}
              alt={review.author_name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream font-serif text-lg text-burgundy">
            {review.author_name.charAt(0)}
          </span>
        )}
        <span>
          <span className="block font-semibold text-ink">
            {review.author_name}
          </span>
          {review.location && (
            <span className="block text-xs text-muted">{review.location}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;

  // The `animate-marquee` keyframe scrolls the track by -50%, so it must be two
  // identical halves. Repeat the reviews until one half spans the viewport,
  // otherwise a short list would leave a visible gap mid-scroll.
  const MIN_CARDS = 8;
  const repeats = Math.ceil(MIN_CARDS / reviews.length);
  const half = Array.from({ length: repeats }, () => reviews).flat();

  return (
    <section className="overflow-hidden bg-cream py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading className="mb-12">What Our Clients Say</SectionHeading>
      </div>

      {/* Full-bleed marquee: pauses on hover, freezes for reduced-motion users */}
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-28" />

        <div className="flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {half.map((review, i) => (
            <ReviewCard key={`a-${i}`} review={review} />
          ))}
          {/* Duplicate half — hidden from assistive tech — completes the loop */}
          {half.map((review, i) => (
            <ReviewCard key={`b-${i}`} review={review} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}
