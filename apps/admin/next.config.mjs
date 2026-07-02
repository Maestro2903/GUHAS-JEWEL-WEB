/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/supabase"],
  images: {
    // Serve AVIF first (≈20–30% smaller than WebP), falling back to WebP.
    formats: ["image/avif", "image/webp"],
    // Uploaded images use immutable crypto.randomUUID() paths (a changed image
    // gets a new URL), so cache each optimized variant at the edge for 31 days.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icgptwqdrexxsxzakspq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
