"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@repo/supabase/server";
import { slugify } from "@/lib/slug";

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const sort_order = Number(formData.get("sort_order") || 0);

  const supabase = await createClient();
  await supabase
    .from("categories")
    .insert({ name, slug: slugify(name), sort_order });
  revalidatePath("/categories");
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const sort_order = Number(formData.get("sort_order") || 0);
  if (!id || !name) return;

  const supabase = await createClient();
  await supabase
    .from("categories")
    .update({ name, slug: slugify(name), sort_order })
    .eq("id", id);
  revalidatePath("/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/categories");
}

// ---- Metals (product attribute options) -----------------------------------

export async function createMetal(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const sort_order = Number(formData.get("sort_order") || 0);

  const supabase = await createClient();
  await supabase.from("metals").insert({ name, sort_order });
  revalidatePath("/categories");
}

export async function updateMetal(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const sort_order = Number(formData.get("sort_order") || 0);
  if (!id || !name) return;

  const supabase = await createClient();
  await supabase.from("metals").update({ name, sort_order }).eq("id", id);
  revalidatePath("/categories");
}

export async function deleteMetal(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("metals").delete().eq("id", id);
  revalidatePath("/categories");
}

// ---- Price ranges (Collections filter bands) ------------------------------

function readPriceRange(formData: FormData) {
  const maxRaw = String(formData.get("max_value") || "").trim();
  return {
    label: String(formData.get("label") || "").trim(),
    min_value: Number(formData.get("min_value") || 0),
    max_value: maxRaw ? Number(maxRaw) : null,
    sort_order: Number(formData.get("sort_order") || 0),
  };
}

export async function createPriceRange(formData: FormData) {
  const fields = readPriceRange(formData);
  if (!fields.label) return;

  const supabase = await createClient();
  await supabase.from("price_ranges").insert(fields);
  revalidatePath("/categories");
}

export async function updatePriceRange(formData: FormData) {
  const id = String(formData.get("id") || "");
  const fields = readPriceRange(formData);
  if (!id || !fields.label) return;

  const supabase = await createClient();
  await supabase.from("price_ranges").update(fields).eq("id", id);
  revalidatePath("/categories");
}

export async function deletePriceRange(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("price_ranges").delete().eq("id", id);
  revalidatePath("/categories");
}
