import Link from "next/link";
import Image from "next/image";
import { createClient } from "@repo/supabase/server";
import type { Review } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import { deleteReview, toggleReviewPublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  const reviews = (data ?? []) as Review[];

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Customer testimonials shown on the homepage."
        action={
          <Link href="/reviews/new" className="btn-primary">
            Add review
          </Link>
        }
      />

      {reviews.length ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="card flex flex-wrap items-start gap-4 p-4">
              {r.avatar_url ? (
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={r.avatar_url}
                    alt={r.author_name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream font-serif text-lg text-burgundy">
                  {r.author_name.charAt(0)}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink">{r.author_name}</p>
                  <span className="text-xs text-burgundy">
                    {"★".repeat(r.rating)}
                    <span className="text-muted">{"★".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                {r.location && (
                  <p className="text-xs text-muted">{r.location}</p>
                )}
                <p className="mt-1 line-clamp-2 text-sm text-ink/70">
                  {r.content}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <form action={toggleReviewPublished}>
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    type="hidden"
                    name="value"
                    value={(!r.is_published).toString()}
                  />
                  <button
                    type="submit"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      r.is_published
                        ? "bg-burgundy/10 text-burgundy"
                        : "bg-black/5 text-muted"
                    }`}
                  >
                    {r.is_published ? "Published" : "Hidden"}
                  </button>
                </form>
                <Link href={`/reviews/${r.id}`} className="btn-ghost px-3 py-1.5">
                  Edit
                </Link>
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input
                    type="hidden"
                    name="avatar_path"
                    value={r.avatar_path ?? ""}
                  />
                  <button type="submit" className="btn-danger px-3 py-1.5">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="text-muted">No reviews yet.</p>
          <Link href="/reviews/new" className="btn-primary mt-4">
            Add your first review
          </Link>
        </div>
      )}
    </div>
  );
}
