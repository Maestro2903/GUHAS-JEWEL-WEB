import Link from "next/link";

function pageList(page: number, total: number): (number | "…")[] {
  const wanted = new Set([1, total, page, page - 1, page + 1]);
  const sorted = Array.from(wanted)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const base =
    "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors";
  const inactive = `${base} border border-black/10 text-ink/70 hover:border-burgundy hover:text-burgundy`;
  const disabled = `${base} border border-black/5 text-ink/30`;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link href={makeHref(page - 1)} className={inactive} aria-label="Previous page">
          ‹ Prev
        </Link>
      ) : (
        <span className={disabled}>‹ Prev</span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted">
            …
          </span>
        ) : p === page ? (
          <span
            key={p}
            aria-current="page"
            className={`${base} border border-burgundy bg-burgundy text-white`}
          >
            {p}
          </span>
        ) : (
          <Link key={p} href={makeHref(p)} className={inactive}>
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={makeHref(page + 1)} className={inactive} aria-label="Next page">
          Next ›
        </Link>
      ) : (
        <span className={disabled}>Next ›</span>
      )}
    </nav>
  );
}
