import { notFound } from "next/navigation";
import { createClient } from "@repo/supabase/server";
import type { Category, Product } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const [{ data: product }, { data: cats }, { data: metalRows }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("metals")
      .select("name")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (!product) notFound();

  const metals = ((metalRows ?? []) as { name: string }[]).map((m) => m.name);

  return (
    <div>
      <PageHeader title="Edit product" subtitle={(product as Product).name} />
      <ProductForm
        categories={(cats ?? []) as Category[]}
        metals={metals}
        product={product as Product}
      />
    </div>
  );
}
