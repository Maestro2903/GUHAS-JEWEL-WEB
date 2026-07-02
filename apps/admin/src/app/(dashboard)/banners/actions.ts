"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@repo/supabase/server";
import { BANNER_BUCKET } from "@repo/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

async function uploadBannerImage(
  supabase: SupabaseClient,
  file: File
): Promise<{ url: string; path: string } | null> {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `banners/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(BANNER_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) return null;
  const { data } = supabase.storage.from(BANNER_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

function str(formData: FormData, key: string): string | null {
  return String(formData.get(key) || "").trim() || null;
}

// Update-or-insert a singleton banner (announcement / hero), keyed by its slot.
async function upsertSingleton(
  supabase: SupabaseClient,
  slot: string,
  id: string,
  fields: Record<string, unknown>
) {
  if (id) {
    await supabase.from("site_banners").update(fields).eq("id", id);
  } else {
    await supabase.from("site_banners").insert({ slot, sort_order: 0, ...fields });
  }
}

export async function updateAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  await upsertSingleton(supabase, "announcement", id, {
    title: str(formData, "title"),
    is_active: formData.get("is_active") === "on",
  });
  revalidatePath("/banners");
}

export async function updateHero(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");

  let image_url: string | null = str(formData, "existing_image_url");
  let image_path: string | null = str(formData, "existing_image_path");
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const up = await uploadBannerImage(supabase, file);
    if (up) {
      if (image_path) await supabase.storage.from(BANNER_BUCKET).remove([image_path]);
      image_url = up.url;
      image_path = up.path;
    }
  }

  await upsertSingleton(supabase, "hero", id, {
    eyebrow: str(formData, "eyebrow"),
    title: str(formData, "title"),
    subtitle: str(formData, "subtitle"),
    cta_label: str(formData, "cta_label"),
    cta_href: str(formData, "cta_href"),
    image_url,
    image_path,
    is_active: formData.get("is_active") === "on",
  });
  revalidatePath("/banners");
}

export async function createPromo(formData: FormData) {
  const supabase = await createClient();

  let image_url: string | null = null;
  let image_path: string | null = null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const up = await uploadBannerImage(supabase, file);
    if (up) {
      image_url = up.url;
      image_path = up.path;
    }
  }

  await supabase.from("site_banners").insert({
    slot: "promo",
    eyebrow: str(formData, "eyebrow"),
    title: str(formData, "title"),
    cta_href: str(formData, "cta_href"),
    image_url,
    image_path,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  });
  revalidatePath("/banners");
}

export async function updatePromo(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  let image_url: string | null = str(formData, "existing_image_url");
  let image_path: string | null = str(formData, "existing_image_path");
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const up = await uploadBannerImage(supabase, file);
    if (up) {
      if (image_path) await supabase.storage.from(BANNER_BUCKET).remove([image_path]);
      image_url = up.url;
      image_path = up.path;
    }
  }

  await supabase
    .from("site_banners")
    .update({
      eyebrow: str(formData, "eyebrow"),
      title: str(formData, "title"),
      cta_href: str(formData, "cta_href"),
      image_url,
      image_path,
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
    })
    .eq("id", id);
  revalidatePath("/banners");
}

// Gallery tiles are keyed by sort_order (position 1–5). A row is created the
// first time a tile is customised; otherwise the site shows the default image.
export async function updateGallery(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const position = Number(formData.get("sort_order") || 0);
  const is_active = formData.get("is_active") === "on";

  let image_url: string | null = str(formData, "existing_image_url");
  let image_path: string | null = str(formData, "existing_image_path");
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const up = await uploadBannerImage(supabase, file);
    if (up) {
      if (image_path) await supabase.storage.from(BANNER_BUCKET).remove([image_path]);
      image_url = up.url;
      image_path = up.path;
    }
  }

  if (id) {
    await supabase
      .from("site_banners")
      .update({ image_url, image_path, is_active })
      .eq("id", id);
  } else {
    await supabase.from("site_banners").insert({
      slot: "gallery",
      sort_order: position,
      image_url,
      image_path,
      is_active,
    });
  }
  revalidatePath("/banners");
}

export async function deletePromo(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const path = str(formData, "image_path");
  if (!id) return;

  await supabase.from("site_banners").delete().eq("id", id);
  if (path) await supabase.storage.from(BANNER_BUCKET).remove([path]);
  revalidatePath("/banners");
}
