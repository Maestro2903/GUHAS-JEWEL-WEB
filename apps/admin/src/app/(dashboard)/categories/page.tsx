import { createClient } from "@repo/supabase/server";
import type { Category, Metal, PriceRange } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createMetal,
  updateMetal,
  deleteMetal,
  createPriceRange,
  updatePriceRange,
  deletePriceRange,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: catData } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  const categories = (catData ?? []) as Category[];

  const { data: metalData, error: metalError } = await supabase
    .from("metals")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  const metals = (metalData ?? []) as Metal[];

  const { data: rangeData, error: rangeError } = await supabase
    .from("price_ranges")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("min_value", { ascending: true });
  const priceRanges = (rangeData ?? []) as PriceRange[];

  return (
    <div className="max-w-3xl space-y-12">
      {/* ---------- Categories ---------- */}
      <div>
        <PageHeader
          title="Categories & Metals"
          subtitle="Group products into collections and manage the metal options. Both appear as filters on the website."
        />

        <h2 className="mb-3 font-serif text-lg text-ink">Categories</h2>
        <form
          action={createCategory}
          className="card mb-6 flex flex-wrap items-end gap-3 p-5"
        >
          <div className="flex-1 min-w-[180px]">
            <label className="field-label">Name</label>
            <input
              name="name"
              required
              placeholder="e.g. Necklaces"
              className="field-input"
            />
          </div>
          <div className="w-28">
            <label className="field-label">Order</label>
            <input
              name="sort_order"
              type="number"
              defaultValue={categories.length + 1}
              className="field-input"
            />
          </div>
          <button type="submit" className="btn-primary">
            Add category
          </button>
        </form>

        {categories.length ? (
          <div className="card divide-y divide-black/5">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-wrap items-end gap-3 p-4">
                <form
                  action={updateCategory}
                  className="flex flex-1 flex-wrap items-end gap-3"
                >
                  <input type="hidden" name="id" value={cat.id} />
                  <div className="flex-1 min-w-[160px]">
                    <label className="field-label">Name</label>
                    <input name="name" defaultValue={cat.name} className="field-input" />
                  </div>
                  <div className="w-24">
                    <label className="field-label">Order</label>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={cat.sort_order}
                      className="field-input"
                    />
                  </div>
                  <button type="submit" className="btn-ghost">
                    Save
                  </button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" className="btn-danger">
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No categories yet. Add your first one above.
          </p>
        )}
      </div>

      {/* ---------- Metals ---------- */}
      <div>
        <h2 className="mb-1 font-serif text-lg text-ink">Metals</h2>
        <p className="mb-3 text-sm text-muted">
          The metal options offered on products (Gold, Silver, Platinum…). Used
          by the product form and the Collections filter.
        </p>

        {metalError ? (
          <div className="card p-5 text-sm text-muted">
            Run <code>supabase/migrations/0004_metals.sql</code> in the Supabase
            SQL Editor to enable metals, then reload.
          </div>
        ) : (
          <>
            <form
              action={createMetal}
              className="card mb-6 flex flex-wrap items-end gap-3 p-5"
            >
              <div className="flex-1 min-w-[180px]">
                <label className="field-label">Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Palladium"
                  className="field-input"
                />
              </div>
              <div className="w-28">
                <label className="field-label">Order</label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={metals.length + 1}
                  className="field-input"
                />
              </div>
              <button type="submit" className="btn-primary">
                Add metal
              </button>
            </form>

            {metals.length ? (
              <div className="card divide-y divide-black/5">
                {metals.map((metal) => (
                  <div key={metal.id} className="flex flex-wrap items-end gap-3 p-4">
                    <form
                      action={updateMetal}
                      className="flex flex-1 flex-wrap items-end gap-3"
                    >
                      <input type="hidden" name="id" value={metal.id} />
                      <div className="flex-1 min-w-[160px]">
                        <label className="field-label">Name</label>
                        <input
                          name="name"
                          defaultValue={metal.name}
                          className="field-input"
                        />
                      </div>
                      <div className="w-24">
                        <label className="field-label">Order</label>
                        <input
                          name="sort_order"
                          type="number"
                          defaultValue={metal.sort_order}
                          className="field-input"
                        />
                      </div>
                      <button type="submit" className="btn-ghost">
                        Save
                      </button>
                    </form>
                    <form action={deleteMetal}>
                      <input type="hidden" name="id" value={metal.id} />
                      <button type="submit" className="btn-danger">
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">
                No metals yet. Add your first one above.
              </p>
            )}
          </>
        )}
      </div>

      {/* ---------- Price ranges ---------- */}
      <div>
        <h2 className="mb-1 font-serif text-lg text-ink">Price ranges</h2>
        <p className="mb-3 text-sm text-muted">
          The price bands shown in the Collections filter. Leave “Max” blank for
          an open-ended top band (e.g. “Above ₹2.5L”).
        </p>

        {rangeError ? (
          <div className="card p-5 text-sm text-muted">
            Run <code>supabase/migrations/0005_price_ranges.sql</code> in the
            Supabase SQL Editor to enable price ranges, then reload.
          </div>
        ) : (
          <>
            <form
              action={createPriceRange}
              className="card mb-6 flex flex-wrap items-end gap-3 p-5"
            >
              <div className="flex-1 min-w-[160px]">
                <label className="field-label">Label</label>
                <input
                  name="label"
                  required
                  placeholder="e.g. ₹50k – ₹1L"
                  className="field-input"
                />
              </div>
              <div className="w-28">
                <label className="field-label">Min (₹)</label>
                <input name="min_value" type="number" min="0" defaultValue={0} className="field-input" />
              </div>
              <div className="w-28">
                <label className="field-label">Max (₹)</label>
                <input name="max_value" type="number" min="0" placeholder="blank = ∞" className="field-input" />
              </div>
              <div className="w-24">
                <label className="field-label">Order</label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={priceRanges.length + 1}
                  className="field-input"
                />
              </div>
              <button type="submit" className="btn-primary">
                Add band
              </button>
            </form>

            {priceRanges.length ? (
              <div className="card divide-y divide-black/5">
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex flex-wrap items-end gap-3 p-4">
                    <form
                      action={updatePriceRange}
                      className="flex flex-1 flex-wrap items-end gap-3"
                    >
                      <input type="hidden" name="id" value={range.id} />
                      <div className="flex-1 min-w-[150px]">
                        <label className="field-label">Label</label>
                        <input name="label" defaultValue={range.label} className="field-input" />
                      </div>
                      <div className="w-24">
                        <label className="field-label">Min</label>
                        <input
                          name="min_value"
                          type="number"
                          defaultValue={range.min_value}
                          className="field-input"
                        />
                      </div>
                      <div className="w-24">
                        <label className="field-label">Max</label>
                        <input
                          name="max_value"
                          type="number"
                          defaultValue={range.max_value ?? ""}
                          placeholder="∞"
                          className="field-input"
                        />
                      </div>
                      <div className="w-20">
                        <label className="field-label">Order</label>
                        <input
                          name="sort_order"
                          type="number"
                          defaultValue={range.sort_order}
                          className="field-input"
                        />
                      </div>
                      <button type="submit" className="btn-ghost">
                        Save
                      </button>
                    </form>
                    <form action={deletePriceRange}>
                      <input type="hidden" name="id" value={range.id} />
                      <button type="submit" className="btn-danger">
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">
                No price ranges yet. Add your first one above.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
