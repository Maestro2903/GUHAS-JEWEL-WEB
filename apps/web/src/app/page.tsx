import Hero from "@/components/Hero";
import MetalRates from "@/components/MetalRates";
import TopProducts from "@/components/TopProducts";
import ProductSection from "@/components/ProductSection";
import PromoBanners from "@/components/PromoBanners";
import MustHave from "@/components/MustHave";
import ImageGallery from "@/components/ImageGallery";
import Reviews from "@/components/Reviews";
import {
  getCategories,
  getPublishedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getPublishedReviews,
  getHeroBanner,
  getPromoBanners,
  getGalleryImages,
} from "@repo/supabase";

// Always read the latest content from Supabase.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    categories,
    allProducts,
    featured,
    newArrivals,
    reviews,
    hero,
    promos,
    gallery,
  ] = await Promise.all([
    getCategories(),
    getPublishedProducts(),
    getFeaturedProducts(8),
    getNewArrivals(8),
    getPublishedReviews(6),
    getHeroBanner(),
    getPromoBanners(),
    getGalleryImages(),
  ]);

  return (
    <>
      <Hero banner={hero} />
      <MetalRates />
      <TopProducts categories={categories} products={allProducts} />
      <ProductSection
        id="new-arrivals"
        title="New Arrivals"
        products={newArrivals}
        band
      />
      <PromoBanners banners={promos} />
      <ProductSection title="Featured Products" products={featured} />
      <MustHave />
      <ImageGallery items={gallery} />
      <Reviews reviews={reviews} />
    </>
  );
}
