import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@repo/supabase";
import { createProduct, updateProduct } from "@/app/(dashboard)/products/actions";

// Fallback list used only if no metals have been added in the admin yet.
const DEFAULT_METALS = [
  "Gold",
  "Rose Gold",
  "White Gold",
  "Silver",
  "Platinum",
  "Diamond",
];

export default function ProductForm({
  categories,
  metals,
  product,
}: {
  categories: Category[];
  metals?: string[];
  product?: Product;
}) {
  const isEdit = !!product;
  const action = isEdit ? updateProduct : createProduct;
  const metalOptions = metals && metals.length ? metals : DEFAULT_METALS;
  // Keep the current product's metal selectable even if it was later removed.
  const metalChoices =
    product?.metal && !metalOptions.includes(product.metal)
      ? [product.metal, ...metalOptions]
      : metalOptions;

  return (
    <form action={action} className="card max-w-2xl space-y-5 p-6">
      {isEdit && (
        <>
          <input type="hidden" name="id" value={product!.id} />
          <input
            type="hidden"
            name="existing_image_url"
            value={product!.image_url ?? ""}
          />
          <input
            type="hidden"
            name="existing_image_path"
            value={product!.image_path ?? ""}
          />
        </>
      )}

      <div>
        <label className="field-label">Name</label>
        <input
          name="name"
          required
          defaultValue={product?.name ?? ""}
          className="field-input"
          placeholder="e.g. Diamond Solitaire Ring"
        />
      </div>

      <div>
        <label className="field-label">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className="field-input"
          placeholder="A short description of the piece"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="field-label">Price (optional)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price ?? ""}
            className="field-input"
            placeholder="Leave blank to hide price"
          />
        </div>
        <div>
          <label className="field-label">Category</label>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="field-input"
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Metal</label>
          <select
            name="metal"
            defaultValue={product?.metal ?? ""}
            className="field-input"
          >
            <option value="">— None —</option>
            {metalChoices.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label">Image</label>
        {product?.image_url && (
          <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-md border border-black/10 bg-cream">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="128px"
              className="object-contain p-2"
            />
          </div>
        )}
        <input
          name="image"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-burgundy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-burgundy-dark"
        />
        {isEdit && (
          <p className="mt-1 text-xs text-muted">
            Leave empty to keep the current image.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label">Display order</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={product?.sort_order ?? 0}
            className="field-input"
          />
        </div>
        <div className="flex items-end gap-6 pb-1">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product?.is_featured ?? false}
              className="h-4 w-4 accent-[#9c1137]"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={product?.is_published ?? true}
              className="h-4 w-4 accent-[#9c1137]"
            />
            Published
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {isEdit ? "Save changes" : "Create product"}
        </button>
        <Link href="/products" className="btn-ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}
