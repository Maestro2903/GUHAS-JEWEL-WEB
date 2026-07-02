import { createPublicClient } from "./public";
import type {
  Category,
  Metal,
  PriceRange,
  Product,
  Review,
  SiteBanner,
} from "./types";

const PRODUCT_SELECT = "*, category:categories(name, slug)";

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Category[];
}

/** Managed metal options (empty → callers fall back to built-in defaults). */
export async function getMetals(): Promise<Metal[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("metals")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Metal[];
}

/** Managed price bands for the Collections filter (empty → no price filter). */
export async function getPriceRanges(): Promise<PriceRange[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("price_ranges")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("min_value", { ascending: true });
  return (data ?? []) as PriceRange[];
}

export async function getPublishedProducts(options?: {
  categorySlug?: string;
}): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (options?.categorySlug) {
    // resolve slug -> id then filter (keeps it simple and index-friendly)
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .maybeSingle();
    if (cat?.id) query = query.eq("category_id", cat.id);
  }

  const { data } = await query;
  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getPublishedReviews(limit = 12): Promise<Review[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Review[];
}

// ---- Site banners (announcement / hero / promo) ---------------------------
// Errors are swallowed (→ []), so the site falls back to its built-in defaults
// when the site_banners table hasn't been migrated yet.
async function getBannerRows(slot: string): Promise<SiteBanner[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("site_banners")
    .select("*")
    .eq("slot", slot)
    .order("sort_order", { ascending: true });
  return (data ?? []) as SiteBanner[];
}

/** The announcement row (may be inactive — the component hides it when off). */
export async function getAnnouncement(): Promise<SiteBanner | null> {
  const [row] = await getBannerRows("announcement");
  return row ?? null;
}

/** The active hero row, or null to fall back to the default hero content. */
export async function getHeroBanner(): Promise<SiteBanner | null> {
  const rows = await getBannerRows("hero");
  return rows.find((r) => r.is_active) ?? null;
}

/** Active promo cards in display order (empty → default promos are shown). */
export async function getPromoBanners(): Promise<SiteBanner[]> {
  const rows = await getBannerRows("promo");
  return rows.filter((r) => r.is_active);
}

/** Homepage image-gallery tiles, keyed by sort_order (1–5 → collage slots). */
export async function getGalleryImages(): Promise<SiteBanner[]> {
  const rows = await getBannerRows("gallery");
  return rows.filter((r) => r.is_active);
}
