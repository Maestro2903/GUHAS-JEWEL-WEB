import { createClient } from "@repo/supabase/server";
import type { Category } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data }, { data: metalRows }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("metals")
      .select("name")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);
  const categories = (data ?? []) as Category[];
  const metals = ((metalRows ?? []) as { name: string }[]).map((m) => m.name);

  return (
    <div>
      <PageHeader title="Add product" subtitle="Create a new piece for your collection." />
      <ProductForm categories={categories} metals={metals} />
    </div>
  );
}
