import Link from "next/link";
import { createClient } from "@repo/supabase/server";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const supabase = await createClient();

  const [products, categories, reviews, messages] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const stats = [
    { label: "Products", value: products.count ?? 0, href: "/products" },
    { label: "Categories", value: categories.count ?? 0, href: "/categories" },
    { label: "Reviews", value: reviews.count ?? 0, href: "/reviews" },
    { label: "Unread messages", value: messages.count ?? 0, href: "/messages" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Manage your storefront content."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 font-serif text-3xl text-burgundy">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-serif text-lg text-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/products/new" className="btn-primary">
            Add product
          </Link>
          <Link href="/categories" className="btn-ghost">
            Manage categories
          </Link>
          <Link href="/reviews/new" className="btn-ghost">
            Add review
          </Link>
        </div>
      </div>
    </div>
  );
}
