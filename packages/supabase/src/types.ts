// Hand-written types matching supabase/migrations/0001_init.sql.
// (Can later be replaced by `supabase gen types typescript`.)

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  metal: string | null;
  image_url: string | null;
  image_path: string | null;
  category_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // populated when selected with `*, category:categories(name, slug)`
  category?: { name: string; slug: string } | null;
};

export type Review = {
  id: string;
  author_name: string;
  location: string | null;
  rating: number;
  content: string;
  avatar_url: string | null;
  avatar_path: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Metal = {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type PriceRange = {
  id: string;
  label: string;
  min_value: number;
  max_value: number | null; // null = no upper bound
  sort_order: number;
  created_at: string;
};

export type BannerSlot = "announcement" | "hero" | "promo" | "gallery";

export type SiteBanner = {
  id: string;
  slot: BannerSlot;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  image_path: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const PRODUCT_BUCKET = "product-images";
export const REVIEW_BUCKET = "review-avatars";
export const BANNER_BUCKET = "banner-images";
