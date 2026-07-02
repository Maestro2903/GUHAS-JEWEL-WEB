"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@repo/supabase/server";
import { REVIEW_BUCKET } from "@repo/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

async function uploadAvatar(
  supabase: SupabaseClient,
  file: File
): Promise<{ url: string; path: string } | null> {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `avatars/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(REVIEW_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) return null;
  const { data } = supabase.storage.from(REVIEW_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

function readFields(formData: FormData) {
  return {
    author_name: String(formData.get("author_name") || "").trim(),
    location: String(formData.get("location") || "").trim() || null,
    rating: Math.min(5, Math.max(1, Number(formData.get("rating") || 5))),
    content: String(formData.get("content") || "").trim(),
    is_published: formData.get("is_published") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
}

export async function createReview(formData: FormData) {
  const supabase = await createClient();
  const fields = readFields(formData);

  let avatar_url: string | null = null;
  let avatar_path: string | null = null;
  const file = formData.get("avatar") as File | null;
  if (file && file.size > 0) {
    const up = await uploadAvatar(supabase, file);
    if (up) {
      avatar_url = up.url;
      avatar_path = up.path;
    }
  }

  await supabase.from("reviews").insert({ ...fields, avatar_url, avatar_path });
  revalidatePath("/reviews");
  redirect("/reviews");
}

export async function updateReview(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const fields = readFields(formData);

  let avatar_url: string | null =
    String(formData.get("existing_avatar_url") || "") || null;
  let avatar_path: string | null =
    String(formData.get("existing_avatar_path") || "") || null;

  const file = formData.get("avatar") as File | null;
  if (file && file.size > 0) {
    const up = await uploadAvatar(supabase, file);
    if (up) {
      if (avatar_path) {
        await supabase.storage.from(REVIEW_BUCKET).remove([avatar_path]);
      }
      avatar_url = up.url;
      avatar_path = up.path;
    }
  }

  await supabase
    .from("reviews")
    .update({ ...fields, avatar_url, avatar_path })
    .eq("id", id);
  revalidatePath("/reviews");
  redirect("/reviews");
}

export async function deleteReview(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("avatar_path") || "") || null;
  if (!id) return;

  await supabase.from("reviews").delete().eq("id", id);
  if (path) await supabase.storage.from(REVIEW_BUCKET).remove([path]);
  revalidatePath("/reviews");
}

export async function toggleReviewPublished(formData: FormData) {
  const id = String(formData.get("id") || "");
  const value = formData.get("value") === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("reviews").update({ is_published: value }).eq("id", id);
  revalidatePath("/reviews");
}
