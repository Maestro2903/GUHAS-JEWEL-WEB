import { notFound } from "next/navigation";
import { createClient } from "@repo/supabase/server";
import type { Review } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import ReviewForm from "@/components/ReviewForm";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!review) notFound();

  return (
    <div>
      <PageHeader title="Edit review" subtitle={(review as Review).author_name} />
      <ReviewForm review={review as Review} />
    </div>
  );
}
