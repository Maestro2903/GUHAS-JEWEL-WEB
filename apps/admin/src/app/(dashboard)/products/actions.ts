"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@repo/supabase/server";
import { PRODUCT_BUCKET } from "@repo/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

async function uploadImage(
  supabase: SupabaseClient,
  file: File
): Promise<{ url: string; path: string } | null> {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) return null;
  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

function readFields(formData: FormData) {
  const priceRaw = String(formData.get("price") || "").trim();
  return {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    price: priceRaw ? Number(priceRaw) : null,
    metal: String(formData.get("metal") || "").trim() || null,
    category_id: String(formData.get("category_id") || "") || null,
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const fields = readFields(formData);

  let image_url: string | null = null;
  let image_path: string | null = null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const up = await uploadImage(supabase, file);
    if (up) {
      image_url = up.url;
      image_path = up.path;
    }
  }

  await supabase.from("products").insert({ ...fields, image_url, image_path });
  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const fields = readFields(formData);

  let image_url: string | null =
    String(formData.get("existing_image_url") || "") || null;
  let image_path: string | null =
    String(formData.get("existing_image_path") || "") || null;

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const up = await uploadImage(supabase, file);
    if (up) {
      // remove the old object if it lived in our bucket
      if (image_path) {
        await supabase.storage.from(PRODUCT_BUCKET).remove([image_path]);
      }
      image_url = up.url;
      image_path = up.path;
    }
  }

  await supabase
    .from("products")
    .update({ ...fields, image_url, image_path })
    .eq("id", id);
  revalidatePath("/products");
  redirect("/products");
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("image_path") || "") || null;
  if (!id) return;

  await supabase.from("products").delete().eq("id", id);
  if (path) await supabase.storage.from(PRODUCT_BUCKET).remove([path]);
  revalidatePath("/products");
}

export async function toggleProductField(formData: FormData) {
  const id = String(formData.get("id") || "");
  const field = String(formData.get("field") || "");
  const value = formData.get("value") === "true";
  if (!id || !["is_featured", "is_published"].includes(field)) return;

  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ [field]: value })
    .eq("id", id);
  revalidatePath("/products");
}
