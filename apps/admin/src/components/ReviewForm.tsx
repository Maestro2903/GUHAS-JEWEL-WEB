import Image from "next/image";
import Link from "next/link";
import type { Review } from "@repo/supabase";
import { createReview, updateReview } from "@/app/(dashboard)/reviews/actions";

export default function ReviewForm({ review }: { review?: Review }) {
  const isEdit = !!review;
  const action = isEdit ? updateReview : createReview;

  return (
    <form action={action} className="card max-w-2xl space-y-5 p-6">
      {isEdit && (
        <>
          <input type="hidden" name="id" value={review!.id} />
          <input
            type="hidden"
            name="existing_avatar_url"
            value={review!.avatar_url ?? ""}
          />
          <input
            type="hidden"
            name="existing_avatar_path"
            value={review!.avatar_path ?? ""}
          />
        </>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label">Customer name</label>
          <input
            name="author_name"
            required
            defaultValue={review?.author_name ?? ""}
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Location (optional)</label>
          <input
            name="location"
            defaultValue={review?.location ?? ""}
            className="field-input"
            placeholder="e.g. Bengaluru"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label">Rating</label>
          <select
            name="rating"
            defaultValue={String(review?.rating ?? 5)}
            className="field-input"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Display order</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={review?.sort_order ?? 0}
            className="field-input"
          />
        </div>
      </div>

      <div>
        <label className="field-label">Review</label>
        <textarea
          name="content"
          required
          rows={4}
          defaultValue={review?.content ?? ""}
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label">Photo (optional)</label>
        {review?.avatar_url && (
          <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full border border-black/10">
            <Image
              src={review.avatar_url}
              alt={review.author_name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <input
          name="avatar"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-burgundy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-burgundy-dark"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={review?.is_published ?? true}
          className="h-4 w-4 accent-[#9c1137]"
        />
        Published
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {isEdit ? "Save changes" : "Add review"}
        </button>
        <Link href="/reviews" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
