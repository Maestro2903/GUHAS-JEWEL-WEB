function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="m12 3 2.7 5.5 6 .9-4.35 4.24 1.03 6L12 17.8 6.62 19.6l1.03-6L3.3 9.4l6-.9z" />
    </svg>
  );
}

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5 text-burgundy"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < rating} />
      ))}
    </div>
  );
}
