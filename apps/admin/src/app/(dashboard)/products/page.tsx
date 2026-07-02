import Link from "next/link";
import Image from "next/image";
import { createClient } from "@repo/supabase/server";
import type { Product } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import { formatPrice } from "@/lib/format";
import { deleteProduct, toggleProductField } from "./actions";

export const dynamic = "force-dynamic";

function TogglePill({
  id,
  field,
  value,
  onLabel,
  offLabel,
}: {
  id: string;
  field: string;
  value: boolean;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <form action={toggleProductField}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={(!value).toString()} />
      <button
        type="submit"
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          value
            ? "bg-burgundy/10 text-burgundy hover:bg-burgundy/20"
            : "bg-black/5 text-muted hover:bg-black/10"
        }`}
      >
        {value ? onLabel : offLabel}
      </button>
    </form>
  );
}

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Upload pieces, set an optional price, and choose what's featured."
        action={
          <Link href="/products/new" className="btn-primary">
            Add product
          </Link>
        }
      />

      {products.length ? (
        <div className="card overflow-hidden">
          <div className="hidden grid-cols-[64px_1fr_140px_120px_120px_140px] items-center gap-4 border-b border-black/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
            <span />
            <span>Product</span>
            <span>Price</span>
            <span>Featured</span>
            <span>Published</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-black/5">
            {products.map((p) => (
              <div
                key={p.id}
                className="px-4 py-4 lg:grid lg:grid-cols-[64px_1fr_140px_120px_120px_140px] lg:items-center lg:gap-4"
              >
                {/* Image + name + price: one flex row on mobile. On lg the
                    wrapper becomes display:contents so these fall into the
                    first three table columns. */}
                <div className="flex items-center gap-4 lg:contents">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-black/10 bg-cream">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{p.name}</p>
                    <p className="truncate text-xs text-muted">
                      {p.category?.name ?? "Uncategorized"}
                    </p>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-burgundy lg:shrink">
                    {formatPrice(p.price)}
                  </div>
                </div>

                {/* Status toggles + actions: a wrapping row on mobile. On lg
                    the wrapper becomes display:contents so these fall into the
                    last three table columns. */}
                <div className="mt-3 flex flex-wrap items-center gap-2 lg:contents">
                  <TogglePill
                    id={p.id}
                    field="is_featured"
                    value={p.is_featured}
                    onLabel="Featured"
                    offLabel="Not featured"
                  />
                  <TogglePill
                    id={p.id}
                    field="is_published"
                    value={p.is_published}
                    onLabel="Published"
                    offLabel="Hidden"
                  />
                  <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:justify-end">
                    <Link
                      href={`/products/${p.id}`}
                      className="btn-ghost px-3 py-1.5"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        type="hidden"
                        name="image_path"
                        value={p.image_path ?? ""}
                      />
                      <button type="submit" className="btn-danger px-3 py-1.5">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="text-muted">No products yet.</p>
          <Link href="/products/new" className="btn-primary mt-4">
            Add your first product
          </Link>
        </div>
      )}
    </div>
  );
}
